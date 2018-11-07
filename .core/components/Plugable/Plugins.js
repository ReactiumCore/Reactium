/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Context from './Context';
import { matchPath } from 'react-router';
import op from 'object-path';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * React Component: Plugins
 * -----------------------------------------------------------------------------
 */

export default class Plugins extends Component {
    render() {
        const {
            zone,
            children,
            filter: localFilter,
            ...otherProps
        } = this.props;

        return (
            <Context.Consumer>
                {({ plugins, filter }) => {
                    let pluginFilter = _ => true;
                    if (typeof filter === 'function') {
                        pluginFilter = filter;
                    }
                    if (typeof localFilter === 'function') {
                        pluginFilter = localFilter;
                    }

                    return (
                        <Fragment>
                            {op
                                .get(plugins, zone, [])
                                .filter(pluginFilter)
                                .map(
                                    ({
                                        id,
                                        component: Component,
                                        ...pluginProps
                                    }) => (
                                        <Component
                                            id={id}
                                            key={id}
                                            {...pluginProps}
                                            {...otherProps}
                                        />
                                    )
                                )}
                            {children}
                        </Fragment>
                    );
                }}
            </Context.Consumer>
        );
    }
}

Plugins.defaultProps = {
    zone: '',
};
