import { generateMetronomeSound } from "./sounds-generator";

export const playSoundByType = (
  selectedSound: string,
  isFirstBeat: boolean
) => {
  let frequency = 500;

  switch (selectedSound) {
    case "click":
      frequency = isFirstBeat ? 1000 : 650;
      break;
    case "beep":
      frequency = isFirstBeat ? 800 : 500;
      break;
    case "tick":
      frequency = isFirstBeat ? 600 : 450;
      break;
    case "snap":
      frequency = isFirstBeat ? 400 : 300;
      break;
    default:
      frequency = isFirstBeat ? 1000 : 650;
      break;
  }

  generateMetronomeSound(frequency, 0.1);
};

export const playPersonalizedSound = (
  selectedPersonalizedSound: string,
  bpm: number,
  isFirstBeat: boolean
) => {
  const soundFilePath = `/personalizedSounds/${selectedPersonalizedSound}.mp3`;
  const audio = new Audio(soundFilePath);

  audio.onloadedmetadata = () => {
    const audioDuration = audio.duration;
    const intervalTime = 60 / bpm;

    if (audioDuration > intervalTime) {
      audio.playbackRate = audioDuration / intervalTime;
    }

    if (isFirstBeat) {
      const audioContext = new (window.AudioContext || window.AudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const gainNode = audioContext.createGain();
      const biquadFilter = audioContext.createBiquadFilter();

      biquadFilter.type = "peaking";
      biquadFilter.frequency.value = 1250;
      biquadFilter.gain.value = 25;
      source
        .connect(biquadFilter)
        .connect(gainNode)
        .connect(audioContext.destination);

      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    } else {
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };
};
