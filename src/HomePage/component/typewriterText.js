import React, { useState, useEffect } from 'react';

const TypewriterText = ({ textToDisplay }) => {
    const [displayedText, setDisplayedText] = useState('|');

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedText(textToDisplay.substring(0, currentIndex));
            currentIndex++;
            if (currentIndex > textToDisplay.length) {
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [textToDisplay]);

    return <h3 style={{color: 'gold', fontSize: '50px'}}>{displayedText}</h3>;
};

export default TypewriterText;