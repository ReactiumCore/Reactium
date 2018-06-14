
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Toolbar from '../Toolbar';
import Menu from '../Menu';
import op from 'object-path';


/**
 * -----------------------------------------------------------------------------
 * React Component: Sidebar
 * -----------------------------------------------------------------------------
 */

export default class Sidebar extends Component {
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
        let {
            menu,
            onFilterClick,
            onMenuItemClick,
            onToolbarItemClick,
            position,
            filters = [],
            toolbar = {},
            prefs   = {},
        } = this.state;

        position = op.get(prefs, 'sidebar.position', position);

        return (
            <aside className={`re-toolkit-sidebar ${position}`}>
                <Toolbar {...toolbar} onToolbarItemClick={onToolbarItemClick} />
                <Menu data={menu} onFilterClick={onFilterClick} onItemClick={onMenuItemClick} filters={filters} />
            </aside>
        );
    }
}

Sidebar.defaultProps = {
    prefs              : {},
    toolbar            : {},
    menu               : {},
    filters            : [],
    onFilterClick      : null,
    onMenuItemClick    : null,
    onToolbarItemClick : null,
    position           : 'left',
};
