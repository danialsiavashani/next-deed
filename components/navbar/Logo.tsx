import Link from 'next/link';
import { CgWorkAlt } from 'react-icons/cg';
import { Button } from '../ui/button';

function Logo() {
  return (
    <Button asChild>
      <Link href="/">
        <CgWorkAlt className="w-6 h-7" />
      </Link>
    </Button>
  );
}
export default Logo;
