import { useRef, useState } from 'react';
import { useCapabilityCheck } from './capability';
import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';

/**
 * @api {ReactHook} useSettingGroup(group) useSettingGroup()
 * @apiVersion 3.2.1
 * @apiDescription Get and set a group of Actinium settings.
 * @apiParam {String} group the setting group id
 * @apiName useSettingGroup
 * @apiGroup ReactHook
 * @apiExample Usage
import React from 'react';
import { useSettingGroup } from 'reactium-core/sdk';
import op from 'object-path';

export default () => {
    const { canGet, canSet, settingGroup, setSettingGroup } = useSettingGroup('MySettings');

    // Set MySetting.foo = 'bar' on click
    return (
        <div>
            {canGet && <span>Foo Setting: {op.get(settingGroup, 'foo')}</span>}

            <button disabled={!canSet} onClick={() => setSettingGroup({
                ...settingGroup,
                foo: 'bar',
            })}>Update Setting</button>
        </div>
    )
}

 * @apiExample Returns
{
    canGet, // Boolean, if current user is allowed to get this setting group
    canSet, // Boolean, if current user is allowed to set this setting group
    settingGroup, // setting group object
    setSettingGroup, // wrapper around Reactium.Setting.set(), will trigger optimistic update and rerender on response
}
 */
export const useSettingGroup = group => {
    const canSet = useCapabilityCheck(
        ['Setting.create', 'Setting.update', `setting.${group}-set`],
        false,
    );
    const canGet = useCapabilityCheck(
        ['Setting.retrieve', `setting.${group}-get`],
        false,
    );

    const settingRef = useRef({});

    const [loading, setLoading] = useState(true);
    const [getter, updateGetter] = useState(1);
    const refresh = () => {
        updateGetter(getter + 1);
    };

    const { default: SDK } = require('reactium-core/sdk');

    const updateSettingRef = settingGroup => {
        settingRef.current = settingGroup;
        refresh();
    };

    const setSettingGroup = async (settingGroup, setPublic = false) => {
        if (canSet) {
            updateSettingRef(settingGroup);
            setLoading(true);
            const settings = await SDK.Setting.set(
                group,
                settingGroup,
                setPublic,
            );
            setLoading(false);
            return settings;
        } else {
            throw new Error(
                'Unable to update setting %s. Not permitted.',
            ).replace('%s', group);
        }
    };

    useAsyncEffect(
        async isMounted => {
            if (group && canGet) {
                const settingGroup = await SDK.Setting.get(group);
                if (isMounted()) {
                    updateSettingRef(settingGroup);
                    setLoading(false);
                }
            }
        },
        [canGet, canSet, group],
    );

    return {
        canGet,
        canSet,
        settingGroup: settingRef.current,
        setSettingGroup,
        loading,
    };
};
