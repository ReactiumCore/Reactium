export const Shell = async () => {
    const { default: React, useRef } = await import('react');
    const { default: _ } = await import('underscore');
    const { createRoot } = await import('react-dom/client');
    const { Loading } = await import('../components/Loading');

    const Shell = () => {
        window.LoadingRef = useRef();
        return <Loading ref={window.LoadingRef} />;
    };

    const something = createRoot(
        document.body.appendChild(document.createElement('div')),
    ).render(<Shell />);

    const { App } = await import('./index');
    await App();

    _.defer(() => window.LoadingRef.current.setVisible(false));
};
