import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import type { User, UserAddress, PublicUser } from '@/types/user';
import type { User as PrismaUser, UserAddress as PrismaAddress } from '@/lib/generated/prisma';

function toAddress(row: PrismaAddress): UserAddress {
  return {
    id: row.id,
    label: row.label,
    firstName: row.firstName,
    lastName: row.lastName,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
    isDefault: row.isDefault,
  };
}

function toUser(row: PrismaUser & { addresses: PrismaAddress[] }): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone ?? undefined,
    passwordHash: row.passwordHash,
    addresses: row.addresses.map(toAddress),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { addresses: true },
  });
  return row ? toUser(row) : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });
  return row ? toUser(row) : undefined;
}

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
  const passwordHash = await hashPassword(password);
  const row = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstName,
      lastName,
      passwordHash,
    },
    include: { addresses: true },
  });
  return toUser(row);
}

export async function updateUser(id: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>): Promise<User | undefined> {
  try {
    const row = await prisma.user.update({
      where: { id },
      data: updates,
      include: { addresses: true },
    });
    return toUser(row);
  } catch {
    return undefined;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export async function addUserAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress | undefined> {
  try {
    if (address.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const row = await prisma.userAddress.create({
      data: {
        userId,
        label: address.label,
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        isDefault: address.isDefault,
      },
    });
    return toAddress(row);
  } catch {
    return undefined;
  }
}

export async function updateUserAddress(userId: string, addressId: string, updates: Partial<Omit<UserAddress, 'id'>>): Promise<UserAddress | undefined> {
  try {
    if (updates.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const row = await prisma.userAddress.update({
      where: { id: addressId, userId },
      data: updates,
    });
    return toAddress(row);
  } catch {
    return undefined;
  }
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<boolean> {
  try {
    await prisma.userAddress.delete({
      where: { id: addressId, userId },
    });
    return true;
  } catch {
    return false;
  }
}
