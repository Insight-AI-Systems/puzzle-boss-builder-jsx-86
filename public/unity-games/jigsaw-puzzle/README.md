
# Jigsaw Puzzle Game Files

Please upload your Unity WebGL build files here with the following structure:

## Required Unity WebGL Build Files:

### Build/ folder should contain:
- `webgl.data` - Game data file
- `webgl.framework.js` - Unity framework
- `webgl.wasm` - WebAssembly file
- `UnityLoader.js` OR `unity.loader.js` - Unity loader script

### TemplateData/ folder should contain:
- `favicon.ico`
- `fullscreen-button.png`
- `progress-bar-empty-dark.png`
- `progress-bar-full-dark.png`
- `unity-logo-dark.png`
- `unity-logo-light.png`
- `webgl-logo.png`
- `style.css`

### Root files:
- `index.html` - Unity's main HTML file (optional - we use our own wrapper)

## Expected Directory Structure:
```
public/unity-games/jigsaw-puzzle/
├── Build/
│   ├── webgl.data
│   ├── webgl.framework.js
│   ├── webgl.wasm
│   └── UnityLoader.js (or unity.loader.js)
├── TemplateData/
│   ├── favicon.ico
│   ├── fullscreen-button.png
│   ├── progress-bar-empty-dark.png
│   ├── progress-bar-full-dark.png
│   ├── unity-logo-dark.png
│   ├── unity-logo-light.png
│   ├── webgl-logo.png
│   └── style.css
└── index.html (optional)
```

## Integration Features:
After uploading, the game will automatically integrate with PuzzleBoss's:
- ✅ Timer system
- ✅ Scoring system  
- ✅ Leaderboard tracking
- ✅ Admin controls
- ✅ Payment system (if configured)
- ✅ User authentication
- ✅ Progress saving

## Access:
The game will be available at: `/games/unity-jigsaw-puzzle`

## Next Steps:
1. Export your Unity project as WebGL build
2. Upload the Build/ and TemplateData/ folders with all files
3. Test the integration at the game URL
4. Verify timer, scoring, and leaderboard functionality

## Support:
If you encounter loading issues, check the browser console for specific error messages about missing files.
