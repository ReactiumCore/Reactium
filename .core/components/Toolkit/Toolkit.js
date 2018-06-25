
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import _ from 'underscore';
import op from 'object-path';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Settings from './Settings';
import { Helmet } from 'react-helmet';
import ToolbarIcons from './Toolbar/ToolbarIcons';
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);

        this.state          = { ...this.props };

        this.content        = null;
        this.sidebar        = null;
        this.settings       = null;
        this.togglePref     = this.togglePref.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            let newState = Object.assign({}, this.state, nextProps);
            return newState;
        });
    }

    onMenuItemClick(e) {
        let url = e.target.getAttribute('href');
        this.state.menuItemClick(url);
    }

    onButtonClick(e, data) {
        let { type } = e;

        this.togglePref({type, data});
        this.toggleFilter({type, data});
        this.toggleFullscreen({type, data, e});
        this.toggleSettings({type});
    }

    onFilterClick(e, filter) {
        let { filters = [] } = this.state;

        let { type } = filter;

        let idx = _.indexOf(_.pluck(filters, 'type'), type);
        if (idx > -1) { filters.splice(idx, 1); }

        this.setState({filters});
    }

    toggleFilter({type, data}) {

        let isFilter = (new RegExp('^toolbar-filter')).test(type);
        if (isFilter !== true) { return; }

        let { filters = [], manifest = {} } = this.state;

        let filter = type.split('toolbar-filter-').join('');

        if (filter !== 'all') {
            if (!_.findWhere(filters, {type: filter})) {

                let { buttons } = manifest.toolbar;
                let btn = _.findWhere(buttons, {name: `filter-${filter}`});
                let { label } = btn;

                filter = {type: filter, label};

                filters.push(filter);
            } else {
                let idx = _.indexOf(_.pluck(filters, 'type'), filter);
                if (idx > -1) { filters.splice(idx, 1); }
            }
        } else {
            filters = [];
        }

        this.setState({filters});
    }

    toggleFullscreen({type, data, e}) {
        if (type !== 'toggle-fullscreen') { return; }
        data.toggleFullScreen(e);
    }

    togglePref({type, data}) {

        let toggles = [
            'toggle-code',
            'toggle-codeColor',
            'toggle-docs',
            'toggle-link',
        ];

        if (toggles.indexOf(type) < 0) { return; }

        let { set } = this.state;

        let value;
        let key = type.split('toggle-').join('');
            key = `prefs.${key}.${data.state.id}`;


        switch (type) {
            case 'toggle-link':
            case 'toggle-docs':
            case 'toggle-code': {
                let k = (type === 'toggle-code') ? 'codes' : 'docs';
                    k = (type === 'toggle-link') ? 'link' : k;

                value = !op.get(this.content, `${k}.${data.state.id}.state.visible`);

                break;
            }

            case 'toggle-codeColor': {
                value = data.state.theme;
                break;
            }
        }

        set({key, value});
    }

    toggleSettings({type, data}) {
        if (type !== 'toolbar-toggle-settings') { return; }
        this.settings.open();
    }

    onSettingsOpen() {
        this.setState({showSettings: true});
    }

    onSettingsClose() {
        this.setState({showSettings: false});
    }

    onSettingSwitchClick({pref, value}) {
        let { set } = this.state;
        let key = `prefs.${pref}`;

        set({key, value});

        this.setState({update: Date.now()});
    }

    onThemeChange(e) { // TODO: on theme change
        this.state.setTheme(e.target.value);
    }

    getElements({ menu, group, element }) {
        let elements = {};

        if (Object.keys(menu).length < 1 || !group) { return null; }

        if (!element) {
            let { component = null } = menu[group];
            elements = component || menu[group]['elements'];
        } else {
            elements[element] = menu[group]['elements'][element];
        }

        return elements;
    }

    filterMenu(menu) {

        // Loop through menu items and if the group has hidden === true -> remove it
        Object.keys(menu).forEach((k) => {
            if (op.get(menu, 'hidden', false) === true) {
                delete menu[k];
                return;
            }

            let elements = op.get(menu, `${k}.elements`, {});

            Object.keys(elements).forEach((e) => {
                if (op.get(elements, `${e}.hidden`, false) === true) {
                    delete elements[e];
                }
            });

            menu[k]['elements'] = elements;
        });

        console.log({ menu });
        return menu;
    }

    render() {
        let {
            update   = Date.now(),
            filters  = [],
            manifest = {},
            prefs    = {},
            group,
            element,
            showSettings,
            showMenu,
            style,
        } = this.state;

        let {
            themes   = [],
            settings = [],
            menu     = {},
            toolbar  = {},
            sidebar  = {},
            header   = {},
            overview,
        } = manifest;

        menu = this.filterMenu(menu);

        let elements  = this.getElements({ menu, group, element });
        let groupName = (group) ? menu[group]['label'] : 'Reactium';
        let theme     = _.findWhere(themes, {selected: true});

        if (!style) {
            style = (theme) ? theme.css : null;
        }

        // update manifest to have the selected style
        themes = themes.map((item) => {
            let { css } = item;
            item['selected'] = (css === style);
            return item;
        });

        return (
            <Fragment>
                <Helmet titleTemplate="%s | Style Guide">
                    <title>{groupName}</title>
                    <html lang="en" />
                    <body className="re-toolkit" />
                </Helmet>

                <ToolbarIcons />

                <Header
                    {...header}
                    themes={themes}
                    onThemeChange={this.onThemeChange.bind(this)}
                />

                <main className={'re-toolkit-container'}>
                    <Sidebar
                        {...sidebar}
                        menu={menu}
                        prefs={prefs}
                        update={update}
                        toolbar={toolbar}
                        filters={filters}
                        ref={(elm) => { this.sidebar = elm; }}
                        onFilterClick={this.onFilterClick.bind(this)}
                        onMenuItemClick={this.onMenuItemClick.bind(this)}
                        onToolbarItemClick={this.onButtonClick.bind(this)}
                    />

                    <Content
                        group={group}
                        prefs={prefs}
                        menu={menu}
                        style={style}
                        data={elements}
                        update={update}
                        title={groupName}
                        element={element}
                        defaultComponent={overview}
                        ref={(elm) => { this.content = elm; }}
                        onButtonClick={this.onButtonClick.bind(this)}
                        onCrumbClick={this.onMenuItemClick.bind(this)}
                    />
                </main>

                <Settings
                    onSwitchClick={this.onSettingSwitchClick.bind(this)}
                    onSettingsClose={this.onSettingsClose.bind(this)}
                    onSettingsOpen={this.onSettingsOpen.bind(this)}
                    ref={(elm) => { this.settings = elm; }}
                    visible={showSettings}
                    settings={settings}
                    update={update}
                    prefs={prefs}
                />
            </Fragment>
        );
    }
}

Toolkit.defaultProps = {
    update: Date.now(),
    prefs: {},
    filters: [],
    style: null,
    showSettings: false,
};
