/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Search from '../Search';
import _ from 'underscore';
import op from 'object-path';
import MenuItems from './MenuItems';
import MenuFilters from './MenuFilters';

/**
 * -----------------------------------------------------------------------------
 * React Component: Menu
 * -----------------------------------------------------------------------------
 */
export default class Menu extends Component {
    static defaultProps = {
        onFilterClick: null,
        onItemClick: null,
        onMenuItemToggle: null,
        search: null,
        prefs: {},
        group: null,
        filters: [],
        data: {},
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.search = null;
        this.filterTest = this.filterTest.bind(this);
        this.searchTest = this.searchTest.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchClear = this.onSearchClear.bind(this);
    }

    componentDidUpdate() {
        let link = document.querySelector(
            '.re-toolkit-menu-middle .link.active',
        );

        if (link) {
            link.scrollIntoView({ behavior: 'instant' });
        } else {
            let heading = document.querySelector(
                '.re-toolkit-menu-middle .heading.active',
            );
            if (heading) {
                heading.scrollIntoView({ behavior: 'instant' });
            }
        }
    }

    onSearch(e) {
        const { target } = e;
        const { data } = this.props;

        let search = target.value;
        search = _.compact(search.split(' ')).join(' ');
        search = search.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '');
        search = search.length < 1 ? null : search;

        this.search = search;
        this.setState({ search });
    }

    onSearchClear(e) {
        this.search = null;
        this.setState({ search: null });
    }

    searchTest(str) {
        const { search } = this;

        if (!search || search === null) {
            return true;
        }

        str = _.compact(str.split(' '))
            .join(' ')
            .replace(/\s+/g, ' ')
            .replace(/^\s+|\s+$/, '')
            .toLowerCase();

        return new RegExp(search, 'i').test(str);
    }

    filterTest(type) {
        const { filters = [] } = this.props;
        return filters.length < 1
            ? true
            : _.pluck(filters, 'type').includes(type);
    }

    render() {
        const { search } = this.state;
        this.search = search;

        return (
            <div className={'re-toolkit-menu'}>
                <div className={'re-toolkit-menu-top'}>
                    <Search
                        text={search}
                        onChange={this.onSearch}
                        onSearchClear={this.onSearchClear}
                    />
                </div>
                <div className={'re-toolkit-menu-middle'}>
                    <ul>
                        <MenuFilters {...this.props} />
                        <MenuItems
                            {...this.props}
                            search={search}
                            searchTest={this.searchTest}
                            filterTest={this.filterTest}
                        />
                    </ul>
                </div>
                <div className={'re-toolkit-menu-bottom'} />
            </div>
        );
    }
}
