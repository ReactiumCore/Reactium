/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from "react";
import { PrimaryButton } from "../Button";

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Hero
 * -----------------------------------------------------------------------------
 */
const Hero = props => {
    let { content, cta, icon } = props;

    return (
        <section className={"hero"}>
            {!icon ? null : <img src={icon} className={"icon"} />}

            {!content ? null : (
                <h1>
                    {content.map((item, i) => {
                        return (
                            <div
                                className={"text-xs-center"}
                                key={`hero-content-${i}`}
                            >
                                {item}
                            </div>
                        );
                    })}
                </h1>
            )}

            {!cta ? null : <PrimaryButton {...cta} />}
        </section>
    );
};

export default Hero;
