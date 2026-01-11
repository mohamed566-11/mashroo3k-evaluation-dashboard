import { translateReason } from '../translations';

describe('Translation Utilities', () => {
    test('should translate English reason to Arabic', () => {
        expect(translateReason('Service Quality', 'ar')).toBe('جودة الخدمات');
        expect(translateReason('Company Reputation', 'ar')).toBe('سمعة الشركة');
        expect(translateReason('Competitive Prices', 'ar')).toBe('أسعار تنافسية');
    });

    test('should keep Arabic reason as is when target is Arabic', () => {
        expect(translateReason('جودة الخدمات', 'ar')).toBe('جودة الخدمات');
        expect(translateReason('سمعة الشركة', 'ar')).toBe('سمعة الشركة');
    });

    test('should translate Arabic reason to English', () => {
        expect(translateReason('جودة الخدمات', 'en')).toBe('Service Quality');
        expect(translateReason('سمعة الشركة', 'en')).toBe('Company Reputation');
    });

    test('should keep English reason as is when target is English', () => {
        expect(translateReason('Service Quality', 'en')).toBe('Service Quality');
        expect(translateReason('Company Reputation', 'en')).toBe('Company Reputation');
    });

    test('should return original reason if no translation exists', () => {
        const unknownReason = 'Unknown Reason';
        expect(translateReason(unknownReason, 'ar')).toBe(unknownReason);
        expect(translateReason(unknownReason, 'en')).toBe(unknownReason);
    });
});