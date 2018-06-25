
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

        this.getDependents = this.getDependents.bind(this);
        this.getDependency = this.getDependency.bind(this);
        this.getElements   = this.getElements.bind(this);
        this.getNPM        = this.getNPM.bind(this);
        this.open          = this.open.bind(this);
        this.close         = this.close.bind(this);
        this.toggle        = this.toggle.bind(this);

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

    getElements() {
        let { menu } = this.state;
        let elements = [];
        _.compact(_.pluck(Object.values(menu), 'elements')).forEach((item) => {
            elements = elements.concat(Object.values(item));
        });

        return elements;
    }

    getDependents(component) {
        let output = [];

        if (!op.has(component, 'dependencies')) { return output; }

        let elements = this.getElements();

        elements.forEach((item) => {
            if (!op.has(item, 'dna')) { return; }
            if (!op.has(item, 'component')) { return; }
            if (typeof op.get(item, 'component') === 'string') { return; }
            if (!op.has(item.component, 'dependencies')) { return; }
            if (item.component.name === component.name) { return; }

            let results = [];
            let deps = item.component.dependencies();

            deps.forEach((str) => {
                let exp = new RegExp('^.\/node_modules\/', 'i');
                if (exp.test(str)) { return; }

                let p = str.split('./src/app/').join('/').split('/index.js').join('');

                let cmp = _.findWhere(elements, {dna: p});

                if (!cmp) { return; }

                let cname = cmp.name;
                if (cname === component.name) {
                    results.push(item);
                }
            });

            if (results.length < 1) { return; }

            results.forEach((res) => { output.push(res); });

        });

        return output;
    }

    getDependency(str) {
        let { menu } = this.state;

        let elements = this.getElements();
        let p = str.split('./src/app/').join('/').split('/index.js').join('');

        let item = _.findWhere(elements, {dna: p});

        if (item) {
            let { route, label } = item;
            return (route && label) ? () => (<Link to={route} title={str}><svg><use xlinkHref={'#re-icon-link'}></use></svg>{label}</Link>) : null;
        } else {
            let exp = new RegExp('^.\/node_modules\/', 'i');
            if (exp.test(str)) { return; }

            let cmp = str.split('/').pop().split('.js').join('');
            return () => (<span><svg><use xlinkHref={'#re-icon-docs'}></use></svg>{cmp} &ndash; {str.split('./src/app').join('')}</span>);
        }
    }

    getNPM(str, deps){
        let exp = new RegExp('^.\/node_modules\/', 'i');
        if (!exp.test(str)) { return; }

        let elements = [];
        let pkg = str.split('./node_modules/').join('').split('/').shift();

        let exclude = ['webpack', 'react'];
        if (exclude.indexOf(pkg) > -1) { return; }

        let url = `https://www.npmjs.com/package/${pkg}`;

        return () => (<a href={url} target={'_blank'}>{pkg}</a>);
    }

    render() {
        let { component, height, visible } = this.state;

        if (typeof component === 'undefined' || typeof component === 'string') {
            return null;
        }

        let deps = (op.has(component, 'dependencies'))
            ? component.dependencies()
            : [];

        let display = (visible === true) ? 'block' : 'none';

        let npm          = _.compact(deps.map((item) => this.getNPM(item, deps)));
        let dependencies = _.compact(deps.map((item) => this.getDependency(item)));
        let dependents   = this.getDependents(component);

        let count = npm.length + dependencies.length + dependents.length;

        if (count < 1) {
            return (
                <div
                    ref={(elm) => { this.cont = elm; }}
                    className={'re-toolkit-dna-view'}
                    style={{height, display}} >
                    <div className={'re-toolkit-card-heading thin'}>
                        DNA
                    </div>
                    <div className={'re-toolkit-card-body'}>
                        <div className={'re-toolkit-card-body-pad'}>
                            <h3>No DNA Found</h3>
                            <p>Be sure to add the dna property to the manifest entry for this element and include the static function <code>dependencies</code> to your class.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={(elm) => { this.cont = elm; }}
                className={'re-toolkit-dna-view'}
                style={{height, display}} >

                {(dependents.length > 0)
                    ? (
                        <Fragment>
                            <div className={'re-toolkit-card-heading thin'}>
                                Dependents
                            </div>
                            <ul>
                                {dependents.map((item, i) => {
                                    let { route, label } = item;
                                    return (!route) ? null : (
                                        <li key={`dep-${i}`}><a href={route}>{label}</a></li>
                                    );
                                })}
                            </ul>
                        </Fragment>
                    )
                    : null
                }

                {(dependencies.length > 0)
                    ? (
                        <Fragment>
                            <div className={'re-toolkit-card-heading thin'}>
                                Dependencies
                            </div>
                            <ul>
                                {dependencies.map((item, i) => {
                                    const Alink = item;
                                    return (Alink)
                                        ? (
                                            <li key={`dep-${i}`}>
                                                <Alink />
                                            </li>
                                        )
                                        : null
                                })}
                            </ul>
                        </Fragment>
                    )
                    : null
                }
                {(npm.length > 0)
                    ? (
                        <Fragment>
                            <div className={'re-toolkit-card-heading thin'}>
                                NPM Modules
                            </div>
                            <ul>
                                {npm.map((item, i) => {
                                    const Alink = item;
                                    return (Alink)
                                        ? (
                                            <li key={`dep-${i}`}>
                                                <Alink />
                                            </li>
                                        )
                                        : null
                                })}
                            </ul>
                        </Fragment>
                    )
                    : null
                }

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
    visible: false,
};
