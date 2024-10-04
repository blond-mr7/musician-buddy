import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

type TimeSignatureProps = {
  timeSignature: string;
  setTimeSignature: (timeSignature: string) => void;
};

const TimeSignature = ({
  timeSignature,
  setTimeSignature,
}: TimeSignatureProps) => {
  const handleTimeSignatureChange = (value: string) => {
    setTimeSignature(value);
  };

  return (
    <div>
      <h3>Select Time Signature</h3>
      <div className="w-1/2 lg:w-1/4">
        <Select value={timeSignature} onValueChange={handleTimeSignatureChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time Signature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2/4</SelectItem>
            <SelectItem value="3">3/4</SelectItem>
            <SelectItem value="4">4/4</SelectItem>
            <SelectItem value="5">5/4</SelectItem>
            <SelectItem value="6">6/4</SelectItem>
            <SelectItem value="7">7/4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeSignature;
