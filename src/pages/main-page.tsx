import RhythmVisualizer from "../components/rythim-visualizer";
import Metronome from "../components/metronome";
import { useState } from "react";
import StudyPauseCycle from "../components/study-pause-cycle";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const MainPage = () => {
  const [bpm, setBpm] = useState(60);
  const [timeSignature, setTimeSignature] = useState("4");
  const [isPlayingFromProgressive, setIsPlayingFromProgressive] =
    useState(false);
  const [onNoteValueChange, setOnNoteValueChange] = useState(false);

  return (
    <div>
      <Accordion type="multiple">
        <AccordionItem value="metronome">
          <AccordionTrigger>Metronome</AccordionTrigger>
          <AccordionContent>
            <Metronome
              setBpm={setBpm}
              isPlayingFromProgressive={isPlayingFromProgressive}
              setIsPlayingFromProgressive={setIsPlayingFromProgressive}
              onNoteValueChange={onNoteValueChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rhythm-visualizer">
          <AccordionTrigger>Rhythm Visualizer</AccordionTrigger>
          <AccordionContent>
            <RhythmVisualizer
              bpm={bpm}
              isPlaying={isPlayingFromProgressive}
              beatCount={parseInt(timeSignature, 10)}
              onNoteValueChange={setOnNoteValueChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="study-pause-cycle">
          <AccordionTrigger>Study/Pause Cycle</AccordionTrigger>
          <AccordionContent>
            <StudyPauseCycle />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MainPage;
