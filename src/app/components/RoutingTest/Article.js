import React, { useEffect } from 'react';
import Reactium from 'reactium-core/sdk';
import { Link } from 'react-router-dom';

const Article = props => {
    const {
        active,
        currentRoute,
        previousRoute,
        transitionState,
        transitionStates,
        changes,
    } = props;

    useEffect(() => {
        const to = setTimeout(() => {
            if (transitionState !== 'READY') {
                Reactium.Routing.nextState();
            }
        }, 1000);
        return () => clearTimeout(to);
    }, [transitionState]);

    console.log('Article', { transitionState });

    if (transitionState === 'LOADING') return <div>Loading...</div>;

    return (
        <div>
            <div>(Article) Route Status: {transitionState}</div>
            <Link to={'/product/1'}>Product 1</Link>
        </div>
    );
};

export default Article;
