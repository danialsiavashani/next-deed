import { fetchSaveId } from '@/app/actions/companyActions';
import SaveToggleForm from './SaveToggleForm';

async function SaveToggleButton({ jobId }: { jobId: string }) {
  const saveId = await fetchSaveId({ jobId });
  return <SaveToggleForm saveId={saveId} jobId={jobId} />;
}
export default SaveToggleButton;
