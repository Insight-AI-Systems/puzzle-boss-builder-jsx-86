
import React, { useState, useCallback } from "react";
import PuzzleEnginePlayground from "./PuzzleEnginePlayground";

// Use three distinct Unsplash images, matching selector options.
const SAMPLE_IMAGES = [
  {
    id: "mountain",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Mountain Lake"
  },
  {
    id: "city",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    alt: "City Skyline"
  },
  {
    id: "forest",
    url: "https://images.unsplash.com/photo-1468779060412-f5b0903e1f1a",
    alt: "Forest Morning"
  }
];

// No change to difficulty presets
const DIFFICULTY_PRESETS = [
  {
    value: 'easy',
    label: 'Easy',
    rows: 3,
    columns: 3
  },
  {
    value: 'medium',
    label: 'Medium',
    rows: 4,
    columns: 4
  },
  {
    value: 'hard',
    label: 'Hard',
    rows: 5,
    columns: 5
  }
];

const HeroPuzzleMini: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].id);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_PRESETS[0].value); // Default to easy for hero
  const [resetKey, setResetKey] = useState(0);

  const currentImage = SAMPLE_IMAGES.find(img => img.id === selectedImage)?.url || SAMPLE_IMAGES[0].url;
  const currentDifficultyPreset = DIFFICULTY_PRESETS.find(d => d.value === difficulty) || DIFFICULTY_PRESETS[0];

  const handleResetPuzzle = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);

  return (
    <div
      style={{
        width: 680, // Substantially larger: 600 -> 680
        maxWidth: '100vw',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          minHeight: 600, // Larger: 540 -> 600
          position: 'relative'
        }}
        className="mx-0 my-[36px] px-0 py-0"
      >
        <PuzzleEnginePlayground
          heroMode
          isCondensed
          key={resetKey + selectedImage + difficulty}
          selectedImage={currentImage}
          difficulty={difficulty}
          miniRows={currentDifficultyPreset.rows}
          miniColumns={currentDifficultyPreset.columns}
        />
      </div>
      <div className="flex justify-between mt-2">
        <select
          value={selectedImage}
          onChange={e => setSelectedImage(e.target.value)}
          className="text-xs rounded px-1 py-0.5 border bg-muted/40"
        >
          {SAMPLE_IMAGES.map(img => (
            <option value={img.id} key={img.id}>
              {img.alt}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="text-xs rounded px-1 py-0.5 border bg-muted/40"
        >
          {DIFFICULTY_PRESETS.map(preset => (
            <option value={preset.value} key={preset.value}>
              {preset.label} ({preset.rows}x{preset.columns})
            </option>
          ))}
        </select>
        <button
          className="ml-1 text-xs border px-2 rounded bg-background hover:bg-accent transition"
          onClick={handleResetPuzzle}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default HeroPuzzleMini;
