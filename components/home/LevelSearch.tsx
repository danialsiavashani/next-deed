'use client';
import { levels } from '@/utils/links';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const name = 'level';
function LevelSearch({
  level,
  salary,
  employmentTypes,
  search,
}: {
  level?: string;
  salary?: string;
  employmentTypes?: string;
  search?: string;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const levelParam = searchParams.get('level');
    setSelectedValue(levelParam || 'All');
  }, [searchParams]);
  const [selectedValue, setSelectedValue] = useState('All'); // default value
  const router = useRouter();

  const searchTerm = search ? `&search=${search}` : '';
  const salaryFilter = salary && salary !== 'All' ? `&salary=${salary}` : '';
  const employmentTypeFilter = employmentTypes
    ? `&employmentTypes=${employmentTypes}`
    : '';
  const handleSelectChange = (value: string) => {
    // Construct the base URL with existing filters
    let newUrl = `/?${searchTerm}${employmentTypeFilter}${salaryFilter}`;

    // Add the salary filter if the value is not 'All' and it's a valid salary value
    if (value !== 'All') {
      newUrl = `/?level=${value}${searchTerm}${employmentTypeFilter}${salaryFilter}`;
    }
    setSelectedValue(value);
    router.push(newUrl); // Programmatically navigate to the new URL
  };

  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Employment Level
        <Select
          name={name}
          value={selectedValue}
          onValueChange={handleSelectChange}
          required
        >
          <SelectTrigger id={name}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
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
export default LevelSearch;
