/**
 * Database Configuration
 * This file shows different approaches: No ORM vs With ORM
 */

// ============================================================================
// APPROACH 1: NO ORM (Current Implementation)
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// Direct Supabase client (no ORM)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Raw SQL operations
export const userOperations = {
  // Create user
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    return { data, error };
  },

  // Get user by email
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  // Update user
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  }
};

// ============================================================================
// APPROACH 2: WITH PRISMA ORM (Alternative)
// ============================================================================

/*
// If we were using Prisma ORM:

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Prisma schema would look like:
/*
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  emailVerified DateTime?
  image         String?
  
  role          UserRole @default(USER)
  status        UserStatus @default(ACTIVE)
  lastLogin     DateTime?
  loginCount    Int      @default(0)
  
  apiKeysLimit  Int      @default(10)
  apiKeysUsed   Int      @default(0)
  preferences   Json     @default("{}")
  
  googleId      String?  @unique
  locale        String?
  timezone      String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  apiKeys       ApiKey[]
}

enum UserRole {
  USER
  ADMIN
  MODERATOR
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
*/

// Prisma operations
export const prismaUserOperations = {
  // Create user
  async createUser(userData) {
    try {
      const user = await prisma.user.create({
        data: userData
      });
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user
  async updateUser(userId, updates) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates
      });
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// ============================================================================
// APPROACH 3: WITH DRIZZLE ORM (Alternative)
// ============================================================================

/*
// If we were using Drizzle ORM:

import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// Schema definition
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  
  role: text('role').notNull().default('user'),
  status: text('status').notNull().default('active'),
  lastLogin: timestamp('lastLogin'),
  loginCount: integer('loginCount').notNull().default(0),
  
  apiKeysLimit: integer('apiKeysLimit').notNull().default(10),
  apiKeysUsed: integer('apiKeysUsed').notNull().default(0),
  preferences: jsonb('preferences').notNull().default('{}'),
  
  googleId: text('googleId').unique(),
  locale: text('locale'),
  timezone: text('timezone'),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

// Drizzle operations
export const drizzleUserOperations = {
  // Create user
  async createUser(userData) {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
*/

// ============================================================================
// CURRENT APPROACH SUMMARY
// ============================================================================

/**
 * Current Implementation: No ORM
 * 
 * Pros:
 * - Simpler setup
 * - Direct control over SQL
 * - No additional dependencies
 * - Works well with Supabase
 * 
 * Cons:
 * - No type safety
 * - Manual SQL queries
 * - No automatic migrations
 * - More boilerplate code
 * 
 * What we're using:
 * 1. Supabase Client (direct database operations)
 * 2. Raw SQL for schema
 * 3. Custom validation functions
 * 4. NextAuth.js for auth
 */

export default {
  // Export current approach
  supabase,
  userOperations,
  
  // Export alternative approaches (commented out)
  // prismaUserOperations,
  // drizzleUserOperations
}; 