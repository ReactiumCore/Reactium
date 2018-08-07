/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonPrimary
 * -----------------------------------------------------------------------------
 */

export default class ButtonPrimary extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <div className={'row'}>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-primary'}>Primary</button>
                    </div>
                    <small>
                        <kbd>.btn-primary</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-primary-pill'}>
                            Primary Pill
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-primary-pill</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-primary-outline'}>
                            Outline
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-primary-outline</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
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
        );
    }
}
