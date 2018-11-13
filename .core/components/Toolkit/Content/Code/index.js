/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import React, { Component, Fragment } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs, vs2015 } from 'react-syntax-highlighter/styles/hljs';
import copy from 'copy-to-clipboard';
import op from 'object-path';
import PropTypes from 'prop-types';
import prettier from 'prettier/standalone';
import parserBabylon from 'prettier/parser-babylon';
import parserHtml from 'prettier/parser-html';

/**
 * -----------------------------------------------------------------------------
 * React Component: Code
 * -----------------------------------------------------------------------------
 */

export default class Code extends Component {
    constructor(props) {
        super(props);

        this.cont = null;
        this.state = { ...this.props };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getPref = this.getPref.bind(this);
        this.onCopyClick = this.onCopyClick.bind(this);
        this.onThemeClick = this.onThemeClick.bind(this);
        this.prettierOptions = {
            parser: 'html',
            singleQuote: true,
            tabWidth: 4,
            printWidth: 200000000,
            jsxSingleQuote: true,
            jsxBracketSameLine: true,
            trailingComma: 'es5',
            plugins: [parserBabylon, parserHtml],
        };
    }

    componentDidMount() {
        this.applyPrefs();
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            let newState = {
                ...prevState,
                ...nextProps,
            };
            return newState;
        });

        this.applyPrefs();
    }

    getPref(newState = {}, key, vals) {
        let { prefs = {} } = this.state;

        vals = !Array.isArray(vals) ? [vals] : vals;

        vals.forEach((v, i) => {
            if (op.has(newState, key)) {
                return;
            }
            if (typeof v !== 'undefined') {
                newState[key] = v;
            }
        });

        return newState;
    }

    applyPrefs() {
        let newState = {};
        newState = this.applyVisiblePref(newState);
        newState = this.applyThemePref(newState);
        newState = this.applyWrapPref(newState);

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }

        const { wrap } = newState;
        const w = wrap === true ? 80 : 200000000;
        op.set(this.prettierOptions, 'printWidth', w);
    }

    applyThemePref(newState = {}) {
        let { prefs = {}, theme, id } = this.state;

        let vals = [
            op.get(prefs, `codeColor.${id}`),
            op.get(prefs, `codeColor.all`, theme),
        ];

        return this.getPref(newState, 'theme', vals);
    }

    applyWrapPref(newState = {}) {
        let { prefs = {} } = this.state;

        return this.getPref(
            newState,
            'wrap',
            op.get(prefs, `syntax.wrap`, false)
        );
    }

    applyVisiblePref(newState = {}) {
        let { prefs = {}, visible = false, id } = this.state;

        let vals = [
            op.get(prefs, `code.${id}`),
            op.get(prefs, 'code.all', visible),
        ];

        return this.getPref(newState, 'visible', vals);
    }

    onCopyClick(e) {
        let { component: Component, onButtonClick } = this.state;

        let markup = prettier.format(
            renderToStaticMarkup(
                <Provider store={this.context.store}>
                    <Component />
                </Provider>
            ),
            this.prettierOptions
        );

        copy(markup);

        if (typeof onButtonClick === 'function') {
            e['type'] = 'copy';
            onButtonClick(e, this, markup);
        }
    }

    onThemeClick(e) {
        let { theme, onButtonClick } = this.state;

        theme = theme === 'dark' ? 'light' : 'dark';

        this.setState({ theme });

        if (typeof onButtonClick === 'function') {
            e['type'] = 'toggle-codeColor';

            let data = { ...this };
            data.state.theme = theme;

            onButtonClick(e, data);
        }
    }

    open() {
        if (!this.cont) {
            return;
        }

        let { speed } = this.state;
        let _self = this;

        TweenMax.set(this.cont, { height: 'auto', display: 'block' });
        TweenMax.from(this.cont, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ visible: true, height: 'auto' });
            },
        });
    }

    close() {
        if (!this.cont) {
            return;
        }

        let { speed } = this.state;
        let _self = this;

        TweenMax.to(this.cont, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ visible: false, height: 0 });
            },
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

    themes(theme = 'dark') {
        let thms = {
            dark: vs2015,
            light: vs,
        };

        return op.has(thms, theme) ? thms[theme] : thms.dark;
    }

    markup(Component) {
        const html = renderToStaticMarkup(
            <Provider store={this.context.store}>
                <Component />
            </Provider>
        );

        return prettier.format(html, this.prettierOptions);
    }

    render() {
        let {
            component: Component,
            visible,
            height,
            theme = 'dark',
        } = this.state;

        if (!Component) {
            return null;
        }

        let type = typeof Component;
        let style = this.themes(theme);
        let display = visible === true ? 'block' : 'none';

        switch (type) {
            case 'function': {
                return (
                    <div
                        ref={elm => {
                            this.cont = elm;
                        }}
                        className={'re-toolkit-code-view'}
                        style={{ height, display }}>
                        <div className={'re-toolkit-card-heading thin'}>
                            <h3>Code</h3>
                            <button
                                className={`theme-btn ${theme}`}
                                title={`theme: ${theme}`}
                                onClick={this.onThemeClick}
                                type={'button'}>
                                <span />
                                <span />
                            </button>
                            <button
                                title={'copy to clipboard'}
                                onClick={this.onCopyClick}
                                type={'button'}>
                                <svg>
                                    <use xlinkHref={'#re-icon-clipboard'} />
                                </svg>
                            </button>
                        </div>
                        <div className={'re-toolkit-code'}>
                            <SyntaxHighlighter
                                showLineNumbers={true}
                                style={style}
                                customStyle={{ padding: '20px 30px' }}
                                language={'HTML'}>
                                {this.markup(Component)}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                );
            }

            default: {
                return (
                    <div
                        ref={elm => {
                            this.cont = elm;
                        }}
                        className={'re-toolkit-code-view'}
                        style={{ height, display }}>
                        <div className={'re-toolkit-card-heading thin'}>
                            <small>
                                <em>
                                    * Code view not available for this type of
                                    element.
                                </em>
                            </small>
                        </div>
                    </div>
                );
            }
        }
    }
}

Code.defaultProps = {
    prefs: {},
    onButtonClick: null,
    height: 'auto',
    speed: 0.2,
    visible: false,
    component: null,
    group: null,
    id: null,
    theme: 'light',
    wrap: false,
};

Code.contextTypes = {
    store: PropTypes.object,
};
