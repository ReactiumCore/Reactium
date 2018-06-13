
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Toolbar from '../Toolbar';
import Menu from '../Menu';


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
            closed,
            menu,
            onFilterClick,
            onMenuItemClick,
            onToolbarItemClick,
            position,
            filters = [],
            toolbar = {}
        } = this.state;

        let cls = (closed === true) ? 're-toolkit-sidebar-closed' : '';
        return (
            <aside className={`re-toolkit-sidebar ${cls} ${position}`}>
                <Toolbar {...toolbar} onToolbarItemClick={onToolbarItemClick} />
                <Menu data={menu} onFilterClick={onFilterClick} onItemClick={onMenuItemClick} filters={filters} />
            </aside>
        );
    }
}

Sidebar.defaultProps = {
    toolbar: {},
    menu: {},
    filters: [],
    closed: false,
    position: 'left',
    onFilterClick: null,
    onMenuItemClick: null,
    onToolbarItemClick: null,
};
