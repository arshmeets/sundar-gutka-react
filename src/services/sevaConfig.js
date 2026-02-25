/**
 * Seva configuration service.
 *
 * Currently returns hardcoded filler data.
 * TODO: Replace getSevaConfig() body with a real STTM API call when the
 *       endpoint is available. All consumers are already coded against this
 *       interface so no other changes will be needed.
 */

/** @typedef {'one_time' | 'recurring' | 'unknown'} DonorType */
/** @typedef {'stripe' | 'qgiv' | 'unknown'} DonorSource */
/** @typedef {'qgiv_prefill_open' | 'stripe' | 'qgiv_embedded'} PaymentMode */

/**
 * @typedef {Object} SevaConfig
 * @property {string}      configVersion
 * @property {string}      country          - ISO 3166-1 alpha-2, e.g. "US"
 * @property {Object}      content
 * @property {string}      content.headline
 * @property {string}      content.description
 * @property {Object}      defaults
 * @property {number[]}    defaults.amounts
 * @property {number}      defaults.selectedAmount
 * @property {PaymentMode} payment_mode
 * @property {boolean}     showSevaDot
 */

/** Filler defaults used until the STTM API is integrated. */
const FILLER_CONFIG = {
  configVersion: "mock-v1",
  country: "US",
  content: {
    headline: "ਸੁੰਦਰ ਗੁਟਕਾ",
    description:
      "Is built by volunteers at Khalis Foundation, a non-profit organization " +
      "that builds software like Sundar Gutka and SikhiToTheMax. Khalis helps " +
      "millions of Sikhs around the world connect with Gurbani. You can be part " +
      "of this seva as well; serve millions with a single donation.",
    taxMessage:
      "Your donation is tax-deductible. You will receive a receipt via email.",
    nonUsTaxMessage: "Thank you for your generous support of Khalis Foundation.",
    footerText:
      "Know coding? You can also do seva through open source contributions.",
    donatedHeadline: "ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ",
    donatedDescription:
      "Thank you for your generous support. Your seva helps Sikhs around the world connect with Gurbani.",
    recurringRetentionDescription:
      "Your monthly seva is making a difference. Thank you for your continued support.",
    convertToRecurringCTA: "Upgrade to Monthly Giving",
  },
  defaults: {
    amounts: [10, 50, 100],
    selectedAmount: 10,
  },
  payment_mode: "qgiv_prefill_open",
  showSevaDot: true,
};

/**
 * Returns the Seva configuration.
 * Async signature is intentional so the real API call can be dropped in later.
 *
 * @returns {Promise<SevaConfig>}
 */
export const getSevaConfig = async () => {
  // TODO: replace with fetch from STTM API + AsyncStorage cache
  return FILLER_CONFIG;
};

/**
 * Builds a Qgiv prefill URL from donor details and donation amount.
 *
 * @param {Object} params
 * @param {number} params.amount
 * @param {'one_time'|'recurring'} params.donationType
 * @returns {string}
 */
export const buildQgivUrl = ({ amount, donationType }) => {
  // TODO: retrieve the real Qgiv form ID from config/API
  const BASE_URL = "https://secure.qgiv.com/for/khalisfoundation";
  const params = new URLSearchParams({
    amount: String(amount),
    recurring: donationType === "recurring" ? "1" : "0",
  });
  return `${BASE_URL}?${params.toString()}`;
};
