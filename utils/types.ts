export type actionFunction = (prevState:any,formData:FormData)=>Promise<{message:string}>
import { IconType } from "react-icons";

export type JobCardProps={
    id:string;
    title:string;
    tagline:string;
    location:string;
    employmentType :string
    salary:string;
    level:string;
    company?: { name: string };
}

export type ClearFilter = {
    label: string;
    icon: IconType;
  };

  export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Freelance' | 'Internship' | 'Remote';

 export const getEmploymentTypeClass = (type: EmploymentType) => {
    switch (type) {
      case 'Full-Time':
        return 'bg-green-100 text-green-600';
      case 'Part-Time':
        return 'bg-yellow-100 text-yellow-600';
      case 'Contract':
        return 'bg-red-100 text-red-600';
      case 'Freelance':
        return 'bg-purple-100 text-purple-600';
      case 'Internship':
        return 'bg-blue-100 text-blue-600';
      case 'Remote':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600'; // Default style
    }
  };

  export type StatusType = 'pending' | 'rejected' | 'interview'; 
  
  export const getStatusTypeClass = (type: StatusType) => {
    switch (type) {
      case 'interview':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600'; // Default style
    }
  };

  export type LevelType = 'intern' | 'entry-level' | 'mid-Level' | 'managerial' | 'executive'