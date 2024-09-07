import { signOutUser } from '@/app/actions/authActions';

function SignOut() {
  return (
    <form action={signOutUser}>
      <button type="submit" color="primary">
        Sing out
      </button>
    </form>
  );
}
export default SignOut;
