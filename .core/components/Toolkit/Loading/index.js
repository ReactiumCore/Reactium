import React from 'react';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Loading
 * -----------------------------------------------------------------------------
 */
const Loading = ({ onComplete }) => {
    setTimeout(onComplete, 725);

    return (
        <div className='re-toolkit-loading'>
            <div className='loader' />
        </div>
    );
};

export default Loading;
