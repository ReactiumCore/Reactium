
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import ToolbarIcons from './ToolbarIcons';

/**
 * -----------------------------------------------------------------------------
 * React Component: Toolbar
 * -----------------------------------------------------------------------------
 */

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    render() {
        let { buttons } = this.state;

        return (
            <nav className={'re-toolkit-toolbar'}>
                <ToolbarIcons />
                {
                    buttons.map((item, i) => {
                        let { icon, name, label } = item;
                        return (
                            <button type={'button'} key={`re-toolkit-toolbar-${i}`}>
                                <svg>
                        			<use xlinkHref={icon}></use>
                        		</svg>
                                <div>{label}</div>
                            </button>
                        );
                    })
                }
            </nav>
        );
    }
}

Toolbar.defaultProps = {
    buttons: [
        {icon:'#re-icon-dna', name: 'filter-all', label: 'All Elements'},
        {icon: '#re-icon-atom', name: 'filter-atom', label: 'Atoms'},
        {icon: '#re-icon-molecule', name: 'filter-molecule', label: 'Molecules'},
        {icon: '#re-icon-organism', name: 'filter-organism', label: 'Organisms'},
        {icon: '#re-icon-template', name: 'filter-template', label: 'Template'},
    ]
};
