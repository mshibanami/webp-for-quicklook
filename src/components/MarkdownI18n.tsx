import React from 'react';
import { translate } from '@docusaurus/Translate';
import ReactMarkdown from 'react-markdown';
import Link from '@docusaurus/Link';

export interface MarkdownI18nProps {
    id: string;
    message: string;
    values?: Record<string, string | number>;
    className?: string;
    components?: Record<string, any>;
}

export const MarkdownI18n: React.FC<MarkdownI18nProps> = ({
    id,
    message,
    values,
    className,
    components,
}) => {
    const markdown = translate({ id, message }, values);

    return (
        <div className={className}>
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
            >
                {markdown}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownI18n;
