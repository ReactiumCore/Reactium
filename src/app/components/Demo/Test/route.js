import Test from "./index";
import deps from "dependencies";

export default {
    // Route pattern
    path: ["/demo/redux"],

    // Route should be exact
    exact: true,

    // the component to load for this route
    component: Test,

    // load callback should return thunk that uses route params.
    load: params => deps.actions.Test.mount(params)
};
