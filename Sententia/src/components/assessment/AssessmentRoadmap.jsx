import React from 'react';
import { Check, Lock, Star } from 'lucide-react';
import styles from './AssessmentRoadmap.module.css';

const AssessmentRoadmap = () => {
    // Define levels/nodes
    const levels = [
        { id: 1, title: 'Overconfidence', status: 'completed', x: 100, y: 400 },
        { id: 2, title: 'Framing Effect', status: 'active', x: 250, y: 250 },
        { id: 3, title: 'Sunk Cost', status: 'locked', x: 100, y: 100 },
        { id: 4, title: 'Anchoring', status: 'locked', x: 400, y: 50 },
    ];

    // Simple S-curve path points for 4 nodes
    // Adjust paths to connect the nodes smoothly
    // Path: Start (100, 450) -> (100, 400) -> curve -> (250, 250) -> curve -> (100, 100) -> curve -> (400, 50)

    // Custom path definition string
    const pathData = "M 100 480 Q 100 400 100 400 C 100 300 250 350 250 250 C 250 150 100 200 100 100 C 100 20 400 80 400 50";

    return (
        <div className={styles.container}>
            <svg className={styles.mapSvg} viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="gradientPath" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                </defs>

                {/* Base Path (Bottom layer) */}
                <path d={pathData} className={styles.pathBase} />

                {/* Gradient Path (Overlay) */}
                <path d={pathData} className={styles.pathGradient} />

                {/* Nodes */}
                {levels.map((level) => {
                    // Decide Icon based on status
                    let Icon = Star;
                    if (level.status === 'completed') Icon = Check;
                    if (level.status === 'locked') Icon = Lock;

                    return (
                        <g
                            key={level.id}
                            transform={`translate(${level.x}, ${level.y})`}
                            onClick={() => console.log(`Clicked level ${level.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <g className={`${styles.nodeGroup} ${styles[level.status]}`}>
                                {/* Pulse effect for active node */}
                                <circle r="30" className={styles.pulseCircle} />

                                {/* Main Node Circle */}
                                <circle r="24" className={styles.nodeCircle} />

                                {/* Icon rendering inside SVG */}
                                <foreignObject x="-12" y="-12" width="24" height="24">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: level.status === 'completed' ? 'white' : (level.status === 'active' ? 'var(--color-primary)' : '#d1d5db')
                                    }}>
                                        <Icon size={16} strokeWidth={3} />
                                    </div>
                                </foreignObject>
                            </g>
                        </g>
                    );
                })}
            </svg>

            {/* HTML Overlays for Labels (Optional, or can use foreignObject inside SVG if preferred for better positioning) */}
            {levels.map((level) => (
                <div
                    key={`label-${level.id}`}
                    className={styles.nodeLabel}
                    style={{
                        left: '50%', // Centered relative to container, need manual adjustment or smarter positioning
                        // Simplified: using absolute positioning relative to container might be tricky with SVG scaling. 
                        // Let's stick to simple tooltips or a static legend for now.
                        // Actually, foreignObject labels inside SVG might be cleaner or just render them in the loop above?
                        // Since styles use sibling selector + .nodeLabel, let's try to put them in the SVG or just use standard React Tooltop pattern.
                        // For this MVP, I'll rely on the visual hover effect and add a static text label below the node in SVG.
                        display: 'none'
                    }}
                >
                    {level.title}
                </div>
            ))}

            {/* Svg Text Labels */}
            <svg className={styles.mapSvg} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} viewBox="0 0 500 500">
                {levels.map((level) => (
                    <text
                        key={`text-${level.id}`}
                        x={level.x + 35}
                        y={level.y + 5}
                        fill="var(--color-text-primary)"
                        fontSize="14"
                        fontWeight="600"
                        fontFamily="var(--font-heading)"
                        style={{ textShadow: '0 2px 4px white' }}
                    >
                        {level.title}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default AssessmentRoadmap;
