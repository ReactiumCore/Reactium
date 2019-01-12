/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import op from 'object-path';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Docs
 * -----------------------------------------------------------------------------
 */

export default class Docs extends Component {
    static defaultProps = {
        theme: 'dark',
        title: null,
        prefs: {},
        height: 'auto',
        speed: 0.2,
        visible: true,
        id: null,
        update: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            height: this.props.height,
            prefs: this.props.prefs,
            visible: this.props.visible,
        };

        this.cont = React.createRef();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.applyPrefs();
    }

    getPref(newState = {}, key, vals) {
        const { prefs = {} } = this.state;

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
        newState = this.applyThemePref(newState);
        newState = this.applyVisiblePref(newState);

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }
    }

    applyVisiblePref(newState = {}) {
        const { id } = this.props;
        const { prefs = {}, visible = false } = this.state;

        const vals = [
            op.get(prefs, `docs.${id}`),
            op.get(prefs, 'docs.all', visible),
        ];

        return this.getPref(newState, 'visible', vals);
    }

    applyThemePref(newState = {}) {
        const { id, theme } = this.props;
        const { prefs = {} } = this.state;

        let vals = [
            op.get(prefs, `codeColor.${id}`),
            op.get(prefs, `codeColor.all`, theme),
        ];

        return this.getPref(newState, 'theme', vals);
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

    render() {
        const { visible, height } = this.state;

        const {
            component: Component,
            title,
            update,
            theme = 'dark',
        } = this.props;

        const display = visible === true ? 'block' : 'none';

        return !Component ? null : (
            <div
                ref={this.cont}
                className={'re-toolkit-docs-view'}
                style={{ height, display }}>
                {title ? (
                    <div className={'re-toolkit-card-heading thin'}>
                        <h3>{title}</h3>
                    </div>
                ) : null}

                <div className={'re-toolkit-card-docs'}>
                    <Component theme={theme} />
                </div>
            </div>
        );
    }
}
