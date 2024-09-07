import { createClient } from '@supabase/supabase-js';

const bucket = 'temp-next-deed'; // Replace with your actual bucket for resumes

const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_KEY as string;

export const supabase = createClient(url, key);

export const uploadResume = async (resume: File) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${resume.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, resume, { cacheControl: '3600' });

  if (error || !data) {
    throw new Error('Resume upload failed');
  }

  const publicUrlData = supabase.storage.from(bucket).getPublicUrl(newName);
  
  if (!publicUrlData.data?.publicUrl) {
    throw new Error('Failed to retrieve resume public URL');
  }

  return publicUrlData.data.publicUrl;
};

export const deleteResume = async (resumePath: string) => {
  try {
    // Decode URL to get the actual file path
    const decodedUrl = decodeURIComponent(resumePath);
    
    // Extract the filename from the decoded URL
    const parts = decodedUrl.split('/');
    const relativePath = parts.pop(); // Extract the filename from the URL
    if (!relativePath) {
      throw new Error('Invalid resume path');
    }

    const { error } = await supabase.storage
      .from(bucket) // Adjust based on your bucket name
      .remove([relativePath]);
      
    if (error) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
    console.log('relativePath=>>>>>>>>>',relativePath);
    
        console.log(error);

    return { message: 'Resume deleted successfully' };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { error: 'An error occurred while deleting the resume.' };
  }
};