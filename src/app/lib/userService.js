/**
 * User Service - Handles user operations with integrated NextAuth + Custom App Users
 */

import { createUserObject, validateUserData, USER_ROLES, USER_STATUS } from './userModel';
import { supabase } from './supabaseClient';

/**
 * Generate a UUID for user ID
 */
function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * User Service Class - Integrated with NextAuth
 */
export class UserService {
  /**
   * Create a new user in the integrated schema (Hybrid Approach)
   * @param {Object} userData - User data from OAuth provider
   * @param {string} nextauthUserId - NextAuth user ID (optional, for linking)
   * @returns {Object} Created user object
   */
  static async createUser(userData, nextauthUserId = null) {
    try {
      // Validate user data
      const validation = validateUserData(userData);
      if (!validation.isValid) {
        throw new Error(`User validation failed: ${validation.errors.join(', ')}`);
      }

      // Create user object with defaults
      const user = createUserObject(userData);
      
      // Store the original OAuth ID separately
      const oauthId = userData.id || userData.provider_id;

      // Save to Supabase database if environment variables are configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // First, create the NextAuth user in the users table
        const { data: nextAuthUser, error: nextAuthError } = await supabase
          .from('users')
          .insert([{
            name: user.name,
            email: user.email,
            image: user.image
          }])
          .select()
          .single();

        if (nextAuthError) {
          console.error('Error creating NextAuth user:', nextAuthError);
          throw new Error(`NextAuth user creation error: ${nextAuthError.message}`);
        }

        console.log('✅ NextAuth user created:', nextAuthUser);

        // Then, create the corresponding app_user record
        const { data: appUser, error: appUserError } = await supabase
          .from('app_users')
          .insert([{
            nextauth_user_id: nextAuthUser.id, // Link to the NextAuth user we just created
            name: user.name,
            email: user.email,
            image: user.image,
            provider: user.provider || 'google',
            provider_id: oauthId, // Store original OAuth ID here
            role: user.role,
            status: user.status,
            api_keys_limit: user.apiKeysLimit,
            api_keys_used: user.apiKeysUsed,
            preferences: user.preferences,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (appUserError) {
          console.error('Error creating app user:', appUserError);
          // Try to clean up the NextAuth user if app_user creation fails
          await supabase.from('users').delete().eq('id', nextAuthUser.id);
          throw new Error(`App user creation error: ${appUserError.message}`);
        }

        console.log('✅ App user created:', appUser);
        return {
          success: true,
          user: appUser,
          nextAuthUser: nextAuthUser,
          message: 'User created successfully in both NextAuth and app_users tables'
        };
      } else {
        // Fallback when Supabase is not configured
        console.log('Supabase not configured, user created in memory:', user);
        return {
          success: true,
          user,
          message: 'User created successfully (no database)'
        };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user by email from integrated schema
   * @param {string} email - User email
   * @returns {Object} User object from integrated view
   */
  static async getUserByEmail(email) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // First try to get from integrated_users view
        const { data, error } = await supabase
          .from('integrated_users')
          .select('*')
          .eq('nextauth_email', email)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user by email from integrated view:', error);
          // Fallback: try to get from app_users table directly
          const { data: appUserData, error: appUserError } = await supabase
            .from('app_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (appUserError) {
            console.error('Error fetching user by email from app_users:', appUserError);
            throw new Error(`Database error: ${appUserError.message}`);
          }

          if (!appUserData) {
            console.log('No user found with email:', email);
            return {
              success: true,
              user: null
            };
          }

          console.log('User fetched from app_users table:', appUserData);
          return {
            success: true,
            user: appUserData
          };
        }

        if (!data) {
          console.log('No user found with email:', email);
          return {
            success: true,
            user: null
          };
        }

        console.log('User fetched from integrated database:', data);
        return {
          success: true,
          user: data
        };
      } else {
        // Fallback when Supabase is not configured
        console.log('Supabase not configured, returning mock user for email:', email);
        const mockUser = createUserObject({
          email,
          name: 'Mock User'
        });
        return {
          success: true,
          user: mockUser
        };
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user by NextAuth user ID
   * @param {string} nextauthUserId - NextAuth user ID
   * @returns {Object} User object from integrated view
   */
  static async getUserByNextAuthId(nextauthUserId) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // First try to get from integrated_users view
        const { data, error } = await supabase
          .from('integrated_users')
          .select('*')
          .eq('nextauth_user_id', nextauthUserId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user by NextAuth ID from integrated view:', error);
          // Fallback: try to get from app_users table directly
          const { data: appUserData, error: appUserError } = await supabase
            .from('app_users')
            .select('*')
            .eq('nextauth_user_id', nextauthUserId)
            .maybeSingle();

          if (appUserError) {
            console.error('Error fetching user by NextAuth ID from app_users:', appUserError);
            throw new Error(`Database error: ${appUserError.message}`);
          }

          return {
            success: true,
            user: appUserData
          };
        }

        return {
          success: true,
          user: data
        };
      } else {
        return {
          success: true,
          user: null
        };
      }
    } catch (error) {
      console.error('Error getting user by NextAuth ID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update user login statistics
   * @param {string} email - User email
   * @returns {Object} Update result
   */
  static async updateLoginStats(email) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use the helper function to update login stats
        const { data, error } = await supabase
          .rpc('update_user_login_stats', { user_email: email });

        if (error) {
          console.error('Error updating login stats in database:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log('Login stats updated in database for email:', email);
        return {
          success: true,
          message: 'Login stats updated'
        };
      } else {
        console.log('Supabase not configured, login stats not updated');
        return {
          success: true,
          message: 'Login stats updated (no database)'
        };
      }
    } catch (error) {
      console.error('Error updating login stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update user data
   * @param {string} nextauthUserId - NextAuth user ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated user object
   */
  static async updateUser(nextauthUserId, updates) {
    try {
      // Validate updates
      const validation = validateUserData(updates);
      if (!validation.isValid) {
        throw new Error(`User validation failed: ${validation.errors.join(', ')}`);
      }

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('app_users')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('nextauth_user_id', nextauthUserId)
          .select()
          .single();

        if (error) {
          console.error('Error updating user in database:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log('User updated in database:', data);
        return {
          success: true,
          user: data,
          message: 'User updated successfully'
        };
      } else {
        console.log('Supabase not configured, user updated in memory');
        return {
          success: true,
          user: updates,
          message: 'User updated successfully (no database)'
        };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user can create API key
   * @param {string} nextauthUserId - NextAuth user ID
   * @returns {Object} Check result
   */
  static async canCreateApiKey(nextauthUserId) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('app_users')
          .select('api_keys_limit, api_keys_used')
          .eq('nextauth_user_id', nextauthUserId)
          .single();

        if (error) {
          console.error('Error checking API key limit:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        const canCreate = data.api_keys_used < data.api_keys_limit;
        
        return {
          success: true,
          canCreate,
          current: data.api_keys_used,
          limit: data.api_keys_limit
        };
      } else {
        return {
          success: true,
          canCreate: true,
          current: 0,
          limit: 10
        };
      }
    } catch (error) {
      console.error('Error checking API key limit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Increment API key count
   * @param {string} nextauthUserId - NextAuth user ID
   * @returns {Object} Update result
   */
  static async incrementApiKeyCount(nextauthUserId) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('app_users')
          .update({
            api_keys_used: supabase.sql`api_keys_used + 1`,
            updated_at: new Date().toISOString()
          })
          .eq('nextauth_user_id', nextauthUserId)
          .select()
          .single();

        if (error) {
          console.error('Error incrementing API key count:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        return {
          success: true,
          user: data,
          message: 'API key count incremented'
        };
      } else {
        return {
          success: true,
          message: 'API key count incremented (no database)'
        };
      }
    } catch (error) {
      console.error('Error incrementing API key count:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Decrement API key count
   * @param {string} nextauthUserId - NextAuth user ID
   * @returns {Object} Update result
   */
  static async decrementApiKeyCount(nextauthUserId) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('app_users')
          .update({
            api_keys_used: supabase.sql`GREATEST(api_keys_used - 1, 0)`,
            updated_at: new Date().toISOString()
          })
          .eq('nextauth_user_id', nextauthUserId)
          .select()
          .single();

        if (error) {
          console.error('Error decrementing API key count:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        return {
          success: true,
          user: data,
          message: 'API key count decremented'
        };
      } else {
        return {
          success: true,
          message: 'API key count decremented (no database)'
        };
      }
    } catch (error) {
      console.error('Error decrementing API key count:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default UserService; 