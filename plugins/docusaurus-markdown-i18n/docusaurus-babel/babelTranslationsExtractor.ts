/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import traverse, { type Node } from '@babel/traverse';
import generate from '@babel/generator';
import {
  parse,
  type types as t,
  type NodePath,
  type TransformOptions,
} from '@babel/core';
import type { TranslationFileContent } from '@docusaurus/types';

export type SourceCodeFileTranslations = {
  sourceCodeFilePath: string;
  translations: TranslationFileContent;
  warnings: string[];
};

export type ExtractorAliasOptions = {
  componentNames?: string[];
  functionNames?: string[];
};

export async function extractAllSourceCodeFileTranslations(
  sourceCodeFilePaths: string[],
  babelOptions: TransformOptions,
  aliasOptions?: ExtractorAliasOptions,
): Promise<SourceCodeFileTranslations[]> {
  return Promise.all(
    sourceCodeFilePaths.flatMap((sourceFilePath) =>
      extractSourceCodeFileTranslations(sourceFilePath, babelOptions, aliasOptions),
    ),
  );
}

export async function extractSourceCodeFileTranslations(
  sourceCodeFilePath: string,
  babelOptions: TransformOptions,
  aliasOptions?: ExtractorAliasOptions,
): Promise<SourceCodeFileTranslations> {
  try {
    const code = await fs.readFile(sourceCodeFilePath, 'utf8');

    const ast = parse(code, {
      ...babelOptions,
      ast: true,
      // filename is important, because babel does not process the same files
      // according to their js/ts extensions.
      // See https://x.com/NicoloRibaudo/status/1321130735605002243
      filename: sourceCodeFilePath,
    }) as Node;

    const translations = extractSourceCodeAstTranslations(
      ast,
      sourceCodeFilePath,
      aliasOptions,
    );
    return translations;
  } catch (err) {
    logger.error`Error while attempting to extract Docusaurus translations from source code file at path=${sourceCodeFilePath}.`;
    throw err;
  }
}

/*
Need help understanding this?

Useful resources:
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
https://github.com/formatjs/formatjs/blob/main/packages/babel-plugin-formatjs/index.ts
https://github.com/pugjs/babel-walk
 */
function extractSourceCodeAstTranslations(
  ast: Node,
  sourceCodeFilePath: string,
  aliasOptions?: ExtractorAliasOptions,
): SourceCodeFileTranslations {
  function sourceWarningPart(node: Node) {
    return `File: ${sourceCodeFilePath} at line ${node.loc?.start.line ?? '?'}
Full code: ${generate(node).code}`;
  }

  const isTranslatorAlias = ((): boolean => {
    const sourceFileName = sourceCodeFilePath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
    return aliasOptions?.componentNames.includes(sourceFileName) ?? false;
  })();

  const translations: TranslationFileContent = {};
  const warnings: string[] = [];
  let translateComponentNames: string[] = [];
  let translateFunctionNames: string[] = [];

  const configuredComponentAliases = aliasOptions?.componentNames ?? [];
  const configuredFunctionAliases = aliasOptions?.functionNames ?? [];

  // First pass: find import declarations of Translate / translate.
  // If not found, don't process the rest to avoid false positives
  traverse(ast, {
    ImportDeclaration(path) {
      if (
        path.node.importKind === 'type' ||
        path.get('source').node.value !== '@docusaurus/Translate'
      ) {
        return;
      }
      const importSpecifiers = path.get('specifiers');
      const defaultImport = importSpecifiers.find(
        (specifier): specifier is NodePath<t.ImportDefaultSpecifier> =>
          specifier.node.type === 'ImportDefaultSpecifier',
      );
      const callbackImport = importSpecifiers.find(
        (specifier): specifier is NodePath<t.ImportSpecifier> =>
          specifier.node.type === 'ImportSpecifier' &&
          ((
            (specifier as NodePath<t.ImportSpecifier>).get('imported')
              .node as t.Identifier
          ).name === 'translate' ||
            (
              (specifier as NodePath<t.ImportSpecifier>).get('imported')
                .node as t.StringLiteral
            ).value === 'translate'),
      );

      if (defaultImport) translateComponentNames.push(defaultImport.get('local').node.name);
      if (callbackImport) translateFunctionNames.push(callbackImport.get('local').node.name);
    },
  });

  traverse(ast, {
    ...(translateComponentNames.length || configuredComponentAliases.length ? {
      JSXElement(path) {
        const openingNamePath = path.get('openingElement').get('name');
        if (!openingNamePath.isJSXIdentifier()) {
          return;
        }
        const openingName = (openingNamePath.node as t.JSXIdentifier).name;
        // If imported (translateComponentNames) or configured alias (configuredComponentAliases)
        if (
          !translateComponentNames.includes(openingName) &&
          !configuredComponentAliases.includes(openingName)
        ) {
          return;
        }
        const elementName = openingName;

        function evaluateJSXProp(propName: string): string | undefined {
          const attributePath = path
            .get('openingElement.attributes')
            .find(
              (attr) =>
                attr.isJSXAttribute() &&
                attr.get('name').isJSXIdentifier({ name: propName }),
            );

          if (attributePath) {
            const attributeValue = attributePath.get('value') as NodePath;

            const attributeValueEvaluated =
              attributeValue.isJSXExpressionContainer()
                ? (attributeValue.get('expression') as NodePath).evaluate()
                : attributeValue.evaluate();

            if (
              attributeValueEvaluated.confident &&
              typeof attributeValueEvaluated.value === 'string'
            ) {
              return attributeValueEvaluated.value;
            }
            warnings.push(
              `<${elementName}> prop=${propName} should be a statically evaluable object.
Example: <${elementName} id="optional id" description="optional description">Message</${elementName}>
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
${sourceWarningPart(path.node)}`,
            );
          }

          return undefined;
        }

        const id = evaluateJSXProp('id');
        const description = evaluateJSXProp('description');
        let message: string;
        const childrenPath = path.get('children');

        // Handle empty content
        if (!childrenPath.length) {
          if (!id) {
            warnings.push(`<${elementName}> without children must have id prop.
Example: <${elementName} id="my-id" />
${sourceWarningPart(path.node)}`);
          } else {
            translations[id] = {
              message: id,
              ...(description && { description }),
            };
          }

          return;
        }

        // Handle single non-empty content
        const singleChildren = childrenPath
          // Remove empty/useless text nodes that might be around our
          // translation! Makes the translation system more reliable to JSX
          // formatting issues
          .filter(
            (children) =>
              !(
                children.isJSXText() &&
                children.node.value.replace('\n', '').trim() === ''
              ),
          )
          .pop();
        const isJSXText = singleChildren?.isJSXText();
        const isJSXExpressionContainer =
          singleChildren?.isJSXExpressionContainer() &&
          (singleChildren.get('expression') as NodePath).evaluate().confident;

        if (isJSXText || isJSXExpressionContainer) {
          message = isJSXText
            ? singleChildren.node.value.trim().replace(/\s+/g, ' ')
            : String(
              (singleChildren.get('expression') as NodePath).evaluate().value,
            );

          translations[id ?? message] = {
            message,
            ...(description && { description }),
          };
        } else if (isTranslatorAlias) {
          // Skip warning for alias components, as they may wrap <Translate>.
        } else {
          warnings.push(
            `${elementName} content could not be extracted. It has to be a static string and use optional but static props, like <${elementName} id="my-id" description="my-description">text</${elementName}>.
${sourceWarningPart(path.node)}`,
          );
        }
      },
    } : {}),

    ...(translateFunctionNames.length || configuredFunctionAliases.length ? {
      CallExpression(path) {
        if (!path.get('callee').isIdentifier()) {
          return;
        }
        const calleeIdName = (path.get('callee').node as t.Identifier).name;

        if (
          !translateFunctionNames.includes(calleeIdName) &&
          !configuredFunctionAliases.includes(calleeIdName)
        ) {
          return;
        }

        const args = path.get('arguments');

        if (args.length === 1 || args.length === 2) {
          const firstArgPath = args[0]!;

          // translate("x" + "y"); => translate("xy");
          const firstArgEvaluated = firstArgPath.evaluate();

          if (
            firstArgEvaluated.confident &&
            typeof firstArgEvaluated.value === 'object'
          ) {
            const { message, id, description } = firstArgEvaluated.value as {
              [propName: string]: unknown;
            };
            translations[String(id ?? message)] = {
              message: String(message ?? id),
              ...(Boolean(description) && { description: String(description) }),
            };
          } else if (isTranslatorAlias) {
            // Skip warning for alias components, as they may wrap translate() or <Translate>.
          } else {
            warnings.push(
              `${calleeIdName}() first arg should be a statically evaluable object.
Example: ${calleeIdName}({message: "text",id: "optional.id",description: "optional description"
Dynamically constructed values are not allowed, because they prevent translations to be extracted.
${sourceWarningPart(path.node)}`,
            );
          }
        } else {
          warnings.push(
            `${calleeIdName} function only takes 1 or 2 args
${sourceWarningPart(path.node)}`,
          );
        }
      },
    } : {}),
  });

  return { sourceCodeFilePath, translations, warnings };
}
