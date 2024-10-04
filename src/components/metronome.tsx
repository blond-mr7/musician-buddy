import { useState, useRef, useEffect, useCallback } from "react";
import { playPersonalizedSound, playSoundByType } from "./constants";
import TimeSignature from "./time-signature";
import TapTempo from "./tap-tempo";
import { Button } from "@/components/ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface MetronomeProps {
  setBpm: (bpm: number) => void;
  isPlayingFromProgressive: boolean;
  setIsPlayingFromProgressive: (playing: boolean) => void;
  onNoteValueChange?: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({
  setBpm,
  isPlayingFromProgressive,
  setIsPlayingFromProgressive,
  onNoteValueChange,
}) => {
  const [mode, setMode] = useState<"standard" | "progressive">("standard");
  const [initialBpm, setInitialBpm] = useState(60);
  const [targetBpm, setTargetBpm] = useState(120);
  const [progressionPercentage, setProgressionPercentage] = useState(0);
  const [progressionBpm, setProgressionBpm] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(initialBpm);
  const [timeSignature, setTimeSignature] = useState("4");
  const [selectedSound, setSelectedSound] = useState("click");
  const [numberOfRepeats, setNumberOfRepeats] = useState(2);
  const [compassCount, setCompassCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const beatCount = parseInt(timeSignature, 10);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressionType, setProgressionType] = useState<
    "percentage" | "bpm"
  >();

  const calculateInterval = (bpm: number) => (60 / bpm) * 1000;

  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === "standard" ? "progressive" : "standard"
    );
    setIsPlayingFromProgressive(false);
    setIsPlaying(false);
    setCurrentBpm(initialBpm);
  };

  const increaseBpmGradually = useCallback(() => {
    if (progressionPercentage !== 0) {
      const bpmIncrementByPercentage =
        initialBpm * (progressionPercentage / 100);
      setCurrentBpm((prevBpm) => {
        const newBpm = prevBpm + bpmIncrementByPercentage;
        setBpm(newBpm);
        return newBpm >= targetBpm ? targetBpm : newBpm;
      });
    }
    if (progressionBpm !== 0) {
      setCurrentBpm((prevBpm) => {
        const newBpm = prevBpm + progressionBpm;
        setBpm(newBpm);
        return newBpm >= targetBpm ? targetBpm : newBpm;
      });
    }
  }, [initialBpm, progressionPercentage, targetBpm, progressionBpm, setBpm]);

  const handleBeatCycle = useCallback(() => {
    setCompassCount((prevCount) => {
      if (prevCount + 1 >= numberOfRepeats) {
        increaseBpmGradually();
        return 0;
      }
      return prevCount + 1;
    });
  }, [numberOfRepeats, increaseBpmGradually]);

  useEffect(() => {
    const personalizedSounds = [
      "camera",
      "classical",
      "drumstick",
      "handgun",
      "interface",
      "metronome",
      "modern",
      "pro",
      "typewriter",
    ];

    const isPlayingMode =
      mode === "standard" ? isPlaying : isPlayingFromProgressive;

    if (isPlayingMode) {
      const interval = calculateInterval(currentBpm);

      intervalRef.current = window.setInterval(() => {
        setCurrentBeat((prevBeat) => {
          const nextBeat = (prevBeat + 1) % beatCount;

          if (personalizedSounds.includes(selectedSound)) {
            playPersonalizedSound(selectedSound, currentBpm, nextBeat === 0);
          } else {
            playSoundByType(selectedSound, nextBeat === 0);
          }

          if (nextBeat === 0 && mode === "progressive") {
            handleBeatCycle();
          }

          return nextBeat;
        });
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [
    isPlaying,
    isPlayingFromProgressive,
    currentBpm,
    selectedSound,
    beatCount,
    handleBeatCycle,
    mode,
  ]);

  const startMetronome = () => {
    setIsPlaying(true);
    setIsPlayingFromProgressive(true);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setIsPlayingFromProgressive(false);
    setCurrentBpm(initialBpm);
    setCurrentBeat(0);
    setCompassCount(0);
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    setCurrentBpm(newBpm);
    restartMetronome(newBpm);
  };
  const restartMetronome = (newBpm: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (onNoteValueChange) {
      stopMetronome();
      startMetronome();
    }
    setCurrentBpm(newBpm);
    setBpm(newBpm);
    startMetronome();
  };

  return (
    <div>
      <h2>
        {mode === "standard" ? "Standard Metronome" : "Progressive Metronome"}
      </h2>

      <Button onClick={toggleMode}>
        {mode === "standard" ? "Switch to Progressive" : "Switch to Standard"}
      </Button>

      {mode === "progressive" && (
        <>
          <div className="w-1/2 lg:w-1/4">
            <label>
              Initial BPM:
              <Input
                type="number"
                value={initialBpm}
                onChange={(e) => setInitialBpm(Number(e.target.value))}
                min={30}
                max={targetBpm - 1}
              />
            </label>
          </div>
          <div className="w-1/2 lg:w-1/4">
            <label>
              Target BPM:
              <Input
                type="number"
                value={targetBpm}
                onChange={(e) => setTargetBpm(Number(e.target.value))}
                min={initialBpm + 1}
                max={240}
              />
            </label>
          </div>

          <>
            <div className="mb-4">
              <h3>Select Progression Type</h3>
              <RadioGroup
                value={progressionType}
                onValueChange={(value: "percentage" | "bpm") =>
                  setProgressionType(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <label htmlFor="percentage">Progression by Percentage</label>

                  <RadioGroupItem value="bpm" id="bpm" />
                  <label htmlFor="bpm">Progression by BPM</label>
                </div>
              </RadioGroup>
            </div>

            {progressionType === "percentage" && (
              <div className="w-1/2 lg:w-1/4">
                <label>
                  Progression Percentage:
                  <Input
                    placeholder="%"
                    type="number"
                    value={progressionPercentage}
                    onChange={(e) =>
                      setProgressionPercentage(Number(e.target.value))
                    }
                    max={100}
                  />
                </label>
              </div>
            )}

            {progressionType === "bpm" && (
              <div className="w-1/2 lg:w-1/4">
                <label>
                  Progression BPM:
                  <Input
                    placeholder="BPM"
                    type="number"
                    value={progressionBpm}
                    onChange={(e) => setProgressionBpm(Number(e.target.value))}
                    min={1}
                  />
                </label>
              </div>
            )}
          </>

          <div className="w-1/2 lg:w-1/4">
            <label>
              Number of Repetitions (for compass):
              <Input
                type="number"
                value={numberOfRepeats}
                onChange={(e) => setNumberOfRepeats(Number(e.target.value))}
                min={1}
              />
            </label>
          </div>
          <h2>
            Current BPM: {currentBpm} (
            {Math.round(
              ((currentBpm - initialBpm) / (targetBpm - initialBpm)) * 100
            )}
            % de 100%)
          </h2>
        </>
      )}
      {mode === "standard" && (
        <>
          <h2>Current BPM: {currentBpm}</h2>
          <div className="w-full lg:w-1/2">
            <Slider
              value={[currentBpm]}
              min={30}
              max={240}
              step={1}
              onChange={handleBpmChange}
              onValueChange={(value) => {
                restartMetronome(value[0]);
              }}
            />
          </div>
          <div>
            <Button onClick={() => restartMetronome(currentBpm - 1)}>-</Button>
            <Button onClick={() => restartMetronome(currentBpm + 1)}>+</Button>
          </div>

          <TapTempo
            setBpm={(newBpm) => {
              restartMetronome(newBpm);
            }}
          />
        </>
      )}

      <TimeSignature
        timeSignature={timeSignature}
        setTimeSignature={setTimeSignature}
      />

      <div>
        <h2>Choose a Sound</h2>
        <div className="w-1/2 lg:w-1/4">
          <Select
            value={selectedSound}
            onValueChange={(value) => setSelectedSound(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a sound" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camera">Camera</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
              <SelectItem value="handgun">Handgun</SelectItem>
              <SelectItem value="interface">Interface</SelectItem>
              <SelectItem value="metronome">Metronome</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="typewriter">Typewriter</SelectItem>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="beep">Beep</SelectItem>
              <SelectItem value="tick">Tick</SelectItem>
              <SelectItem value="snap">Snap</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={
          isPlaying || isPlayingFromProgressive ? stopMetronome : startMetronome
        }
      >
        {isPlaying || isPlayingFromProgressive ? "Stop" : "Start"}
      </Button>
    </div>
  );
};

export default Metronome;
