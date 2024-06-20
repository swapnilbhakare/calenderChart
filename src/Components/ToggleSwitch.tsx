import React from 'react';

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
    return (
        <div className="toggle-container">
            <label className="toggle-label">{label}</label>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default ToggleSwitch;
