import React from 'react';
import './TOTPDisplay.css';
interface TOTPDisplayProps {
    totp: string;
    timeRemaining: number;
    period: number;
    isValid: boolean;
    error: string | undefined;
}

const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ totp, timeRemaining, period, isValid, error }) => {
    const progressPercentage = ((period - timeRemaining) / period) * 100;

    if (error) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <h2>Generated TOTP</h2>
                    <div className="totp-placeholder">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <h2>Generated TOTP</h2>
                    <div className="totp-placeholder">
                        <p>Enter a valid secret key to generate TOTP codes</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="totp-display">
            <div className="display-container">
                <h2>Generated TOTP</h2>

                <div className="totp-code">
                    <span className="code-text">{totp}</span>
                </div>

                <div className="timer-section">
                    <div className="timer-display">
                        <span className="time-remaining">{timeRemaining}s</span>
                        <span className="time-label">remaining</span>
                    </div>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                    </div>
                </div>

                <div className="refresh-info">
                    <p>Code refreshes automatically every {period} seconds</p>
                </div>
            </div>
        </div>
    );
};

export default TOTPDisplay;
