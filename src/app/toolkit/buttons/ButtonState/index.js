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

export default class ButtonState extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <Fragment>
                <section className={'my-xs-10 my-sm-20'}>
                    <h4 className={'mb-xs-10 mb-sm-20'}>Default State</h4>
                    <div className={'row'}>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary'}>
                                    Primary
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-pill'}>
                                    Primary Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-pill</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-outline'}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-outline-pill'}>
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline-pill</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={'my-xs-10 my-sm-20'}>
                    <h4 className={'mb-xs-10 mb-sm-20'}>Hover State</h4>
                    <div className={'row'}>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary hover'}>
                                    Primary
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary .hover</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-pill hover'}>
                                    Primary Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-pill .hover</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-outline hover'}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline .hover</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-outline-pill hover'}
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline-pill .hover</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={'my-xs-10 my-sm-20'}>
                    <h4 className={'mb-xs-10 mb-sm-20'}>Active State</h4>
                    <div className={'row'}>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary active'}>
                                    Primary
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary .active</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-pill active'}>
                                    Primary Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-pill .active</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-outline active'}
                                >
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline .active</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={
                                        'btn-primary-outline-pill active'
                                    }
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline-pill .active</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={'my-xs-10 my-sm-20'}>
                    <h4 className={'mb-xs-10 mb-sm-20'}>Focus State</h4>
                    <div className={'row'}>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary focus'}>
                                    Primary
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary .focus</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-pill focus'}>
                                    Primary Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-pill .focus</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button className={'btn-primary-outline focus'}>
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline .focus</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-outline-pill focus'}
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline-pill .focus</kbd>
                            </small>
                        </div>
                    </div>
                </section>
                <section className={'my-xs-10 my-sm-20'}>
                    <h4 className={'mb-xs-10 mb-sm-20'}>Disabled State</h4>
                    <div className={'row'}>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary'}
                                    disabled={true}
                                >
                                    Primary
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary .disabled</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-pill'}
                                    disabled={true}
                                >
                                    Primary Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-pill .disabled</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-outline'}
                                    disabled={true}
                                >
                                    Outline
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline .disabled</kbd>
                            </small>
                        </div>
                        <div className={'col-xs-6 col-sm text-center my-10'}>
                            <div className={'mb-xs-8 mb-sm-10'}>
                                <button
                                    className={'btn-primary-outline-pill'}
                                    disabled={true}
                                >
                                    Outline Pill
                                </button>
                            </div>
                            <small>
                                <kbd>.btn-primary-outline-pill .disabled</kbd>
                            </small>
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}
