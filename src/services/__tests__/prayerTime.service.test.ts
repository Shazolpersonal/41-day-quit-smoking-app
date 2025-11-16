import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { prayerTimeService, Coordinates } from '../prayerTime.service';

// Mock react-native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

describe('PrayerTimeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('should request location permission on Android', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('granted');

      const result = await prayerTimeService.requestLocationPermission();

      expect(result).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        'android.permission.ACCESS_FINE_LOCATION',
        expect.objectContaining({
          title: 'অবস্থান অনুমতি',
        }),
      );
    });

    it('should return false when permission is denied', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('denied');

      const result = await prayerTimeService.requestLocationPermission();

      expect(result).toBe(false);
    });

    it('should handle permission request errors', async () => {
      (PermissionsAndroid.request as jest.Mock).mockRejectedValueOnce(
        new Error('Permission error'),
      );

      const result = await prayerTimeService.requestLocationPermission();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('should get current location successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: 23.8103,
          longitude: 90.4125,
        },
      };

      (Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
        (success) => success(mockPosition),
      );

      const result = await prayerTimeService.getCurrentLocation();

      expect(result).toEqual({
        latitude: 23.8103,
        longitude: 90.4125,
      });
    });

    it('should return null on location error', async () => {
      (Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
        (success, error) => error(new Error('Location error')),
      );

      const result = await prayerTimeService.getCurrentLocation();

      expect(result).toBeNull();
    });
  });

  describe('getPrayerTimes', () => {
    it('should calculate prayer times for Dhaka', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      expect(prayerTimes).toHaveProperty('fajr');
      expect(prayerTimes).toHaveProperty('sunrise');
      expect(prayerTimes).toHaveProperty('dhuhr');
      expect(prayerTimes).toHaveProperty('asr');
      expect(prayerTimes).toHaveProperty('maghrib');
      expect(prayerTimes).toHaveProperty('isha');
      expect(prayerTimes).toHaveProperty('date');

      // Verify time format (HH:MM)
      expect(prayerTimes.fajr).toMatch(/^\d{2}:\d{2}$/);
      expect(prayerTimes.dhuhr).toMatch(/^\d{2}:\d{2}$/);
      expect(prayerTimes.asr).toMatch(/^\d{2}:\d{2}$/);
      expect(prayerTimes.maghrib).toMatch(/^\d{2}:\d{2}$/);
      expect(prayerTimes.isha).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should calculate prayer times for different locations', () => {
      const date = new Date('2024-06-15T12:00:00.000Z');
      const mecca: Coordinates = { latitude: 21.4225, longitude: 39.8262 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, mecca);

      expect(prayerTimes.fajr).toBeDefined();
      expect(prayerTimes.dhuhr).toBeDefined();
      expect(prayerTimes.asr).toBeDefined();
      expect(prayerTimes.maghrib).toBeDefined();
      expect(prayerTimes.isha).toBeDefined();
    });

    it('should use default location when coordinates not provided', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');

      const prayerTimes = prayerTimeService.getPrayerTimes(date);

      expect(prayerTimes).toBeDefined();
      expect(prayerTimes.fajr).toBeDefined();
    });

    it('should calculate different times for different dates', () => {
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };
      const winter = new Date('2024-01-15T12:00:00.000Z');
      const summer = new Date('2024-06-15T12:00:00.000Z');

      const winterTimes = prayerTimeService.getPrayerTimes(winter, dhaka);
      const summerTimes = prayerTimeService.getPrayerTimes(summer, dhaka);

      // Prayer times should be different in winter vs summer
      expect(winterTimes.fajr).not.toBe(summerTimes.fajr);
      expect(winterTimes.maghrib).not.toBe(summerTimes.maghrib);
    });
  });

  describe('getPrayerTimesWithLocation', () => {
    it('should get prayer times using device location', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('granted');
      (Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
        (success) =>
          success({
            coords: { latitude: 23.8103, longitude: 90.4125 },
          }),
      );

      const prayerTimes = await prayerTimeService.getPrayerTimesWithLocation();

      expect(prayerTimes).toBeDefined();
      expect(prayerTimes.fajr).toBeDefined();
      expect(prayerTimes.dhuhr).toBeDefined();
    });

    it('should use default location when permission denied', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('denied');

      const prayerTimes = await prayerTimeService.getPrayerTimesWithLocation();

      expect(prayerTimes).toBeDefined();
      expect(prayerTimes.fajr).toBeDefined();
    });

    it('should use default location when location unavailable', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('granted');
      (Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
        (success, error) => error(new Error('Location error')),
      );

      const prayerTimes = await prayerTimeService.getPrayerTimesWithLocation();

      expect(prayerTimes).toBeDefined();
      expect(prayerTimes.fajr).toBeDefined();
    });
  });

  describe('getNextPrayerTime', () => {
    it('should return next prayer when current time is before Fajr', () => {
      const prayerTimes = {
        fajr: '05:00',
        sunrise: '06:30',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '17:45',
        isha: '19:00',
        date: new Date().toISOString(),
      };

      // Mock current time to be 04:00
      const mockDate = new Date();
      mockDate.setHours(4, 0, 0, 0);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);

      expect(nextPrayer).toBeDefined();
      expect(nextPrayer?.name).toBe('Fajr');
      expect(nextPrayer?.nameBangla).toBe('ফজর');
      expect(nextPrayer?.time).toBe('05:00');
      expect(nextPrayer?.timeRemaining).toBeDefined();

      jest.restoreAllMocks();
    });

    it('should return next prayer when current time is between prayers', () => {
      const prayerTimes = {
        fajr: '05:00',
        sunrise: '06:30',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '17:45',
        isha: '19:00',
        date: new Date().toISOString(),
      };

      // Mock current time to be 14:00 (between Dhuhr and Asr)
      const mockDate = new Date();
      mockDate.setHours(14, 0, 0, 0);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);

      expect(nextPrayer).toBeDefined();
      expect(nextPrayer?.name).toBe('Asr');
      expect(nextPrayer?.nameBangla).toBe('আসর');

      jest.restoreAllMocks();
    });

    it('should return Fajr for tomorrow when all prayers passed', () => {
      const prayerTimes = {
        fajr: '05:00',
        sunrise: '06:30',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '17:45',
        isha: '19:00',
        date: new Date().toISOString(),
      };

      // Mock current time to be 23:00 (after all prayers)
      const mockDate = new Date();
      mockDate.setHours(23, 0, 0, 0);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);

      expect(nextPrayer).toBeDefined();
      expect(nextPrayer?.name).toBe('Fajr');
      expect(nextPrayer?.timeRemaining.hours).toBeGreaterThan(5);

      jest.restoreAllMocks();
    });

    it('should include all prayer name translations', () => {
      const prayerTimes = {
        fajr: '05:00',
        sunrise: '06:30',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '17:45',
        isha: '19:00',
        date: new Date().toISOString(),
      };

      const mockDate = new Date();
      mockDate.setHours(4, 0, 0, 0);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);

      expect(nextPrayer?.name).toBeDefined();
      expect(nextPrayer?.nameArabic).toBeDefined();
      expect(nextPrayer?.nameBangla).toBeDefined();

      jest.restoreAllMocks();
    });
  });

  describe('getNextPrayerWithLocation', () => {
    it('should get next prayer using device location', async () => {
      (PermissionsAndroid.request as jest.Mock).mockResolvedValueOnce('granted');
      (Geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(
        (success) =>
          success({
            coords: { latitude: 23.8103, longitude: 90.4125 },
          }),
      );

      const mockDate = new Date();
      mockDate.setHours(10, 0, 0, 0);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextPrayer = await prayerTimeService.getNextPrayerWithLocation();

      expect(nextPrayer).toBeDefined();
      expect(nextPrayer?.name).toBeDefined();
      expect(nextPrayer?.time).toBeDefined();
      expect(nextPrayer?.timeRemaining).toBeDefined();

      jest.restoreAllMocks();
    });
  });

  describe('Prayer time calculations', () => {
    it('should ensure Fajr is before sunrise', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      const fajrMinutes = this.timeToMinutes(prayerTimes.fajr);
      const sunriseMinutes = this.timeToMinutes(prayerTimes.sunrise);

      expect(fajrMinutes).toBeLessThan(sunriseMinutes);
    });

    it('should ensure Dhuhr is after sunrise', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      const sunriseMinutes = this.timeToMinutes(prayerTimes.sunrise);
      const dhuhrMinutes = this.timeToMinutes(prayerTimes.dhuhr);

      expect(dhuhrMinutes).toBeGreaterThan(sunriseMinutes);
    });

    it('should ensure Asr is after Dhuhr', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      const dhuhrMinutes = this.timeToMinutes(prayerTimes.dhuhr);
      const asrMinutes = this.timeToMinutes(prayerTimes.asr);

      expect(asrMinutes).toBeGreaterThan(dhuhrMinutes);
    });

    it('should ensure Maghrib is after Asr', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      const asrMinutes = this.timeToMinutes(prayerTimes.asr);
      const maghribMinutes = this.timeToMinutes(prayerTimes.maghrib);

      expect(maghribMinutes).toBeGreaterThan(asrMinutes);
    });

    it('should ensure Isha is after Maghrib', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const dhaka: Coordinates = { latitude: 23.8103, longitude: 90.4125 };

      const prayerTimes = prayerTimeService.getPrayerTimes(date, dhaka);

      const maghribMinutes = this.timeToMinutes(prayerTimes.maghrib);
      const ishaMinutes = this.timeToMinutes(prayerTimes.isha);

      expect(ishaMinutes).toBeGreaterThan(maghribMinutes);
    });

    // Helper method to convert time string to minutes
    timeToMinutes(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
  });
});
