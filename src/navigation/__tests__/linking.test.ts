import linking from '../linking';

describe('Linking Configuration', () => {
  it('should have correct prefixes', () => {
    expect(linking.prefixes).toContain('quitsmokingapp://');
    expect(linking.prefixes).toContain('https://quitsmokingapp.com');
  });

  it('should have correct screen configurations', () => {
    expect(linking.config?.screens).toBeDefined();
    expect(linking.config?.screens?.Onboarding).toBe('onboarding');
    expect(linking.config?.screens?.CravingSOS).toBe('craving-sos');
  });

  it('should have MainTabs configuration', () => {
    const mainTabs = linking.config?.screens?.MainTabs as any;
    expect(mainTabs).toBeDefined();
    expect(mainTabs.screens).toBeDefined();
    expect(mainTabs.screens.Home).toBe('home');
    expect(mainTabs.screens.Daily).toBeDefined();
    expect(mainTabs.screens.Progress).toBe('progress');
    expect(mainTabs.screens.Journal).toBe('journal');
    expect(mainTabs.screens.Settings).toBe('settings');
  });

  it('should parse Daily screen day parameter', () => {
    const dailyConfig = (linking.config?.screens?.MainTabs as any)?.screens
      ?.Daily;
    expect(dailyConfig.path).toBe('daily/:day?');
    expect(dailyConfig.parse.day('5')).toBe(5);
    expect(dailyConfig.parse.day('')).toBeUndefined();
  });

  it('should have JournalDetail configuration', () => {
    const journalDetail = linking.config?.screens?.JournalDetail as any;
    expect(journalDetail.path).toBe('journal/:entryId');
  });

  it('should have JournalEdit configuration', () => {
    const journalEdit = linking.config?.screens?.JournalEdit as any;
    expect(journalEdit.path).toBe('journal/edit/:entryId?');
  });
});
