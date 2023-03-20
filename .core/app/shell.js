const onLoaded = () => {
    if (
        window.LoadingRef &&
        window.LoadingRef.current &&
        typeof window.LoadingRef.current.setVisible == 'function'
    ) {
        window.LoadingRef.current.setVisible(false);
    }
};

export const Shell = async (
    LoadingComponent,
    loadCb = onLoaded,
    delay = 250,
) => {
    const { default: React, useRef } = await import('react');
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

    setTimeout(loadCb, delay);
};
