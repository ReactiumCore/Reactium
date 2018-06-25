
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { H1 } from '../Headings';
import { P } from '../Paragraph';

/**
 * -----------------------------------------------------------------------------
 * React Component: Article
 * -----------------------------------------------------------------------------
 */

export default class Article extends Component {
    static dependencies() { return module.children; }

    constructor(props) {
        super(props);

        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    render() {
        return (
            <article>
                <H1>The quick brown fox jumps over a lazy dog</H1>
                <P />
            </article>
        );
    }
}
