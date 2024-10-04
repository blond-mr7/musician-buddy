import { useState } from "react";
import { Button } from "@/components/ui/button";

const TapTempo: React.FC<{ setBpm: (bpm: number) => void }> = ({ setBpm }) => {
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [bpm, setCalculatedBpm] = useState<number | null>(null);

  const handleTap = () => {
    const currentTapTime = Date.now();

    if (lastTapTime) {
      const interval = currentTapTime - lastTapTime;

      const newBpm = 60000 / interval;

      setCalculatedBpm(Math.round(newBpm));
      setBpm(Math.round(newBpm));
    }

    setLastTapTime(currentTapTime);
  };

  return (
    <div>
      <h3>Tap Tempo</h3>
      <Button onClick={handleTap}>Tap</Button>
    </div>
  );
};

export default TapTempo;
