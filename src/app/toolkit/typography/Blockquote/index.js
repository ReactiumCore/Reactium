/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: Blockquote
 * -----------------------------------------------------------------------------
 */

export default class Blockquote extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <blockquote>
                <p>
                    <Lipsum length={58} />.
                </p>
                <small>&ndash; Guyus Latinacus</small>
            </blockquote>
        );
    }
}
