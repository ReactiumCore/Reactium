/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Features
 * -----------------------------------------------------------------------------
 */

const Features = ({ count, layout = [], items = [] }) => {
    return items.length < 1 ? null : (
        <section className={'feature'}>
            {items.map((item, i) => {
                let { title, caption, backgroundImage } = item;

                count += 2;

                let orderLeft = count % 4 === 0 ? count : count - 1;
                let orderRight = count % 4 === 0 ? count - 1 : count;

                return (
                    <Fragment key={`feature-${i}`}>
                        <div
                            className={`feature-block ${layout[0]} order-${orderLeft}`}>
                            <div className={'feature-caption'}>
                                <h2>{title}</h2>
                                <p>{caption}</p>
                            </div>
                        </div>
                        <div
                            className={`feature-block ${layout[1]} order-${orderRight}`}
                            style={{ backgroundImage }}
                        />
                    </Fragment>
                );
            })}
        </section>
    );
};

Features.defaultProps = {
    count: 0,
    layout: [],
    items: [],
};

export default Features;
