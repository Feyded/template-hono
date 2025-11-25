import { PrismaClient } from "@prisma/client";
import { ConflictError, NotFoundError } from "../utils/error.js";
import { hash } from "@node-rs/bcrypt";

const prisma = new PrismaClient();

type CreateUserDataArgs = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
};

type UpdateUserDataArgs = Omit<CreateUserDataArgs, "password" | "email">;

export async function getUsersData() {
  return await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      middle_name: true,
      last_name: true,
      role: true,
      is_active: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function getUserData(id: string) {
  const user = await prisma.users.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function createUserData(payload: CreateUserDataArgs) {
  const emailExist = await prisma.users.findUnique({
    where: { email: payload.email },
  });

  if (emailExist) {
    throw new ConflictError("Email already exist.");
  }

  const hashPassword = await hash(payload.password, 10);

  const newUser = await prisma.users.create({
    data: {
      ...payload,
      password: hashPassword,
    },
  });

  const {password, ...userWithoutPassword} = newUser;
  
  return userWithoutPassword;
}

export async function updateUserData(id: string, payload: UpdateUserDataArgs) {
  const user = await prisma.users.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      first_name: payload.first_name,
      middle_name: payload.middle_name,
      last_name: payload.last_name,
    },
  });

  return updatedUser;
}
