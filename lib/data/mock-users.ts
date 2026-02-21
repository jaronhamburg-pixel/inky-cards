import { User, UserAddress, PublicUser } from '@/types/user';

// Simple hash for demo only — NOT cryptographically secure
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

const seedUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '555-0123',
    passwordHash: simpleHash('password123'),
    addresses: [
      {
        id: '1',
        label: 'Home',
        firstName: 'Sarah',
        lastName: 'Johnson',
        address: '123 Maple Street',
        city: 'London',
        state: '',
        zip: 'SW1A 1AA',
        country: 'GB',
        isDefault: true,
      },
    ],
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '',
    passwordHash: simpleHash('password123'),
    addresses: [
      {
        id: '2',
        label: 'Home',
        firstName: 'John',
        lastName: 'Smith',
        address: '456 Oak Avenue',
        city: 'Manchester',
        state: '',
        zip: 'M1 1AA',
        country: 'GB',
        isDefault: true,
      },
    ],
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-20'),
  },
];

let userStorage: User[] = [...seedUsers];
let userCounter = seedUsers.length + 1;
let addressCounter = seedUsers.reduce((sum, u) => sum + u.addresses.length, 0) + 1;

export function getUserByEmail(email: string): User | undefined {
  return userStorage.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return userStorage.find((u) => u.id === id);
}

export function createUser(email: string, password: string, firstName: string, lastName: string): User {
  const user: User = {
    id: String(userCounter++),
    email: email.toLowerCase(),
    firstName,
    lastName,
    passwordHash: simpleHash(password),
    addresses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  userStorage.push(user);
  return user;
}

export function updateUser(id: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>): User | undefined {
  const user = userStorage.find((u) => u.id === id);
  if (!user) return undefined;
  Object.assign(user, updates);
  user.updatedAt = new Date();
  return user;
}

export function authenticateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.passwordHash !== simpleHash(password)) return null;
  return user;
}

// Address helpers
export function addUserAddress(userId: string, address: Omit<UserAddress, 'id'>): UserAddress | undefined {
  const user = userStorage.find((u) => u.id === userId);
  if (!user) return undefined;

  const newAddress: UserAddress = { ...address, id: String(addressCounter++) };
  if (newAddress.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(newAddress);
  user.updatedAt = new Date();
  return newAddress;
}

export function updateUserAddress(userId: string, addressId: string, updates: Partial<Omit<UserAddress, 'id'>>): UserAddress | undefined {
  const user = userStorage.find((u) => u.id === userId);
  if (!user) return undefined;

  const address = user.addresses.find((a) => a.id === addressId);
  if (!address) return undefined;

  if (updates.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  Object.assign(address, updates);
  user.updatedAt = new Date();
  return address;
}

export function deleteUserAddress(userId: string, addressId: string): boolean {
  const user = userStorage.find((u) => u.id === userId);
  if (!user) return false;

  const index = user.addresses.findIndex((a) => a.id === addressId);
  if (index === -1) return false;

  user.addresses.splice(index, 1);
  user.updatedAt = new Date();
  return true;
}
