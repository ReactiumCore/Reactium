
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

        this.content = null;
        this.state   = { ...this.props };
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

    onButtonClick(e, data) {

        let { type } = e;
        let { set } = this.state;

        let persist = [
            'toggle-code',
        ];

        if (persist.indexOf(type) > -1) {
            let karry = type.split('-'); karry.shift();
            let key, value;

            switch (type) {
                case 'toggle-code':{
                    key   = `prefs.${karry.join('-')}.${data.state.id}`;
                    value = !op.get(this.content, `codes.${data.state.id}.state.visible`);
                    set({key, value});
                    break;
                }
            }
        }
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
