import { useState, useEffect, useCallback } from 'react';

const PROFANITY_URL = 'https://raw.githubusercontent.com/zacanger/profane-words/master/words.json';

let cachedRegexes: RegExp[] | null = null;
let fetchPromise: Promise<RegExp[]> | null = null;

export const useProfanityFilter = () => {
    const [isReady, setIsReady] = useState<boolean>(!!cachedRegexes);

    useEffect(() => {
        if (cachedRegexes) {
            setIsReady(true);
            return;
        }

        if (!fetchPromise) {
            fetchPromise = fetch(PROFANITY_URL)
                .then(res => res.json())
                .then((data: string[]) => {
                    const regexes = data.map(word => {
                        // Escape regex special characters in the word
                        const escapedWord = word.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
                        // Use strict non-word boundaries or start/end of string to prevent 'associate' matching 'ass'
                        return new RegExp(`(?:^|[^a-zA-Z0-9_])${escapedWord}(?:[^a-zA-Z0-9_]|$)`, 'i');
                    });

                    cachedRegexes = regexes;
                    return regexes;
                })
                .catch(err => {
                    console.error("Failed to fetch profanity list, falling back to basic list:", err);
                    const fallback = ['shit', 'fuck', 'bitch', 'asshole', 'cunt', 'dick'];
                    const regexes = fallback.map(word => new RegExp(`(?:^|[^a-zA-Z0-9_])${word}(?:[^a-zA-Z0-9_]|$)`, 'i'));
                    cachedRegexes = regexes;
                    return regexes;
                });
        }

        fetchPromise.then(() => {
            setIsReady(true);
        });
    }, []);

    const containsProfanity = useCallback((text: string): boolean => {
        if (!text || !cachedRegexes) return false;

        // Execute the test on the text against all pre-compiled regexes
        // Pre-compiled regexes make this loop extremely fast (O(N) with fast C++ backend)
        return cachedRegexes.some(regex => regex.test(text));
    }, [isReady]);

    return { containsProfanity, isReady };
};
