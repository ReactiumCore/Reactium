/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

/**
 * -----------------------------------------------------------------------------
 * React Component: Nav
 * -----------------------------------------------------------------------------
 */

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };

        this.container = null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {
                ...prevState,
                ...nextProps
            };
        });
    }

    render() {
        let { buttons, fixed } = this.state;

        return (
            <nav
                className={fixed === true ? "main fixed" : "main"}
                ref={elm => {
                    this.container = elm;
                }}
            >
                <div>
                    <ul>
                        {buttons.map((item, i) => {
                            return (
                                <li key={`nav-${i}`}>
                                    <NavLink {...item}>{item.label}</NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        );
    }
}

Nav.defaultProps = {
    fixed: false,
    buttons: [
        { type: "nav", exact: true, to: "/demo/site/menu", label: "Menu" },
        {
            type: "nav",
            exact: true,
            to: "/demo/site/catering",
            label: "Catering"
        },
        { type: "nav", exact: true, to: "/demo/site/about", label: "About Us" },
        { type: "nav", exact: true, to: "/demo/site/contact", label: "Contact" }
    ]
};

export default Nav;
