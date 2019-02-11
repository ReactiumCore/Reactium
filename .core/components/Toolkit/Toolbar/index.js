/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import defaultState from '../state';
import Icon from 'reactium-core/components/Toolkit/Icon';

/**
 * -----------------------------------------------------------------------------
 * React Component: Toolbar
 * -----------------------------------------------------------------------------
 */
const noop = () => {};

export default class Toolbar extends Component {
    static defaultProps = {
        onToolbarItemClick: noop,
        buttons: defaultState.buttons.toolbar,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(e) {
        const { onToolbarItemClick = noop } = this.props;
        e['type'] = e.currentTarget.id;
        onToolbarItemClick(e, this);
    }

    render() {
        const { buttons } = this.props;

        return (
            <nav className='re-toolkit-toolbar'>
                <div>
                    {buttons.map(
                        ({ icon: ico, name, label = null, cls = null }, i) => {
                            const Ico = Icon[ico];
                            return name === 'spacer' ? (
                                <div
                                    className='spacer'
                                    key={`re-toolkit-toolbar-${i}`}
                                />
                            ) : (
                                <button
                                    onClick={this.onButtonClick}
                                    type='button'
                                    key={`re-toolkit-toolbar-${i}`}
                                    id={`toolbar-${name}`}
                                    className={cls}>
                                    {ico && Ico && <Ico />}
                                    {label ? <div>{label}</div> : ''}
                                </button>
                            );
                        },
                    )}
                </div>
            </nav>
        );
    }
}
