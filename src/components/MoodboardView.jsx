import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';

const roundLabels = ['분위기', '질감', '조형', '빛과 컬러'];

const MoodboardView = ({ finalImages, onRestart }) => {
    const gridRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!gridRef.current) return;
        setIsDownloading(true);
        try {
            // html-to-image bug workaround: call once silently to load <img> tags
            await htmlToImage.toPng(gridRef.current, { cacheBust: true });

            const node = gridRef.current;
            const scrollWidth = node.scrollWidth;
            const scrollHeight = node.scrollHeight;

            const image = await htmlToImage.toPng(node, {
                pixelRatio: 2,
                backgroundColor: '#0F1115',
                cacheBust: true,
                style: {
                    // Instruct the library's internal virtual clone to evaluate its full scrolling size
                    transform: 'translate(0, 0)',
                    margin: '0',
                    width: `${scrollWidth}px`,
                    height: `${scrollHeight}px`,
                },
                // Pass canvas bounds manually so the exported image scales to the unclipped width/height
                width: scrollWidth,
                height: scrollHeight,
                canvasWidth: scrollWidth * 2,
                canvasHeight: scrollHeight * 2,
            });

            const link = document.createElement('a');
            link.download = 'brand-moodboard.png';
            link.href = image;
            link.click();
        } catch (error) {
            console.error('Error downloading image:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="app-container" style={{ overflowY: 'auto', paddingBottom: '60px' }}>
            <div className="moodboard-container">

                <div className="moodboard-grid" ref={gridRef}>
                    {finalImages.map((img, index) => (
                        <div key={index} className="moodboard-item" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                            <img src={img.imageSrc} alt={img.name} />
                            <div className="moodboard-item-overlay">
                                <span className="moodboard-item-label">#{roundLabels[index]}</span>
                                <h3 className="moodboard-item-name">{img.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-container">
                    <button
                        className="restart-btn"
                        onClick={onRestart}
                        disabled={isDownloading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        다시하기
                    </button>
                    <button
                        className="download-btn"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? '저장 중...' : '이미지 다운로드'}
                        {!isDownloading && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoodboardView;
