/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: ListOrdered
 * -----------------------------------------------------------------------------
 */

export default class ListOrdered extends Component {
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
                    <Lipsum length={58} />
                </li>
            );
        }

        return output;
    }

    render() {
        return <ol>{this.renderItems().map(item => item)}</ol>;
    }
}
