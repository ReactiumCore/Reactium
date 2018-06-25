
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import LI from './LI';
import UL from './UL';

/**
 * -----------------------------------------------------------------------------
 * React Component: Lists
 * -----------------------------------------------------------------------------
 */

export default class Lists extends Component {
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

    renderDefault() {
        let items = [
            (<LI key={`li-1`}>Item 1</LI>),
            (<LI key={`li-2`}>Item 2</LI>),
            (<LI key={`li-3`}>Item 3</LI>),
            (<LI key={`li-4`}>Item 4</LI>),
            (<LI key={`li-5`}>Item 5</LI>),
        ];

        return items.map((item) => item);
    }

    render() {
        let { children, className, style } = this.state;
        children = (!children) ? this.renderDefault() : children;

        return (
            <ul className={className} style={style}>
                {children}
            </ul>
        );
    }
}

export {
    LI,
    UL,
}

Lists.defaultProps = {};
