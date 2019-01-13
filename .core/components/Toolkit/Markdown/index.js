/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { vs, vs2015 } from 'react-syntax-highlighter/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { renderToStaticMarkup } from 'react-dom/server';
import marked from 'marked';
import React from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Markdown
 * -----------------------------------------------------------------------------
 */

const markedRenderer = (theme = 'dark') => {
    const style = theme === 'dark' ? vs2015 : vs;
    const rndr = new marked.Renderer();

    rndr.code = function(markup, lang) {
        const hl = renderToStaticMarkup(
            <SyntaxHighlighter
                showLineNumbers={true}
                style={style}
                customStyle={{ padding: '20px 30px' }}
                language={lang}>
                {markup}
            </SyntaxHighlighter>,
        );

        return `<div class="re-toolkit-code inline">${hl}</div>`;
    };

    return rndr;
};

const parseMarkdown = (md, theme = 'dark') => {
    marked.setOptions({
        xhtml: true,
        gfm: true,
        breaks: true,
    });

    md = marked(md, { renderer: markedRenderer(theme) });
    return { __html: md };
};

const Markdown = ({ children, theme }) => (
    <div
        className='markdown'
        dangerouslySetInnerHTML={parseMarkdown(children, theme)}
    />
);

Markdown.defaultProps = {
    theme: 'dark',
};

export default Markdown;
