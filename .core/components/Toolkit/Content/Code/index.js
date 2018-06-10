
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { TweenMax, Power2 } from 'gsap';
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

        this.cont        = null;
        this.state       = { ...this.props };
        this.open        = this.open.bind(this);
        this.close       = this.close.bind(this);
        this.toggle      = this.toggle.bind(this);
        this.onCopyClick = this.onCopyClick.bind(this);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
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

    onCopyClick(e) {
        let { component:Component, onCopyClick } = this.state;
        let markup = renderToStaticMarkup(<Component />);

        markup = HTMLtoJSX(markup);

        copy(markup);

        if (typeof onCopyClick === 'function') {
            onCopyClick(e, markup);
        }
    }

    open() {
        if (!this.cont) { return; }

        let { speed } = this.state;
        let _self = this;

        TweenMax.set(this.cont, {height: 'auto', display: 'block'});
        TweenMax.from(this.cont, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({visible: true, height: 'auto'});
            }
        });
    }

    close() {
        if (!this.cont) { return; }

        let { speed } = this.state;
        let _self = this;

        TweenMax.to(this.cont, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({visible: false, height: 0});
            }
        });
    }

    toggle() {
        let { visible } = this.state;

        if (visible !== true) {
            this.open();
        } else {
            this.close();
        }
    }

    render() {
        let { component:Component, group, id, visible, height } = this.state;

        if (!Component) { return null; }

        let type = typeof Component;

        let display = (visible === true) ? 'block' : 'none';

        switch(type) {
            case 'function': {
                let markup = renderToStaticMarkup(<Component />);

                return (
                    <div ref={(elm) => { this.cont = elm; }} className={'re-toolkit-code-view'} style={{height, display}}>
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
                    </div>
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
    height    : 'auto',
    speed     : 0.25,
    visible   : true,
    component : null,
    group     : null,
    id        : null,
};
