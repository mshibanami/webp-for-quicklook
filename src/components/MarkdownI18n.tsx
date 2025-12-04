import React, { ReactNode } from 'react';
import { translate, TranslateProps } from '@docusaurus/Translate';
import ReactMarkdown from 'react-markdown';
import Link from '@docusaurus/Link';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';

export type MarkdownI18nProps = Omit<TranslateProps<string>, 'values'> & {
    values?: Record<string, string | number>;
    components?: Record<string, any>;
    markdownOptions?: ReactMarkdownOptions;
}

export default function MarkdownI18n({
    id,
    values,
    components,
    children,
    markdownOptions,
}: MarkdownI18nProps): ReactNode {
    const markdown = translate({ id, message: children }, values);

    return (
        <ReactMarkdown
            components={{
                a: ({ href, children, ...props }: any) => {
                    if (!href) return <a {...props}>{children}</a>;
                    // internal links -> Docusaurus Link
                    if (href.startsWith('/') || href.startsWith('#') || href.startsWith('pathname://')) {
                        const linkProps = props as React.ComponentProps<typeof Link>;
                        return <Link to={href} {...linkProps}>{children}</Link>;

                    }
                    // external link
                    return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                        </a>
                    );
                },
                ...components,
            }}
            {...markdownOptions}
        >
            {markdown}
        </ReactMarkdown>
    );
};
