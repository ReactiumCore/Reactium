import React from 'react';

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
                        <svg>
                            <use xlinkHref={'#re-icon-close'} />
                        </svg>
                        {label}
                    </button>
                );
            })}
        </li>
    );

export default MenuFilters;
