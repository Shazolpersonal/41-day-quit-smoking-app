import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/* eslint-disable no-console */

/**
 * Prayer times for a day
 */
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

/**
 * Next prayer information
 */
export interface NextPrayer {
  name: string;
  nameArabic: string;
  nameBangla: string;
  time: string;
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

/**
 * Location coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Prayer Time Service
 * Calculates Islamic prayer times based on location using astronomical algorithms
 * Implements the calculation method used by Islamic Foundation Bangladesh
 */
class PrayerTimeService {
  // Default location (Dhaka, Bangladesh)
  private defaultLocation: Coordinates = {
    latitude: 23.8103,
    longitude: 90.4125,
  };

  // Calculation parameters for Bangladesh (Islamic Foundation method)
  private calculationParams = {
    fajrAngle: 18, // Angle below horizon for Fajr
    ishaAngle: 17, // Angle below horizon for Isha
    asrMethod: 1, // 1 = Standard (Shafi), 2 = Hanafi
  };

  /**
   * Request location permissions
   * @returns Promise<boolean> True if permission granted
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'অবস্থান অনুমতি',
            message: 'নামাজের সময় নির্ধারণের জন্য আপনার অবস্থান প্রয়োজন',
            buttonNeutral: 'পরে জিজ্ঞাসা করুন',
            buttonNegative: 'বাতিল',
            buttonPositive: 'অনুমতি দিন',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // iOS permissions are handled through Info.plist
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Get current location coordinates
   * @returns Promise<Coordinates | null> Location coordinates or null on error
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }

  /**
   * Get prayer times for a specific date and location
   * @param date Date object (defaults to today)
   * @param coordinates Location coordinates (defaults to Dhaka)
   * @returns PrayerTimes object with all prayer times
   */
  getPrayerTimes(
    date: Date = new Date(),
    coordinates: Coordinates = this.defaultLocation,
  ): PrayerTimes {
    const { latitude, longitude } = coordinates;

    // Calculate Julian date
    const julianDate = this.getJulianDate(date);

    // Calculate equation of time and solar declination
    const { equationOfTime, solarDeclination } = this.getSolarPosition(julianDate);

    // Calculate prayer times
    const fajrTime = this.calculatePrayerTime(
      date,
      latitude,
      longitude,
      -this.calculationParams.fajrAngle,
      equationOfTime,
      solarDeclination,
    );

    const sunriseTime = this.calculatePrayerTime(
      date,
      latitude,
      longitude,
      -0.833, // Sunrise angle
      equationOfTime,
      solarDeclination,
    );

    const dhuhrTime = this.calculateDhuhrTime(date, longitude, equationOfTime);

    const asrTime = this.calculateAsrTime(
      date,
      latitude,
      longitude,
      equationOfTime,
      solarDeclination,
      this.calculationParams.asrMethod,
    );

    const maghribTime = this.calculatePrayerTime(
      date,
      latitude,
      longitude,
      -0.833, // Sunset angle
      equationOfTime,
      solarDeclination,
      false, // Evening prayer
    );

    const ishaTime = this.calculatePrayerTime(
      date,
      latitude,
      longitude,
      -this.calculationParams.ishaAngle,
      equationOfTime,
      solarDeclination,
      false, // Evening prayer
    );

    return {
      fajr: this.formatTime(fajrTime),
      sunrise: this.formatTime(sunriseTime),
      dhuhr: this.formatTime(dhuhrTime),
      asr: this.formatTime(asrTime),
      maghrib: this.formatTime(maghribTime),
      isha: this.formatTime(ishaTime),
      date: date.toISOString(),
    };
  }

  /**
   * Get prayer times using device location
   * @param date Date object (defaults to today)
   * @returns Promise<PrayerTimes> Prayer times for the location
   */
  async getPrayerTimesWithLocation(date: Date = new Date()): Promise<PrayerTimes> {
    // Check and request permission if needed
    const hasPermission = await this.requestLocationPermission();

    if (!hasPermission) {
      console.log('Location permission denied, using default location (Dhaka)');
      return this.getPrayerTimes(date, this.defaultLocation);
    }

    // Get current location
    const location = await this.getCurrentLocation();

    if (!location) {
      console.log('Could not get location, using default location (Dhaka)');
      return this.getPrayerTimes(date, this.defaultLocation);
    }

    return this.getPrayerTimes(date, location);
  }

  /**
   * Get next prayer time and remaining time
   * @param prayerTimes Prayer times for the day
   * @returns NextPrayer | null Next prayer info or null if all prayers passed
   */
  getNextPrayerTime(prayerTimes: PrayerTimes): NextPrayer | null {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      {
        name: 'Fajr',
        nameArabic: 'الفجر',
        nameBangla: 'ফজর',
        time: prayerTimes.fajr,
      },
      {
        name: 'Sunrise',
        nameArabic: 'الشروق',
        nameBangla: 'সূর্যোদয়',
        time: prayerTimes.sunrise,
      },
      {
        name: 'Dhuhr',
        nameArabic: 'الظهر',
        nameBangla: 'যোহর',
        time: prayerTimes.dhuhr,
      },
      {
        name: 'Asr',
        nameArabic: 'العصر',
        nameBangla: 'আসর',
        time: prayerTimes.asr,
      },
      {
        name: 'Maghrib',
        nameArabic: 'المغرب',
        nameBangla: 'মাগরিব',
        time: prayerTimes.maghrib,
      },
      {
        name: 'Isha',
        nameArabic: 'العشاء',
        nameBangla: 'এশা',
        time: prayerTimes.isha,
      },
    ];

    // Find next prayer
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        const timeRemaining = this.calculateTimeRemaining(prayer.time);
        return {
          ...prayer,
          timeRemaining,
        };
      }
    }

    // All prayers passed, return Fajr for tomorrow
    const tomorrowFajr = prayers[0];
    const timeRemaining = this.calculateTimeRemaining(tomorrowFajr.time, true);

    return {
      ...tomorrowFajr,
      timeRemaining,
    };
  }

  /**
   * Get next prayer using device location
   * @returns Promise<NextPrayer | null> Next prayer info
   */
  async getNextPrayerWithLocation(): Promise<NextPrayer | null> {
    const prayerTimes = await this.getPrayerTimesWithLocation();
    return this.getNextPrayerTime(prayerTimes);
  }

  /**
   * Calculate Julian date
   * @param date Date object
   * @returns Julian date number
   */
  private getJulianDate(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    return jd;
  }

  /**
   * Calculate solar position (equation of time and declination)
   * @param julianDate Julian date
   * @returns Object with equationOfTime and solarDeclination
   */
  private getSolarPosition(julianDate: number): {
    equationOfTime: number;
    solarDeclination: number;
  } {
    const d = julianDate - 2451545.0;
    const g = this.fixAngle(357.529 + 0.98560028 * d);
    const q = this.fixAngle(280.459 + 0.98564736 * d);
    const l = this.fixAngle(q + 1.915 * this.dsin(g) + 0.02 * this.dsin(2 * g));

    const e = 23.439 - 0.00000036 * d;
    const ra = this.darctan2(this.dcos(e) * this.dsin(l), this.dcos(l)) / 15;

    const equationOfTime = q / 15 - ra;
    const solarDeclination = this.darcsin(this.dsin(e) * this.dsin(l));

    return { equationOfTime, solarDeclination };
  }

  /**
   * Calculate prayer time for a given angle
   * @param date Date object
   * @param latitude Latitude
   * @param longitude Longitude
   * @param angle Sun angle below horizon
   * @param equationOfTime Equation of time
   * @param solarDeclination Solar declination
   * @param isMorning True for morning prayers (default true)
   * @returns Time in decimal hours
   */
  private calculatePrayerTime(
    date: Date,
    latitude: number,
    longitude: number,
    angle: number,
    equationOfTime: number,
    solarDeclination: number,
    isMorning: boolean = true,
  ): number {
    const latRad = (latitude * Math.PI) / 180;
    const declRad = (solarDeclination * Math.PI) / 180;
    const angleRad = (angle * Math.PI) / 180;

    const cosH =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
      (Math.cos(latRad) * Math.cos(declRad));

    if (cosH > 1 || cosH < -1) {
      // Prayer time doesn't occur (extreme latitudes)
      return isMorning ? 5 : 19; // Default times
    }

    const h = Math.acos(cosH) * (180 / Math.PI);
    const hourAngle = isMorning ? 360 - h : h;

    const time = (hourAngle / 15) - equationOfTime + (longitude / 15) + (date.getTimezoneOffset() / 60);

    return this.fixHour(time);
  }

  /**
   * Calculate Dhuhr (noon) prayer time
   * @param date Date object
   * @param longitude Longitude
   * @param equationOfTime Equation of time
   * @returns Time in decimal hours
   */
  private calculateDhuhrTime(
    date: Date,
    longitude: number,
    equationOfTime: number,
  ): number {
    const time = 12 - equationOfTime + (longitude / 15) + (date.getTimezoneOffset() / 60);
    return this.fixHour(time);
  }

  /**
   * Calculate Asr prayer time
   * @param date Date object
   * @param latitude Latitude
   * @param longitude Longitude
   * @param equationOfTime Equation of time
   * @param solarDeclination Solar declination
   * @param method 1 = Standard (Shafi), 2 = Hanafi
   * @returns Time in decimal hours
   */
  private calculateAsrTime(
    date: Date,
    latitude: number,
    longitude: number,
    equationOfTime: number,
    solarDeclination: number,
    method: number,
  ): number {
    const latRad = (latitude * Math.PI) / 180;
    const declRad = (solarDeclination * Math.PI) / 180;

    const shadowFactor = method === 1 ? 1 : 2;
    const angle = Math.atan(
      1 / (shadowFactor + Math.tan(Math.abs(latRad - declRad))),
    );

    const cosH =
      (Math.sin(angle) - Math.sin(latRad) * Math.sin(declRad)) /
      (Math.cos(latRad) * Math.cos(declRad));

    if (cosH > 1 || cosH < -1) {
      return 15; // Default Asr time
    }

    const h = Math.acos(cosH) * (180 / Math.PI);
    const time = (h / 15) - equationOfTime + (longitude / 15) + (date.getTimezoneOffset() / 60);

    return this.fixHour(time);
  }

  /**
   * Calculate time remaining until a prayer
   * @param prayerTime Prayer time in HH:MM format
   * @param isTomorrow True if prayer is tomorrow
   * @returns Object with hours, minutes, seconds
   */
  private calculateTimeRemaining(
    prayerTime: string,
    isTomorrow: boolean = false,
  ): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);

    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    if (isTomorrow) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const diff = prayerDate.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);

    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }

  /**
   * Format decimal time to HH:MM string
   * @param time Time in decimal hours
   * @returns Formatted time string
   */
  private formatTime(time: number): string {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Fix angle to be within 0-360 range
   * @param angle Angle in degrees
   * @returns Fixed angle
   */
  private fixAngle(angle: number): number {
    angle = angle % 360;
    return angle < 0 ? angle + 360 : angle;
  }

  /**
   * Fix hour to be within 0-24 range
   * @param hour Hour value
   * @returns Fixed hour
   */
  private fixHour(hour: number): number {
    hour = hour % 24;
    return hour < 0 ? hour + 24 : hour;
  }

  /**
   * Sine function with degree input
   * @param degrees Angle in degrees
   * @returns Sine value
   */
  private dsin(degrees: number): number {
    return Math.sin((degrees * Math.PI) / 180);
  }

  /**
   * Cosine function with degree input
   * @param degrees Angle in degrees
   * @returns Cosine value
   */
  private dcos(degrees: number): number {
    return Math.cos((degrees * Math.PI) / 180);
  }

  /**
   * Arcsine function with degree output
   * @param value Input value
   * @returns Angle in degrees
   */
  private darcsin(value: number): number {
    return (Math.asin(value) * 180) / Math.PI;
  }

  /**
   * Arctangent2 function with degree output
   * @param y Y coordinate
   * @param x X coordinate
   * @returns Angle in degrees
   */
  private darctan2(y: number, x: number): number {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }
}

// Export singleton instance
export const prayerTimeService = new PrayerTimeService();
export default prayerTimeService;
