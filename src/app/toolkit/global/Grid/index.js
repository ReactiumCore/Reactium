/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Grid
 * -----------------------------------------------------------------------------
 */

export default class Grid extends Component {
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

    gridRows() {
        let output = [];

        for (let i = 1; i <= 12; i++) {
            let l = i;
            let r = 12 - i;

            let colLeft = (
                <div className={`col-xs-12 col-sm-${l}`}>
                    <div className={'re-box-row'}>
                        <span className={'hide-xs-only'}>col-sm-{l}</span>
                        <span className={'hide-sm'}>col-xs-12</span>
                    </div>
                </div>
            );

            let colRight =
                r !== 0 ? (
                    <div className={`col-xs-12 col-sm-${r}`}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm-{r}</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                ) : null;

            let row = (
                <div className="row" key={`row-${i}`}>
                    {colLeft}
                    {colRight}
                </div>
            );

            output.push(row);
        }

        return output;
    }

    gridOffsets() {
        let output = [];

        for (let i = 1; i < 12; i++) {
            let l = i;
            let r = 12 - i;

            let row = (
                <div className="row" key={`row-${i}`}>
                    <div className={`col-xs-12 col-sm-${r} col-sm-offset-${l}`}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>
                                col-sm-offset-{l}
                            </span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                </div>
            );

            output.push(row);
        }

        return output;
    }

    gridAutoWidth() {
        return (
            <Fragment>
                <div className={'row'}>
                    <div className={'col-xs-12 col-sm'}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                    <div className={'col-xs-12 col-sm'}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-xs-12 col-sm'}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                    <div className={'col-xs-12 col-sm'}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                    <div className={'col-xs-12 col-sm'}>
                        <div className={'re-box-row'}>
                            <span className={'hide-xs-only'}>col-sm</span>
                            <span className={'hide-sm'}>col-xs-12</span>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    gridAlign() {
        let haligns = ['start', 'center', 'end'];
        let valigns = ['top', 'middle', 'bottom'];

        let output = [<h5 key={'h-align'}>Horizontal</h5>];

        let h = haligns.map((align, i) => {
            let opp = align === 'start' ? 'end' : 'center';
            opp = align === 'end' ? 'start' : opp;

            return (
                <div
                    className={`row ${opp}-xs ${align}-sm`}
                    key={`grid-align-h-${i}`}
                >
                    <div className="col-xs-4">
                        <div className="re-box-row">
                            <span className={'hide-xs-only'}>{align}-sm</span>
                            <span className={'hide-sm'}>{opp}-xs</span>
                        </div>
                    </div>
                </div>
            );
        });

        let v = valigns.map((align, i) => {
            let opp = align === 'top' ? 'bottom' : 'middle';
            opp = align === 'bottom' ? 'top' : opp;

            return (
                <div
                    className={`row ${opp}-xs ${align}-sm`}
                    key={`grid-align-v-${i}`}
                >
                    <div className="col-xs-3">
                        <div className="re-box-row" style={{ height: 100 }} />
                    </div>
                    <div className="col-xs-9">
                        <div className="re-box-row">
                            <span className={'hide-xs-only'}>{align}-sm</span>
                            <span className={'hide-sm'}>{opp}-xs</span>
                        </div>
                    </div>
                </div>
            );
        });

        output = output.concat(h, [<h5 key="v-align">Vertical</h5>], v);

        return output;
    }

    gridDist() {
        return (
            <Fragment>
                <div className={'mb-20'}>
                    <h5>Space Between</h5>
                    <div className={'mb-10'}>
                        <small>
                            <kbd>.between-xs</kbd>
                        </small>
                    </div>
                    <div className="row between-xs">
                        <div className="col-xs-2">
                            <div className="re-box-row" />
                        </div>
                        <div className="col-xs-2">
                            <div className="re-box-row" />
                        </div>
                        <div className="col-xs-2">
                            <div className="re-box-row" />
                        </div>
                    </div>
                </div>

                <h5>Space Around</h5>
                <div className={'mb-10'}>
                    <small>
                        <kbd>.around-xs</kbd>
                    </small>
                </div>
                <div className="row around-xs">
                    <div className="col-xs-2">
                        <div className="re-box-row" />
                    </div>
                    <div className="col-xs-2">
                        <div className="re-box-row" />
                    </div>
                    <div className="col-xs-2">
                        <div className="re-box-row" />
                    </div>
                </div>
            </Fragment>
        );
    }

    gridOrder() {
        return (
            <Fragment>
                <div className={'mb-20'}>
                    <h5>First</h5>
                    <div className={'mb-10'}>
                        <small>
                            <kbd>.first-sm</kbd>
                        </small>
                    </div>
                    <div className="row">
                        <div className="col-xs-4">
                            <div className="re-box-row text-center">1</div>
                        </div>
                        <div className="col-xs-4">
                            <div className="re-box-row text-center">2</div>
                        </div>
                        <div className="col-xs-4 first-sm text-center bg-grey">
                            <div className="re-box-row">3</div>
                        </div>
                    </div>
                </div>

                <h5>Last</h5>
                <div className={'mb-10'}>
                    <small>
                        <kbd>.last-sm</kbd>
                    </small>
                </div>
                <div className="row">
                    <div className="col-xs-4 last-sm bg-grey">
                        <div className="re-box-row text-center">1</div>
                    </div>
                    <div className="col-xs-4">
                        <div className="re-box-row text-center">2</div>
                    </div>
                    <div className="col-xs-4 text-center">
                        <div className="re-box-row">3</div>
                    </div>
                </div>
            </Fragment>
        );
    }

    gridReverse() {
        return (
            <Fragment>
                <div className={'mb-10'}>
                    <small>
                        <kbd>.reverse-sm</kbd>
                    </small>
                </div>
                <div className="row reverse-sm">
                    <div className="col-xs-3">
                        <div className="re-box-row text-center">1</div>
                    </div>
                    <div className="col-xs-3">
                        <div className="re-box-row text-center">2</div>
                    </div>
                    <div className="col-xs-3">
                        <div className="re-box-row text-center">3</div>
                    </div>
                    <div className="col-xs-3">
                        <div className="re-box-row text-center">4</div>
                    </div>
                </div>
            </Fragment>
        );
    }

    gridVis() {
        return (
            <Fragment>
                <div className={'row'}>
                    <div className={'col-xs'}>
                        <div className={'hide-xs-only re-box-row'}>
                            .hide-xs-only
                        </div>
                        <div className={'hide-sm re-box-row'}>.hide-sm</div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-xs'}>
                        <div
                            className={'show-xs-only re-box-row'}
                            style={{ display: 'none' }}
                        >
                            .show-xs-only
                        </div>
                        <div
                            className={'show-sm re-box-row'}
                            style={{ display: 'none' }}
                        >
                            .show-sm
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    render() {
        return (
            <div className="re-demo">
                <section>
                    <p>
                        Responsive modifiers enable specifying different column
                        sizes, offsets and alignment at{' '}
                        <kbd>xs|sm|md|lg|xl</kbd> viewport widths.
                    </p>
                    {this.gridRows().map(item => item)}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Offsets</h4>
                    </div>
                    <p>Adjust the leading of a column in a row.</p>
                    {this.gridOffsets().map(item => item)}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Auto Width</h4>
                    </div>
                    <p>Automatically size the contents of a row.</p>
                    {this.gridAutoWidth()}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Alignment</h4>
                    </div>
                    <p>Horizontally or vertically align a column.</p>
                    {this.gridAlign().map(item => item)}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Distribution</h4>
                    </div>
                    <p>
                        Classes for distributing the contents of a row or
                        column.
                    </p>
                    {this.gridDist()}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Reordering</h4>
                    </div>
                    <p>Classes to reorder columns.</p>
                    {this.gridOrder()}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Reversing</h4>
                    </div>
                    <p>Reverse the order of the columns.</p>
                    {this.gridReverse()}
                </section>

                <section>
                    <div className={'my-20'}>
                        <h4>Visibility</h4>
                    </div>
                    <p>Responsive hide or show content.</p>
                    {this.gridVis()}
                </section>
            </div>
        );
    }
}
