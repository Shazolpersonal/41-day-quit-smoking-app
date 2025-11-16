/**
 * SettingsContext Usage Examples
 * 
 * This file demonstrates how to use the SettingsContext in your components.
 */

import React, {useEffect} from 'react';
import {View, Text, Switch, Button, TextInput, FlatList} from 'react-native';
import {useSettings} from './SettingsContext';

/**
 * Example 1: Notification Settings Component
 */
export const NotificationSettingsExample = () => {
  const {settings, updateNotifications, error} = useSettings();

  if (!settings) {
    return <Text>Loading settings...</Text>;
  }

  return (
    <View>
      <Text>Notification Settings</Text>
      
      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <View>
        <Text>Enable Notifications</Text>
        <Switch
          value={settings.notifications.enabled}
          onValueChange={(value) => updateNotifications({enabled: value})}
        />
      </View>

      <View>
        <Text>Daily Reminder</Text>
        <Switch
          value={settings.notifications.dailyReminder}
          onValueChange={(value) => updateNotifications({dailyReminder: value})}
        />
      </View>

      <View>
        <Text>Reminder Time</Text>
        <TextInput
          value={settings.notifications.dailyReminderTime}
          onChangeText={(value) => updateNotifications({dailyReminderTime: value})}
          placeholder="HH:mm"
        />
      </View>

      <View>
        <Text>Prayer Times Notifications</Text>
        <Switch
          value={settings.notifications.prayerTimes}
          onValueChange={(value) => updateNotifications({prayerTimes: value})}
        />
      </View>

      <View>
        <Text>Milestone Notifications</Text>
        <Switch
          value={settings.notifications.milestones}
          onValueChange={(value) => updateNotifications({milestones: value})}
        />
      </View>

      <View>
        <Text>Encouragement Notifications</Text>
        <Switch
          value={settings.notifications.encouragement}
          onValueChange={(value) => updateNotifications({encouragement: value})}
        />
      </View>
    </View>
  );
};

/**
 * Example 2: Appearance Settings Component
 */
export const AppearanceSettingsExample = () => {
  const {settings, updateAppearance, error} = useSettings();

  if (!settings) {
    return <Text>Loading settings...</Text>;
  }

  return (
    <View>
      <Text>Appearance Settings</Text>
      
      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <View>
        <Text>Font Size</Text>
        <Button
          title="Small"
          onPress={() => updateAppearance({fontSize: 'small'})}
        />
        <Button
          title="Medium"
          onPress={() => updateAppearance({fontSize: 'medium'})}
        />
        <Button
          title="Large"
          onPress={() => updateAppearance({fontSize: 'large'})}
        />
        <Text>Current: {settings.appearance.fontSize}</Text>
      </View>

      <View>
        <Text>Theme</Text>
        <Button
          title="Light"
          onPress={() => updateAppearance({theme: 'light'})}
        />
        <Button
          title="Dark"
          onPress={() => updateAppearance({theme: 'dark'})}
        />
        <Text>Current: {settings.appearance.theme}</Text>
      </View>

      <View>
        <Text>Sound Effects</Text>
        <Switch
          value={settings.appearance.soundEffects}
          onValueChange={(value) => updateAppearance({soundEffects: value})}
        />
      </View>

      <View>
        <Text>Haptic Feedback</Text>
        <Switch
          value={settings.appearance.hapticFeedback}
          onValueChange={(value) => updateAppearance({hapticFeedback: value})}
        />
      </View>
    </View>
  );
};

/**
 * Example 3: Privacy Settings Component
 */
export const PrivacySettingsExample = () => {
  const {settings, updatePrivacy, error} = useSettings();
  const [pin, setPin] = React.useState('');

  if (!settings) {
    return <Text>Loading settings...</Text>;
  }

  const handleSetPin = async () => {
    const success = await updatePrivacy({pinLock: true, pin});
    if (success) {
      setPin('');
      alert('PIN set successfully');
    }
  };

  return (
    <View>
      <Text>Privacy Settings</Text>
      
      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <View>
        <Text>PIN Lock</Text>
        <Switch
          value={settings.privacy.pinLock}
          onValueChange={(value) => updatePrivacy({pinLock: value})}
        />
      </View>

      {settings.privacy.pinLock && (
        <View>
          <Text>Set PIN (4-6 digits)</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN"
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
          />
          <Button title="Set PIN" onPress={handleSetPin} />
        </View>
      )}

      <View>
        <Text>Biometric Authentication</Text>
        <Switch
          value={settings.privacy.biometric}
          onValueChange={(value) => updatePrivacy({biometric: value})}
        />
      </View>

      <View>
        <Text>Data Encryption</Text>
        <Switch
          value={settings.privacy.dataEncryption}
          onValueChange={(value) => updatePrivacy({dataEncryption: value})}
        />
      </View>
    </View>
  );
};

/**
 * Example 4: Emergency Contacts Component
 */
export const EmergencyContactsExample = () => {
  const {
    settings,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    error,
  } = useSettings();

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [relationship, setRelationship] = React.useState('');

  if (!settings) {
    return <Text>Loading settings...</Text>;
  }

  const handleAddContact = async () => {
    const success = await addEmergencyContact({name, phone, relationship});
    if (success) {
      setName('');
      setPhone('');
      setRelationship('');
      alert('Contact added successfully');
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    const success = await removeEmergencyContact(contactId);
    if (success) {
      alert('Contact removed successfully');
    }
  };

  return (
    <View>
      <Text>Emergency Contacts</Text>
      
      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <View>
        <Text>Add New Contact</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone (01XXXXXXXXX)"
          keyboardType="phone-pad"
        />
        <TextInput
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Relationship"
        />
        <Button title="Add Contact" onPress={handleAddContact} />
      </View>

      <View>
        <Text>Contacts ({settings.emergencyContacts.length}/5)</Text>
        <FlatList
          data={settings.emergencyContacts}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.phone}</Text>
              <Text>{item.relationship}</Text>
              <Button
                title="Remove"
                onPress={() => handleRemoveContact(item.id)}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

/**
 * Example 5: Settings Overview Component
 */
export const SettingsOverviewExample = () => {
  const {settings, loading, error, refreshSettings, resetSettings} = useSettings();

  useEffect(() => {
    // Refresh settings when component mounts
    refreshSettings();
  }, []);

  if (loading) {
    return <Text>Loading settings...</Text>;
  }

  if (error) {
    return <Text style={{color: 'red'}}>Error: {error}</Text>;
  }

  if (!settings) {
    return <Text>No settings found</Text>;
  }

  const handleReset = async () => {
    const confirmed = confirm('Are you sure you want to reset all settings?');
    if (confirmed) {
      const success = await resetSettings();
      if (success) {
        alert('Settings reset successfully');
      }
    }
  };

  return (
    <View>
      <Text>Settings Overview</Text>

      <View>
        <Text>Notifications: {settings.notifications.enabled ? 'Enabled' : 'Disabled'}</Text>
        <Text>Theme: {settings.appearance.theme}</Text>
        <Text>Font Size: {settings.appearance.fontSize}</Text>
        <Text>PIN Lock: {settings.privacy.pinLock ? 'Enabled' : 'Disabled'}</Text>
        <Text>Emergency Contacts: {settings.emergencyContacts.length}</Text>
        <Text>Last Updated: {new Date(settings.updatedAt).toLocaleString()}</Text>
      </View>

      <Button title="Refresh Settings" onPress={refreshSettings} />
      <Button title="Reset to Defaults" onPress={handleReset} />
    </View>
  );
};

/**
 * Example 6: Using Settings in App Component
 */
export const AppWithSettingsExample = () => {
  const {settings} = useSettings();

  // Apply theme based on settings
  const backgroundColor = settings?.appearance.theme === 'dark' ? '#000' : '#fff';
  const textColor = settings?.appearance.theme === 'dark' ? '#fff' : '#000';

  // Apply font size based on settings
  const fontSize = 
    settings?.appearance.fontSize === 'small' ? 12 :
    settings?.appearance.fontSize === 'large' ? 18 :
    14; // medium

  return (
    <View style={{backgroundColor, flex: 1}}>
      <Text style={{color: textColor, fontSize}}>
        Welcome to the Quit Smoking App
      </Text>
      {/* Rest of your app */}
    </View>
  );
};

/**
 * Example 7: Conditional Rendering Based on Settings
 */
export const ConditionalRenderingExample = () => {
  const {settings} = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <View>
      {settings.notifications.enabled && (
        <Text>Notifications are enabled</Text>
      )}

      {settings.privacy.pinLock && (
        <Text>App is protected with PIN</Text>
      )}

      {settings.emergencyContacts.length > 0 && (
        <Text>You have {settings.emergencyContacts.length} emergency contacts</Text>
      )}
    </View>
  );
};
