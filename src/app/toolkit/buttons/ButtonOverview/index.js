/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import ButtonPrimary from 'toolkit/buttons/ButtonPrimary';
import ButtonSecondary from 'toolkit/buttons/ButtonSecondary';
import ButtonTertiary from 'toolkit/buttons/ButtonTertiary';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonOverview
 * -----------------------------------------------------------------------------
 */

export default class ButtonOverview extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <Fragment>
                <ButtonPrimary />
                <ButtonSecondary />
                <ButtonTertiary />
            </Fragment>
        );
    }
}
