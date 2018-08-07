/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Radio
 * -----------------------------------------------------------------------------
 */

export default class Radio extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <Fragment>
                <div>
                    <label>
                        Radio 1{' '}
                        <input type="radio" name={'radio-demo'} value={1} />
                    </label>
                </div>
                <div>
                    <label>
                        Radio 2{' '}
                        <input type="radio" name={'radio-demo'} value={2} />
                    </label>
                </div>
                <div>
                    <label>
                        Radio 3{' '}
                        <input type="radio" name={'radio-demo'} value={3} />
                    </label>
                </div>
                <div>
                    <label>
                        Radio 4{' '}
                        <input type="radio" name={'radio-demo'} value={4} />
                    </label>
                </div>
            </Fragment>
        );
    }
}
