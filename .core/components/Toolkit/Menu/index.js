
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
        let { items } = this.state;

        return (
            <div className={'re-toolkit-menu'}>
                <Search />
                <ul>
                    {items.map((item, i) => {
                        let { label, link, heading = false } = item;

                        let cls = (heading === true) ? 'heading' : 'link';
                        let exact = !heading;

                        return (
                            <li key={`re-toolkit-menu-${i}`}>
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
    items: [
        {label: 'Typography', link: '/toolkit/typography', heading: true},
        {label: 'Link 1', link: '/toolkit/typography/link-1'},
        {label: 'Link 2', link: '/toolkit/typography/link-2'},
        {label: 'Link 3', link: '/toolkit/typography/link-3'},
        {label: 'Link 4', link: '/toolkit/typography/link-4'},
    ]
};
