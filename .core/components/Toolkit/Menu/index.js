
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Search from '../Search';

/**
 * -----------------------------------------------------------------------------
 * React Component: Menu
 * -----------------------------------------------------------------------------
 */

export default class Menu extends Component {
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

    render() {
        let { data = {} } = this.state;

        let items = [];

        return (
            <div className={'re-toolkit-menu'}>
                <Search />
                <ul>
                    {Object.keys(data).map((key, k) => {

                        let { label, link } = data[key];

                        return (
                            <li key={`group-${key}`}>
                                <NavLink className={'heading'} exact={false} to={link}>
                                    {label}
                                </NavLink>
                            </li>
                        );
                    })}

                    {items.map((item, i) => {
                        let { label, link, heading = false } = item;

                        let cls = (heading === true) ? 'heading' : 'link';
                        let exact = !heading;

                        return (
                            <li key={`re-toolkit-menu-item-${i}`}>
                                <NavLink className={cls} exact={exact} to={link}>{label}</NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

Menu.defaultProps = {
    data: {},
    items: [
        {label: 'Typography', link: '/toolkit/typography', heading: true},
        {label: 'Link 1', link: '/toolkit/typography/link-1'},
        {label: 'Link 2', link: '/toolkit/typography/link-2'},
        {label: 'Link 3', link: '/toolkit/typography/link-3'},
        {label: 'Link 4', link: '/toolkit/typography/link-4'},
    ]
};
