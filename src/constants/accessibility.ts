/**
 * Accessibility Constants
 * WCAG 2.1 Level AA compliance standards
 */

/**
 * Minimum touch target size (44x44 points)
 * WCAG 2.1 Success Criterion 2.5.5 (Level AAA)
 * We use 44 as minimum for better accessibility
 */
export const TOUCH_TARGET = {
  MIN_SIZE: 44,
  RECOMMENDED_SIZE: 48,
  SPACING: 8, // Minimum spacing between touch targets
} as const;

/**
 * Color contrast ratios
 * WCAG 2.1 Success Criterion 1.4.3 (Level AA)
 */
export const CONTRAST_RATIO = {
  NORMAL_TEXT: 4.5, // For text smaller than 18pt or 14pt bold
  LARGE_TEXT: 3, // For text 18pt+ or 14pt+ bold
  UI_COMPONENTS: 3, // For UI components and graphical objects
} as const;

/**
 * Font size scaling
 * Support system font size settings up to 200%
 */
export const FONT_SCALE = {
  MIN: 0.85,
  MAX: 2.0,
  DEFAULT: 1.0,
} as const;

/**
 * Animation durations for reduced motion
 */
export const ANIMATION = {
  NORMAL: 300,
  REDUCED: 100, // For users with reduced motion preference
  NONE: 0,
} as const;

/**
 * Accessibility labels in Bangla
 */
export const A11Y_LABELS = {
  // Navigation
  HOME_TAB: 'হোম ট্যাব',
  DAILY_TAB: 'দৈনিক ট্যাব',
  JOURNAL_TAB: 'জার্নাল ট্যাব',
  PROGRESS_TAB: 'অগ্রগতি ট্যাব',
  SETTINGS_TAB: 'সেটিংস ট্যাব',
  
  // Actions
  BACK_BUTTON: 'পিছনে যান',
  CLOSE_BUTTON: 'বন্ধ করুন',
  SAVE_BUTTON: 'সংরক্ষণ করুন',
  CANCEL_BUTTON: 'বাতিল করুন',
  DELETE_BUTTON: 'মুছে ফেলুন',
  EDIT_BUTTON: 'সম্পাদনা করুন',
  
  // SOS
  SOS_BUTTON: 'জরুরি সাহায্য বোতাম',
  BREATHING_EXERCISE: 'শ্বাস-প্রশ্বাসের ব্যায়াম',
  EMERGENCY_CONTACT: 'জরুরি যোগাযোগ',
  
  // Progress
  DAY_COUNTER: 'দিন গণনা',
  MONEY_SAVED: 'সাশ্রয়কৃত অর্থ',
  PROGRESS_BAR: 'অগ্রগতি বার',
  MILESTONE_BADGE: 'মাইলস্টোন ব্যাজ',
  
  // Journal
  JOURNAL_ENTRY: 'জার্নাল এন্ট্রি',
  MOOD_SELECTOR: 'মেজাজ নির্বাচক',
  TRIGGER_SELECTOR: 'ট্রিগার নির্বাচক',
  
  // Settings
  NOTIFICATION_TOGGLE: 'বিজ্ঞপ্তি টগল',
  FONT_SIZE_SLIDER: 'ফন্ট সাইজ স্লাইডার',
  HAPTIC_TOGGLE: 'হ্যাপটিক ফিডব্যাক টগল',
  
  // Islamic Content
  DUA_PLAYER: 'দোয়া প্লেয়ার',
  PRAYER_TIME: 'নামাজের সময়',
  QURAN_VERSE: 'কুরআনের আয়াত',
} as const;

/**
 * Accessibility hints in Bangla
 */
export const A11Y_HINTS = {
  TAP_TO_OPEN: 'খুলতে ট্যাপ করুন',
  TAP_TO_EDIT: 'সম্পাদনা করতে ট্যাপ করুন',
  TAP_TO_DELETE: 'মুছে ফেলতে ট্যাপ করুন',
  TAP_TO_TOGGLE: 'টগল করতে ট্যাপ করুন',
  TAP_TO_PLAY: 'চালাতে ট্যাপ করুন',
  TAP_TO_CALL: 'কল করতে ট্যাপ করুন',
  DOUBLE_TAP_TO_ACTIVATE: 'সক্রিয় করতে দুইবার ট্যাপ করুন',
  SWIPE_TO_NAVIGATE: 'নেভিগেট করতে সোয়াইপ করুন',
  ADJUST_SLIDER: 'মান পরিবর্তন করতে সোয়াইপ করুন',
} as const;

/**
 * Semantic roles for screen readers
 */
export const A11Y_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  HEADER: 'header',
  TEXT: 'text',
  IMAGE: 'image',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SWITCH: 'switch',
  SLIDER: 'adjustable',
  TAB: 'tab',
  MENU: 'menu',
  ALERT: 'alert',
} as const;

/**
 * Accessibility states
 */
export const A11Y_STATES = {
  SELECTED: 'নির্বাচিত',
  NOT_SELECTED: 'নির্বাচিত নয়',
  CHECKED: 'চেক করা',
  UNCHECKED: 'চেক করা নয়',
  ENABLED: 'সক্রিয়',
  DISABLED: 'নিষ্ক্রিয়',
  EXPANDED: 'প্রসারিত',
  COLLAPSED: 'সংকুচিত',
} as const;
