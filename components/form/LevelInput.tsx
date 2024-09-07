import { levels } from '@/utils/links';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const name = 'level';
function LevelInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Level
        <Select
          defaultValue={defaultValue || levels[0].type}
          name={name}
          required
        >
          <SelectTrigger id={name}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levels.map((item) => {
              return (
                <SelectItem key={item.type} value={item.type}>
                  {item.type}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
export default LevelInput;
