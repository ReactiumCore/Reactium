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
import Loading from './Loading';
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
    static defaultProps = {
        update: Date.now(),
        prefs: {},
        filters: [],
        style: null,
        showSettings: false,
    };

    constructor(props) {
        super(props);

        this.state = {};
        this.content = null;
        this.sidebar = null;
        this.settings = null;
        this.notify = null;
        this.onResize = this.onResize.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.togglePref = this.togglePref.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('keydown', this.onKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('keydown', this.onKeyPress);
    }

    onKeyPress(e) {
        const { altKey, shiftKey, code } = e;
        const codes = ['bracketleft'];

        if (codes.includes(String(code).toLowerCase()) && altKey && !shiftKey) {
            e.preventDefault();
            this.props.menuToggle();
        }

        if (codes.includes(String(code).toLowerCase()) && altKey && shiftKey) {
            e.preventDefault();
            this.toggleSettings({ type: 'toolbar-toggle-settings' });
        }
    }

    onCopyClick(type) {
        if (type !== 'copy') {
            return;
        }
        const autohide = 3000;
        const dismissable = true;
        const elm = this.notify;
        const message = 'Code copied!';

        this.props.notice.show({ message, autohide, dismissable, elm });
    }

    onNoticeDismiss() {
        const elm = this.notify;

        this.props.notice.hide({ elm });
    }

    onResize() {
        let w = window.innerWidth;
        if (w < 768) {
            const { prefs } = this.props;
            const expanded = op.get(prefs, 'sidebar.expanded', true);

            if (expanded === true) {
                this.toggleMenu();
            }
        }
    }

    onMenuItemClick(e) {
        const url = e.target.getAttribute('href');
        this.props.menuItemClick(url);
    }

    onMenuItemToggle(e) {
        const { prefs } = this.props;
        const target = e.currentTarget.dataset.target;

        const collapseAll = op.get(prefs, 'menu.all', false);
        const value = !op.get(prefs, `menu.${target}`, collapseAll);

        const data = {
            state: {
                id: target,
                value,
            },
        };

        const type = 'toggle-menu';

        this.togglePref({ type, data });
    }

    onButtonClick(e, data) {
        const { type } = e;
        this.togglePref({ type, data });
        this.toggleFilter({ type, data });
        this.toggleFullscreen({ type, data, e });
        this.toggleSettings({ type });
        this.onCopyClick(type);
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
        this.props.toggleSettings();
    }

    onSettingsClose() {
        this.props.toggleSettings();
    }

    onSettingSwitchClick({ pref, value }) {
        const key = `prefs.${pref}`;

        this.props.set({ key, value });

        this.setState({ update: Date.now() });
    }

    onThemeChange(e) {
        this.props.setTheme(e.target.value);
    }

    toggleFilter({ type, data }) {
        const isFilter = new RegExp('^toolbar-filter').test(type);
        if (isFilter !== true) {
            return;
        }

        const { manifest } = this.props;
        const { filters = [] } = this.state;

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
        this.props.menuToggle();
        this.setState({ update: Date.now() });
    }

    togglePref({ type, data }) {
        const toggles = [
            'toggle-code',
            'toggle-codeColor',
            'toggle-docs',
            'toggle-link',
            'toggle-menu',
        ];

        if (toggles.indexOf(type) < 0) {
            return;
        }

        let { set } = this.props;

        let value;
        let key = type.split('toggle-').join('');
        key = `prefs.${key}.${data.state.id}`;

        switch (type) {
            case 'toggle-link':
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

    toggleSettings({ type }) {
        if (type !== 'toolbar-toggle-settings') {
            return;
        }
        this.settings.toggle();
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

            const elements = op.get(menu, `${k}.elements`, {});

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
        const { filters = [] } = this.state;
        let {
            update = Date.now(),
            manifest = {},
            prefs = {},
            group,
            element,
            showSettings,
            showMenu,
            style,
            notify,
            loading,
        } = this.props;

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
                    update={update}
                    themes={themes}
                    style={style}
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
                        onFilterClick={this.onFilterClick.bind(this)}
                        onMenuItemClick={this.onMenuItemClick.bind(this)}
                        onMenuItemToggle={this.onMenuItemToggle.bind(this)}
                        onToolbarItemClick={this.onButtonClick.bind(this)}
                    />

                    {!loading && (
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
                    )}
                    {loading && <Loading onComplete={this.props.loaded} />}
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
