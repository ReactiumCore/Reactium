/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonTertiary
 * -----------------------------------------------------------------------------
 */

export default class ButtonTertiary extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <div className={'row'}>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-tertiary'}>Tertiary</button>
                    </div>
                    <small>
                        <kbd>.btn-tertiary</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-tertiary-pill'}>
                            Tertiary Pill
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-tertiary-pill</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-tertiary-outline'}>
                            Outline
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-tertiary-outline</kbd>
                    </small>
                </div>
                <div className={'col-xs-12 col-sm text-center my-10'}>
                    <div className={'mb-xs-8 mb-sm-10'}>
                        <button className={'btn-tertiary-outline-pill'}>
                            Outline Pill
                        </button>
                    </div>
                    <small>
                        <kbd>.btn-tertiary-outline-pill</kbd>
                    </small>
                </div>
            </div>
        );
    }
}
