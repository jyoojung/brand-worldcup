import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';

const roundLabels = ['분위기', '질감', '조형', '빛과 컬러'];

const MoodboardView = ({ finalImages, onRestart }) => {
    const gridRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!gridRef.current) return;
        setIsDownloading(true);

        const node = gridRef.current;
        const images = Array.from(node.querySelectorAll('img'));
        const originalSrcs = images.map(img => img.src);

        try {
            // 1. 모든 이미지를 순회하며 Base64로 강제 변환 (CORS / SVG 렌더링 우회)
            await Promise.all(images.map(async (img) => {
                const src = img.getAttribute('src');
                if (!src) return;

                // 절대 경로 또는 상대 경로 이미지를 fetch로 받아와서 Blob -> Base64 변환
                const response = await fetch(src);
                const blob = await response.blob();

                const base64Src = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                img.src = base64Src; // 임시로 Data URL을 박아줌
            }));

            // 렌더링이 DOM에 반영될 시간을 약간 줍니다 (0.1초)
            await new Promise(resolve => setTimeout(resolve, 100));

            const scrollWidth = node.scrollWidth;
            const scrollHeight = node.scrollHeight;

            // 2. Base64로 이미지가 치환된 상태에서 html-to-image 실행
            const image = await htmlToImage.toPng(node, {
                pixelRatio: 2,
                backgroundColor: '#0F1115',
                width: scrollWidth,
                height: scrollHeight,
                canvasWidth: scrollWidth * 2,
                canvasHeight: scrollHeight * 2,
                style: {
                    transform: 'translate(0, 0)',
                    margin: '0',
                    width: `${scrollWidth}px`,
                    height: `${scrollHeight}px`,
                }
            });

            // 3. 사진 다운로드
            const link = document.createElement('a');
            link.download = 'brand-moodboard.png';
            link.href = image;
            link.click();
        } catch (error) {
            console.error('Error downloading image:', error);
        } finally {
            // 4. 원래의 이미지 src로 원상복구
            images.forEach((img, idx) => {
                img.src = originalSrcs[idx];
            });
            setIsDownloading(false);
        }
    };

    return (
        <div className="app-container" style={{ overflowY: 'auto', paddingBottom: '60px' }}>
            <header className="app-header">
                <button
                    className="round-indicator"
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.4)',
                        color: 'white'
                    }}
                    onClick={onRestart}
                    disabled={isDownloading}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    다시하기
                </button>
                <div className="theme-grid-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: '1.5rem' }}>
                    무드보드
                </div>
                <button
                    className="round-indicator"
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'white',
                        color: 'black',
                        border: 'none'
                    }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? '저장 중...' : '이미지 다운로드'}
                    {!isDownloading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                </button>
            </header>

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
            </div>
        </div>
    );
};

export default MoodboardView;
