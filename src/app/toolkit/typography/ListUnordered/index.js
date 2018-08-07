/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: ListUnordered
 * -----------------------------------------------------------------------------
 */

export default class ListUnordered extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    renderItems() {
        let output = [];

        for (let i = 0; i < 10; i++) {
            output.push(
                <li key={`item-${i}`}>
                    <Lipsum length={21} />
                </li>
            );
        }

        return output;
    }

    render() {
        return <ul>{this.renderItems().map(item => item)}</ul>;
    }
}
