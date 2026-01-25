import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Stats: React.FC = () => {
    const { t } = useTranslation();

    const stats = [
        { value: '+25', key: 'speakers', icon: 'fa-user-tie' },
        { value: '+500', key: 'participants', icon: 'fa-users' },
        { value: '2', key: 'days', icon: 'fa-calendar-alt' },
        { value: '+10', key: 'workshops', icon: 'fa-tools' },
    ];

    // Duplicate for seamless scroll - now each stat is an object
    const marqueeItems = [...stats, ...stats];

    const animationStyles = `
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); } /* Changed to 50% as only one full set is duplicated */
        }
        .marquee-container {
            display: flex;
            overflow: hidden;
            width: 100%;
        }
        .marquee-content {
            flex-shrink: 0;
            display: flex;
            justify-content: space-around;
            align-items: center; /* Added for vertical alignment */
            gap: 2rem; /* Spacing between cards */
            min-width: 100%;
            animation: scroll 40s linear infinite;
        }
        .marquee:hover .marquee-content {
            animation-play-state: paused;
        }
        .stat-card {
            background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent white for a modern look */
            border-radius: 0.75rem; /* Rounded corners */
            padding: 1.5rem 2rem; /* Padding inside the card */
            display: flex;
            flex-direction: column; /* Stack icon and text */
            align-items: center; /* Center content horizontally */
            justify-content: center; /* Center content vertically */
            min-width: 200px; /* Minimum width for cards */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
            transition: transform 0.3s ease-in-out; /* Smooth hover effect */
        }
        .stat-card:hover {
            transform: translateY(-5px); /* Lift effect on hover */
        }
        .stat-icon {
            font-size: 2.5rem; /* Large icon size */
            margin-bottom: 0.5rem; /* Space between icon and text */
            color: #FFD700; /* brand-yellow for icons */
        }
        .stat-value {
            font-size: 2.5rem; /* Large value text */
            font-weight: bold;
            line-height: 1; /* Adjust line height */
            white-space: nowrap;
        }
        .stat-text {
            font-size: 1.1rem; /* Smaller text for description */
            text-align: center;
            white-space: nowrap;
        }
    `;

    return (
        <section className="py-10 bg-brand-green text-white overflow-hidden relative">
            <style>{animationStyles}</style>
            <div className="marquee-container">
                <div className="marquee-content">
                    {marqueeItems.map((item, index) => (
                        <div key={index} className="stat-card">
                            <i className={`fa-solid ${item.icon} stat-icon`}></i>
                            <span className="stat-value">{item.value}</span>
                            <span className="stat-text">{t(`stats.${item.key}`)}</span>
                        </div>
                    ))}
                </div>
                {/* The second marquee-content div is removed, animation handles seamless loop */}
            </div>
        </section>
    );
};

export default Stats;