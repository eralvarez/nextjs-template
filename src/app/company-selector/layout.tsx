import { headers } from 'next/headers';
import { Box, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { DashboardLayout } from 'components/layouts/dashboardLayout';
import { auth } from 'lib/auth';
import { prisma } from 'lib/prisma';

export default async function RootAppLayout({ children }: { children: React.ReactNode }) {
  const sessionResponse = await auth.api.getSession({ headers: await headers() });
  if (!sessionResponse) {
    redirect('/sign-in');
  }
  const { session, user } = sessionResponse!;
  const members = await prisma.member.findMany({
    where: { userId: user.id },
    include: { company: true },
  });

  console.log({ session, user, members });

  if (members.length === 0) {
    return <div>Please contact support to be added to a company.</div>;
  }

  if (members.length > 1) {
    return (
      <Box>
        <Typography>Select a Company</Typography>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <a href={`/app/${member.company.id}`}>{member.company.name}</a>
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  redirect(`/app/${members[0].company.id}`);

  // return null;
}
