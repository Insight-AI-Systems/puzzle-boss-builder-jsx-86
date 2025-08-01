// CodeCanyon Jigsaw Deluxe - Settings and Configuration
const PuzzleSettings = {
    // Default puzzle configurations
    difficulties: {
        easy: { rows: 3, columns: 3, pieces: 9 },
        medium: { rows: 4, columns: 4, pieces: 16 },
        hard: { rows: 5, columns: 5, pieces: 25 },
        expert: { rows: 6, columns: 6, pieces: 36 }
    },
    
    // Default images for puzzles
    defaultImages: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616c9d1e6e1?w=600&h=600&fit=crop'
    ],
    
    // Game settings
    game: {
        snapThreshold: 30,
        dragOpacity: 0.8,
        completionAnimation: true,
        showPieceNumbers: true,
        enableHints: true,
        autoSave: true
    },
    
    // Visual settings
    visual: {
        borderColor: '#333',
        borderWidth: 2,
        backgroundColor: '#f0f0f0',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        highlightColor: '#00ff00'
    },
    
    // Audio settings
    audio: {
        enabled: true,
        volume: 0.5,
        sounds: {
            pickup: '/sounds/pickup.mp3',
            place: '/sounds/place.mp3',
            complete: '/sounds/complete.mp3',
            error: '/sounds/error.mp3'
        }
    },
    
    // Initialize default settings
    init() {
        console.log('CodeCanyon Jigsaw Deluxe Settings Initialized');
        return this;
    },
    
    // Get difficulty settings
    getDifficulty(level) {
        return this.difficulties[level] || this.difficulties.medium;
    },
    
    // Get random default image
    getRandomImage() {
        return this.defaultImages[Math.floor(Math.random() * this.defaultImages.length)];
    },
    
    // Save settings to localStorage
    save() {
        try {
            localStorage.setItem('codecanyon_puzzle_settings', JSON.stringify(this));
        } catch (e) {
            console.warn('Could not save settings to localStorage');
        }
    },
    
    // Load settings from localStorage
    load() {
        try {
            const saved = localStorage.getItem('codecanyon_puzzle_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.assign(this, settings);
            }
        } catch (e) {
            console.warn('Could not load settings from localStorage');
        }
        return this;
    }
};

// Make it globally available
window.PuzzleSettings = PuzzleSettings;

// Auto-initialize
PuzzleSettings.init().load();