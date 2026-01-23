
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
    code: CurrencyCode;
    name: string;
    symbol: string;
    locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', locale: 'en-AE' },
    { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
    { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', locale: 'en-CA' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', locale: 'en-AU' },
];

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
    USD: 1,
    INR: 83.12,  // Approx conversion
    AED: 3.67,   // Pegged
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.5,
    CAD: 1.35,
    AUD: 1.52,
};

export function formatPrice(amountInUsd: number, currencyCode: CurrencyCode): string {
    const rate = EXCHANGE_RATES[currencyCode] || 1;
    const convertedAmount = amountInUsd * rate;

    // Find currency config
    const config = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedAmount);
}
