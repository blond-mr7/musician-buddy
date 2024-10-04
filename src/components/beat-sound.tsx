import React, { useRef, useCallback } from "react";

type BeatSoundComponentProps = {
  isPlaying: boolean;
  setPlayBeatSound: (playBeatSound: (beatSound: string) => void) => void;
  beatSound: string;
  setBeatSound: (beatSound: string) => void;
};

const BeatSoundComponent = ({
  isPlaying,
  setPlayBeatSound,
  beatSound,
  setBeatSound,
}: BeatSoundComponentProps) => {
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const playBeatSound = useCallback((beatSound: string) => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }

    const sounds: { [key: string]: HTMLAudioElement } = {
      classical: new Audio("public/classical.mp3"),
      metronome: new Audio("public/metronome.mp3"),
      drumstick: new Audio("public/drumstick.mp3"),
      pro: new Audio("public/pro.mp3"),
    };

    const selectedSound = sounds[beatSound];

    if (!selectedSound) {
      console.error("Sound not found for beatSound:", beatSound);
      return;
    }

    currentAudio.current = selectedSound;
    selectedSound.volume = 1.0;
    selectedSound.currentTime = 0;
    selectedSound.play();
  }, []);

  // Passa a função `playBeatSound` para o componente pai
  setPlayBeatSound(() => playBeatSound);

  const handleBeatSoundChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newBeatSound = event.target.value;
    setBeatSound(newBeatSound);

    if (isPlaying) {
      playBeatSound(newBeatSound);
    }
  };

  return (
    <div>
      <h3>Select Beat Sound</h3>
      <select value={beatSound} onChange={handleBeatSoundChange}>
        <option value="classical">Classical</option>
        <option value="metronome">Metronome</option>
        <option value="drumstick">Drumstick</option>
        <option value="pro">Pro</option>
      </select>
      <p>Selected Beat Sound: {beatSound}</p>
    </div>
  );
};

export default BeatSoundComponent;
