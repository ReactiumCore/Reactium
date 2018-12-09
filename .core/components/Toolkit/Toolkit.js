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
import Notify from './Notify';
import { Helmet } from 'react-helmet';
import ToolbarIcons from './Toolbar/ToolbarIcons';
import React, { Component, Fragment } from 'react';
import { Plugins } from 'reactium-core/components/Plugable';

/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);

        this.state = { ...this.props };
        this.content = null;
        this.sidebar = null;
        this.settings = null;
        this.notify = null;
        this.togglePref = this.togglePref.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            let newState = Object.assign({}, this.state, nextProps);
            return newState;
        });
    }

    onCopyClick() {
        let autohide = 3000;
        let dismissable = true;
        let elm = this.notify;
        let message = 'Code copied!';

        this.state.notice.show({ message, autohide, dismissable, elm });
    }

    onNoticeDismiss() {
        let elm = this.notify;

        this.state.notice.hide({ elm });
    }

    onResize() {
        let w = window.innerWidth;
        if (w < 768) {
            let { prefs } = this.state;
            let expanded = op.get(prefs, 'sidebar.expanded', true);

            if (expanded === true) {
                this.toggleMenu();
            }
        }
    }

    onMenuItemClick(e) {
        let url = e.target.getAttribute('href');
        this.state.menuItemClick(url);
    }

    onMenuItemToggle(e) {
        let { prefs } = this.state;
        let target = e.currentTarget.dataset.target;

        let collapseAll = op.get(prefs, 'menu.all', false);
        let value = !op.get(prefs, `menu.${target}`, collapseAll);

        let data = {
            state: {
                id: target,
                value,
            },
        };

        let type = 'toggle-menu';

        this.togglePref({ type, data });
    }

    onButtonClick(e, data) {
        let { type } = e;

        this.togglePref({ type, data });
        this.toggleFilter({ type, data });
        this.toggleFullscreen({ type, data, e });
        this.toggleSettings({ type });
    }

    onFilterClick(e, filter) {
        let { filters = [] } = this.state;

        let { type } = filter;

        let idx = _.indexOf(_.pluck(filters, 'type'), type);
        if (idx > -1) {
            filters.splice(idx, 1);
        }

        this.setState({ filters });
    }

    onSettingsOpen() {
        this.state.toggleSettings();
    }

    onSettingsClose() {
        this.state.toggleSettings();
    }

    onSettingSwitchClick({ pref, value }) {
        let { set } = this.state;
        let key = `prefs.${pref}`;

        set({ key, value });

        this.setState({ update: Date.now() });
    }

    onThemeChange(e) {
        this.state.setTheme(e.target.value);
    }

    toggleFilter({ type, data }) {
        let isFilter = new RegExp('^toolbar-filter').test(type);
        if (isFilter !== true) {
            return;
        }

        let { filters = [], manifest = {} } = this.state;

        let filter = type.split('toolbar-filter-').join('');

        if (filter !== 'all') {
            if (!_.findWhere(filters, { type: filter })) {
                let { buttons } = manifest.toolbar;
                let btn = _.findWhere(buttons, { name: `filter-${filter}` });
                let { label } = btn;

                filter = { type: filter, label };

                filters.push(filter);
            } else {
                let idx = _.indexOf(_.pluck(filters, 'type'), filter);
                if (idx > -1) {
                    filters.splice(idx, 1);
                }
            }
        } else {
            filters = [];
        }

        this.setState({ filters });
    }

    toggleFullscreen({ type, data, e }) {
        if (type !== 'toggle-fullscreen') {
            return;
        }
        data.toggleFullScreen(e);
    }

    toggleMenu() {
        this.state.menuToggle(this.sidebar.container);
        this.setState({ update: Date.now() });
    }

    togglePref({ type, data }) {
        let toggles = [
            'toggle-code',
            'toggle-codeColor',
            'toggle-docs',
            'toggle-link',
            'toggle-menu',
        ];

        if (toggles.indexOf(type) < 0) {
            return;
        }

        let { set } = this.state;

        let value;
        let key = type.split('toggle-').join('');
        key = `prefs.${key}.${data.state.id}`;

        switch (type) {
            case 'toggle-link':
            case 'toggle-docs':
            case 'toggle-code': {
                let k = type === 'toggle-code' ? 'codes' : 'docs';
                k = type === 'toggle-link' ? 'link' : k;

                value = !op.get(
                    this.content,
                    `${k}.${data.state.id}.state.visible`,
                );

                break;
            }

            case 'toggle-codeColor': {
                value = data.state.theme;
                break;
            }

            case 'toggle-menu': {
                value = data.state.value;
                break;
            }
        }

        set({ key, value });
        this.setState({ update: Date.now() });
    }

    toggleSettings({ type, data }) {
        if (type !== 'toolbar-toggle-settings') {
            return;
        }
        this.settings.open();
    }

    getElements({ menu, group, element }) {
        let elements = {};

        if (Object.keys(menu).length < 1 || !group) {
            return null;
        }

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
        Object.keys(menu).forEach(k => {
            if (op.get(menu, 'hidden', false) === true) {
                delete menu[k];
                return;
            }

            let elements = op.get(menu, `${k}.elements`, {});

            Object.keys(elements).forEach(e => {
                if (op.get(elements, `${e}.hidden`, false) === true) {
                    delete elements[e];
                }
            });

            menu[k]['elements'] = elements;
        });

        return menu;
    }

    render() {
        let {
            update = Date.now(),
            filters = [],
            manifest = {},
            prefs = {},
            group,
            element,
            showSettings,
            showMenu,
            style,
            notify,
        } = this.state;

        let {
            themes = [],
            menu = {},
            toolbar = {},
            sidebar = {},
            header = {},
            overview,
        } = manifest;

        menu = this.filterMenu(menu);

        let elements = this.getElements({ menu, group, element });
        let groupName = group ? menu[group]['label'] : 'Reactium';
        let theme = _.findWhere(themes, { selected: true });

        if (!style) {
            style = theme ? theme.css : null;
        }

        // update manifest to have the selected style
        themes = themes.map(item => {
            let { css } = item;
            item['selected'] = css === style;
            return item;
        });

        return (
            <Fragment>
                <Helmet titleTemplate='%s | Style Guide'>
                    <title>{groupName}</title>
                    <html lang='en' />
                    <body className='re-toolkit' />
                </Helmet>
                <Plugins zone='toolkit-head' />

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
                        group={group}
                        ref={elm => {
                            this.sidebar = elm;
                        }}
                        onFilterClick={this.onFilterClick.bind(this)}
                        onMenuItemClick={this.onMenuItemClick.bind(this)}
                        onMenuItemToggle={this.onMenuItemToggle.bind(this)}
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
                        ref={elm => {
                            this.content = elm;
                        }}
                        onMenuToggleClick={this.toggleMenu.bind(this)}
                        onButtonClick={this.onButtonClick.bind(this)}
                        onCrumbClick={this.onMenuItemClick.bind(this)}
                        onCopyClick={this.onCopyClick.bind(this)}
                    />
                </main>

                <Settings
                    onSwitchClick={this.onSettingSwitchClick.bind(this)}
                    onSettingsClose={this.onSettingsClose.bind(this)}
                    onSettingsOpen={this.onSettingsOpen.bind(this)}
                    ref={elm => {
                        this.settings = elm;
                    }}
                    visible={showSettings}
                    update={update}
                    prefs={prefs}
                />

                <Notify
                    prefs={prefs}
                    ref={elm => {
                        this.notify = elm;
                    }}
                    onCloseClick={this.onNoticeDismiss.bind(this)}
                    {...notify}
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
