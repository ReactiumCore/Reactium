
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import op from 'object-path';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Settings from './Settings';
import ToolbarIcons from './Toolbar/ToolbarIcons';
import _ from 'underscore';


/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);

        this.content        = null;
        this.settings       = null;
        this.togglePref     = this.togglePref.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.state          = { ...this.props };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onMenuItemClick(e) {
        let url = e.target.getAttribute('href');
        this.state.menuItemClick(url);
    }

    onButtonClick(e, data) {
        let { type } = e;

        //console.log('Toolkit.onButtonClick(',type,')');

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
        ];

        if (toggles.indexOf(type) < 0) { return; }

        let { set } = this.state;

        let value;
        let key = type.split('toggle-').join('');
            key = `prefs.${key}.${data.state.id}`;

        switch (type) {
            case 'toggle-docs':
            case 'toggle-code': {
                let k = (type === 'toggle-code') ? 'codes' : 'docs';
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

    render() {
        let { manifest = {}, prefs = {}, group, element, filters = [] } = this.state;
        let { menu = {}, toolbar = {}, sidebar = {}, overview } = manifest;

        let elements  = this.getElements({ menu, group, element });
        let groupName = (group) ? menu[group]['label'] : 'Reactium';

        return (
            <Fragment>
                <Helmet titleTemplate="%s | Style Guide">
                    <title>{groupName}</title>
                    <html lang="en" />
                    <body className="re-toolkit" />
                </Helmet>

                <ToolbarIcons />

                <Header />

                <main className={'re-toolkit-container'}>

                    <Sidebar
                        {...sidebar}
                        menu={menu}
                        toolbar={toolbar}
                        filters={filters}
                        onToolbarItemClick={this.onButtonClick.bind(this)}
                        onMenuItemClick={this.onMenuItemClick.bind(this)}
                        onFilterClick={this.onFilterClick.bind(this)}
                    />

                    <Content
                        group={group}
                        prefs={prefs}
                        data={elements}
                        title={groupName}
                        element={element}
                        defaultComponent={overview}
                        ref={(elm) => { this.content = elm; }}
                        onButtonClick={this.onButtonClick.bind(this)}
                        onCrumbClick={this.onMenuItemClick.bind(this)}
                    />
                </main>
                
                <Settings ref={(elm) => { this.settings = elm; }} />
            </Fragment>
        );
    }
}

Toolkit.defaultProps = {
    prefs: {},
    filters: [],
};
