
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import op from 'object-path';
import { TweenMax, Power2 } from 'gsap';
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Docs
 * -----------------------------------------------------------------------------
 */

export default class Docs extends Component {
    constructor(props) {
        super(props);

        this.cont   = null;
        this.state  = { ...this.props };
        this.open   = this.open.bind(this);
        this.close  = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.applyPrefs();

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

    getPref(newState = {}, key, vals) {
        let { prefs = {} } = this.state;

        vals.forEach((v, i) => {
            if (op.has(newState, key)) { return; }
            if (typeof v !== 'undefined') { newState[key] = v; }
        });

        return newState;
    }

    applyPrefs() {

        let newState = {};
            newState = this.applyVisiblePref(newState);

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }
    }

    applyVisiblePref(newState = {}) {
        let { prefs = {}, visible, id } = this.state;

        let vals = [
            op.get(prefs, `docs.${id}`),
            op.get(prefs, 'docs.all'),
            visible,
        ];

        return this.getPref(newState, 'visible', vals);
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
        let { component:Component, visible, height, title } = this.state;

        let display = (visible === true) ? 'block' : 'none';

        return (!Component) ? null : (
            <div ref={(elm) => { this.cont = elm; }} className={'re-toolkit-docs-view'} style={{height, display}}>
                {(title)
                    ? (
                        <div className={'re-toolkit-card-heading thin'}>
                            <h3>{title}</h3>
                        </div>
                    )
                    : null
                }

                <div className={'re-toolkit-card-docs'}>
                    <Component />
                </div>
            </div>
        );
    }
}

Docs.defaultProps = {
    title   : null,
    prefs   : {},
    height  : 'auto',
    speed   : 0.2,
    visible : true,
    id      : null,
};
