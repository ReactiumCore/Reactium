
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Search from '../Search';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * React Component: Menu
 * -----------------------------------------------------------------------------
 */

export default class Menu extends Component {

    constructor(props) {
        super(props);

        this.state      = { ...this.props };
        this.search = null;
        this.searchTest = this.searchTest.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onSearch(e) {
        let { target } = e;
        let { data }   = this.state;

        let search = target.value;
            search = _.compact(search.split(' ')).join(' ');
            search = search.replace(/\s+/g,' ').replace(/^\s+|\s+$/,'');
            search = (search.length < 1) ? null : search;

            this.search = search;

        this.setState({ search });
    }

    onSearchClear(e) {
        this.search = null;
        this.setState({search: null});
    }

    searchTest(str) {
        let { search } = this;

        if (!search || search === null) { return true; }

        str = _.compact(str.split(' ')).join(' ').replace(/\s+/g,' ').replace(/^\s+|\s+$/,'').toLowerCase();

        return (new RegExp(search, 'i')).test(str);
    }

    filterTest(type) {
        let { filters } = this.state;

        if (filters.length < 1) { return true; }

        filters = _.pluck(filters, 'type');

        return Boolean(filters.indexOf(type) > -1);
    }

    renderFilters() {
        let { filters = [], onFilterClick } = this.state;

        return (filters.length > 0)
            ? (
                <li className={'filters'}>
                    {filters.map((item, i) => {
                        let { type, label } = item;
                        return (
                            <button key={`filter-${i}`} className={'filters-remove-btn'} onClick={(e) => { onFilterClick(e, item); }} >
                                <svg><use xlinkHref={'#re-icon-close'}></use></svg>
                                {label}
                            </button>
                        );
                    })}
                </li>
            )
            : null;
    }

    render() {
        let { data = {}, onItemClick, filters = [], search } = this.state;

        if (search) { this.search = search; }

        return (
            <Fragment>
                <div className={'re-toolkit-menu'}>
                    <div className={'re-toolkit-menu-top'}>
                        <Search text={search} onChange={this.onSearch.bind(this)} onSearchClear={this.onSearchClear.bind(this)} />
                    </div>
                    <div className={'re-toolkit-menu-middle'}>
                        <ul>

                            {this.renderFilters()}

                            {Object.keys(data).map((key, k) => {

                                let { label, route, redirect = false, elements = {}, target = null } = data[key];

                                // Test the label against the search value
                                const isMatch = this.searchTest(label);
                                if (isMatch !== true && Object.keys(elements).length < 1) { return; }

                                // Do a search on the label and sub children.
                                // If the search is true add it to the childSearch array to be drawn in the menu later.
                                const childSearch = [];

                                if (Object.keys(elements).length > 0) {
                                    Object.keys(elements).forEach((elm, i) => {
                                        let item = elements[elm];
                                        let { label, type } = item;

                                        if (this.searchTest(label) === true && this.filterTest(type) === true) {
                                            childSearch.push(elm);
                                        }
                                    });
                                }

                                // No childrenSearch and no search match
                                if (isMatch !== true && childSearch.length < 1) { return; }

                                // No childSearch and filters
                                if (childSearch.length < 1 && filters.length > 0) { return; }

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
                                        {(childSearch.length < 1) ? null : (
                                            <ul>
                                                {childSearch.map((elm, i) => {
                                                    let item = elements[elm];
                                                    let { label, route, redirect = false, target = null } = item;

                                                    if (this.searchTest(label) !== true) { return; }

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

Menu.defaultProps = {
    onFilterClick : null,
    onItemClick   : null,
    search        : null,
    filters       : [],
    data          : {},
};
