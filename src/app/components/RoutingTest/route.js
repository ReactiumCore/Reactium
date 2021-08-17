import Article from './Article';
import Product from './Product';

// This is the same as the default
const transitionStates = [
    {
        state: 'EXITING',
        active: 'previous',
    },
    {
        state: 'LOADING',
        active: 'current',
    },
    {
        state: 'ENTERING',
        active: 'current',
    },
    {
        state: 'READY',
        active: 'current',
    },
];

// route.js can export an array of routes as well
export default [
    {
        path: '/article/:id',
        component: Article,
        transitions: true,
        transitionStates,
        type: 'articles',
    },
    {
        path: '/product/:id',
        component: Product,
        transitions: true,
        transitionStates,
    },
];
