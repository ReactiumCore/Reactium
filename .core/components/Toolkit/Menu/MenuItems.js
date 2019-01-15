import op from 'object-path';
import _ from 'underscore';
import MenuLink from './MenuLink';
import React, { Fragment } from 'react';

const MenuItems = ({
    onItemClick,
    onMenuItemToggle,
    prefs,
    group,
    data = {},
    filters = [],
    filterTest,
    search,
    searchTest,
}) => {
    const collapseAll = op.get(prefs, 'menu.all', false);

    return Object.keys(data)
        .filter(key => {
            const { elements = {}, hidden = false, hideEmpty, label } = data[
                key
            ];

            if (!hideEmpty) {
                return true;
            }

            if (Object.keys(elements).length < 1) {
                return false;
            }

            return !hidden;
        })
        .map((key, k) => {
            let {
                label,
                route,
                redirect = false,
                elements = {},
                target = null,
            } = data[key];

            // Test the label against the search value
            const isMatch = searchTest(label);
            if (isMatch !== true && Object.keys(elements).length < 1) {
                return false;
            }

            // Do a search on the label and sub children.
            // If the search is true add it to the childSearch array to be drawn in the menu later.
            const childSearch = [];

            if (Object.keys(elements).length > 0) {
                Object.keys(elements).forEach((elm, i) => {
                    let item = elements[elm];
                    let { label, type } = item;

                    if (
                        searchTest(label) === true &&
                        filterTest(type) === true
                    ) {
                        childSearch.push(elm);
                    }
                });
            }

            // No childrenSearch and no search match
            if (isMatch !== true && childSearch.length < 1) {
                return;
            }

            // No childSearch and filters
            if (childSearch.length < 1 && filters.length > 0) {
                return;
            }

            let cls =
                op.get(prefs, `menu.${key}`, collapseAll) === true
                    ? 'collapsed'
                    : 'expanded';
            cls = group === key ? 'expanded' : cls;
            cls = search || filters.length > 0 ? 'expanded' : cls;

            return (
                <li
                    key={`group-${key}`}
                    id={`menu-group-${key}`}
                    className={cls}>
                    <MenuLink {...data[key]} className='heading' />

                    {childSearch.length > 0 && (
                        <Fragment>
                            {group !== key && (
                                <button
                                    type={'button'}
                                    className={'heading-toggle'}
                                    data-target={key}
                                    onClick={onMenuItemToggle}
                                />
                            )}

                            <ul id={`menu-group-${key}-items`}>
                                {childSearch
                                    .filter(elm =>
                                        Boolean(
                                            searchTest(elements[elm].label) !==
                                                true ||
                                                elements[elm].hidden === true
                                                ? false
                                                : true,
                                        ),
                                    )
                                    .map((elm, i) => (
                                        <li key={`menu-item-${i}`}>
                                            <MenuLink
                                                {...elements[elm]}
                                                className='link'
                                            />
                                        </li>
                                    ))}
                            </ul>
                        </Fragment>
                    )}
                </li>
            );
        });
};

export default MenuItems;
