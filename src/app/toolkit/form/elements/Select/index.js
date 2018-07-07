/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";

/**
 * -----------------------------------------------------------------------------
 * React Component: Select
 * -----------------------------------------------------------------------------
 */

class Select extends Component {
    static dependencies() {
        if (module) {
            return module.children;
        }
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty("mount")) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return (
            <Fragment>
                <select id="test">
                    <option>1</option>
                    <option>2</option>
                    <option>5</option>
                </select>
            </Fragment>
        );
    }
}

// Default properties
Select.defaultProps = {};

export default Select;
