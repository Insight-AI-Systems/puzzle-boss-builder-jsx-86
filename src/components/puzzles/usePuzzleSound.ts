
import { useSoundEffects } from './utils/useSoundEffects';

export function usePuzzleSound() {
  const { playSound, muted, toggleMute, volume, changeVolume } = useSoundEffects();
  return { playSound, muted, toggleMute, volume, changeVolume };
}
