/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { Component, Fragment } from 'react';
import op from 'object-path';
import { Link } from 'react-router-dom';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * React Component: Dna
 * -----------------------------------------------------------------------------
 */

export default class Dna extends Component {
    static defaultProps = {
        component: null,
        height: 'auto',
        menu: {},
        prefs: {},
        speed: 0.2,
        id: null,
        visible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            prefs: this.props.prefs,
            visible: this.props.visible,
        };

        this.cont = React.createRef();
        this.getDependents = this.getDependents.bind(this);
        this.getDependency = this.getDependency.bind(this);
        this.getElements = this.getElements.bind(this);
        this.getNPM = this.getNPM.bind(this);
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
        newState = this.applyVisiblePref(newState);

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }
    }

    applyVisiblePref(newState = {}) {
        const { id } = this.props;
        const { prefs = {}, visible = false } = this.state;

        const vals = [
            op.get(prefs, `link.${id}`),
            op.get(prefs, 'link.all', visible),
        ];

        return this.getPref(newState, 'visible', vals);
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

    getElements() {
        const { menu } = this.props;
        let elements = [];
        _.compact(_.pluck(Object.values(menu), 'elements')).forEach(item => {
            elements = elements.concat(Object.values(item));
        });

        return elements;
    }

    getDependents(component) {
        const { dna } = this.props;
        const output = [];

        if (!op.has(component, 'dependencies')) {
            return output;
        }

        const elements = this.getElements();

        elements.forEach(item => {
            if (!op.has(item, 'dna')) {
                return;
            }
            if (!op.has(item, 'component')) {
                return;
            }
            if (typeof op.get(item, 'component') === 'string') {
                return;
            }
            if (!op.has(item, 'component.dependencies')) {
                return;
            }

            if (item.component.name === component.name) {
                return;
            }

            const results = [];
            const deps = item.component.dependencies();

            deps.forEach(str => {
                if (typeof str !== 'string') {
                    if (op.has(str, 'id')) {
                        str = str.id;
                    }
                }

                const exp = new RegExp('^./node_modules/', 'i');
                if (exp.test(str)) {
                    return;
                }

                const p = str
                    .split('./src/app/')
                    .join('/')
                    .split('/index.js')
                    .join('');

                if (p === dna) {
                    results.push(item);
                }
            });

            if (results.length < 1) {
                return;
            }

            results.forEach(res => {
                output.push(res);
            });
        });

        return output;
    }

    getDependency(str) {
        str = typeof str === 'string' ? str : null;
        str = str === null && op.has(str, 'id') ? str.id : str;
        if (str === null) {
            return;
        }

        const { menu } = this.props;
        const elements = this.getElements();

        const p = str
            .split('./src/app/')
            .join('/')
            .split('/index.js')
            .join('');

        const item = _.findWhere(elements, { dna: p });

        if (item) {
            const { route, label } = item;
            return route && label
                ? () => (
                      <Link to={route} title={str}>
                          <svg>
                              <use xlinkHref={'#re-icon-link'} />
                          </svg>
                          {label}
                      </Link>
                  )
                : null;
        } else {
            const exp = new RegExp('^./node_modules/', 'i');
            if (exp.test(str)) {
                return;
            }

            const cmp = str
                .split('/')
                .pop()
                .split('.js')
                .join('');
            return () => (
                <span>
                    <svg>
                        <use xlinkHref={'#re-icon-docs'} />
                    </svg>
                    {cmp} &ndash; {str.split('./src/app').join('')}
                </span>
            );
        }
    }

    getNPM(str, deps) {
        const exp = new RegExp('^./node_modules/', 'i');
        if (!exp.test(str)) {
            return;
        }

        const elements = [];

        const pkg = str
            .split('./node_modules/')
            .join('')
            .split('/')
            .shift();

        const exclude = ['webpack', 'react', 'core-js'];
        if (exclude.indexOf(pkg) > -1) {
            return;
        }

        const url = `https://www.npmjs.com/package/${pkg}`;

        return () => (
            <a href={url} target={'_blank'}>
                {pkg}
            </a>
        );
    }

    render() {
        if (process.env.NODE_ENV !== 'development') {
            return null;
        }

        const { visible } = this.state;
        const { component, height } = this.props;

        if (typeof component === 'undefined' || typeof component === 'string') {
            return null;
        }

        const deps = op.has(component, 'dependencies')
            ? component.dependencies()
            : [];

        const display = visible === true ? 'block' : 'none';

        const npm = _.compact(deps.map(item => this.getNPM(item, deps)));
        const dependencies = _.compact(
            deps.map(item => this.getDependency(item)),
        );

        const dependents = this.getDependents(component);

        const count = npm.length + dependencies.length + dependents.length;

        if (count < 1) {
            return (
                <div
                    ref={this.cont}
                    className={'re-toolkit-dna-view'}
                    style={{ height, display }}>
                    <div className={'re-toolkit-card-heading thin'}>DNA</div>
                    <div className={'re-toolkit-card-body'}>
                        <div className={'re-toolkit-card-body-pad'}>
                            <h3 style={{ marginTop: 10, marginBottom: 10 }}>
                                No DNA Found
                            </h3>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={this.cont}
                className={'re-toolkit-dna-view'}
                style={{ height, display }}>
                {dependents.length > 0 ? (
                    <Fragment>
                        <div className={'re-toolkit-card-heading thin'}>
                            Dependents
                        </div>
                        <ul>
                            {dependents.map((item, i) => {
                                let { route, label } = item;
                                return !route ? null : (
                                    <li key={`dep-${i}`}>
                                        <a href={route}>{label}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </Fragment>
                ) : null}

                {dependencies.length > 0 ? (
                    <Fragment>
                        <div className={'re-toolkit-card-heading thin'}>
                            Dependencies
                        </div>
                        <ul>
                            {dependencies.map((item, i) => {
                                const Alink = item;
                                return Alink ? (
                                    <li key={`dep-${i}`}>
                                        <Alink />
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </Fragment>
                ) : null}
                {npm.length > 0 ? (
                    <Fragment>
                        <div className={'re-toolkit-card-heading thin'}>
                            NPM Modules
                        </div>
                        <ul>
                            {npm.map((item, i) => {
                                const Alink = item;
                                return Alink ? (
                                    <li key={`dep-${i}`}>
                                        <Alink />
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </Fragment>
                ) : null}
            </div>
        );
    }
}
