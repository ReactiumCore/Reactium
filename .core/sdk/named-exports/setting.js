import { useRef, useState, useEffect } from 'react';
import Setting from '../setting';
import { useCapabilityCheck } from './capability';

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

    const [getter, updateGetter] = useState(1);
    const refresh = () => {
        updateGetter(getter + 1);
    };

    const updateSettingRef = settingGroup => {
        settingRef.current = settingGroup;
        refresh();
    };

    const setSettingGroup = async (settingGroup, setPublic = false) => {
        if (canSet) {
            updateSettingRef(settingGroup);
            return Setting.set(group, settingGroup, setPublic);
        } else {
            throw new Error(
                'Unable to update setting %s. Not permitted.',
            ).replace('%s', group);
        }
    };

    useEffect(() => {
        const getSettingGroup = async () => {
            if (group && canGet) {
                const settingGroup = await Setting.get(group);
                updateSettingRef(settingGroup);
            }
        };

        getSettingGroup();
    }, [canGet, canSet, group]);

    return {
        canGet,
        canSet,
        settingGroup: settingRef.current,
        setSettingGroup,
    };
};
