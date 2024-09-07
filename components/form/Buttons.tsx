'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { LuPenSquare, LuTrash2 } from 'react-icons/lu';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  disabled?: boolean;
};

export function SubmitButton({
  className = '',
  text = '',
  size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-2 animate-spin" />
          please wait
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export function AcceptButton({
  className = '',
  text = '',
  size = 'lg',
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-2 animate-spin" />
          please wait
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type actionType = 'edit' | 'delete';

export const IconButton = ({
  actionType,
  className,
}: {
  actionType: actionType;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <LuPenSquare />;
      case 'delete':
        return <LuTrash2 />;

      default:
        const never: never = actionType;
        throw new Error(` ${never}`);
    }
  };
  return (
    <Button
      type="submit"
      size="icon"
      variant="link"
      className={`p-2 cursor-pointer ${className}`}
    >
      {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
    </Button>
  );
};

export const CardSubmitButton = ({ isSave }: { isSave: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className="p-2 cursor-pointer"
    >
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isSave ? (
        <FaBookmark />
      ) : (
        <FaRegBookmark />
      )}
    </Button>
  );
};
