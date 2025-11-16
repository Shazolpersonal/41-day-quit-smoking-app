/**
 * UserContext Usage Examples
 * 
 * This file demonstrates how to use the UserContext in your React Native components.
 */

import React, {useEffect} from 'react';
import {View, Text, Button, ActivityIndicator, Alert} from 'react-native';
import {useUser} from './UserContext';

/**
 * Example 1: Display User Profile
 */
export const UserProfileScreen: React.FC = () => {
  const {user, loading, error} = useUser();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>লোড হচ্ছে...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>কোন ব্যবহারকারী পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <View style={{padding: 20}}>
      <Text>ধূমপান ত্যাগের তারিখ: {new Date(user.quitDate).toLocaleDateString('bn-BD')}</Text>
      <Text>প্রতিদিন সিগারেট: {user.cigarettesPerDay}</Text>
      <Text>প্যাকেটের দাম: ৳{user.pricePerPack}</Text>
      <Text>প্যাকেটে সিগারেট: {user.cigarettesPerPack}</Text>
    </View>
  );
};

/**
 * Example 2: Create New User (Onboarding)
 */
export const OnboardingScreen: React.FC = () => {
  const {createUser, error} = useUser();

  const handleCreateUser = async () => {
    const success = await createUser({
      quitDate: new Date().toISOString(),
      cigarettesPerDay: 20,
      pricePerPack: 350,
      cigarettesPerPack: 20,
    });

    if (success) {
      Alert.alert('সফল', 'আপনার প্রোফাইল তৈরি হয়েছে!');
      // Navigate to home screen
    } else {
      Alert.alert('ত্রুটি', error || 'প্রোফাইল তৈরি করতে ব্যর্থ');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text>স্বাগতম! আপনার তথ্য দিন</Text>
      {/* Add form inputs here */}
      <Button title="শুরু করুন" onPress={handleCreateUser} />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

/**
 * Example 3: Update Quit Date
 */
export const UpdateQuitDateScreen: React.FC = () => {
  const {user, updateQuitDate, error} = useUser();

  const handleUpdateQuitDate = async () => {
    const newDate = new Date('2024-01-15').toISOString();
    const success = await updateQuitDate(newDate);

    if (success) {
      Alert.alert('সফল', 'ধূমপান ত্যাগের তারিখ আপডেট হয়েছে!');
    } else {
      Alert.alert('ত্রুটি', error || 'আপডেট করতে ব্যর্থ');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text>বর্তমান তারিখ: {user?.quitDate}</Text>
      {/* Add date picker here */}
      <Button title="তারিখ আপডেট করুন" onPress={handleUpdateQuitDate} />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

/**
 * Example 4: Update Cigarette Data
 */
export const UpdateCigaretteDataScreen: React.FC = () => {
  const {user, updateCigaretteData, error} = useUser();

  const handleUpdate = async () => {
    const success = await updateCigaretteData(15, 400, 20);

    if (success) {
      Alert.alert('সফল', 'সিগারেটের তথ্য আপডেট হয়েছে!');
    } else {
      Alert.alert('ত্রুটি', error || 'আপডেট করতে ব্যর্থ');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text>প্রতিদিন সিগারেট: {user?.cigarettesPerDay}</Text>
      <Text>প্যাকেটের দাম: ৳{user?.pricePerPack}</Text>
      {/* Add input fields here */}
      <Button title="আপডেট করুন" onPress={handleUpdate} />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

/**
 * Example 5: Refresh User Data
 */
export const RefreshUserDataScreen: React.FC = () => {
  const {user, refreshUser, loading} = useUser();

  useEffect(() => {
    // Refresh user data when screen is focused
    refreshUser();
  }, []);

  const handleRefresh = async () => {
    await refreshUser();
    Alert.alert('সফল', 'তথ্য রিফ্রেশ হয়েছে!');
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{padding: 20}}>
      <Text>ব্যবহারকারী: {user?.id}</Text>
      <Button title="রিফ্রেশ করুন" onPress={handleRefresh} />
    </View>
  );
};

/**
 * Example 6: Clear User Data (Settings)
 */
export const ClearDataScreen: React.FC = () => {
  const {clearUser, error} = useUser();

  const handleClearData = () => {
    Alert.alert(
      'নিশ্চিত করুন',
      'আপনি কি সব তথ্য মুছে ফেলতে চান?',
      [
        {text: 'বাতিল', style: 'cancel'},
        {
          text: 'হ্যাঁ',
          style: 'destructive',
          onPress: async () => {
            const success = await clearUser();
            if (success) {
              Alert.alert('সফল', 'সব তথ্য মুছে ফেলা হয়েছে');
              // Navigate to onboarding
            } else {
              Alert.alert('ত্রুটি', error || 'মুছে ফেলতে ব্যর্থ');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{padding: 20}}>
      <Button title="সব তথ্য মুছে ফেলুন" onPress={handleClearData} color="red" />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

/**
 * Example 7: Update User Profile (General)
 */
export const UpdateProfileScreen: React.FC = () => {
  const {user, updateUser, error} = useUser();

  const handleUpdateProfile = async () => {
    const success = await updateUser({
      cigarettesPerDay: 10,
      pricePerPack: 380,
    });

    if (success) {
      Alert.alert('সফল', 'প্রোফাইল আপডেট হয়েছে!');
    } else {
      Alert.alert('ত্রুটি', error || 'আপডেট করতে ব্যর্থ');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text>প্রোফাইল সম্পাদনা করুন</Text>
      {/* Add form fields here */}
      <Button title="সংরক্ষণ করুন" onPress={handleUpdateProfile} />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

/**
 * Example 8: App Root with Provider
 */
import {UserProvider} from './UserContext';

export const App: React.FC = () => {
  return (
    <UserProvider>
      {/* Your app navigation and screens */}
      <UserProfileScreen />
    </UserProvider>
  );
};
