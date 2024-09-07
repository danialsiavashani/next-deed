'use client';
import { employmentType } from '@/utils/links';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const name = 'employmentType';
function EmploymentTypeList({
  employmentTypes,
  level,
  salary,
  search,
}: {
  employmentTypes?: string;
  level?: string;
  salary?: string;
  search?: string;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const levelParam = searchParams.get('employmentTypes');
    setSelectedValue(levelParam || 'All');
  }, [searchParams]);
  const [selectedValue, setSelectedValue] = useState('All'); // default value
  const router = useRouter();
  const searchTerm = search ? `&search=${search}` : '';
  const salaryFilter = salary ? `&salary=${salary}` : '';
  const levelFilter = level && level !== 'All' ? `&level=${level}` : '';

  const handleSelectChange = (value: string) => {
    const employmentTypeFilter =
      value && value !== 'All' ? `&employmentTypes=${value}` : '';

    const newUrl = `/?${searchTerm}${salaryFilter}${employmentTypeFilter}${levelFilter}`;

    setSelectedValue(value);
    router.push(newUrl); // Programmatically navigate to the new URL
  };

  return (
    <div className="mb-2">
      <Label htmlFor="name" className="capitalize">
        Employment Type
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
            {employmentType.map((item) => {
              return (
                <SelectItem key={item.type} value={item.type}>
                  <Link href={`/?employmentTypes=${item.type}${searchTerm}`}>
                    {item.type}
                  </Link>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
export default EmploymentTypeList;
