import { createContext } from 'react';
import op from 'object-path';

export default createContext(
    undefined,
    ({ plugins: prev }, { plugins: next }) => {
        if (
            Object.keys(prev)
                .sort()
                .join('') !==
            Object.keys(next)
                .sort()
                .join('')
        ) {
            return 1;
        }

        Object.entries(prev).forEach(([zone, prevPlugins]) => {
            const nextPlugins = next[zone];
            if (
                nextPlugins
                    .map(({ id }) => id)
                    .sort()
                    .join('') !==
                prevPlugins
                    .map(({ id }) => id)
                    .sort()
                    .join('')
            ) {
                return 1;
            }
        });

        return 0;
    },
);
