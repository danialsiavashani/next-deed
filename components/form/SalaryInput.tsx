import { salaryRange } from '@/utils/links';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const name = 'salary';
function SalaryInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Salary Range
        <Select
          defaultValue={defaultValue || salaryRange[0].type}
          name={name}
          required
        >
          <SelectTrigger id={name}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {salaryRange.map((item) => {
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
export default SalaryInput;
