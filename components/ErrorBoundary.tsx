import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#e11d48' }}>Algo correu mal (Something went wrong)</h1>
                    <p>Por favor, recarregue a página.</p>
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f8f8f8', borderRadius: '4px', textAlign: 'left', overflow: 'auto' }}>
                        <code style={{ color: '#991b1b' }}>{this.state.error?.toString()}</code>
                    </div>
                </div>
            );
        }

        // @ts-ignore: TS checking error with React 19 Component typings
        return this.props.children;
    }
}

export default ErrorBoundary;
