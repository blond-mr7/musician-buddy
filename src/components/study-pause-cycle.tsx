import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

const StudyPauseCycle = () => {
  const [studyDuration, setStudyDuration] = useState(15);
  const [pauseDuration, setPauseDuration] = useState(5);
  const [numberOfCycles, setNumberOfCycles] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isStudying, setIsStudying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const selectedNumberOfPauses = numberOfCycles - 1;

  useEffect(() => {
    setTimeLeft(isStudying ? studyDuration * 60 : pauseDuration * 60);
  }, [studyDuration, pauseDuration, isStudying]);

  useEffect(() => {
    if (!isRunning) return;

    let timer: NodeJS.Timeout | null = null;

    const handleTimeUpdate = () => {
      setTimeLeft((prevTime) => prevTime - 1);
    };

    timer = setInterval(handleTimeUpdate, 1000);

    const updateCycle = () => {
      if (timeLeft === 0) {
        if (isStudying) {
          if (currentCycle < selectedNumberOfPauses) {
            setTimeLeft(pauseDuration * 60);
            setIsStudying(false);
          } else {
            setIsRunning(false);
            alert("End of study cycle!");
            clearInterval(timer!);
          }
        } else {
          if (currentCycle + 1 < numberOfCycles) {
            setCurrentCycle((prevCycle) => prevCycle + 1);
            setTimeLeft(studyDuration * 60);
            setIsStudying(true);
          } else {
            clearInterval(timer!);
            setIsRunning(false);
            alert("End of study cycle!");
          }
        }
      }
    };

    updateCycle();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    isRunning,
    timeLeft,
    isStudying,
    currentCycle,
    numberOfCycles,
    studyDuration,
    pauseDuration,
    selectedNumberOfPauses,
  ]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentCycle(0);
    setIsStudying(true);
    setTimeLeft(studyDuration * 60);
  };

  return (
    <div className="w-1/2 lg:w-1/4 ">
      <h2>Study/Pause Cycle</h2>
      <div>
        <label>
          Study Duration (minutes):
          <Input
            type="number"
            min={1}
            value={studyDuration}
            onChange={(e) => setStudyDuration(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Pause Duration (minutes):
          <Input
            type="number"
            min={1}
            value={pauseDuration}
            onChange={(e) => setPauseDuration(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Number of Cycles:
          <Input
            type="number"
            min={1}
            value={numberOfCycles}
            onChange={(e) => setNumberOfCycles(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <h3>
          {isStudying ? "Studying" : "Pause"}: {Math.floor(timeLeft / 60)}:
          {("0" + (timeLeft % 60)).slice(-2)}
        </h3>
      </div>
      <div>
        <Button size="default" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
};

export default StudyPauseCycle;
