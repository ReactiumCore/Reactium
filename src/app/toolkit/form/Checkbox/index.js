/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Checkbox
 * -----------------------------------------------------------------------------
 */

export default class Checkbox extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <Fragment>
                <div>
                    <label>
                        Check Me! <input type="checkbox" />
                    </label>
                </div>
                <div>
                    <label>
                        And Me! <input type="checkbox" />
                    </label>
                </div>
            </Fragment>
        );
    }
}
