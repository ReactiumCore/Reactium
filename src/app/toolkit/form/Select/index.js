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
        <select {...props} style={{ width: 200 }}>
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
            <div className={'flex-sm'}>
                <div className={'mr-xs-0 mr-sm-20 mb-xs-10 mb-sm-0'}>
                    <S multiple />
                </div>
                <div>
                    <S />
                </div>
            </div>
        );
    }
}
