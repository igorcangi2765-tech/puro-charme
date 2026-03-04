import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface LanguageSelectorProps {
    currentLang: Language;
    onLanguageChange: (lang: Language) => void;
    isScrolled?: boolean;
}

const FlagMZ = () => (
    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
        <defs>
            <clipPath id="mz-clip">
                <path fillOpacity=".7" d="M0 0h682.7v512H0z" />
            </clipPath>
        </defs>
        <g clipPath="url(#mz-clip)" transform="scale(.9375)">
            <path fill="#009a00" d="M0 0h768v160H0z" />
            <path fill="#fff" d="M0 160h768v16H0z" />
            <path fill="#000001" d="M0 176h768v160H0z" />
            <path fill="#fff" d="M0 336h768v16H0z" />
            <path fill="#ffca00" d="M0 352h768v160H0z" />
            <path fill="#d21034" d="M0 0v512l336-256z" />
            <path fill="#ffca00" d="m198.5 333-51.2-37.5L96.1 333l19.9-60.3-51.5-37.1 63.5.2 19.3-60.4 19.4 60.5 63.5-.3-51.5 37.1z" />
            <path fill="#fff" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M102.8 290.9h37c3 3.3 9.5 4.7 15.8 0 11.6-6.4 34 0 34 0l4.4-4.7-10.7-35.2-3.9-4.2s-8.3-5-24-3.3-21.2-.5-21.2-.5-13.7 1.6-17.6 3.6l-4.4 4.4z" />
            <path fill="none" stroke="#000" strokeWidth="1.2" d="m148 246.6-.3 38.8m31.7-38.3L186 278" />
            <path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m117 246.6-3.7 16" />
            <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m78.9 295.1 8.6 10.2q1.5.9 2.9 0l12.8-15.4 5.4-6.7q1.3-1.6 1-3l10.4-9.3 2.2.2c-1-.2-1.7-.7-1-1.8l2.4-1.8 1.8 2.3s-2.6 3.4-2.9 3.4h-2.8l-5.4 4.9 2.4 2 3.5 9.8 4.4-3.1-2.8-10 6.1-6.7-2.3-3.6 1.6-2s21.3 13.4 29.6 9.8c.2 0 .5-9.6.5-9.6s-22.2-2.3-22.7-6.7 5-5 5-5l-2.4-3.2.5-1.8 3.9 4.8 8.7-7.4 51.5 58.6c2.8-1.1 3.4-1.8 3.6-4.6L155 241.5l3.8-4.1c.8-.9 1-1.2 1-2.6l6-5.1a7 7 0 0 1 3.8 3L186 219c.4.4 1.7.8 2.6.4l26.9-25.9-29.3 20.7-1-.7c0-.9 1-1 0-2.6-1.2-1.4-2.9 1.3-3.1 1.3s-4.3-1.4-5.2-3.2l-.2 4.7-7.5 7-5.7-.3-8.2 8-1 3 1.3 2.7s-4.4 3.8-4.4 3.6c0-.3-.9-1.2-1-1.3l3.8-3.4.5-2.3-1.2-2c-.4.3-5.2 5.4-5.5 4.8l-14-15.5.8-2.9-8.7-9.5c-3.2-1.1-8.3-1.3-9.3 5.7-.8 1.6-7.4.2-7.4.2l-3.6.8L85.2 241l11.3 13.6 23.2-29.3.7-8.3 4.8 5.4q2.5.5 4.7-.5l13.7 15.3-2.3 2.3 2 2.2 2.4-1.6.9 1.3-3.1 2.1c-1.8-1.2-3.6-2.7-3.5-5l-7.7 6.4-.3 1.2-22.9 19-2 .3-.5 6 14.9-12.4v-1.8l1.5 1.3 11.6-9.3s.8 1 .5 1-10.3 9.3-10.3 9.3l-.2 1-1.8 1.6-1-.8-14 12.4h-2l-7.7 7.7c-2 .2-3.7.4-5.4 1.5z" />
        </g>
    </svg>
);

const FlagUS = () => (
    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
        <defs>
            <marker id="us-star" markerHeight="30" markerWidth="30">
                <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
            </marker>
        </defs>
        <path fill="#bd3d44" d="M0 0h640v480H0" />
        <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
        <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
        <path fill="none" markerMid="url(#us-star)" d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z" />
    </svg>
);


export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange, isScrolled }) => {
    return (
        <div className="flex items-center gap-2">
            {/* Portugal Flag Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLanguageChange('pt')}
                className={`relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-all duration-300 ${currentLang === 'pt'
                    ? 'opacity-100 grayscale-0 ring-2 ring-puro-pastelPink bg-puro-softPink/10'
                    : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                    }`}
                aria-label="Português"
            >
                <div className="w-7 h-5 rounded-[2px] overflow-hidden shadow-sm">
                    <FlagMZ />
                </div>
            </motion.button>

            {/* UK Flag Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLanguageChange('en')}
                className={`relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-all duration-300 ${currentLang === 'en'
                    ? 'opacity-100 grayscale-0 ring-2 ring-puro-pastelPink bg-puro-softPink/10'
                    : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                    }`}
                aria-label="English"
            >
                <div className="w-7 h-5 rounded-[2px] overflow-hidden shadow-sm">
                    <FlagUS />
                </div>
            </motion.button>
        </div>
    );
};
