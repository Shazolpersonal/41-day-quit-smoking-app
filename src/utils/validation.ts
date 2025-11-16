/**
 * Validation Utilities
 * Form validation and data validation functions
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate user onboarding data
 */
export function validateOnboardingData(data: {
  quitDate: string;
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate quit date
  if (!data.quitDate) {
    errors.quitDate = 'ধূমপান ছাড়ার তারিখ প্রয়োজন';
  } else {
    const quitDate = new Date(data.quitDate);
    const now = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + 7); // Max 7 days in future

    if (isNaN(quitDate.getTime())) {
      errors.quitDate = 'সঠিক তারিখ প্রদান করুন';
    } else if (quitDate > maxFutureDate) {
      errors.quitDate = 'তারিখ ভবিষ্যতে খুব বেশি দূরে হতে পারে না';
    }
  }

  // Validate cigarettes per day
  if (data.cigarettesPerDay === undefined || data.cigarettesPerDay === null) {
    errors.cigarettesPerDay = 'দৈনিক সিগারেটের সংখ্যা প্রয়োজন';
  } else if (data.cigarettesPerDay < 1) {
    errors.cigarettesPerDay = 'কমপক্ষে ১টি সিগারেট হতে হবে';
  } else if (data.cigarettesPerDay > 100) {
    errors.cigarettesPerDay = 'সংখ্যা খুব বেশি মনে হচ্ছে। অনুগ্রহ করে পরীক্ষা করুন';
  }

  // Validate price per pack
  if (data.pricePerPack === undefined || data.pricePerPack === null) {
    errors.pricePerPack = 'প্যাকেটের দাম প্রয়োজন';
  } else if (data.pricePerPack < 1) {
    errors.pricePerPack = 'দাম ০ এর বেশি হতে হবে';
  } else if (data.pricePerPack > 10000) {
    errors.pricePerPack = 'দাম খুব বেশি মনে হচ্ছে। অনুগ্রহ করে পরীক্ষা করুন';
  }

  // Validate cigarettes per pack
  if (data.cigarettesPerPack === undefined || data.cigarettesPerPack === null) {
    errors.cigarettesPerPack = 'প্যাকেটে সিগারেটের সংখ্যা প্রয়োজন';
  } else if (data.cigarettesPerPack < 1) {
    errors.cigarettesPerPack = 'কমপক্ষে ১টি সিগারেট হতে হবে';
  } else if (data.cigarettesPerPack > 100) {
    errors.cigarettesPerPack = 'সংখ্যা খুব বেশি মনে হচ্ছে। অনুগ্রহ করে পরীক্ষা করুন';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate journal entry data
 */
export function validateJournalEntry(data: {
  content: string;
  mood?: string;
  triggers?: string[];
  cravingIntensity?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate content
  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'জার্নাল এন্ট্রি খালি হতে পারে না';
  } else if (data.content.length > 5000) {
    errors.content = 'জার্নাল এন্ট্রি খুব দীর্ঘ (সর্বোচ্চ ৫০০০ অক্ষর)';
  }

  // Validate craving intensity if provided
  if (data.cravingIntensity !== undefined && data.cravingIntensity !== null) {
    if (data.cravingIntensity < 1 || data.cravingIntensity > 10) {
      errors.cravingIntensity = 'ক্রেভিং তীব্রতা ১ থেকে ১০ এর মধ্যে হতে হবে';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate emergency contact data
 */
export function validateEmergencyContact(data: {
  name: string;
  phone: string;
  relationship: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'নাম প্রয়োজন';
  } else if (data.name.length > 100) {
    errors.name = 'নাম খুব দীর্ঘ';
  }

  // Validate phone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'ফোন নম্বর প্রয়োজন';
  } else if (!isValidPhoneNumber(data.phone)) {
    errors.phone = 'সঠিক ফোন নম্বর প্রদান করুন';
  }

  // Validate relationship
  if (!data.relationship || data.relationship.trim().length === 0) {
    errors.relationship = 'সম্পর্ক প্রয়োজন';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate phone number (Bangladesh format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');

  // Bangladesh phone number patterns:
  // 01XXXXXXXXX (11 digits)
  // +8801XXXXXXXXX (14 digits with country code)
  // 8801XXXXXXXXX (13 digits with country code)
  const patterns = [
    /^01[3-9]\d{8}$/, // 01XXXXXXXXX
    /^\+8801[3-9]\d{8}$/, // +8801XXXXXXXXX
    /^8801[3-9]\d{8}$/, // 8801XXXXXXXXX
  ];

  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Validate PIN code
 */
export function validatePIN(pin: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!pin) {
    errors.pin = 'পিন কোড প্রয়োজন';
  } else if (pin.length !== 4) {
    errors.pin = 'পিন কোড ৪ সংখ্যার হতে হবে';
  } else if (!/^\d{4}$/.test(pin)) {
    errors.pin = 'পিন কোড শুধুমাত্র সংখ্যা হতে হবে';
  } else if (/^(\d)\1{3}$/.test(pin)) {
    errors.pin = 'পিন কোড খুব সহজ (একই সংখ্যা ব্যবহার করবেন না)';
  } else if (pin === '1234' || pin === '0000' || pin === '1111') {
    errors.pin = 'পিন কোড খুব সহজ। আরও জটিল পিন ব্যবহার করুন';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate settings data
 */
export function validateSettings(data: {
  dailyReminderTime?: string;
  fontSize?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate daily reminder time if provided
  if (data.dailyReminderTime) {
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.dailyReminderTime)) {
      errors.dailyReminderTime = 'সঠিক সময় ফরম্যাট ব্যবহার করুন (HH:MM)';
    }
  }

  // Validate font size if provided
  if (data.fontSize) {
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(data.fontSize)) {
      errors.fontSize = 'সঠিক ফন্ট সাইজ নির্বাচন করুন';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize user input (remove potentially harmful content)
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove leading/trailing whitespace
  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

/**
 * Validate number input
 */
export function validateNumber(
  value: any,
  min?: number,
  max?: number,
  fieldName: string = 'মান'
): ValidationResult {
  const errors: Record<string, string> = {};

  if (value === undefined || value === null || value === '') {
    errors.value = `${fieldName} প্রয়োজন`;
  } else {
    const num = Number(value);

    if (isNaN(num)) {
      errors.value = `${fieldName} একটি সংখ্যা হতে হবে`;
    } else {
      if (min !== undefined && num < min) {
        errors.value = `${fieldName} কমপক্ষে ${min} হতে হবে`;
      }
      if (max !== undefined && num > max) {
        errors.value = `${fieldName} সর্বোচ্চ ${max} হতে পারে`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate date input
 */
export function validateDate(
  dateString: string,
  allowFuture: boolean = false,
  fieldName: string = 'তারিখ'
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!dateString) {
    errors.date = `${fieldName} প্রয়োজন`;
  } else {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      errors.date = `সঠিক ${fieldName} প্রদান করুন`;
    } else if (!allowFuture && date > new Date()) {
      errors.date = `${fieldName} ভবিষ্যতে হতে পারে না`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
