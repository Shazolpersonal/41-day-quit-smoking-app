# Audio Files for Duas

This directory contains audio files for dua recitations.

## File Structure

```
assets/audio/
├── hasbunallah.mp3
├── allahumma_la_sahla.mp3
├── la_ilaha_illa_anta.mp3
├── alhamdulillah_salihat.mp3
├── allahumma_ma_asbaha.mp3
├── allahumma_inni_audhu_ajz.mp3
├── rabbana_afrigh.mp3
├── rabbi_ainni.mp3
├── allahumma_inni_audhu_munkarat.mp3
└── astaghfirullah_tawbah.mp3
```

## Audio File Requirements

### Format
- **Preferred:** MP3 (128-192 kbps)
- **Alternative:** M4A, WAV
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Channels:** Mono or Stereo

### File Size
- Target: 200-400 KB per file
- Maximum: 1 MB per file
- Total bundle size: ~3-5 MB for all audio files

### Naming Convention
- Use lowercase letters
- Use underscores for spaces
- Match the dua ID from `islamicContent.ts`
- Example: `dua_craving_1` → `hasbunallah.mp3`

## Installation Instructions

### Android

1. Create the raw resources directory:
   ```bash
   mkdir -p android/app/src/main/res/raw
   ```

2. Copy audio files:
   ```bash
   cp assets/audio/*.mp3 android/app/src/main/res/raw/
   ```

3. Ensure files are lowercase and have no special characters

### iOS

1. Open Xcode project
2. Right-click on project → Add Files
3. Select all audio files from `assets/audio/`
4. Check "Copy items if needed"
5. Add to target: QuitSmokingApp

## Audio Sources

### Recommended Sources for Islamic Audio
1. **Quran.com** - High-quality Quran recitations
2. **IslamicFinder** - Dua audio collections
3. **Muslim Pro** - Islamic audio resources
4. **Custom Recording** - Record with a qualified reciter

### Recording Guidelines
- Use a professional reciter with proper tajweed
- Record in a quiet environment
- Use a good quality microphone
- Apply noise reduction
- Normalize audio levels
- Add 0.5s silence at start and end

## Audio Processing

### Using FFmpeg
```bash
# Convert to MP3 with optimal settings
ffmpeg -i input.wav -codec:a libmp3lame -b:a 128k -ar 44100 output.mp3

# Normalize audio
ffmpeg -i input.mp3 -af "loudnorm" output.mp3

# Trim silence
ffmpeg -i input.mp3 -af "silenceremove=1:0:-50dB" output.mp3
```

### Using Audacity
1. Import audio file
2. Effect → Noise Reduction
3. Effect → Normalize
4. Effect → Compressor
5. Export as MP3 (128-192 kbps)

## Testing Audio Files

### Manual Testing
1. Place files in appropriate directories
2. Run the app
3. Navigate to Dua Detail screen
4. Test play/pause/stop controls
5. Verify audio quality

### Automated Testing
```bash
# Check file sizes
ls -lh assets/audio/

# Verify file formats
file assets/audio/*.mp3

# Check audio properties
ffprobe assets/audio/hasbunallah.mp3
```

## Troubleshooting

### Audio Not Playing
- Verify file is in correct directory
- Check file name matches exactly
- Ensure file format is supported
- Check file permissions

### Poor Audio Quality
- Increase bitrate (192 kbps)
- Check source audio quality
- Re-encode with better settings

### Large File Sizes
- Reduce bitrate (96-128 kbps)
- Convert to mono if stereo
- Trim unnecessary silence
- Use MP3 instead of WAV

## Future Enhancements

- [ ] Add more dua audio files
- [ ] Include Quran verse recitations
- [ ] Add dhikr audio with counters
- [ ] Implement audio streaming
- [ ] Add multiple reciter options
- [ ] Include translations audio

## Copyright and Licensing

Ensure all audio files are:
- Properly licensed for use
- Free from copyright restrictions
- Attributed to the reciter
- Compliant with Islamic guidelines

## Contact

For audio file contributions or issues, please contact the development team.
