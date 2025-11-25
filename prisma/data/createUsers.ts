import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUsers() {
  const users = [
    {
      first_name: "James",
      middle_name: "Paul",
      last_name: "Ilagan",
      email: "james@example.com",
      role: "SUPER_ADMIN" as const,
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
    {
      first_name: "John",
      middle_name: "Morgan",
      last_name: "Doe",
      email: "john@example.com",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
    {
      first_name: "Mark",
      middle_name: "Kanlo",
      last_name: "Kanlas",
      email: "mark@example.com",
      password: "$2a$12$Ax19rFKcGjJGjrvLoeQP.ee9decDIHjjfPEal32RztBO0htNnWKIW",
    },
  ];

  for (const user of users) {
    const createdUser = await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });

    console.log(
      `Create user: ${createdUser.first_name} ${createdUser.last_name}`
    );
  }

  return users;
}
