import { connect } from 'react-redux';
import React from 'react';
import ClientRouter from './browser';
import actions from './Routes/actions';
import getRoutes from './getRoutes';

const mapStateToProps = ({ Routes = {} }) => {
    if (Object.values(Routes).length) {
        return { Routes };
    }

    return {};
};

const mapDispatchToProps = dispatch => ({
    init: routes => dispatch(actions.init(routes)),
});

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.initRoutes = getRoutes();
        props.init(this.initRoutes);
    }

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
