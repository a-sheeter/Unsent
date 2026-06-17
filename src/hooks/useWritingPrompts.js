import { useState, useEffect } from "react";

const PROMPTS = [
    "What happened today that stuck with you?",
    "What are you feeling but not saying?",
    "If you could say anything without consequence, what would it be?"
]

export default function useWritingPrompts() {
    
    /* --- Effect --- */
    useEffect(() => {
        const shuffledPrompts = [...PROMPTS].sort(() => Math.random() - 0.5);
        setShuffled(shuffledPrompts);
        setCurrentPrompt(shuffledPrompts[0]);
        setIndex(1);
    }, []);

    /* --- State --- */
    const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
    const [shuffled, setShuffled] = useState([]);
    const [index, setIndex] = useState(0);

    function getNewPrompt() {
        if (index >= shuffled.length) {
            const reshuffled = [...PROMPTS].sort(() => Math.random() - 0.5);
            setShuffled(reshuffled);
            setCurrentPrompt(reshuffled[0]);
            setIndex(1)
        } else {
            setCurrentPrompt(shuffled[index]);
            setIndex(prev => prev + 1);
        }
    };

    return {
        currentPrompt, 
        getNewPrompt
    }
}

