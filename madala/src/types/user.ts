export interface Address {
  street: string;
  city: string;
  district: string;
  province: string;
  zipCode: string;
  country: string;
}

export interface User {
  _id: string;  // Consistent với MongoDB
  email: string;
  name: string;  // Consistent với model
  firstName?: string;  // Optional fields
  lastName?: string;
  fullName?: string;
  phone?: string;
  image?: string;  // Consistent với model
  address?: Address;
  roles: 'user' | 'admin';  // Consistent với model và admin.ts
  isActive?: boolean;
  createdAt: string;  // Consistent với MongoDB
  updatedAt: string;  // Consistent với MongoDB
  registeredAt?: string;  // Alias for createdAt
  lastLogin?: string;
}
