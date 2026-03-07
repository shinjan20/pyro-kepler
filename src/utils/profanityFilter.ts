import { Filter } from 'bad-words';

// Create a singleton instance of the bad-words filter
const filter = new Filter();

/**
 * Checks if a given text contains profanity.
 * @param text The text to check. Can be undefined/null.
 * @returns True if profanity is detected, false otherwise.
 */
export const hasProfanity = (text?: string | null): boolean => {
    if (!text) return false;
    return filter.isProfane(text);
};

/**
 * Checks an object of form fields for profanity.
 * @param fields An object containing form field values
 * @returns The name of the first field containing profanity, or null if clean.
 */
export const checkFormForProfanity = (fields: Record<string, string | undefined | null>): string | null => {
    for (const [fieldName, value] of Object.entries(fields)) {
        if (hasProfanity(value)) {
            return fieldName;
        }
    }
    return null;
};
