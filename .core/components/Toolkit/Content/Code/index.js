
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { renderToStaticMarkup } from 'react-dom/server';
import React, { Component, Fragment } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/styles/hljs';
import copy from 'copy-to-clipboard';
import pretty from 'pretty';
import HTMLtoJSX from 'html-to-jsx';


/**
 * -----------------------------------------------------------------------------
 * React Component: Code
 * -----------------------------------------------------------------------------
 */

export default class Code extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props };
        this.onCopyClick = this.onCopyClick.bind(this);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onCopyClick(e) {
        let { component:Component, onCopyClick } = this.state;
        let markup = pretty(renderToStaticMarkup(<Component />));

        markup = HTMLtoJSX(markup);

        copy(markup);

        if (typeof onCopyClick === 'function') {
            onCopyClick(e, markup);
        }
    }

    render() {
        let { component:Component, group, id, visible } = this.state;

        if (!Component) { return null; }

        let type    = typeof Component;
        let display = (visible) ? 'block' : 'none';

        switch(type) {
            case 'function': {
                let markup = pretty(renderToStaticMarkup(<Component />));

                return (
                    <Fragment>
                        <div className={'re-toolkit-card-heading thin'}>
                            <h3>Code</h3>
                            <button
                                title={'copy to clipboard'}
                                onClick={this.onCopyClick}
                                type={'button'} >
                                <svg>
                                    <use xlinkHref={'#re-icon-clipboard'}></use>
                                </svg>
                            </button>
                        </div>
                        <div className={'re-toolkit-code'}>
                            <SyntaxHighlighter
                                showLineNumbers={true}
                                style={vs2015}
                                language={'HTML'} >
                                {markup}
                            </SyntaxHighlighter>
                        </div>
                    </Fragment>
                );
            }

            default: {
                return (
                    <div className={'re-toolkit-card-heading thin'}>
                        <small><em>* Code view not available for this type of element.</em></small>
                    </div>
                );
            }
        }
    }
}

Code.defaultProps = {
    visible   : true,
    component : null,
    group     : null,
    id        : null,
};
