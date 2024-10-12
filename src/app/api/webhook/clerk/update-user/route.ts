import prisma from "clients/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.data.email_addresses.at(0).email_address;
  await prisma.user.update({
    data: {
      firstName: body.data.first_name as string,
      lastName: body.data.last_name as string,
    },
    where: {
      email,
    },
  });

  console.log({ body });
  return Response.json({ status: true });
}
