import prisma from "clients/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  await prisma.user.create({
    data: {
      clerkUserId: body.data.id,
      firstName: body.data.first_name,
      lastName: body.data.last_name,
      email: body.data.email_addresses.at(0).email_address,
    },
  });

  console.log({ body });
  return Response.json({ status: true });
}
