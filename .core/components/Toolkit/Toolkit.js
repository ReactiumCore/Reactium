
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';


/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
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

        if (Object.keys(menu).length < 1) { return null; }

        if (!element) {
            elements = menu[group]['elements'];
        } else {
            elements[element] = menu[group]['elements'][element];
        }

        return elements;
    }

    render() {
        let { manifest = {}, group, element } = this.state;
        let { menu = {} } = manifest;

        let elements = this.getElements({ menu, group, element });

        let groupName = (group) ? menu[group]['label'] : 'Style Guide';

        return (
            <Fragment>
                <Header />
                <main className={'re-toolkit-container'}>
                    <Sidebar menu={menu} onMenuItemClick={this.onMenuItemClick.bind(this)} />
                    <Content
                        title={groupName}
                        group={group}
                        data={elements}
                        element={element}
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

Toolkit.defaultProps = {};
