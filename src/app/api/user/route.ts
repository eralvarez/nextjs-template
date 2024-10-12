import prisma from "clients/prisma";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();

  return Response.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    },
  });

  return Response.json({ status: true });
}
