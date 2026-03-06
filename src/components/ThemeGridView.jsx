import React from 'react';

const ThemeGridView = ({ themes, onSelect }) => {
    return (
        <div className="theme-grid-container">
            <div className="theme-grid">
                {themes.map((theme, index) => (
                    <div
                        key={theme.id}
                        className="theme-grid-item"
                        style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                        onClick={() => onSelect(theme)}
                    >
                        <img src={theme.imageSrc} alt={theme.name} />
                        <div className="theme-grid-item-overlay">
                            <h3 className="theme-grid-item-name">{theme.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeGridView;
