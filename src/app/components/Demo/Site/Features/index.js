/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";

/**
 * -----------------------------------------------------------------------------
 * React Component: Features
 * -----------------------------------------------------------------------------
 */

export default class Features extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        let count = 0;
        let { items = [], layout = [] } = this.state;

        return items.length < 1 ? null : (
            <section className={"feature"}>
                {items.map((item, i) => {
                    let { title, caption, backgroundImage } = item;

                    count += 2;

                    let orderLeft = count % 4 === 0 ? count : count - 1;
                    let orderRight = count % 4 === 0 ? count - 1 : count;

                    return (
                        <Fragment key={`feature-${i}`}>
                            <div
                                className={`feature-block ${
                                    layout[0]
                                } order-${orderLeft}`}
                            >
                                <div className={`feature-caption`}>
                                    <h2>{title}</h2>
                                    <p>{caption}</p>
                                </div>
                            </div>
                            <div
                                className={`feature-block ${
                                    layout[1]
                                } order-${orderRight}`}
                                style={{ backgroundImage }}
                            />
                        </Fragment>
                    );
                })}
            </section>
        );
    }
}

Features.defaultProps = {
    layout: [],
    items: []
};
