# Islamic Components

This directory contains components related to Islamic content features.

## Components

### AudioPlayer

Audio player component for playing dua recitations.

**Props:**
- `duaId` (string): ID of the dua to play
- `duaTitle` (string): Title of the dua for display

**Features:**
- Play/pause audio playback
- Stop and reset playback
- Progress bar with time indicators
- Forward 10 seconds
- Loading states
- Audio availability indicators

**Usage:**
```tsx
import {AudioPlayer} from '../components/islamic/AudioPlayer';

<AudioPlayer 
  duaId="dua_craving_1" 
  duaTitle="কঠিন সময়ে দোয়া" 
/>
```

**Audio Files:**
Audio files should be placed in:
- Android: `android/app/src/main/res/raw/`
- iOS: `ios/Resources/`

Supported formats: MP3, M4A, WAV

**Future Enhancements:**
- Repeat mode
- Playback speed control
- Download audio for offline use
- Background playback
- Audio visualization

## Related Services

- `audio.service.ts`: Handles audio playback logic
- `islamicContent.ts`: Contains dua data and metadata

## Testing

All components have corresponding test files in `__tests__/` directory.

Run tests:
```bash
npm test -- islamic
```
