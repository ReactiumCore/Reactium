
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
        this.state        = { ...this.props };
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            let newState = {
                ...prevState,
                ...nextProps,
            };
            return newState;
        });
    }


    markedRenderer(theme = 'dark') {
        let style = (theme === 'dark') ? vs2015 : vs;

        let rndr = new marked.Renderer();

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

    parseMarkdown(md, theme = 'dark') {
        marked.setOptions({
            xhtml: true,
            gfm: true,
            breaks: true,
        });

        md = marked(md, {renderer: this.markedRenderer(theme)});
        return {__html: md};
    }

    render() {
        let { children, theme } = this.state;
        return <div className={'markdown'} dangerouslySetInnerHTML={this.parseMarkdown(children, theme)} />;
    }
}

Markdown.defaultProps = {
    theme: 'dark',
};
