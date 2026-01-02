import React from 'react';
import './Loader.css';

type LoaderSize = 'sm' | 'md' | 'lg';

type LoaderProps = {
    size?: LoaderSize;
    className?: string;
};

const sizeClassMap: Record<LoaderSize, string> = {
    sm: 'app-loader--sm',
    md: 'app-loader--md',
    lg: 'app-loader--lg',
};

const Loader: React.FC<LoaderProps> = ({ size = 'md', className }) => {
    const sizeClass = sizeClassMap[size];
    const mergedClassName = ['app-loader', sizeClass, className].filter(Boolean).join(' ');

    return (
        <div className={mergedClassName} role="status" aria-live="polite">
            <svg className="loader__spinner" viewBox="0 0 50 50" aria-hidden="true">
                <circle className="loader__track" cx="25" cy="25" r="20" fill="none" />
                <circle className="loader__indicator" cx="25" cy="25" r="20" fill="none" />
            </svg>
        </div>
    );
};

export default Loader;
