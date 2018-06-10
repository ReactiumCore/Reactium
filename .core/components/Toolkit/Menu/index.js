
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
        let { data = {}, onItemClick } = this.state;

        let items = [];

        return (
            <Fragment>
                <div className={'re-toolkit-menu'}>
                    <div className={'re-toolkit-menu-top'}>
                        <Search />
                    </div>
                    <div className={'re-toolkit-menu-middle'}>
                        <ul>
                            {Object.keys(data).map((key, k) => {

                                let { label, route, redirect = false, elements = {}, target = null } = data[key];

                                return (
                                    <li key={`group-${key}`}>
                                        {(redirect === true)
                                            ? (
                                                <a className={'heading'} href={route} target={target}>{label}</a>
                                            )
                                            : (
                                                <NavLink className={'heading'} exact={false} to={route} onClick={onItemClick}>
                                                    {label}
                                                </NavLink>
                                            )
                                        }
                                        {(Object.keys(elements).length < 1) ? null : (
                                            <ul>
                                                {Object.keys(elements).map((elm, i) => {
                                                    let item = elements[elm];
                                                    let { label, route, redirect = false, target = null } = item;
                                                    return (
                                                        <li key={`re-toolkit-menu-item-${i}`}>
                                                            {(redirect === true)
                                                                ? (
                                                                    <a className={'link'} href={route} target={target}>{label}</a>
                                                                )
                                                                : (
                                                                    <NavLink className={'link'} exact={true} to={route} onClick={onItemClick}>{label}</NavLink>
                                                                )
                                                            }
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={'re-toolkit-menu-bottom'}>
                    </div>
                </div>
            </Fragment>
        );
    }
}
