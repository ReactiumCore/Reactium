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
import parserbabel from 'prettier/parser-babylon';
import parserHtml from 'prettier/parser-html';
import { getStore } from 'reactium-core/app';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * React Component: Code
 * -----------------------------------------------------------------------------
 */

export default class Code extends Component {
    static defaultProps = {
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

    constructor(props) {
        super(props);

        this.cont = React.createRef();
        this.state = {
            height: this.props.height,
            prefs: this.props.prefs,
            theme: this.props.theme,
            visible: this.props.visible,
            update: this.props.update,
        };
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
            plugins: [parserbabel, parserHtml],
        };
    }

    componentDidMount() {
        this.applyPrefs();
    }

    componentDidUpdate(prevProps, prevState) {
        const { update: lastUpdate } = prevProps;
        const { update, prefs } = this.props;

        if (update !== lastUpdate) {
            this.applyPrefs();
        }
    }

    getPref(newState = {}, key, vals) {
        const { prefs = {} } = this.state;

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
        const { id } = this.props;
        const { prefs = {}, theme } = this.state;
        const vals = [
            op.get(prefs, `codeColor.${id}`),
            op.get(prefs, `codeColor.all`, theme),
        ];

        return this.getPref(newState, 'theme', vals);
    }

    applyWrapPref(newState = {}) {
        const { prefs = {} } = this.state;
        return this.getPref(
            newState,
            'wrap',
            op.get(prefs, `syntax.wrap`, false),
        );
    }

    applyVisiblePref(newState = {}) {
        const { id } = this.props;
        const { prefs = {}, visible = false } = this.state;

        let vals = [
            op.get(prefs, `code.${id}`),
            op.get(prefs, 'code.all', visible),
        ];

        return this.getPref(newState, 'visible', vals);
    }

    onCopyClick(e) {
        const { component: Component, onButtonClick } = this.props;
        const markup = prettier.format(
            renderToStaticMarkup(
                <Provider store={getStore()}>
                    <Component />
                </Provider>,
            ),
            this.prettierOptions,
        );

        copy(markup);

        if (typeof onButtonClick === 'function') {
            e['type'] = 'copy';
            onButtonClick(e, this);
        }
    }

    onThemeClick(e) {
        let { theme } = this.state;
        theme = theme === 'dark' ? 'light' : 'dark';
        getStore().dispatch(
            deps.actions.Toolkit.set({
                key: 'prefs.codeColor.all',
                value: theme,
            }),
        );
    }

    open() {
        const { speed } = this.props;
        const _self = this;

        TweenMax.set(this.cont.current, { height: 'auto', display: 'block' });
        TweenMax.from(this.cont.current, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ visible: true, height: 'auto' });
            },
        });
    }

    close() {
        const { speed } = this.props;
        const _self = this;

        TweenMax.to(this.cont.current, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ visible: false, height: 0 });
            },
        });
    }

    toggle() {
        const { visible } = this.state;

        if (visible !== true) {
            this.open();
        } else {
            this.close();
        }
    }

    themes(theme = 'dark') {
        const thms = {
            dark: vs2015,
            light: vs,
        };

        return op.has(thms, theme) ? thms[theme] : thms.dark;
    }

    markup(Component) {
        const html = renderToStaticMarkup(
            <Provider store={getStore()}>
                <Component />
            </Provider>,
        );

        return prettier.format(html, this.prettierOptions);
    }

    render() {
        const { component: Component } = this.props;

        if (!Component) {
            return null;
        }

        const { visible, height, theme = 'dark' } = this.state;

        const type = typeof Component;
        const style = this.themes(theme);
        const display = visible === true ? 'block' : 'none';

        switch (type) {
            case 'function': {
                return (
                    <div
                        ref={this.cont}
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
                        ref={this.cont}
                        style={{ height, display }}
                        className={'re-toolkit-code-view'}>
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
