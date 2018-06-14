
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

export default class Header extends Component {
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
        let { logo, title, version } = this.state;

        return (
            <header className={'re-toolkit-header'}>
                {(logo)
                    ? (
                        <a href={'/toolkit'}>
                            <img className={'re-toolkit-header-logo'} src={logo} />
                        </a>
                    )
                    : null
                }
                {(title)
                    ? (
                        <h1 style={{flexGrow: 1}}>{title}</h1>
                    )
                    : null
                }
                {(version)
                    ? (
                        <small>{version}</small>
                    )
                    : null
                }
            </header>
        );
    }
}

Header.defaultProps = {
    logo    : null,
    title   : null,
    version : '0.0.1',
};
