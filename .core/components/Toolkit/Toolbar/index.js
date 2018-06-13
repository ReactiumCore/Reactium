
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Toolbar
 * -----------------------------------------------------------------------------
 */

export default class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state         = { ...this.props };
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onButtonClick(e) {
        let { id } = e.currentTarget;
        let { onToolbarItemClick } = this.state;

        if (typeof onToolbarItemClick === 'function') {
            e['type'] = id;
            onToolbarItemClick(e, this);
        }
    }

    render() {
        let { buttons } = this.state;

        return (
            <nav className={'re-toolkit-toolbar'}>
                <div>
                    {
                        buttons.map((item, i) => {
                            let { icon, name, label = null, cls = null } = item;
                            return (name === 'spacer')
                                ? (
                                    <div className={'spacer'} key={`re-toolkit-toolbar-${i}`}></div>
                                ) : (
                                    <button onClick={this.onButtonClick} type={'button'} key={`re-toolkit-toolbar-${i}`} id={`toolbar-${name}`} className={cls}>
                                        <svg>
                                			<use xlinkHref={icon}></use>
                                		</svg>
                                        {(label) ? (<div>{label}</div>) : ''}
                                    </button>
                                );
                        })
                    }
                </div>
            </nav>
        );
    }
}

Toolbar.defaultProps = {
    onToolbarItemClick: null,
    buttons: [
        {icon:'#re-icon-dna', name: 'filter-all', label: 'All Elements'},
        {icon: '#re-icon-atom', name: 'filter-atom', label: 'Atoms'},
        {icon: '#re-icon-molecule', name: 'filter-molecule', label: 'Molecules'},
        {icon: '#re-icon-organism', name: 'filter-organism', label: 'Organisms'},
        {icon: '#re-icon-catalyst', name: 'filter-catalyst', label: 'Catalysts'},
        {icon: '#re-icon-page', name: 'filter-template', label: 'Pages'},
        {icon: '#re-icon-template', name: 'filter-template', label: 'Templates'},
        {name: 'spacer'},
        {icon: '#re-icon-settings', name: 'toggle-settings', cls: 'toggle'}
    ]
};
