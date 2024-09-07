'use client';
import { salaryRange } from '@/utils/links';
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

const name = 'salary';
function SalarySearch({
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
    const levelParam = searchParams.get('salary');
    setSelectedValue(levelParam || 'All');
  }, [searchParams]);
  const [selectedValue, setSelectedValue] = useState('All'); // default value
  const router = useRouter();

  const searchTerm = search ? `&search=${search}` : '';
  const levelFilter = level && level !== 'All' ? `&level=${level}` : '';
  const employmentTypeFilter = employmentTypes
    ? `&employmentTypes=${employmentTypes}`
    : '';

  const handleSelectChange = (value: string) => {
    // Construct the new URL with both salary and employmentTypes filters
    let newUrl = `/?${searchTerm}${employmentTypeFilter}${levelFilter}`;

    // Include salary filter only if value is not 'All'
    if (value !== 'All') {
      newUrl = `/?salary=${value}${searchTerm}${employmentTypeFilter}${levelFilter}`;
    }
    setSelectedValue(value);
    router.push(newUrl); // Programmatically navigate to the new URL
  };
  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Salary range
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
export default SalarySearch;
