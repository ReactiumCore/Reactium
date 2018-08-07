/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonSizing
 * -----------------------------------------------------------------------------
 */

export default class ButtonSizing extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    renderRows() {
        let sizes = ['lg', 'md', 'sm', 'xs'];

        return sizes.map((sz, i) => {
            return (
                <div className={'row'} key={`row-${i}`}>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}`}>
                                Primary
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-{sz}-primary</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}-pill`}>
                                Primary Pill
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-pill</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}-outline`}>
                                Outline
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-outline</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button
                                className={`btn-primary-${sz}-outline-pill`}
                            >
                                Outline Pill
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-outline-pill</kbd>
                        </small>
                    </div>
                </div>
            );
        });
    }

    render() {
        return <Fragment>{this.renderRows().map(item => item)}</Fragment>;
    }
}
