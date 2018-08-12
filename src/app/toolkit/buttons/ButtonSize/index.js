/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: ButtonSizing
 * -----------------------------------------------------------------------------
 */

class ButtonSizing extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = { ...this.props };
    }

    renderRows() {
        let sizes = ['lg', 'md', 'sm', 'xs'];

        return sizes.map((sz, i) => {
            return (
                <div className={'row'} key={`row-${i}`}>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}`}>
                                Primary
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-{sz}-primary</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}-pill`}>
                                Primary Pill
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-pill</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button className={`btn-primary-${sz}-outline`}>
                                Outline
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-outline</kbd>
                        </small>
                    </div>
                    <div className={'col-xs-12 col-sm text-center my-10'}>
                        <div className={'mb-xs-8 mb-sm-10'}>
                            <button
                                className={`btn-primary-${sz}-outline-pill`}
                            >
                                Outline Pill
                            </button>
                        </div>
                        <small>
                            <kbd>.btn-primary-{sz}-outline-pill</kbd>
                        </small>
                    </div>
                </div>
            );
        });
    }

    onStyleChange(e) {
        let style = e.currentTarget.value;
        this.setState({ style });
    }

    onTypeChange(e) {
        let type = e.currentTarget.value;
        this.setState({ type });
    }

    render() {
        let { sizes, style, styles, type, types } = this.state;

        return (
            <Fragment>
                <div className={'flex end'}>
                    <span className={'form-group mr-10'}>
                        <select
                            value={type}
                            onChange={this.onTypeChange.bind(this)}
                        >
                            {Object.keys(types).map((k, i) => {
                                return (
                                    <option key={`type-${i}`} value={k}>
                                        {types[k]}
                                    </option>
                                );
                            })}
                        </select>
                    </span>

                    <div className={'form-group'}>
                        <select
                            value={style}
                            onChange={this.onStyleChange.bind(this)}
                        >
                            {Object.keys(styles).map((k, i) => {
                                return (
                                    <option key={`style-${i}`} value={k}>
                                        {styles[k]}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className={'pt-xs-20'}>
                    <div className={'row'}>
                        {Object.keys(sizes)
                            .reverse()
                            .map((k, i) => {
                                let name = sizes[k];
                                let cls =
                                    k !== 'default'
                                        ? `btn-${type}-${k}`
                                        : `btn-${type}`;
                                cls += style !== 'default' ? `-${style}` : '';
                                return (
                                    <div
                                        key={`size-${i}`}
                                        className={'col-xs-12'}
                                    >
                                        <div className={'text-center my-10'}>
                                            <button
                                                type={'button'}
                                                className={cls}
                                            >
                                                {name}
                                            </button>
                                        </div>
                                        <div
                                            className={
                                                'small text-center my-10'
                                            }
                                        >
                                            <kbd>.{cls}</kbd>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </Fragment>
        );
    }
}

ButtonSizing.defaultProps = {
    size: 'default',
    sizes: {
        xs: 'XS',
        sm: 'Small',
        default: 'Default',
        md: 'Medium',
        lg: 'Large'
    },
    style: 'default',
    styles: {
        default: 'Default',
        pill: 'Pill',
        outline: 'Outline',
        'outline-pill': 'Outline Pill'
    },
    type: 'primary',
    types: {
        primary: 'Primary',
        secondary: 'Secondary',
        tertiary: 'Tertiary'
    }
};

export default ButtonSizing;
