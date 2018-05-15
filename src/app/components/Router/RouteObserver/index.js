import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import RouteObserver from './RouteObserver';
import deps from 'dependencies';

const initialState = {
    Router: {
        pathname: false,
    },
};

const mapStateToProps = ({Router = {
    pathname: false
}}) => ({
    ...initialState,
    Router,
});

const mapDispatchToProps = dispatch => ({
    updateRoute: (location, route, params) => dispatch(deps.actions.Router.updateRoute(location, route, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteObserver));
