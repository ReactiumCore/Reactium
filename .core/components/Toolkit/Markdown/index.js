
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { vs, vs2015 } from 'react-syntax-highlighter/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { renderToStaticMarkup } from 'react-dom/server';
import React, { Component } from 'react';
import marked from 'marked';


/**
 * -----------------------------------------------------------------------------
 * React Component: Markdown
 * -----------------------------------------------------------------------------
 */

export default class Markdown extends Component {
    constructor(props) {
        super(props);
    }

    markedRenderer() {
        let rndr = new marked.Renderer();
        let style = vs2015;

        rndr.code = function (markup, lang) {

            let hl = renderToStaticMarkup(
                <SyntaxHighlighter
                    showLineNumbers={true}
                    style={style}
                    customStyle={{padding: "20px 30px"}}
                    language={lang} >
                    {markup}
                </SyntaxHighlighter>
            );

            return `<div class="re-toolkit-code inline">${hl}</div>`;
        };

        return rndr;
    }

    parseMarkdown(md) {
        marked.setOptions({
            xhtml: true,
            gfm: true,
            breaks: true,
        });

        md = marked(md, {renderer: this.markedRenderer()});
        return {__html: md};
    }

    render() {
        let { children } = this.props;
        return <div className={'markdown'} dangerouslySetInnerHTML={this.parseMarkdown(children)} />;
    }
}
