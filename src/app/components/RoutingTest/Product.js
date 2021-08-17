import React, { useEffect } from 'react';
import Reactium from 'reactium-core/sdk';
import { Link } from 'react-router-dom';

const Product = props => {
    const {
        active,
        currentRoute,
        previousRoute,
        transitionState,
        transitionStates,
        changes,
    } = props;

    useEffect(() => {
        // Change Transition State on this component if not READY
        // every 1 second
        const to = setTimeout(() => {
            if (transitionState !== 'READY') {
                Reactium.Routing.nextState();
            }
        }, 1000);
        return () => clearTimeout(to);
    }, [transitionState]);

    console.log('Product', { transitionState });

    if (transitionState === 'LOADING') return <div>Loading...</div>;

    return (
        <div>
            <div>(Product) Route Status: {transitionState}</div>
            <Link to={'/article/1'}>Article 1</Link>
        </div>
    );
};

export default Product;
