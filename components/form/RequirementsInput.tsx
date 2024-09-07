'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

function RequirementsInput({
  requirementProps,
}: {
  requirementProps?: string[];
}) {
  const [minimumRequirements, setMinimumRequirements] = useState<string[]>(
    requirementProps || ['']
  );

  const handleRequirementsChange = (index: number, value: string) => {
    const newSteps = [...minimumRequirements];
    newSteps[index] = value;
    setMinimumRequirements(newSteps);
  };

  const handleAddRequirement = () => {
    setMinimumRequirements([...minimumRequirements, '']);
  };

  const handleRemoveRequirement = (index: number) => {
    const newSteps = minimumRequirements.filter((_, i) => i !== index);
    setMinimumRequirements(newSteps);
  };
  return (
    <>
      {minimumRequirements.map((minimumRequirement, index) => (
        <div key={index} className="mb-2 flex items-center">
          <input
            type="hidden"
            name="minimumRequirements"
            value={JSON.stringify(minimumRequirements)}
          />
          <input
            name={`requirement-${index}`} // Updated the name attribute to make each step distinct
            type="text"
            value={minimumRequirement}
            onChange={(e) => handleRequirementsChange(index, e.target.value)}
            placeholder={`Requirement ${index + 1}`}
            className="border p-2 w-full"
          />
          <Button
            type="button"
            onClick={() => handleRemoveRequirement(index)}
            className="ml-2 bg-red-500 hover:bg-red-300 text-white px-4 py-2"
          >
            <FaRegTrashCan />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddRequirement}
        className="text-white px-4 py-2"
      >
        <IoMdAdd />
      </Button>
    </>
  );
}
export default RequirementsInput;
