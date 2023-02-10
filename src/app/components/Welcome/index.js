import React, { useEffect } from 'react';
import { useHookComponent, useRefs } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Welcome
 * -----------------------------------------------------------------------------
 */
const Welcome = () => {
    const refs = useRefs();

    const Loading = useHookComponent('Loading');

    const onLoad = () => {
        const Loader = refs.get('loading');
        Loader.setVisible(false);
    };

    useEffect(() => {
        const i = refs.get('iframe');
        i.addEventListener('load', onLoad);
        return () => i.removeEventListener('load', onLoad);
    }, []);

    useEffect(() => {
        document.title = 'Reactium';
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Loading ref={elm => refs.set('loading', elm)} />
            <iframe
                width='100%'
                height='100%'
                src='https://reactium.io/'
                ref={elm => refs.set('iframe', elm)}
            />
        </div>
    );
};

export { Welcome };
