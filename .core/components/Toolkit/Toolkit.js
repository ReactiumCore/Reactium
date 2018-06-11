
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
import ToolbarIcons from './Toolbar/ToolbarIcons';



/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);

        this.content    = null;
        this.togglePref = this.togglePref.bind(this);
        this.state      = { ...this.props };
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

        console.log('Toolkit.onToolbarItemClick(', type, ')');
        console.log(data);
        this.togglePref({type, data});
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
            case 'toggle-code': {
                value = !op.get(this.content, `codes.${data.state.id}.state.visible`);
                break;
            }

            case 'toggle-docs': {
                value = !op.get(this.content, `docs.${data.state.id}.state.visible`);
                break;
            }

            case 'toggle-codeColor': {
                value = data.state.theme;
                break;
            }
        }

        set({key, value});
    }

    render() {
        let { manifest = {}, prefs = {}, group, element } = this.state;
        let { menu = {}, toolbar = {}, sidebar = {} } = manifest;

        let elements  = this.getElements({ menu, group, element });
        let groupName = (group) ? menu[group]['label'] : 'Reactium';

        return (
            <Fragment>
                <ToolbarIcons />
                <Header />
                <main className={'re-toolkit-container'}>
                    <Sidebar
                        {...sidebar}
                        menu={menu}
                        toolbar={toolbar}
                        onToolbarItemClick={this.onButtonClick.bind(this)}
                        onMenuItemClick={this.onMenuItemClick.bind(this)}
                    />
                    <Content
                        group={group}
                        prefs={prefs}
                        data={elements}
                        title={groupName}
                        element={element}
                        ref={(elm) => { this.content = elm; }}
                        onButtonClick={this.onButtonClick.bind(this)}
                        onCrumbClick={this.onMenuItemClick.bind(this)}
                    />
                </main>
                <Helmet titleTemplate="%s | Style Guide">
                    <title>{groupName}</title>
                    <html lang="en" />
                    <body className="re-toolkit" />
                </Helmet>
            </Fragment>
        );
    }
}

Toolkit.defaultProps = {
    prefs: {},
};
