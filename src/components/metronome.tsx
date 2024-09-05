import React, { useEffect, useRef, useState } from "react";

const sounds: { [key: string]: HTMLAudioElement } = {
  classical: new Audio("public/classical.mp3"),
  metronome: new Audio("public/metronome.wav"),
  drumstick: new Audio("public/drumstick.mp3"),
  camera: new Audio("public/camera.wav"),
  interface: new Audio("public/interface.wav"),
  modern: new Audio("public/modern.wav"),
  pro: new Audio("public/pro.mp3"),
  typewriter: new Audio("public/typewriter.wav"),
  handgun: new Audio("public/handgun.mp3"),
};

const Metronome = () => {
  const [bpm, setBpm] = useState(60);
  const tapTimes = useRef<number[]>([]);
  const [timeSignature, setTimeSignature] = useState("4");
  const [beatSound, setBeatSound] = useState("classical");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const playBeatSound = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }

    const selectedSound = sounds[beatSound];
    currentAudio.current = selectedSound;

    // Destacar o primeiro beat
    if (currentBeat === 0) {
      selectedSound.volume = 1.0; // Primeiro beat mais alto
    } else {
      selectedSound.volume = 0.75; // Outros beats mais baixos
    }

    selectedSound.currentTime = 0;
    selectedSound.play();

    setCurrentBeat((prevBeat) => (prevBeat + 1) % parseInt(timeSignature));
  };

  const playSingleBeatFor10Seconds = () => {
    const selectedSound = sounds[beatSound];

    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }

    currentAudio.current = selectedSound;
    selectedSound.currentTime = 0;
    selectedSound.play();

    setTimeout(() => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }
    }, 10000);
  };

  const calculateInterval = (bpm: number) => (60 / bpm) * 1000;

  const startMetronome = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    const interval = calculateInterval(bpm);

    intervalRef.current = window.setInterval(playBeatSound, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentAudio.current) {
      currentAudio.current.pause(); // Pausar imediatamente o som
      currentAudio.current.currentTime = 0; // Resetar o tempo
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);

    if (isPlaying) {
      clearInterval(intervalRef.current || undefined);
      const newInterval = calculateInterval(newBpm);
      intervalRef.current = window.setInterval(playBeatSound, newInterval);
    }
  };

  const handleBeatSoundChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBeatSound(event.target.value);

    // Se o metrônomo estiver tocando, atualiza o som imediatamente
    if (isPlaying) {
      playBeatSound();
    }
  };

  const calculateBpmFromTaps = () => {
    if (tapTimes.current.length > 1) {
      const lastTap = tapTimes.current[tapTimes.current.length - 1];
      const secondLastTap = tapTimes.current[tapTimes.current.length - 2];

      const interval = lastTap - secondLastTap;

      const newBpm = Math.round(60000 / interval);
      if (newBpm > 40 && newBpm < 240) setBpm(newBpm);

      if (isPlaying) {
        clearInterval(intervalRef.current || undefined);
        const newInterval = calculateInterval(newBpm);
        intervalRef.current = window.setInterval(playBeatSound, newInterval);
      }
    }
  };

  const handleTapTempo = () => {
    const currentTime = Date.now();

    if (
      tapTimes.current.length > 1 &&
      currentTime - tapTimes.current[tapTimes.current.length - 1] < 300
    ) {
      return;
    }

    tapTimes.current.push(currentTime);

    if (tapTimes.current.length > 2) {
      tapTimes.current = tapTimes.current.slice(-2);
    }

    calculateBpmFromTaps();
  };

  const handleTimeSignatureChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimeSignature(event.target.value);
  };

  return (
    <div>
      <h2>Current BPM: {bpm}</h2>
      <input
        type="range"
        min="30"
        max="240"
        value={bpm}
        onChange={handleBpmChange}
      />
      <br />
      <button onClick={handleTapTempo}>Tap Tempo</button>
      <div>
        <h3>Select Time Signature</h3>
        <select value={timeSignature} onChange={handleTimeSignatureChange}>
          <option value="2">2/4</option>
          <option value="3">3/4</option>
          <option value="4">4/4</option>
        </select>
      </div>

      <p>Selected Time Signature: {timeSignature}/4</p>

      <h3>Select Beat Sound</h3>
      <select value={beatSound} onChange={handleBeatSoundChange}>
        <option value="classical">Classical</option>
        <option value="metronome">Metronome</option>
        <option value="drumstick">Drumstick</option>
        <option value="handgun">Handgun</option>
        <option value="camera">Camera</option>
        <option value="interface">Interface</option>
        <option value="modern">Modern</option>
        <option value="pro">Pro</option>
        <option value="typewriter">Typewriter</option>
      </select>

      <p>Selected Beat Sound: {beatSound}</p>

      <button onClick={playSingleBeatFor10Seconds}>
        Play Beat for 10 Seconds
      </button>

      <button onClick={isPlaying ? stopMetronome : startMetronome}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  );
};

export default Metronome;
