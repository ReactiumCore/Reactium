
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
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

    parseMarkdown(md) {
        md = marked(md.split(/\n/).map(str => str.replace(/^\s+/g, '')).join('\n'));
        return {__html: md};
    }

    render() {
        let { children } = this.props;
        return <div className={'markdown'} dangerouslySetInnerHTML={this.parseMarkdown(children)} />;
    }
}
