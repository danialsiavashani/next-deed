'use client';

import { toggleSaveAction } from '@/app/actions/companyActions';
import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { CardSubmitButton } from '../form/Buttons';

type SaveToggleFormProps = {
  jobId: string;
  saveId: string | null;
};

function SaveToggleForm({ jobId, saveId }: SaveToggleFormProps) {
  const pathname = usePathname();
  const toggleAction = toggleSaveAction.bind(null, {
    jobId,
    saveId,
    pathname,
  });
  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isSave={saveId ? true : false} />
    </FormContainer>
  );
}
export default SaveToggleForm;
