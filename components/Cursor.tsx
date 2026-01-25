import React, { useState, useEffect } from 'react';

const Cursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        
        document.addEventListener('mousemove', onMouseMove);

        const followerInterval = setInterval(() => {
            setFollowerPosition(prev => ({
                x: prev.x + (position.x - prev.x) / 8,
                y: prev.y + (position.y - prev.y) / 8,
            }));
        }, 20); // Update follower position smoothly

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            clearInterval(followerInterval);
        };
    }, [position]);

    return (
        <>
            <style>{`
                .custom-cursor {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #00A859; /* App's brand green */
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9999;
                    transition: all 0.1s ease;
                    transform: translate(-50%, -50%);
                }
                .cursor-follower {
                    width: 40px;
                    height: 40px;
                    border: 1px solid rgba(0, 168, 89, 0.3);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9998;
                    transition: all 0.3s ease;
                    transform: translate(-50%, -50%);
                }
                /* Hide on touch devices */
                @media (pointer: coarse) {
                    .custom-cursor, .cursor-follower {
                        display: none;
                    }
                }
            `}</style>
            <div className="custom-cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }}></div>
            <div className="cursor-follower" style={{ left: `${followerPosition.x}px`, top: `${followerPosition.y}px` }}></div>
        </>
    );
};

export default Cursor;
