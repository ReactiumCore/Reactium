/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * -----------------------------------------------------------------------------
 * React Component: Button
 * -----------------------------------------------------------------------------
 */

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        let { type = "button" } = this.state;

        switch (type) {
            case "link":
                return <Link {...this.state} />;

            case "nav":
                return <NavLink {...this.state} />;

            case "label":
                return <label {...this.state} />;

            default:
                return <button {...this.state} />;
        }
    }
}

class PrimaryButton extends Button {
    constructor(props) {
        super(props);
    }
}

PrimaryButton.defaultProps = {
    className: "btn btn-primary",
    type: "button"
};

export { PrimaryButton };
