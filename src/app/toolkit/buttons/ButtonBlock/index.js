/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonBlock
 * -----------------------------------------------------------------------------
 */

export default class ButtonBlock extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <Fragment>
                <div
                    style={{ width: '100%' }}
                    className={'p-20 bg-grey-light mb-xs-10 mb-sm-20'}
                >
                    <button className={`btn-primary-lg btn-block`}>
                        Primary Block
                    </button>
                </div>
                <div style={{ width: '100%' }} className={'p-20 bg-grey-light'}>
                    <button className={`btn-primary-lg-outline btn-block`}>
                        Outline Block
                    </button>
                </div>
            </Fragment>
        );
    }
}
