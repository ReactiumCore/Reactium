import { connect } from 'react-redux';
import React from 'react';
import ClientRouter from './browser';
import actions from './Routes/actions';
import getRoutes from './getRoutes';
import op from 'object-path';

const mapStateToProps = state => ({
    Routes: op.get(state, 'Routes', { routes: getRoutes() }),
});

const mapDispatchToProps = dispatch => ({
    init: routes => dispatch(actions.init(routes)),
});

class Router extends React.Component {
    render() {
        const {
            server = false,
            location,
            context,
            init,
            Routes = {},
        } = this.props;
        const { routes = [], updated } = Routes;

        return (
            <ClientRouter
                updated={updated}
                routes={routes.length ? routes : this.initRoutes}
            />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Router);
