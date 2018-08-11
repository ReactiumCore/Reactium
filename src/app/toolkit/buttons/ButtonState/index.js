/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonState
 * -----------------------------------------------------------------------------
 */

class ButtonState extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = { ...this.props };
    }

    onChange(e) {
        let active = e.currentTarget.value;
        this.setState({ active });
    }

    render() {
        let { active, types = {} } = this.state;
        let cls = `btn-${active}`;
        let name = types[active];

        return (
            <Fragment>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <div className={`form-group`}>
                        <select
                            value={active}
                            onChange={this.onChange.bind(this)}
                            className={`mt-xs-20 mr-xs-24`}
                        >
                            {Object.keys(types).map((k, i) => {
                                return (
                                    <option key={`type-${i}`} value={k}>
                                        {types[k]}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <h4 className={`mb-xs-10 mb-sm-20`}>Default State</h4>
                <section className={`mb-xs-10 mb-sm-20`}>
                    <div className={`row`}>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={cls}>{name}</button>
                            </div>
                            <small>
                                <kbd>.{cls}</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-pill`}>
                                    {name} Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-pill</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline`}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline-pill`}>
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline-pill</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={`my-xs-10 my-sm-20`}>
                    <h4 className={`mb-xs-10 mb-sm-20`}>Hover State</h4>
                    <div className={`row`}>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls} hover`}>
                                    {name}
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls} .hover</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-pill hover`}>
                                    {name} Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-pill .hover</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline hover`}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline .hover</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline-pill hover`}>
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline-pill .hover</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={`my-xs-10 my-sm-20`}>
                    <h4 className={`mb-xs-10 mb-sm-20`}>Active State</h4>
                    <div className={`row`}>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls} active`}>
                                    {name}
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls} .active</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-pill active`}>
                                    {name} Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-pill .active</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline active`}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline .active</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button
                                    className={`${cls}-outline-pill active`}
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline-pill .active</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={`my-xs-10 my-sm-20`}>
                    <h4 className={`mb-xs-10 mb-sm-20`}>Focus State</h4>
                    <div className={`row`}>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls} focus`}>
                                    {name}
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls} .focus</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-pill focus`}>
                                    {name} Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-pill .focus</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline focus`}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline .focus</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={`${cls}-outline-pill focus`}>
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline-pill .focus</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={`mt-xs-10 mt-sm-20`}>
                    <h4 className={`mb-xs-10 mb-sm-20`}>Disabled State</h4>
                    <div className={`row`}>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button className={cls} disabled={true}>
                                    {name}
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls} .disabled</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button
                                    className={`${cls}-pill`}
                                    disabled={true}
                                >
                                    {name} Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-pill .disabled</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button
                                    className={`${cls}-outline`}
                                    disabled={true}
                                >
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline .disabled</kbd>
                            </small>
                        </div>
                        <div className={`col-xs-6 col-sm text-center my-10`}>
                            <div className={`mb-xs-8 mb-sm-10`}>
                                <button
                                    className={`${cls}-outline-pill`}
                                    disabled={true}
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.{cls}-outline-pill .disabled</kbd>
                            </small>
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}

ButtonState.defaultProps = {
    active: 'primary',
    types: {
        primary: 'Primary',
        secondary: 'Secondary',
        tertiary: 'Tertiary'
    }
};

export default ButtonState;
