/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { PrimaryButton } from '../Button';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Hero
 * -----------------------------------------------------------------------------
 */
const Hero = ({ content, cta, icon }) => (
    <section className='hero'>
        {icon && <img src={icon} className='icon' />}
        {content && (
            <h1>
                {content.map((item, i) => (
                    <div className='text-xs-center' key={`hero-content-${i}`}>
                        {item}
                    </div>
                ))}
            </h1>
        )}

        {cta && <PrimaryButton {...cta} />}
    </section>
);

export default Hero;
