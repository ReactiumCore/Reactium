
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import layout from './layout';

/**
 * -----------------------------------------------------------------------------
 * React Component: HomeLayout
 * -----------------------------------------------------------------------------
 */

class HomeLayout extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('onMount')) {
            this.state.onMount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return (
            <Fragment>
                {layout.regions.map(region => (
                    <section key={region.name} className={`region-${region.name}`}>
                        {region.name}
                    </section>
                ))}
            </Fragment>
        );
    }
}

export default HomeLayout;
