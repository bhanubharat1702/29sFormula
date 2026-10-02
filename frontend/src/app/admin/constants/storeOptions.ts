export interface CountryOption {
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  phoneCode: string;
  timezone: string;
}

export const COUNTRIES: CountryOption[] = [
  { name: "India", code: "IN", currency: "INR (₹) - Indian Rupee", currencyCode: "INR", phoneCode: "+91", timezone: "Asia/Kolkata" },
  { name: "United States", code: "US", currency: "USD ($) - US Dollar", currencyCode: "USD", phoneCode: "+1", timezone: "America/New_York" },
  { name: "United Kingdom", code: "GB", currency: "GBP (£) - British Pound", currencyCode: "GBP", phoneCode: "+44", timezone: "Europe/London" },
  { name: "Canada", code: "CA", currency: "CAD ($) - Canadian Dollar", currencyCode: "CAD", phoneCode: "+1", timezone: "America/Toronto" },
  { name: "Australia", code: "AU", currency: "AUD ($) - Australian Dollar", currencyCode: "AUD", phoneCode: "+61", timezone: "Australia/Sydney" },
  { name: "United Arab Emirates", code: "AE", currency: "AED (د.إ) - UAE Dirham", currencyCode: "AED", phoneCode: "+971", timezone: "Asia/Dubai" },
  { name: "Saudi Arabia", code: "SA", currency: "SAR (﷼) - Saudi Riyal", currencyCode: "SAR", phoneCode: "+966", timezone: "Asia/Riyadh" },
  { name: "Singapore", code: "SG", currency: "SGD ($) - Singapore Dollar", currencyCode: "SGD", phoneCode: "+65", timezone: "Asia/Singapore" },
  { name: "Germany", code: "DE", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+49", timezone: "Europe/Berlin" },
  { name: "France", code: "FR", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+33", timezone: "Europe/Paris" },
  { name: "Italy", code: "IT", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+39", timezone: "Europe/Rome" },
  { name: "Spain", code: "ES", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+34", timezone: "Europe/Madrid" },
  { name: "Netherlands", code: "NL", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+31", timezone: "Europe/Amsterdam" },
  { name: "Switzerland", code: "CH", currency: "CHF (CHF) - Swiss Franc", currencyCode: "CHF", phoneCode: "+41", timezone: "Europe/Zurich" },
  { name: "Japan", code: "JP", currency: "JPY (¥) - Japanese Yen", currencyCode: "JPY", phoneCode: "+81", timezone: "Asia/Tokyo" },
  { name: "South Korea", code: "KR", currency: "KRW (₩) - South Korean Won", currencyCode: "KRW", phoneCode: "+82", timezone: "Asia/Seoul" },
  { name: "China", code: "CN", currency: "CNY (¥) - Chinese Yuan", currencyCode: "CNY", phoneCode: "+86", timezone: "Asia/Shanghai" },
  { name: "Hong Kong", code: "HK", currency: "HKD ($) - Hong Kong Dollar", currencyCode: "HKD", phoneCode: "+852", timezone: "Asia/Hong_Kong" },
  { name: "Malaysia", code: "MY", currency: "MYR (RM) - Malaysian Ringgit", currencyCode: "MYR", phoneCode: "+60", timezone: "Asia/Kuala_Lumpur" },
  { name: "Indonesia", code: "ID", currency: "IDR (Rp) - Indonesian Rupiah", currencyCode: "IDR", phoneCode: "+62", timezone: "Asia/Jakarta" },
  { name: "Brazil", code: "BR", currency: "BRL (R$) - Brazilian Real", currencyCode: "BRL", phoneCode: "+55", timezone: "America/Sao_Paulo" },
  { name: "Mexico", code: "MX", currency: "MXN ($) - Mexican Peso", currencyCode: "MXN", phoneCode: "+52", timezone: "America/Mexico_City" },
  { name: "South Africa", code: "ZA", currency: "ZAR (R) - South African Rand", currencyCode: "ZAR", phoneCode: "+27", timezone: "Africa/Johannesburg" },
  { name: "New Zealand", code: "NZ", currency: "NZD ($) - New Zealand Dollar", currencyCode: "NZD", phoneCode: "+64", timezone: "Pacific/Auckland" },
  { name: "Ireland", code: "IE", currency: "EUR (€) - Euro", currencyCode: "EUR", phoneCode: "+353", timezone: "Europe/Dublin" }
];

export const BUSINESS_CATEGORIES = [
  { value: "retail", label: "General Retail" },
  { value: "fashion", label: "Apparel, Fashion & Clothing" },
  { value: "beauty", label: "Beauty, Cosmetics & Personal Care" },
  { value: "electronics", label: "Electronics, Computers & Gadgets" },
  { value: "food", label: "Food, Beverages & Groceries" },
  { value: "health", label: "Health, Wellness & Pharmacy" },
  { value: "home", label: "Home Decor, Furniture & Kitchen" },
  { value: "jewelry", label: "Jewelry, Watches & Accessories" },
  { value: "sports", label: "Sports, Fitness & Outdoor" },
  { value: "kids", label: "Toys, Kids & Baby Products" },
  { value: "automotive", label: "Automotive & Industrial" },
  { value: "books", label: "Books, Stationery & Media" },
  { value: "art", label: "Art, Crafts & Collectibles" },
  { value: "services", label: "Services & Appointments" },
  { value: "digital", label: "Digital Products & Subscriptions" },
  { value: "other", label: "Other / Specialized Business" }
];

export const CURRENCIES = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "CAD", label: "CAD ($) - Canadian Dollar" },
  { value: "AUD", label: "AUD ($) - Australian Dollar" },
  { value: "AED", label: "AED (د.إ) - UAE Dirham" },
  { value: "SAR", label: "SAR (﷼) - Saudi Riyal" },
  { value: "SGD", label: "SGD ($) - Singapore Dollar" },
  { value: "JPY", label: "JPY (¥) - Japanese Yen" },
  { value: "CNY", label: "CNY (¥) - Chinese Yuan" },
  { value: "KRW", label: "KRW (₩) - South Korean Won" },
  { value: "BRL", label: "BRL (R$) - Brazilian Real" },
  { value: "MXN", label: "MXN ($) - Mexican Peso" },
  { value: "ZAR", label: "ZAR (R) - South African Rand" },
  { value: "NZD", label: "NZD ($) - New Zealand Dollar" },
  { value: "CHF", label: "CHF (CHF) - Swiss Franc" },
  { value: "HKD", label: "HKD ($) - Hong Kong Dollar" },
  { value: "MYR", label: "MYR (RM) - Malaysian Ringgit" },
  { value: "IDR", label: "IDR (Rp) - Indonesian Rupiah" }
];

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST - UTC+5:30)" },
  { value: "America/New_York", label: "America/New_York (EST/EDT - UTC-5/4)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT - UTC-6/5)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT - UTC-7/6)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT - UTC-8/7)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST - UTC+0/1)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST - UTC+1/2)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST - UTC+1/2)" },
  { value: "Europe/Rome", label: "Europe/Rome (CET/CEST - UTC+1/2)" },
  { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST - UTC+1/2)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST - UTC+1/2)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST - UTC+4)" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh (AST - UTC+3)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT - UTC+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST - UTC+9)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST - UTC+8)" },
  { value: "Asia/Seoul", label: "Asia/Seoul (KST - UTC+9)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT - UTC+10/11)" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEST/AEDT - UTC+10/11)" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (NZST/NZDT - UTC+12/13)" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo (BRT - UTC-3)" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST - UTC+2)" },
  { value: "UTC", label: "UTC (Universal Coordinated Time)" }
];
