import React, { useEffect } from 'react';
import Reactium, { __, Zone } from 'reactium-core/sdk';

const DefaultComponent = () => {
    const comps = Reactium.Zone.getZoneComponents('not-found');

    if (comps.length < 1) {
        Reactium.Zone.addComponent({
            zone: 'not-found',
            id: 'NOT_FOUND_DEFAULT',
            component: () => __('PAGE NOT FOUND'),
            order: Reactium.Enums.priority.highest,
        });

        return () => {
            Reactium.Zone.removeComponent('NOT_FOUND_DEFAULT');
        };
    }
};

export default () => {
    useEffect(DefaultComponent, []);
    return <Zone zone='not-found' />;
};
