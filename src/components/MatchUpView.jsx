import React, { useState } from 'react';

const MatchUpView = ({ image1, image2, onSelect }) => {
    const [selectedId, setSelectedId] = useState(null);

    // Reset selection when new images are passed in (e.g., next matchup)
    React.useEffect(() => {
        setSelectedId(null);
    }, [image1, image2]);

    const handleSelect = (image) => {
        if (selectedId) return; // Prevent double clicks
        setSelectedId(image.id);
        // Call the parent onSelect which already has a timeout, but we can do it immediately 
        // because the parent also manages its own transitioning state.
        onSelect(image);
    };

    return (
        <div className="matchup-container">
            {/* VS Text */}
            <div className="vs-text">VS</div>

            {/* Left Side */}
            <div className={`matchup-side ${selectedId === image1.id ? 'selected' : ''}`} onClick={() => handleSelect(image1)}>
                <img src={image1.imageSrc} alt={image1.name} className="matchup-image" />
                <div className="matchup-content">
                    <h2 className="matchup-title">{image1.name}</h2>
                </div>
                {selectedId === image1.id && (
                    <div className="checkmark-overlay">
                        <svg className="checkmark" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" fill="none" cx="26" cy="26" r="25" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className={`matchup-side ${selectedId === image2.id ? 'selected' : ''}`} onClick={() => handleSelect(image2)}>
                <img src={image2.imageSrc} alt={image2.name} className="matchup-image" />
                <div className="matchup-content">
                    <h2 className="matchup-title">{image2.name}</h2>
                </div>
                {selectedId === image2.id && (
                    <div className="checkmark-overlay">
                        <svg className="checkmark" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" fill="none" cx="26" cy="26" r="25" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchUpView;
