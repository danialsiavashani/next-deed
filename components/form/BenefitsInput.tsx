'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

function BenefitsInput({ benefitProps }: { benefitProps?: string[] }) {
  const [benefits, setBenefits] = useState<string[]>(benefitProps || ['']);
  const handleBenefitsChange = (index: number, value: string) => {
    const newSteps = [...benefits];
    newSteps[index] = value;
    setBenefits(newSteps);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const handleRemoveBenefit = (index: number) => {
    const newSteps = benefits.filter((_, i) => i !== index);
    setBenefits(newSteps);
  };
  return (
    <>
      {benefits.map((benefit, index) => (
        <div key={index} className="mb-2 flex items-center">
          <input
            type="hidden"
            name="benefits"
            value={JSON.stringify(benefits)}
          />
          <input
            name={`benefit-${index}`} // Updated the name attribute to make each step distinct
            type="text"
            value={benefit}
            onChange={(e) => handleBenefitsChange(index, e.target.value)}
            placeholder={`Benefit ${index + 1}`}
            className="border p-2 w-full"
          />
          <Button
            type="button"
            onClick={() => handleRemoveBenefit(index)}
            className="ml-2 bg-red-500 hover:bg-red-300 text-white px-4 py-2"
          >
            <FaRegTrashCan />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddBenefit}
        className="text-white px-4 py-2"
      >
        <IoMdAdd />
      </Button>
    </>
  );
}
export default BenefitsInput;
