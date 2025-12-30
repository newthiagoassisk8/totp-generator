import React from 'react';
import './TOTPGenerator.css';
import TOTPCreateForm from './TOTPCreateForm';

const TOTPCreate: React.FC = () => {
    return (
        <div className="totp-generator">
            <div className="generator-container">
                <TOTPCreateForm />
            </div>
        </div>
    );
};

export default TOTPCreate;
