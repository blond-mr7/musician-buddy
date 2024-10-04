import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

type RhythmVisualizerProps = {
  bpm: number;
  isPlaying: boolean;
  beatCount: number;
};

const noteSubdivisions: { [key: string]: number } = {
  none: 0,
  breve: 1,
  semibreve: 1,
  minima: 2,
  tercina: 3,
  seminima: 4,
  quialtera_up: 5,
  sextina: 6,
  quialtera_down: 7,
  colcheia: 8,
  semicolcheia: 16,
  fusa: 32,
  semifusa: 64,
};

const RhythmVisualizer = ({
  bpm,
  isPlaying,
  beatCount,
}: RhythmVisualizerProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [noteValue, setNoteValue] = useState("seminima");
  const subdivisions = noteSubdivisions[noteValue] || 1;
  const intervalTime = (60 / bpm / subdivisions) * 1000;

  useEffect(() => {
    if (!isPlaying) {
      setActiveIndex(-1);
      return;
    }

    let currentBeat = 0 + 1;

    const interval = setInterval(() => {
      if (noteValue === "breve") {
        setActiveIndex(0);
      } else if (noteValue === "semibreve") {
        setActiveIndex(currentBeat === 0 ? 0 : -1);
        currentBeat = (currentBeat + 1) % beatCount;
      } else {
        setActiveIndex(currentBeat);
        currentBeat = (currentBeat + 1) % subdivisions;
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, bpm, subdivisions, intervalTime, noteValue, beatCount]);

  const handleNoteValueChange = (value: string) => {
    setNoteValue(value);
  };

  return (
    <div className="w-2/3 lg:w-1/4">
      {/* Seletor de subdivisões rítmicas */}
      <Select value={noteValue} onValueChange={handleNoteValueChange}>
        <SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="breve">Breve</SelectItem>
            <SelectItem value="semibreve">Semibreve</SelectItem>
            <SelectItem value="minima">Minima</SelectItem>
            <SelectItem value="tercina">Tercina</SelectItem>
            <SelectItem value="seminima">Seminima</SelectItem>
            <SelectItem value="quialtera_up">Padrão 5</SelectItem>
            <SelectItem value="sextina">Sextina</SelectItem>
            <SelectItem value="quialtera_down">Padrão 7</SelectItem>
            <SelectItem value="colcheia">Colcheia</SelectItem>
            <SelectItem value="semicolcheia">Semicolcheia</SelectItem>
            <SelectItem value="fusa">Fusa</SelectItem>
            <SelectItem value="semifusa">Semifusa</SelectItem>
          </SelectContent>
        </SelectTrigger>
      </Select>

      {/* Visualização das bolinhas */}
      <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: subdivisions }).map((_, index) => (
          <div
            key={index}
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: index === activeIndex ? "yellow" : "gray",
              transition: "background-color 0.1s ease-in-out",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RhythmVisualizer;
