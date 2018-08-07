/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonSecondary
 * -----------------------------------------------------------------------------
 */

export default class ButtonSecondary extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <div className={'row'}>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-secondary'}>Secondary</button>
                    </div>
                    <small>
                        <kbd>.btn-secondary</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-secondary-pill'}>
                            Secondary Pill
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-secondary-pill</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-secondary-outline'}>
                            Outline
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-secondary-outline</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-secondary-outline-pill'}>
                            Outline Pill
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-secondary-outline-pill</kbd>
                    </small>
                </div>
            </div>
        );
    }
}
