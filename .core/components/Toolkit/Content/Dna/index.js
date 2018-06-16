
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { TweenMax, Power2 } from 'gsap';
import React, { Component, Fragment } from 'react';
import op from 'object-path';
import { Link } from 'react-router-dom'
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * React Component: Dna
 * -----------------------------------------------------------------------------
 */

export default class Dna extends Component {
    constructor(props) {
        super(props);

        this.getLink = this.getLink.bind(this);
        this.getNPM  = this.getNPM.bind(this);
        this.open    = this.open.bind(this);
        this.close   = this.close.bind(this);
        this.toggle  = this.toggle.bind(this);

        this.state   = {
            ...this.props,
        };
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

        this.applyPrefs();
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
        let { prefs = {}, visible = false, id } = this.state;

        let vals = [
            op.get(prefs, `link.${id}`),
            op.get(prefs, 'link.all', visible),
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

        TweenMax.to(this.cont, speed/2, {
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


    getLink(str) {
        let { menu } = this.state;

        let elements = [];
        let p = str.split('./src/app/').join('/').split('/index.js').join('');

        _.compact(_.pluck(Object.values(menu), 'elements')).forEach((item) => {
            elements = elements.concat(Object.values(item));
        });

        let item = _.findWhere(elements, {dna: p});

        if (item) {
            let { route, label } = item;
            return (route && label) ? () => (<Link to={route}>{label}</Link>) : null;
        }
    }

    getNPM(str){
        return str;
    }

    render() {
        let { component = {}, height, visible } = this.state;

        let deps = (op.has(component, 'dependencies'))
            ? component.dependencies()
            : [];

        let display = (visible === true) ? 'block' : 'none';

        return (
            <div ref={(elm) => { this.cont = elm; }} className={'re-toolkit-dna-view'} style={{height, display}}>
                <div className={'re-toolkit-card-heading thin'}>
                    Dependencies
                </div>
                <ul>
                    {deps.map((item, i) => {
                        const Alink = this.getLink(item);
                        return (Alink)
                            ? (
                                <li key={`dep-${i}`}>
                                    <Alink />
                                </li>
                            )
                            : null
                    })}
                </ul>
            </div>
        );
    }
}

Dna.defaultProps = {
    component: null,
    height: 'auto',
    menu: {},
    prefs: {},
    speed: 0.2,
    id: null,
    visible: true,
};
