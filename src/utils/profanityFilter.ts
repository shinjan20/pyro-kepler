import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'dummy_key_to_prevent_crash',
    dangerouslyAllowBrowser: true
});

const PROFANITY_URL = 'https://raw.githubusercontent.com/zacanger/profane-words/master/words.json';
let cachedFallbackRegexes: RegExp[] | null = null;
let fallbackFetchPromise: Promise<RegExp[]> | null = null;

const fallbackCheck = async (text: string): Promise<boolean> => {
    const textLower = text.toLowerCase();

    // If we haven't fetched the list yet, fetch it now
    if (!cachedFallbackRegexes) {
        if (!fallbackFetchPromise) {
            fallbackFetchPromise = fetch(PROFANITY_URL)
                .then(res => res.json())
                .then((data: string[]) => {
                    const regexes = data.map(word => {
                        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        return new RegExp(`(?:^|[^a-zA-Z0-9_])${escapedWord}(?:[^a-zA-Z0-9_]|$)`, 'i');
                    });
                    cachedFallbackRegexes = regexes;
                    return regexes;
                })
                .catch(err => {
                    console.error("Failed to fetch profanity list, falling back to basic list:", err);
                    const basic = ['shit', 'fuck', 'bitch', 'asshole', 'cunt', 'dick'];
                    const regexes = basic.map(word => new RegExp(`(?:^|[^a-zA-Z0-9_])${word}(?:[^a-zA-Z0-9_]|$)`, 'i'));
                    cachedFallbackRegexes = regexes;
                    return regexes;
                });
        }
        await fallbackFetchPromise;
    }

    // Use cached regexes to test
    if (cachedFallbackRegexes) {
        return cachedFallbackRegexes.some(regex => regex.test(textLower));
    }
    return false;
};

/**
 * Checks if a given text contains profanity asynchronously via the LLM API.
 * WARNING: Running OpenAI directly on the client exposes your API key!
 * Only do this for local development or trusted environments.
 * @param text The text to check. Can be undefined/null.
 * @returns True if profanity is detected, false otherwise.
 */
export const checkTextForProfanityAsync = async (text?: string | null): Promise<boolean> => {
    if (!text || text.trim().length === 0) return false;

    // Local override: if no real API key is found, always pass validation
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY.includes('sk-') === false) {
        console.warn('Skipping profanity API check: No valid VITE_OPENAI_API_KEY provided. Using local fallback.');
        return fallbackCheck(text);
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a strict profanity and toxicity detection engine. Evaluate the provided text and reply with only a JSON object: { \"hasProfanity\": boolean, \"reason\": string }. Consider severe slurs, excessive cursing, hate speech, and explicit content to be profanity. Moderate professional language is fine."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 150,
        });

        const content = response.choices[0].message.content;
        if (!content) return fallbackCheck(text);

        const result = JSON.parse(content);
        return result.hasProfanity === true;

    } catch (error) {
        console.error('Failed to call OpenAI profanity API:', error);
        // Fallback to local keyword check on quota/network errors
        return fallbackCheck(text);
    }
};

/**
 * Checks an object of form fields for profanity asynchronously.
 * @param fields An object containing form field values
 * @returns The name of the first field containing profanity, or null if clean.
 */
export const checkFormForProfanityAsync = async (fields: Record<string, string | undefined | null>): Promise<string | null> => {
    // Check fields in parallel for speed
    const checks = Object.entries(fields).map(async ([fieldName, value]) => {
        const isProfane = await checkTextForProfanityAsync(value);
        return { fieldName, isProfane };
    });

    const results = await Promise.all(checks);

    for (const result of results) {
        if (result.isProfane) {
            return result.fieldName;
        }
    }

    return null;
};
