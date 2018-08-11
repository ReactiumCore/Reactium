/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Select
 * -----------------------------------------------------------------------------
 */

const S = props => {
    return (
        <select {...props}>
            <option>Item 1</option>
            <option>Item 2</option>
            <option>Item 3</option>
        </select>
    );
};

export default class Select extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    render() {
        return (
            <form>
                <div className={'form-group'}>
                    <S />
                </div>
                <div className={'form-group'}>
                    <S multiple />
                </div>
            </form>
        );
    }
}
