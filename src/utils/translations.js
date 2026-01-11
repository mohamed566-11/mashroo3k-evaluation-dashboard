/**
 * Translation mappings for reason values between English and Arabic
 */
export const REASON_TRANSLATIONS = {
    // English to Arabic
    'Company Reputation': 'سمعة الشركة',
    'Service Quality': 'جودة الخدمات',
    'Competitive Prices': 'أسعار تنافسية',
    'Friend Recommendation': 'توصية من صديق',
    'Easy Communication': 'سهولة التواصل',
    'Other': 'أخرى',

    // Arabic to English
    'سمعة الشركة': 'Company Reputation',
    'جودة الخدمات': 'Service Quality',
    'أسعار تنافسية': 'Competitive Prices',
    'توصية من صديق': 'Friend Recommendation',
    'سهولة التواصل': 'Easy Communication',
    'أخرى': 'Other'
};

/**
 * Translates a reason value based on the target language
 * @param {string} reason - The reason value to translate
 * @param {'en'|'ar'} targetLang - The target language ('en' for English, 'ar' for Arabic)
 * @returns {string} The translated reason or the original if no translation exists
 */
export const translateReason = (reason, targetLang = 'ar') => {
    if (!reason) return reason;

    // Check if the reason has a direct translation
    const translated = REASON_TRANSLATIONS[reason];
    if (translated) {
        if (targetLang === 'ar') {
            // If we have an Arabic translation, return it
            if (reason.match(/[a-zA-Z]/) && !reason.match(/[؀-ۿ]/)) {
                // Input is English, return Arabic
                return translated;
            } else {
                // Input is already Arabic, return it
                return reason;
            }
        } else if (targetLang === 'en') {
            // If we have an English translation, return it
            if (reason.match(/[؀-ۿ]/)) {
                // Input is Arabic, find the English equivalent
                const englishKeys = Object.keys(REASON_TRANSLATIONS).filter(key =>
                    REASON_TRANSLATIONS[key] === reason && key.match(/[a-zA-Z]/));
                return englishKeys.length > 0 ? englishKeys[0] : reason;
            } else {
                // Input is already English, return it
                return reason;
            }
        }
    }

    // If no direct translation exists, return the original reason
    return reason;
};

/**
 * Gets all available reason translations
 * @returns {Array} Array of objects with English and Arabic reason values
 */
export const getAllReasonTranslations = () => {
    const englishReasons = Object.keys(REASON_TRANSLATIONS).filter(key => key.match(/[a-zA-Z]/) && !key.match(/[؀-ۿ]/));
    return englishReasons.map(englishReason => ({
        english: englishReason,
        arabic: REASON_TRANSLATIONS[englishReason]
    }));
};