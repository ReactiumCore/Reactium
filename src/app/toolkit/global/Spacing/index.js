/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Spacing
 * -----------------------------------------------------------------------------
 */

export default class Spacing extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        let properties = ['m:margin', 'p:padding'];
        let sides = [
            't:top',
            'r:right',
            'b:bottom',
            'l:left',
            'x:left and right',
            'y:top and bottom'
        ];
        let breaks = ['xs', 'sm', 'md', 'lg', 'xl'];
        let sizes = [
            0,
            2,
            4,
            6,
            8,
            10,
            12,
            14,
            16,
            18,
            20,
            24,
            32,
            40,
            48,
            56,
            64,
            72,
            80
        ];

        return (
            <div className={'re-demo'}>
                <p>
                    Assign responsive-friendly margin or padding values to an
                    element or a subset of its sides with shorthand classes.
                    Includes support for individual properties, all properties,
                    and vertical and horizontal properties.
                </p>
                <p>Classes are built from the following Sass maps:</p>

                <div className={'row'}>
                    <div className={'col-xs-12 col-sm-3'}>
                        <h5>Property</h5>
                        <p className={'pr-10'}>
                            {properties.map((item, i) => {
                                return (
                                    <span
                                        key={`prop-${i}`}
                                        className={'number'}
                                    >
                                        {item}
                                        <br />
                                    </span>
                                );
                            })}
                        </p>
                    </div>

                    <div className={'col-xs-12 col-sm-3'}>
                        <h5>Side</h5>
                        <p className={'pr-10'}>
                            {sides.map((item, i) => {
                                return (
                                    <span
                                        key={`side-${i}`}
                                        className={'number'}
                                    >
                                        {item}
                                        <br />
                                    </span>
                                );
                            })}
                        </p>
                    </div>

                    <div className={'col-xs-12 col-sm-3'}>
                        <h5>Breakpoint</h5>
                        <p className={'pr-10'}>
                            <span className={'number'}>
                                {breaks.join(', ')}
                            </span>
                        </p>
                    </div>

                    <div className={'col-xs-12 col-sm-3'}>
                        <h5>Size</h5>
                        <p>
                            <span className={'number'}>{sizes.join(', ')}</span>
                        </p>
                    </div>
                </div>

                <h4>Notation</h4>
                <p>
                    The classes are named using the format{' '}
                    <kbd>[property][side]-[breakpoint]-[size]</kbd>
                </p>
                <section className={'pb-20'}>
                    <div className={'row'}>
                        <div className={'col-xs-12 bg-grey-light'}>
                            <div
                                className={
                                    'mt-sm-20 mb-sm-20 px-sm-20 py-sm-20 mt-xs-10 mb-xs-10 px-xs-10 py-xs-10 bg-blue'
                                }
                            >
                                <span className={'hide-xs-only white number'}>
                                    mt-sm-20, mb-sm-20, px-sm-20, py-sm-20
                                </span>
                                <span className={'hide-sm white number'}>
                                    mt-xs-10, mb-xs-10, px-xs-10, py-sm-10
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <p>
                    Removing the <kbd>[breakpoint]</kbd> portion will apply the
                    size to all breakpoints.
                </p>
                <section className={'pb-20'}>
                    <div className={'row'}>
                        <div className={'col-xs-12 bg-grey-light'}>
                            <div className={'m-20 p-20 bg-blue'}>
                                <span className={'white number'}>
                                    m-20, p-20
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <h4>Centering</h4>
                <p>
                    Additionally, you can horizontally center a fixed width
                    element.
                </p>
                <section>
                    <div className={'row'}>
                        <div className={'col-xs-12 bg-grey-light'}>
                            <div className={'py-10'}>
                                <div
                                    className={
                                        'mx-xs-auto bg-blue text-center p-6'
                                    }
                                    style={{ width: 200 }}
                                >
                                    <span className={'white number'}>
                                        mx-xs-auto
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
