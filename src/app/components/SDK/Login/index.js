import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import PropTypes from 'prop-types';
import Reactium from 'reactium-core/sdk';

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

const noop = () => {};

const ENUMS = {
    DEBUG: true,
    EVENT: {
        CHANGE: 'change',
        INIT: 'init',
    },
};

/**
 * -----------------------------------------------------------------------------
 * Hook Component: Login
 * -----------------------------------------------------------------------------
 */
let Login = (props, ref) => {
    const now = Date.now();

    // Refs
    const containerRef = useRef();
    const stateRef = useRef({
        ...props,
        form: {},
    });

    // State
    const [state, setNewState] = useState(stateRef.current);

    // Internal Interface
    const setState = (newState, caller) => {
        // Update the stateRef
        stateRef.current = {
            ...stateRef.current,
            ...newState,
        };

        if (ENUMS.DEBUG && caller) {
            console.log('setState()', caller, {
                state: stateRef.current,
            });
        }

        // Trigger useEffect()
        setNewState(stateRef.current);
    };

    // External Interface
    useImperativeHandle(ref, () => ({
        ref,
        setState,
        state,
    }));

    // Side Effects
    useEffect(
        () => setState(props, 'User -> useEffect()'),
        Object.values(props),
    );

    useEffect(() => {
        console.log(Reactium.User.current());
    });

    const submit = async e => {
        e.preventDefault();

        const { form } = stateRef.current;
        const { username, password } = form;
        const u = await Reactium.User.auth(username, password);
    };

    const onChange = e => {
        const elm = op.get(e, 'target');
        const { form } = stateRef.current;
        const { name, value } = elm;

        form[name] = value;

        setState({ form });
    };

    const find = e => {
        const dataSet = e.target.dataset;
        const { username } = dataSet;
        Reactium.User.find({ username }).then(console.log);
    };

    const isRole = async e => {
        const dataSet = e.target.dataset;
        const { role, user } = dataSet;
        const valid = await Reactium.User.isRole(role, user);
        console.log(valid);
    };

    const can = async e => {
        const dataSet = e.target.dataset;
        const { caps, user } = dataSet;
        const valid = await Reactium.User.can(caps, user);
        console.log(valid);
    };

    const addRole = async e => {
        const dataSet = e.target.dataset;
        const { role, user } = dataSet;

        Reactium.User.Role.add(role, user).then(console.log);
    };

    const removeRole = async e => {
        const dataSet = e.target.dataset;
        const { role, user } = dataSet;

        Reactium.User.Role.remove(role, user).then(console.log);
    };

    // Renderers
    const render = () => {
        const { form } = stateRef.current;

        return !Reactium.User.current() ? (
            <form onSubmit={submit}>
                <input
                    type='text'
                    name='username'
                    onChange={onChange}
                    placeholder='Username'
                    value={op.get(form, 'username', '')}
                />
                <input
                    type='password'
                    name='password'
                    onChange={onChange}
                    placeholder='Password'
                    value={op.get(form, 'password', '')}
                />
                <button type='submit'>Sign In</button>
            </form>
        ) : (
            <>
                <h1>Hello {Reactium.User.current().username}</h1>
                <button type='button' onClick={find} data-username='cam'>
                    Find Cam
                </button>
                <button
                    type='button'
                    onClick={isRole}
                    data-role='banned'
                    data-user='IFpJunhE0I'>
                    Is Allie Banned?
                </button>
                <button
                    type='button'
                    onClick={can}
                    data-caps='Blueprint.creates'
                    data-user='HrIE319DdZ'>
                    Can Cam Make Blueprints?
                </button>
                <button
                    type='button'
                    onClick={addRole}
                    data-role='moderator'
                    data-user='zI3KfBsmXF'>
                    Add Lisa to Moderators
                </button>
                <button
                    type='button'
                    onClick={removeRole}
                    data-role='moderator'
                    data-user='zI3KfBsmXF'>
                    Remove Lisa from Moderators
                </button>
            </>
        );
    };

    return render();
};

Login = forwardRef(Login);

Login.propTypes = {
    namespace: PropTypes.string,
};

Login.defaultProps = {
    namespace: 'Login',
};

export { Login as default };
