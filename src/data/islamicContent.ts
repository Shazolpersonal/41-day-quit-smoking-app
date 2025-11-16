/**
 * Islamic Content Data
 * Contains duas, dhikr, motivational quotes, and Quran verses in Bangla
 * For the 41-Day Quit Smoking Program
 */

import { Hadith } from "@/types";

import { Hadith } from "@/types";

import { Hadith } from "@/types";

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  banglaTranslation: string;
  purpose: string;
  benefits: string[];
}

export interface Dhikr {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  banglaTranslation: string;
  count: number;
  benefits: string[];
  timing?: string;
}

export interface IslamicQuote {
  id: string;
  quote: string;
  author?: string;
  category: 'motivation' | 'patience' | 'gratitude' | 'strength' | 'faith';
}

export interface QuranVerse {
  id: string;
  surah: string;
  ayah: string;
  arabic: string;
  banglaTranslation: string;
  context: string;
  relevance: string;
}

/**
 * Common Duas for Craving, Gratitude, and Strength
 */
export const duas: Dua[] = [
  // Duas for Craving/Difficulty
  {
    id: 'dua_craving_1',
    title: 'কঠিন সময়ে দোয়া',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    banglaTranslation: 'আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনি কতই না উত্তম কর্মবিধায়ক।',
    purpose: 'ধূমপানের তীব্র আকাঙ্ক্ষা বা কঠিন মুহূর্তে পড়ুন',
    benefits: [
      'মানসিক শক্তি ও সাহস বৃদ্ধি পায়',
      'আল্লাহর উপর ভরসা বাড়ে',
      'দুশ্চিন্তা ও উদ্বেগ কমে',
      'আত্মবিশ্বাস বৃদ্ধি পায়',
    ],
  },
  {
    id: 'dua_craving_2',
    title: 'সহজতার জন্য দোয়া',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja\'altahu sahla, wa anta taj\'alul hazna idha shi\'ta sahla',
    banglaTranslation: 'হে আল্লাহ! আপনি যা সহজ করে দেন তা ছাড়া কিছুই সহজ নয়। আপনি ইচ্ছা করলে কঠিন বিষয়কেও সহজ করে দিতে পারেন।',
    purpose: 'ধূমপান ত্যাগের কঠিন যাত্রায় সহজতা চাওয়ার জন্য',
    benefits: [
      'কঠিন কাজ সহজ হয়ে যায়',
      'আল্লাহর সাহায্য লাভ হয়',
      'মনোবল বৃদ্ধি পায়',
      'ধৈর্য ধারণ করা সহজ হয়',
    ],
  },
  {
    id: 'dua_craving_3',
    title: 'বিপদ থেকে মুক্তির দোয়া',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    banglaTranslation: 'আপনি ছাড়া কোনো উপাস্য নেই, আপনি পবিত্র, নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।',
    purpose: 'ধূমপানের আসক্তি থেকে মুক্তি পেতে',
    benefits: [
      'সকল বিপদ থেকে মুক্তি পাওয়া যায়',
      'আল্লাহর রহমত লাভ হয়',
      'গুনাহ মাফ হয়',
      'মানসিক প্রশান্তি আসে',
    ],
  },

  // Duas for Gratitude
  {
    id: 'dua_gratitude_1',
    title: 'শুকরিয়ার দোয়া',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    transliteration: 'Alhamdulillahil-ladhi bi ni\'matihi tatimmus-salihat',
    banglaTranslation: 'সমস্ত প্রশংসা আল্লাহর জন্য, যাঁর অনুগ্রহে সকল ভালো কাজ সম্পন্ন হয়।',
    purpose: 'প্রতিদিন ধূমপানমুক্ত থাকার জন্য আল্লাহর শুকরিয়া আদায়',
    benefits: [
      'আল্লাহর নেয়ামত বৃদ্ধি পায়',
      'কৃতজ্ঞতার অনুভূতি বাড়ে',
      'ইতিবাচক মানসিকতা তৈরি হয়',
      'বরকত লাভ হয়',
    ],
  },
  {
    id: 'dua_gratitude_2',
    title: 'সকাল-সন্ধ্যার শুকরিয়া',
    arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: 'Allahumma ma asbaha bi min ni\'matin fa minka wahdaka la sharika laka falakl-hamdu wa lakash-shukr',
    banglaTranslation: 'হে আল্লাহ! আমার যে নেয়ামত রয়েছে তা একমাত্র আপনার পক্ষ থেকে, আপনার কোনো শরীক নেই। সুতরাং সকল প্রশংসা ও কৃতজ্ঞতা আপনারই।',
    purpose: 'সকালে উঠে স্বাস্থ্য ও ধূমপানমুক্ত জীবনের জন্য কৃতজ্ঞতা',
    benefits: [
      'দিনের শুরু ইতিবাচক হয়',
      'আল্লাহর সাথে সম্পর্ক মজবুত হয়',
      'নেয়ামতের মূল্য বোঝা যায়',
      'মানসিক প্রশান্তি আসে',
    ],
  },

  // Duas for Strength
  {
    id: 'dua_strength_1',
    title: 'শক্তি ও সাহসের দোয়া',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-\'ajzi wal-kasal',
    banglaTranslation: 'হে আল্লাহ! আমি আপনার কাছে অক্ষমতা ও অলসতা থেকে আশ্রয় চাই।',
    purpose: 'দুর্বলতা ও অলসতা থেকে বাঁচতে এবং দৃঢ় থাকতে',
    benefits: [
      'শারীরিক ও মানসিক শক্তি বৃদ্ধি পায়',
      'অলসতা দূর হয়',
      'কাজে উৎসাহ আসে',
      'লক্ষ্য অর্জনে সহায়ক',
    ],
  },
  {
    id: 'dua_strength_2',
    title: 'দৃঢ়তার জন্য দোয়া',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
    transliteration: 'Rabbana afrigh \'alayna sabran wa thabbit aqdamana',
    banglaTranslation: 'হে আমাদের রব! আমাদের উপর ধৈর্য ঢেলে দিন এবং আমাদের পা দৃঢ় রাখুন।',
    purpose: 'ধূমপান ত্যাগের যাত্রায় দৃঢ় থাকার জন্য',
    benefits: [
      'ধৈর্য ও সহনশীলতা বৃদ্ধি পায়',
      'প্রলোভনের বিরুদ্ধে দৃঢ় থাকা যায়',
      'মানসিক শক্তি বাড়ে',
      'লক্ষ্যে অটল থাকা সহজ হয়',
    ],
  },
  {
    id: 'dua_strength_3',
    title: 'সাহায্য প্রার্থনার দোয়া',
    arabic: 'رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ',
    transliteration: 'Rabbi a\'inni wa la tu\'in \'alayya',
    banglaTranslation: 'হে আমার রব! আমাকে সাহায্য করুন এবং আমার বিরুদ্ধে সাহায্য করবেন না।',
    purpose: 'আল্লাহর সাহায্য চাওয়ার জন্য',
    benefits: [
      'আল্লাহর সাহায্য লাভ হয়',
      'শত্রুদের থেকে রক্ষা পাওয়া যায়',
      'আত্মবিশ্বাস বৃদ্ধি পায়',
      'সফলতা অর্জন সহজ হয়',
    ],
  },

  // Dua for Protection from Bad Habits
  {
    id: 'dua_protection_1',
    title: 'খারাপ অভ্যাস থেকে রক্ষার দোয়া',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ مُنْكَرَاتِ الْأَخْلَاقِ وَالْأَعْمَالِ وَالْأَهْوَاءِ',
    transliteration: 'Allahumma inni a\'udhu bika min munkaratil-akhlaqi wal-a\'mali wal-ahwa',
    banglaTranslation: 'হে আল্লাহ! আমি আপনার কাছে খারাপ চরিত্র, খারাপ কাজ এবং খারাপ প্রবৃত্তি থেকে আশ্রয় চাই।',
    purpose: 'ধূমপান সহ সকল খারাপ অভ্যাস থেকে বাঁচতে',
    benefits: [
      'খারাপ অভ্যাস থেকে রক্ষা পাওয়া যায়',
      'চরিত্র উন্নত হয়',
      'নফসের নিয়ন্ত্রণ বাড়ে',
      'আল্লাহর সন্তুষ্টি লাভ হয়',
    ],
  },

  // Dua for Tawbah (Repentance)
  {
    id: 'dua_tawbah_1',
    title: 'তওবার দোয়া',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha-lladhi la ilaha illa huwal-hayyul-qayyumu wa atubu ilayh',
    banglaTranslation: 'আমি আল্লাহর কাছে ক্ষমা চাই, যিনি ছাড়া কোনো উপাস্য নেই, যিনি চিরঞ্জীব, চিরস্থায়ী এবং আমি তাঁর কাছে তওবা করছি।',
    purpose: 'ধূমপানের গুনাহ থেকে তওবা করার জন্য',
    benefits: [
      'গুনাহ মাফ হয়',
      'আল্লাহর রহমত লাভ হয়',
      'মানসিক প্রশান্তি আসে',
      'নতুন জীবন শুরু করার সুযোগ',
    ],
  },
];

/**
 * Dhikr with Counts and Benefits
 */
export const dhikrList: Dhikr[] = [
  {
    id: 'dhikr_tasbih',
    title: 'তাসবিহ (সুবহানাল্লাহ)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    banglaTranslation: 'আল্লাহ পবিত্র',
    count: 33,
    benefits: [
      'মনের প্রশান্তি আসে',
      'আল্লাহর নৈকট্য লাভ হয়',
      'গুনাহ মাফ হয়',
      'সওয়াব অর্জন হয়',
    ],
    timing: 'নামাজের পর বা যেকোনো সময়',
  },
  {
    id: 'dhikr_tahmid',
    title: 'তাহমিদ (আলহামদুলিল্লাহ)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    banglaTranslation: 'সকল প্রশংসা আল্লাহর',
    count: 33,
    benefits: [
      'কৃতজ্ঞতার অনুভূতি বৃদ্ধি পায়',
      'নেয়ামত বৃদ্ধি পায়',
      'ইতিবাচক মানসিকতা তৈরি হয়',
      'জান্নাতের বাগান রোপণ হয়',
    ],
    timing: 'নামাজের পর বা যেকোনো সময়',
  },
  {
    id: 'dhikr_takbir',
    title: 'তাকবীর (আল্লাহু আকবার)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    banglaTranslation: 'আল্লাহ সর্বশ্রেষ্ঠ',
    count: 34,
    benefits: [
      'আল্লাহর মহত্ত্ব উপলব্ধি হয়',
      'ভয় ও দুশ্চিন্তা দূর হয়',
      'আত্মবিশ্বাস বৃদ্ধি পায়',
      'শয়তান থেকে রক্ষা পাওয়া যায়',
    ],
    timing: 'নামাজের পর বা যেকোনো সময়',
  },
  {
    id: 'dhikr_istighfar',
    title: 'ইস্তিগফার (আস্তাগফিরুল্লাহ)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    banglaTranslation: 'আমি আল্লাহর কাছে ক্ষমা চাই',
    count: 100,
    benefits: [
      'গুনাহ মাফ হয়',
      'রিজিক বৃদ্ধি পায়',
      'সমস্যার সমাধান হয়',
      'মানসিক প্রশান্তি আসে',
    ],
    timing: 'দিনে যেকোনো সময়, বিশেষত সকাল-সন্ধ্যা',
  },
  {
    id: 'dhikr_durood',
    title: 'দরূদ শরীফ',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad',
    banglaTranslation: 'হে আল্লাহ! মুহাম্মদ (সা.) এবং তাঁর পরিবারের উপর রহমত বর্ষণ করুন',
    count: 10,
    benefits: [
      'আল্লাহর রহমত লাভ হয়',
      'দশটি সওয়াব পাওয়া যায়',
      'দশটি গুনাহ মাফ হয়',
      'দশটি মর্যাদা বৃদ্ধি পায়',
    ],
    timing: 'দিনে যেকোনো সময়',
  },
  {
    id: 'dhikr_la_ilaha',
    title: 'কালিমা তাইয়্যিবা',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
    transliteration: 'La ilaha illallahu Muhammadur Rasulullah',
    banglaTranslation: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, মুহাম্মদ (সা.) আল্লাহর রাসূল',
    count: 100,
    benefits: [
      'ঈমান মজবুত হয়',
      'জান্নাতের চাবি',
      'সর্বোচ্চ সওয়াব',
      'শয়তান থেকে রক্ষা',
    ],
    timing: 'সর্বদা',
  },
  {
    id: 'dhikr_la_hawla',
    title: 'লা হাওলা ওয়ালা কুওয়াতা',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    banglaTranslation: 'আল্লাহর সাহায্য ছাড়া কোনো শক্তি ও সামর্থ্য নেই',
    count: 10,
    benefits: [
      'কঠিন কাজ সহজ হয়',
      'জান্নাতের ভাণ্ডার',
      'দুশ্চিন্তা দূর হয়',
      'আল্লাহর উপর ভরসা বাড়ে',
    ],
    timing: 'বিপদ বা কঠিন সময়ে',
  },
  {
    id: 'dhikr_ayatul_kursi',
    title: 'আয়াতুল কুরসি',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allahu la ilaha illa huwal hayyul qayyum...',
    banglaTranslation: 'আল্লাহ, তিনি ছাড়া কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক...',
    count: 1,
    benefits: [
      'সকল বিপদ থেকে রক্ষা',
      'শয়তান থেকে রক্ষা',
      'জান্নাতের দরজা খোলে',
      'সর্বোচ্চ আয়াত',
    ],
    timing: 'নামাজের পর, ঘুমানোর আগে',
  },
];

/**
 * Motivational Islamic Quotes in Bangla
 */
export const islamicQuotes: IslamicQuote[] = [
  // Motivation
  {
    id: 'quote_motivation_1',
    quote: 'আল্লাহ কখনো তাঁর বান্দাকে একা ছেড়ে দেন না। যখন তুমি আল্লাহর দিকে এক পা এগিয়ে যাও, আল্লাহ তোমার দিকে দশ পা এগিয়ে আসেন।',
    category: 'motivation',
  },
  {
    id: 'quote_motivation_2',
    quote: 'প্রতিটি কঠিন সময়ের পরে সহজতা আসে। আল্লাহ বলেন, "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।" (সূরা ইনশিরাহ: ৫-৬)',
    category: 'motivation',
  },
  {
    id: 'quote_motivation_3',
    quote: 'তুমি যদি আল্লাহর জন্য কিছু ত্যাগ করো, আল্লাহ তোমাকে তার চেয়ে উত্তম কিছু দান করবেন।',
    category: 'motivation',
  },
  {
    id: 'quote_motivation_4',
    quote: 'ধূমপান ত্যাগ করা শুধু একটি স্বাস্থ্য সিদ্ধান্ত নয়, এটি আল্লাহর সন্তুষ্টি অর্জনের একটি পথ।',
    category: 'motivation',
  },
  {
    id: 'quote_motivation_5',
    quote: 'প্রতিটি সিগারেট যা তুমি প্রত্যাখ্যান করো, তা তোমার ঈমান ও ইচ্ছাশক্তির বিজয়।',
    category: 'motivation',
  },
  {
    id: 'quote_motivation_6',
    quote: 'আল্লাহ তোমাকে যে শরীর দিয়েছেন, তা একটি আমানত। এর যত্ন নেওয়া তোমার দায়িত্ব।',
    category: 'motivation',
  },

  // Patience (Sabr)
  {
    id: 'quote_patience_1',
    quote: 'ধৈর্য অর্ধেক ঈমান। যে ধৈর্য ধারণ করে, আল্লাহ তার সাথে থাকেন।',
    category: 'patience',
  },
  {
    id: 'quote_patience_2',
    quote: 'রাসূলুল্লাহ (সা.) বলেছেন, "ধৈর্যশীল ব্যক্তির জন্য আল্লাহ যে পুরস্কার রেখেছেন তা অসাধারণ।"',
    category: 'patience',
  },
  {
    id: 'quote_patience_3',
    quote: 'ধূমপানের আকাঙ্ক্ষা সাময়িক, কিন্তু ধৈর্যের পুরস্কার চিরস্থায়ী।',
    category: 'patience',
  },
  {
    id: 'quote_patience_4',
    quote: 'আল্লাহ বলেন, "হে ঈমানদারগণ! তোমরা ধৈর্য ও নামাজের মাধ্যমে সাহায্য চাও।" (সূরা বাকারা: ১৫৩)',
    category: 'patience',
  },
  {
    id: 'quote_patience_5',
    quote: 'প্রতিটি কঠিন মুহূর্ত তোমাকে আরও শক্তিশালী করছে। ধৈর্য ধরো, আল্লাহ তোমার সাথে আছেন।',
    category: 'patience',
  },

  // Gratitude (Shukr)
  {
    id: 'quote_gratitude_1',
    quote: 'আল্লাহ বলেন, "যদি তোমরা কৃতজ্ঞ হও, আমি অবশ্যই তোমাদের নেয়ামত বাড়িয়ে দেব।" (সূরা ইবরাহীম: ৭)',
    category: 'gratitude',
  },
  {
    id: 'quote_gratitude_2',
    quote: 'প্রতিদিন ধূমপানমুক্ত থাকার জন্য আল্লাহর শুকরিয়া আদায় করো। এটি একটি বিশাল নেয়ামত।',
    category: 'gratitude',
  },
  {
    id: 'quote_gratitude_3',
    quote: 'কৃতজ্ঞতা হলো সুখের চাবি। যে আল্লাহর নেয়ামতের কৃতজ্ঞতা করে, সে সর্বদা সুখী থাকে।',
    category: 'gratitude',
  },
  {
    id: 'quote_gratitude_4',
    quote: 'আলহামদুলিল্লাহ বলো প্রতিটি ছোট-বড় নেয়ামতের জন্য। স্বাস্থ্য, পরিবার, এবং ধূমপানমুক্ত জীবন।',
    category: 'gratitude',
  },
  {
    id: 'quote_gratitude_5',
    quote: 'রাসূলুল্লাহ (সা.) বলেছেন, "যে মানুষের কৃতজ্ঞতা করে না, সে আল্লাহর কৃতজ্ঞতাও করে না।"',
    category: 'gratitude',
  },

  // Strength (Quwwah)
  {
    id: 'quote_strength_1',
    quote: 'শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে আল্লাহর কাছে বেশি প্রিয়। তোমার শরীর ও মনকে শক্তিশালী করো।',
    category: 'strength',
  },
  {
    id: 'quote_strength_2',
    quote: 'তুমি যতটা মনে করো তার চেয়ে অনেক বেশি শক্তিশালী। আল্লাহ তোমাকে এই শক্তি দিয়েছেন।',
    category: 'strength',
  },
  {
    id: 'quote_strength_3',
    quote: 'ধূমপান ত্যাগ করা তোমার শক্তির প্রমাণ, দুর্বলতার নয়। তুমি একজন যোদ্ধা।',
    category: 'strength',
  },
  {
    id: 'quote_strength_4',
    quote: 'আল্লাহ বলেন, "আমি তোমাদের সাথে আছি।" এর চেয়ে বড় শক্তি আর কী হতে পারে?',
    category: 'strength',
  },
  {
    id: 'quote_strength_5',
    quote: 'প্রতিটি প্রলোভন প্রত্যাখ্যান করা তোমার ইচ্ছাশক্তিকে আরও শক্তিশালী করে।',
    category: 'strength',
  },

  // Faith (Iman)
  {
    id: 'quote_faith_1',
    quote: 'ঈমান হলো আল্লাহর উপর পূর্ণ বিশ্বাস। বিশ্বাস করো যে তিনি তোমাকে সাহায্য করবেন।',
    category: 'faith',
  },
  {
    id: 'quote_faith_2',
    quote: 'আল্লাহ বলেন, "তোমরা আমাকে স্মরণ করো, আমি তোমাদের স্মরণ করব।" (সূরা বাকারা: ১৫২)',
    category: 'faith',
  },
  {
    id: 'quote_faith_3',
    quote: 'তোমার শরীর আল্লাহর আমানত। এর যত্ন নেওয়া ঈমানের অংশ।',
    category: 'faith',
  },
  {
    id: 'quote_faith_4',
    quote: 'রাসূলুল্লাহ (সা.) বলেছেন, "আল্লাহর উপর ভরসা করো, তিনি তোমার জন্য যথেষ্ট।"',
    category: 'faith',
  },
  {
    id: 'quote_faith_5',
    quote: 'ধূমপান ত্যাগ করা শুধু একটি শারীরিক যুদ্ধ নয়, এটি একটি আধ্যাত্মিক যাত্রা।',
    category: 'faith',
  },
];

/**
 * Relevant Quran Verses with Bangla Translations
 */
export const quranVerses: QuranVerse[] = [
  {
    id: 'verse_patience_1',
    surah: 'সূরা বাকারা',
    ayah: '১৫৩',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    banglaTranslation: 'হে ঈমানদারগণ! তোমরা ধৈর্য ও নামাজের মাধ্যমে সাহায্য চাও। নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
    context: 'ধৈর্য ও নামাজের গুরুত্ব',
    relevance: 'ধূমপান ত্যাগের কঠিন যাত্রায় ধৈর্য ও নামাজের মাধ্যমে আল্লাহর সাহায্য চাওয়া',
  },
  {
    id: 'verse_ease_1',
    surah: 'সূরা ইনশিরাহ',
    ayah: '৫-৬',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    banglaTranslation: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে। নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
    context: 'কষ্টের পর স্বস্তি',
    relevance: 'প্রত্যাহারের কঠিন সময়ের পর স্বস্থতা ও সুখ আসবে',
  },
  {
    id: 'verse_gratitude_1',
    surah: 'সূরা ইবরাহীম',
    ayah: '৭',
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    banglaTranslation: 'যদি তোমরা কৃতজ্ঞ হও, আমি অবশ্যই তোমাদের নেয়ামত বাড়িয়ে দেব।',
    context: 'কৃতজ্ঞতার পুরস্কার',
    relevance: 'ধূমপানমুক্ত জীবনের জন্য আল্লাহর শুকরিয়া আদায় করলে আরও নেয়ামত পাওয়া যাবে',
  },
  {
    id: 'verse_remembrance_1',
    surah: 'সূরা রা\'দ',
    ayah: '২৮',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    banglaTranslation: 'জেনে রাখো, আল্লাহর যিকিরেই অন্তরসমূহ প্রশান্ত হয়।',
    context: 'আল্লাহর স্মরণে প্রশান্তি',
    relevance: 'মানসিক চাপ ও ধূমপানের আকাঙ্ক্ষায় আল্লাহর যিকির মনে প্রশান্তি আনে',
  },
  {
    id: 'verse_help_1',
    surah: 'সূরা বাকারা',
    ayah: '২৮৬',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    banglaTranslation: 'আল্লাহ কাউকে তার সাধ্যের বাইরে দায়িত্ব দেন না।',
    context: 'আল্লাহর রহমত',
    relevance: 'আল্লাহ জানেন তুমি ধূমপান ত্যাগ করতে সক্ষম, তাই তিনি তোমাকে এই পথ দেখিয়েছেন',
  },
  {
    id: 'verse_trust_1',
    surah: 'সূরা তালাক',
    ayah: '৩',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    banglaTranslation: 'যে আল্লাহর উপর ভরসা করে, আল্লাহই তার জন্য যথেষ্ট।',
    context: 'আল্লাহর উপর ভরসা',
    relevance: 'ধূমপান ত্যাগের যাত্রায় আল্লাহর উপর পূর্ণ ভরসা রাখা',
  },
  {
    id: 'verse_protection_1',
    surah: 'সূরা আল-ইমরান',
    ayah: '১৭৩',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    banglaTranslation: 'আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনি কতই না উত্তম কর্মবিধায়ক।',
    context: 'আল্লাহর উপর নির্ভরতা',
    relevance: 'কঠিন মুহূর্তে আল্লাহই যথেষ্ট, তাঁর উপর ভরসা করা',
  },
  {
    id: 'verse_repentance_1',
    surah: 'সূরা যুমার',
    ayah: '৫৩',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    banglaTranslation: 'বলুন, হে আমার বান্দারা! যারা নিজেদের উপর বাড়াবাড়ি করেছ, তোমরা আল্লাহর রহমত থেকে নিরাশ হয়ো না।',
    context: 'আল্লাহর ক্ষমা',
    relevance: 'ধূমপানের গুনাহ থেকে তওবা করলে আল্লাহ ক্ষমা করবেন',
  },
  {
    id: 'verse_success_1',
    surah: 'সূরা আল-মুমিনুন',
    ayah: '১',
    arabic: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ',
    banglaTranslation: 'নিশ্চয়ই মুমিনগণ সফল হয়েছে।',
    context: 'মুমিনদের সফলতা',
    relevance: 'ঈমানদার হিসেবে ধূমপান ত্যাগে সফল হওয়া',
  },
  {
    id: 'verse_health_1',
    surah: 'সূরা বাকারা',
    ayah: '১৯৫',
    arabic: 'وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ',
    banglaTranslation: 'তোমরা নিজেদেরকে ধ্বংসের মুখে ঠেলে দিও না।',
    context: 'আত্মধ্বংস থেকে বিরত থাকা',
    relevance: 'ধূমপান স্বাস্থ্যের জন্য ক্ষতিকর, তাই এটি ত্যাগ করা ফরজ',
  },
  {
    id: 'verse_strength_1',
    surah: 'সূরা আনফাল',
    ayah: '৪৬',
    arabic: 'وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    banglaTranslation: 'এবং ধৈর্য ধারণ করো, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
    context: 'ধৈর্যের সাথে আল্লাহর সাহায্য',
    relevance: 'ধূমপান ত্যাগের কঠিন সময়ে ধৈর্য ধরলে আল্লাহ সাহায্য করবেন',
  },
];

/**
 * Hadith Collection - Related to Health and Perseverance
 */
export const hadithCollection: Hadith[] = [
  // Health-related Hadith
  {
    id: 'hadith_health_1',
    arabic: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ',
    banglaTranslation: 'দুটি নেয়ামত এমন যাতে অনেক মানুষ ক্ষতিগ্রস্ত: স্বাস্থ্য এবং অবসর সময়।',
    source: 'সহীহ বুখারী',
    reference: 'হাদীস নং ৬৪১২',
    category: 'health',
    relevance: 'স্বাস্থ্য একটি মহান নেয়ামত যার যত্ন নেওয়া আমাদের দায়িত্ব',
  },
  {
    id: 'hadith_health_2',
    arabic: 'إِنَّ لِجَسَدِكَ عَلَيْكَ حَقًّا',
    banglaTranslation: 'নিশ্চয়ই তোমার শরীরের তোমার উপর অধিকার রয়েছে।',
    source: 'সহীহ বুখারী',
    reference: 'হাদীস নং ১৯৭৫',
    category: 'health',
    relevance: 'শরীরের যত্ন নেওয়া এবং ক্ষতিকর জিনিস থেকে বিরত থাকা আমাদের দায়িত্ব',
  },
  {
    id: 'hadith_health_3',
    arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ',
    banglaTranslation: 'নিজের বা অন্যের ক্ষতি করা যাবে না।',
    source: 'সুনান ইবনে মাজাহ',
    reference: 'হাদীস নং ২৩৪০',
    category: 'health',
    relevance: 'ধূমপান নিজের এবং অন্যদের ক্ষতি করে, তাই এটি ত্যাগ করা জরুরি',
  },
  {
    id: 'hadith_health_4',
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    banglaTranslation: 'শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে উত্তম এবং আল্লাহর কাছে বেশি প্রিয়।',
    source: 'সহীহ মুসলিম',
    reference: 'হাদীস নং ২৬৬৪',
    category: 'health',
    relevance: 'শারীরিক ও মানসিক শক্তি বৃদ্ধি করা এবং স্বাস্থ্যকর জীবনযাপন করা',
  },

  // Perseverance and Patience
  {
    id: 'hadith_patience_1',
    arabic: 'وَمَنْ يَتَصَبَّرْ يُصَبِّرْهُ اللَّهُ',
    banglaTranslation: 'যে ধৈর্য ধারণ করার চেষ্টা করে, আল্লাহ তাকে ধৈর্যশীল করে দেন।',
    source: 'সহীহ বুখারী',
    reference: 'হাদীস নং ১৪৬৯',
    category: 'patience',
    relevance: 'ধূমপান ত্যাগের কঠিন সময়ে ধৈর্য ধরলে আল্লাহ সাহায্য করবেন',
  },
  {
    id: 'hadith_patience_2',
    arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
    banglaTranslation: 'মুমিনের ব্যাপারটি আশ্চর্যজনক! তার সব বিষয়ই কল্যাণকর।',
    source: 'সহীহ মুসলিম',
    reference: 'হাদীস নং ২৯৯৯',
    category: 'patience',
    relevance: 'কঠিন সময়েও ধৈর্য ধরলে তাতে কল্যাণ রয়েছে',
  },
  {
    id: 'hadith_patience_3',
    arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    banglaTranslation: 'মুসলিমের যে কোনো কষ্ট, ক্লান্তি, দুশ্চিন্তা, দুঃখ, কষ্ট বা পেরেশানি এমনকি কাঁটার খোঁচা পর্যন্ত - আল্লাহ এর দ্বারা তার গুনাহ মাফ করে দেন।',
    source: 'সহীহ বুখারী',
    reference: 'হাদীস নং ৫৬৪২',
    category: 'patience',
    relevance: 'প্রত্যাহারের কষ্ট সহ্য করলে গুনাহ মাফ হয় এবং সওয়াব পাওয়া যায়',
  },

  // Determination and Willpower
  {
    id: 'hadith_determination_1',
    arabic: 'احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجَزْ',
    banglaTranslation: 'যা তোমার উপকারী তার জন্য চেষ্টা করো, আল্লাহর সাহায্য চাও এবং অক্ষম হয়ো না।',
    source: 'সহীহ মুসলিম',
    reference: 'হাদীস নং ২৬৬৪',
    category: 'determination',
    relevance: 'ধূমপান ত্যাগের জন্য দৃঢ় সংকল্প এবং আল্লাহর সাহায্য চাওয়া',
  },
  {
    id: 'hadith_determination_2',
    arabic: 'إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ',
    banglaTranslation: 'আল্লাহ পছন্দ করেন যখন তোমাদের কেউ কোনো কাজ করে, তখন যেন তা সুন্দরভাবে সম্পন্ন করে।',
    source: 'শুআবুল ঈমান',
    reference: 'হাদীস নং ৪৯৩৪',
    category: 'determination',
    relevance: 'ধূমপান ত্যাগের কাজটি পূর্ণ দৃঢ়তার সাথে সম্পন্ন করা',
  },

  // Repentance and Change
  {
    id: 'hadith_repentance_1',
    arabic: 'كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
    banglaTranslation: 'প্রতিটি আদম সন্তান ভুল করে এবং ভুলকারীদের মধ্যে সর্বোত্তম হলো তওবাকারীরা।',
    source: 'সুনান ইবনে মাজাহ',
    reference: 'হাদীস নং ৪২৫১',
    category: 'repentance',
    relevance: 'ধূমপানের গুনাহ থেকে তওবা করা এবং নতুন জীবন শুরু করা',
  },
  {
    id: 'hadith_repentance_2',
    arabic: 'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لَا ذَنْبَ لَهُ',
    banglaTranslation: 'গুনাহ থেকে তওবাকারী এমন ব্যক্তির মতো যার কোনো গুনাহ নেই।',
    source: 'সুনান ইবনে মাজাহ',
    reference: 'হাদীস নং ৪২৫০',
    category: 'repentance',
    relevance: 'ধূমপান ত্যাগ করা এবং তওবা করলে আল্লাহ ক্ষমা করে দেন',
  },

  // Gratitude
  {
    id: 'hadith_gratitude_1',
    arabic: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    banglaTranslation: 'যে মানুষের কৃতজ্ঞতা প্রকাশ করে না, সে আল্লাহর কৃতজ্ঞতাও প্রকাশ করে না।',
    source: 'সুনান আবু দাউদ',
    reference: 'হাদীস নং ৪৮১১',
    category: 'gratitude',
    relevance: 'স্বাস্থ্য এবং ধূমপানমুক্ত জীবনের জন্য আল্লাহর শুকরিয়া আদায়',
  },
];

/**
 * Helper Functions
 */

// Get random dua
export const getRandomDua = (): Dua => {
  return duas[Math.floor(Math.random() * duas.length)];
};

// Get dua by purpose
export const getDuaByPurpose = (purpose: string): Dua[] => {
  return duas.filter(dua => 
    dua.purpose.toLowerCase().includes(purpose.toLowerCase())
  );
};

// Get random dhikr
export const getRandomDhikr = (): Dhikr => {
  return dhikrList[Math.floor(Math.random() * dhikrList.length)];
};

// Get dhikr for specific timing
export const getDhikrByTiming = (timing: string): Dhikr[] => {
  return dhikrList.filter(dhikr => 
    dhikr.timing?.toLowerCase().includes(timing.toLowerCase())
  );
};

// Get random quote
export const getRandomQuote = (): IslamicQuote => {
  return islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
};

// Get quotes by category
export const getQuotesByCategory = (
  category: 'motivation' | 'patience' | 'gratitude' | 'strength' | 'faith'
): IslamicQuote[] => {
  return islamicQuotes.filter(quote => quote.category === category);
};

// Get random Quran verse
export const getRandomQuranVerse = (): QuranVerse => {
  return quranVerses[Math.floor(Math.random() * quranVerses.length)];
};

// Get verse by relevance
export const getVerseByRelevance = (keyword: string): QuranVerse[] => {
  return quranVerses.filter(verse => 
    verse.relevance.toLowerCase().includes(keyword.toLowerCase()) ||
    verse.context.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Get random hadith
export const getRandomHadith = (): Hadith => {
  return hadithCollection[Math.floor(Math.random() * hadithCollection.length)];
};

// Get hadith by category
export const getHadithByCategory = (
  category: 'health' | 'patience' | 'determination' | 'repentance' | 'gratitude'
): Hadith[] => {
  return hadithCollection.filter(hadith => hadith.category === category);
};

// Get daily Islamic content (combination of dua, dhikr, quote, verse, and hadith)
export const getDailyIslamicContent = () => {
  return {
    dua: getRandomDua(),
    dhikr: getRandomDhikr(),
    quote: getRandomQuote(),
    verse: getRandomQuranVerse(),
    hadith: getRandomHadith(),
  };
};
