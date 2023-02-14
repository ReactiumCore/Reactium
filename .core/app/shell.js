export const Shell = async LoadingComponent => {
    const { default: React, useRef } = await import('react');
    const { default: _ } = await import('underscore');
    const { createRoot } = await import('react-dom/client');

    let Loading;
    if (LoadingComponent) Loading = LoadingComponent;
    else {
        const mod = await import('../components/Loading');
        Loading = mod.Loading;
    }

    const Shell = () => {
        window.LoadingRef = useRef();
        return <Loading ref={window.LoadingRef} />;
    };

    const something = createRoot(
        document.body.appendChild(document.createElement('div')),
    ).render(<Shell />);

    const { App } = await import('./index');
    await App();

    _.defer(
        () =>
            window.LoadingRef.current &&
            _.isFunction(window.LoadingRef.current.setVisible) &&
            window.LoadingRef.current.setVisible(false),
    );
};
