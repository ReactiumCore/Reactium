/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import op from 'object-path';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { Component, Fragment } from 'react';
import deps from 'dependencies';
import { getStore } from 'reactium-core/app';

/**
 * -----------------------------------------------------------------------------
 * React Component: Docs
 * -----------------------------------------------------------------------------
 */
export default class Docs extends Component {
    static defaultProps = {
        title: null,
        prefs: {},
        height: 'auto',
        speed: 0.2,
        id: null,
        update: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            height: this.props.height,
        };

        this.prefs = {};
        this.cont = React.createRef();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.applyPrefs();
    }

    componentDidUpdate(prevProps) {
        const { update: lastUpdate } = prevProps;
        const { update } = this.props;

        if (update !== lastUpdate) {
            this.applyPrefs();
        }
    }

    applyPrefs() {
        this.prefs = getStore().getState().Toolkit.prefs;
    }

    open() {
        const { id, speed } = this.props;
        const _self = this;

        TweenMax.set(this.cont.current, { height: 'auto', display: 'block' });
        TweenMax.from(this.cont.current, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ height: 'auto' });
                getStore().dispatch(
                    deps.actions.Toolkit.set({
                        key: `prefs.docs.${id}`,
                        value: true,
                    }),
                );
            },
        });
    }

    close() {
        const { id, speed } = this.props;
        const _self = this;

        TweenMax.to(this.cont.current, speed, {
            height: 0,
            overwrite: 'all',
            ease: Power2.easeInOut,
            onComplete: () => {
                _self.setState({ height: 0 });
                getStore().dispatch(
                    deps.actions.Toolkit.set({
                        key: `prefs.docs.${id}`,
                        value: false,
                    }),
                );
            },
        });
    }

    toggle() {
        if (this.visible() !== true) {
            this.open();
        } else {
            this.close();
        }
    }

    getPref(key, prefs) {
        prefs = prefs || getStore().getState().Toolkit.prefs;
        const { id } = this.props;

        let def, pref;

        switch (key) {
            case 'visible':
                pref = `docs.${id}`;
                def = 'docs.all';
                break;

            case 'theme':
                pref = `codeColor.${id}`;
                def = 'codeColor.all';
                break;
        }

        return op.get(prefs, pref, op.get(prefs, def, false));
    }

    visible() {
        const { visible } = this.props;
        return visible === true ? true : this.getPref('visible');
    }

    theme() {
        return this.getPref('theme');
    }

    render() {
        const { height } = this.state;
        const { component: Component, title, update } = this.props;
        const display = this.visible() ? 'block' : 'none';
        const theme = this.theme();

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
