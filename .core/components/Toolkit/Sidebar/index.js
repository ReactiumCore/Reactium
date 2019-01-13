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
const position = prefs => op.get(prefs, 'sidebar.position', 'left');

const expanded = prefs => op.get(prefs, 'sidebar.expanded', true);

const Sidebar = ({
    menu,
    onFilterClick,
    onMenuItemClick,
    onMenuItemToggle,
    onToolbarItemClick,
    group,
    filters = [],
    toolbar = {},
    prefs = {},
    update,
}) => (
    <aside
        id='reactium-sidebar'
        className={`re-toolkit-sidebar ${position(prefs)} ${
            expanded(prefs) ? 'expanded' : 'collapsed'
        }`}>
        <Toolbar {...toolbar} onToolbarItemClick={onToolbarItemClick} />
        <Menu
            prefs={prefs}
            data={menu}
            group={group}
            update={update}
            onFilterClick={onFilterClick}
            onItemClick={onMenuItemClick}
            onMenuItemToggle={onMenuItemToggle}
            filters={filters}
        />
    </aside>
);

Sidebar.defaultProps = {
    prefs: {},
    toolbar: {},
    menu: {},
    filters: [],
    group: null,
    onFilterClick: null,
    onMenuItemClick: null,
    onMenuItemToggle: null,
    onToolbarItemClick: null,
};

export default Sidebar;
