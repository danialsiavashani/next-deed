import { employmentType } from '@/utils/links';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const name = 'employmentType';
function EmploymentTypeInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Employment Type
        <Select
          defaultValue={defaultValue || employmentType[0].type}
          name={name}
          required
        >
          <SelectTrigger id={name}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {employmentType.map((item) => {
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
export default EmploymentTypeInput;
