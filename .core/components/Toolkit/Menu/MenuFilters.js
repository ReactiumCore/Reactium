import React from 'react';
import Icon from 'reactium-core/components/Toolkit/Icon';

const MenuFilters = ({ filters = [], onFilterClick }) =>
    filters.length > 0 && (
        <li className={'filters'}>
            {filters.map((item, i) => {
                let { type, label } = item;
                return (
                    <button
                        key={`filter-${i}`}
                        className={'filters-remove-btn'}
                        onClick={e => {
                            onFilterClick(e, item);
                        }}>
                        <Icon.Close width={12} height={12} />
                        {label}
                    </button>
                );
            })}
        </li>
    );

export default MenuFilters;
