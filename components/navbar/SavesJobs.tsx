import Link from 'next/link';
import { Button } from '../ui/button';
import { BsBookmarksFill } from 'react-icons/bs';
function SavesJobs() {
  return (
    <Button asChild>
      <Link href="/jobs/saves">
        <BsBookmarksFill className="w-6 h-7" />
      </Link>
    </Button>
  );
}
export default SavesJobs;
