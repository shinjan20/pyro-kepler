export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length < 6) return 'Weak';
    let strengthScore = 0;
    if (password.length > 8) strengthScore++;
    if (/[A-Z]/.test(password)) strengthScore++;
    if (/[0-9]/.test(password)) strengthScore++;
    if (/[^A-Za-z0-9]/.test(password)) strengthScore++;

    if (strengthScore <= 1) return 'Weak';
    if (strengthScore === 2 || strengthScore === 3) return 'Medium';
    return 'Strong';
};
