import { useContext, useState, useEffect, useRef } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import op from 'object-path';
import * as equals from 'shallow-equals';

const noop = () => {};

/**
 * @api {Function} Reactium.ec(Component) Reactium.ec()
 * @apiDescription ec, short for "easy connect" is a stripped down version of the
redux `connect` function, which will provide your component with any Redux state
properties under the name matching your component class (if applicable),
as well as a `getState` function property.
 * @apiName Reactium.ec
 * @apiParam {Component} Component the React component to be decorated with Redux state.
 * @apiGroup Reactium.Utilities
 * @apiExample MyComponent/index.js
import MyComponent from './MyComponent';
import { ec } from 'reactium-core/sdk';

export ec(MyComponent);
 * @apiExample MyComponent/MyComponent.js
import React, { Component } from 'react';

class MyComponent extends Component {
    render() {
        // getState prop provided by ec
        const state = this.props.getState();
        // foo property provided by ec
        const foo = this.props.foo;

        // Given that Redux store has an property MyComponent with property `foo`
        return (
            <div>
                {state.MyComponent.foo}
                {foo}
            </div>
        );
    }
}

MyComponent.defaultProps = {
    getState: () => {},
    foo: null,
};

export default MyComponent;
 */
export const ec = Component => {
    return connect(state => ({
        ...op.get(state, Component.name, {}),
        getState: () => state,
    }))(Component);
};

/**
 * @api {ReactHook} useStore() useStore()
 * @apiDescription Just gimme the store damnit! This React hook provides the Redux
store when used on a component declared within the Store Provider.
 * @apiName useStore
 * @apiGroup ReactHook
 * @apiExample MyComponent.js
import React, { useEffect } from 'react';
import { useStore } from 'reactium-core/sdk';

export default () => {
    const { dispatch, getState, subscribe } = useStore();
    let count = getState();

    useEffect(() => {
        const unsubscribe = subscribe(() => {
            count = getState();
        });

        return unsubscribe;
    });

    return (
        <div>
            <button onClick={() => dispatch({ type: 'BUTTON_CLICK' })}>
                Click {count}
            </button>
        </div>
    );
};
 */
export const useStore = () =>
    op.get(useContext(ReactReduxContext), 'store', {
        getState: () => ({}),
        subscribe: noop,
        dispatch: noop,
    });

/**
 * Default to shallow equals.
 */
const defaultShouldUpdate = ({ prevState, newState }) =>
    !equals(prevState, newState);

/**
 * @api {ReactHook} useSelect(params) useSelect()
 * @apiDescription React hook for subscribing to only the updates from Redux store
that you care about, and no more. This is superior to `react-redux` connect, in
that your component will not update on every dispatch, only those state changes
you have specifically targeted.
 * @apiParam {Mixed} params
 1. Callback function taking current state object from Redux store, and
 returning what you care about, or
 2. an Object with `select` and `shouldUpdate` props.
 * @apiParam {Function} params.select Callback function taking current state object from Redux store, and
 returning what you care about.
 * @apiParam {Function} [params.shouldUpdate] Callback function object with 2 properties `newState` and `prevState`, containing the current
 results of the select function, and the previous results of the select function, respectively. Returns true if your component should update, otherwise
 false. By default, `useSelect` will do a shallow comparison.
 * @apiName useSelect
 * @apiGroup ReactHook
 * @apiExample Simple.js
import React from 'react';
import { useSelect } from 'reactium-core/sdk';

// given a Redux state of { "Simple": {"foo": { "bar": "baz" }}}
export default () => {
    // Simple select callback: will update the component only when state.Simple.foo.bar changes no more.
    const baz = useSelect(state => state.Simple.foo.bar);
    return (
        <div>
            {baz}
        </div>
    );
};
* @apiExample Advanced.js
import React from 'react';
import { useSelect } from 'reactium-core/sdk';

// given a Redux state of {
//    "Advanced": {
//      "foo": { "bar": "baz" },
//      "hello": "world",
//    }
//}
export default () => {
   // Advanced select callback: will update the component only conditions of shouldUpdate are true.
   // All other Redux state changes are ignored.
   const Advanced = useSelect({
     select: state => state.Advanced,

     shouldUpdate: ({newState, prevState}) => {
       // newState and prevState are current and previous outcome of select callback above
       return newState.foo.bar !== prevState.foo.bar || newState.hello !== prevState.hello;
     },
   });

   return (
       <div>
           {Advanced.foo.bar}
           {Advanced.hello}
       </div>
   );
};
 */
export const useSelect = params => {
    let select = newState => newState;
    let shouldUpdate = defaultShouldUpdate;
    if (typeof params === 'function') {
        select = params;
    } else {
        select = op.get(params, 'select', select);
        shouldUpdate = op.get(params, 'shouldUpdate', shouldUpdate);
    }

    const { getState, subscribe } = useStore();
    const stateRef = useRef(select(getState()));
    const [value, setValue] = useState(stateRef.current);

    const setState = () => {
        const newState = select(getState());
        const prevState = stateRef.current;

        if (
            shouldUpdate({
                newState,
                prevState,
            })
        ) {
            stateRef.current = newState;
            setValue(stateRef.current);
        }
    };

    useEffect(() => {
        setState();
        return subscribe(setState);
    });

    return stateRef.current;
};
