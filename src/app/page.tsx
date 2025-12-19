import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from 'lib/auth';

export default async function HomePage() {
  const sessionResponse = await auth.api.getSession({ headers: await headers() });
  if (sessionResponse) {
    redirect('/company-selector');
  } else {
    redirect('/sign-in');
  }
}
