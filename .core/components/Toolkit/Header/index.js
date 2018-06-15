
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import _ from 'underscore';

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
        let { logo, title, version, themes = [], onThemeChange = null } = this.state;

        let selected = (themes.length > 1) ? _.findWhere(themes, {selected: true}) : null;
        if (selected) {
            selected = selected.css
        } else {
            selected = null;
        }

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
                {(themes.length > 1)
                    ? (
                        <div style={{marginLeft: 10}}>
                            <select className={'re-toolkit-select'} defaultValue={selected} onChange={onThemeChange}>
                                {themes.map((item, i) => {
                                    let { css, name } = item;
                                    return (<option key={i} value={css}>{name}</option>);
                                })}
                            </select>
                        </div>
                    )
                    : null
                }
            </header>
        );
    }
}

Header.defaultProps = {
    themes        : [],
    logo          : null,
    title         : null,
    onThemeChange : null,
    version       : '0.0.1',
};
