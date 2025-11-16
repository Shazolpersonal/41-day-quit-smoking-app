import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {User} from '../types';
import {UserModel} from '../models/User';
import {storageService} from '../services/storage.service';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  updateQuitDate: (quitDate: string) => Promise<boolean>;
  updateCigaretteData: (cigarettesPerDay: number, pricePerPack: number, cigarettesPerPack: number) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Load user data from storage
   */
  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await storageService.getUser();
      setUser(userData);
    } catch (err) {
      setError('ব্যবহারকারীর তথ্য লোড করতে ব্যর্থ');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new user
   */
  const createUser = async (
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<boolean> => {
    try {
      setError(null);

      // Validate user data
      const validation = UserModel.validate(data);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return false;
      }

      // Create user model
      const newUser = UserModel.create(data);

      // Save to storage
      const success = await storageService.saveUser(newUser);
      
      if (success) {
        setUser(newUser);
        return true;
      } else {
        setError('ব্যবহারকারী তৈরি করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('ব্যবহারকারী তৈরি করতে ত্রুটি');
      console.error('Error creating user:', err);
      return false;
    }
  };

  /**
   * Update user data
   */
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      setError(null);

      if (!user) {
        setError('কোন ব্যবহারকারী পাওয়া যায়নি');
        return false;
      }

      // Validate updates
      const validation = UserModel.validate({...user, ...updates});
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return false;
      }

      // Update user model
      const updatedUser = UserModel.update(user, updates);

      // Save to storage
      const success = await storageService.saveUser(updatedUser);
      
      if (success) {
        setUser(updatedUser);
        return true;
      } else {
        setError('ব্যবহারকারীর তথ্য আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('ব্যবহারকারীর তথ্য আপডেট করতে ত্রুটি');
      console.error('Error updating user:', err);
      return false;
    }
  };

  /**
   * Update quit date
   */
  const updateQuitDate = async (quitDate: string): Promise<boolean> => {
    try {
      setError(null);

      // Validate quit date
      const quitDateObj = new Date(quitDate);
      const now = new Date();
      
      if (quitDateObj > now) {
        setError('ধূমপান ত্যাগের তারিখ ভবিষ্যতে হতে পারে না');
        return false;
      }

      return await updateUser({quitDate});
    } catch (err) {
      setError('ধূমপান ত্যাগের তারিখ আপডেট করতে ত্রুটি');
      console.error('Error updating quit date:', err);
      return false;
    }
  };

  /**
   * Update cigarette consumption data
   */
  const updateCigaretteData = async (
    cigarettesPerDay: number,
    pricePerPack: number,
    cigarettesPerPack: number,
  ): Promise<boolean> => {
    try {
      setError(null);

      // Validate cigarette data
      if (cigarettesPerDay < 0) {
        setError('প্রতিদিন সিগারেটের সংখ্যা ০ এর কম হতে পারে না');
        return false;
      }

      if (pricePerPack < 0) {
        setError('প্যাকেটের দাম ০ এর কম হতে পারে না');
        return false;
      }

      if (cigarettesPerPack < 1) {
        setError('প্যাকেটে সিগারেটের সংখ্যা কমপক্ষে ১ হতে হবে');
        return false;
      }

      return await updateUser({
        cigarettesPerDay,
        pricePerPack,
        cigarettesPerPack,
      });
    } catch (err) {
      setError('সিগারেটের তথ্য আপডেট করতে ত্রুটি');
      console.error('Error updating cigarette data:', err);
      return false;
    }
  };

  /**
   * Refresh user data from storage
   */
  const refreshUser = async (): Promise<void> => {
    await loadUser();
  };

  /**
   * Clear user data
   */
  const clearUser = async (): Promise<boolean> => {
    try {
      setError(null);
      const success = await storageService.clearAllData();
      
      if (success) {
        setUser(null);
        return true;
      } else {
        setError('ব্যবহারকারীর তথ্য মুছে ফেলতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('ব্যবহারকারীর তথ্য মুছে ফেলতে ত্রুটি');
      console.error('Error clearing user:', err);
      return false;
    }
  };

  const value: UserContextType = {
    user,
    loading,
    error,
    createUser,
    updateUser,
    updateQuitDate,
    updateCigaretteData,
    refreshUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook to use UserContext
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

export default UserContext;
