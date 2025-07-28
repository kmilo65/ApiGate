/**
 * User Service - Handles user operations with explicit user model
 */

import { createUserObject, validateUserData, USER_ROLES, USER_STATUS } from './userModel';

/**
 * User Service Class
 */
export class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data from OAuth provider
   * @returns {Object} Created user object
   */
  static async createUser(userData) {
    try {
      // Validate user data
      const validation = validateUserData(userData);
      if (!validation.isValid) {
        throw new Error(`User validation failed: ${validation.errors.join(', ')}`);
      }

      // Create user object with defaults
      const user = createUserObject(userData);

      // Here you would typically save to database
      // For now, we'll just return the user object
      console.log('Creating user:', user);

      return {
        success: true,
        user,
        message: 'User created successfully'
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update user data
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated user object
   */
  static async updateUser(userId, updates) {
    try {
      // Validate updates
      const validation = validateUserData(updates);
      if (!validation.isValid) {
        throw new Error(`Update validation failed: ${validation.errors.join(', ')}`);
      }

      // Here you would typically update in database
      console.log('Updating user:', userId, updates);

      return {
        success: true,
        message: 'User updated successfully'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object} User object
   */
  static async getUserById(userId) {
    try {
      // Here you would typically fetch from database
      console.log('Getting user by ID:', userId);

      // Mock user data for demonstration
      const user = createUserObject({
        id: userId,
        email: 'user@example.com',
        name: 'Example User'
      });

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Object} User object
   */
  static async getUserByEmail(email) {
    try {
      // Here you would typically fetch from database
      console.log('Getting user by email:', email);

      // Mock user data for demonstration
      const user = createUserObject({
        email,
        name: 'Example User'
      });

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update user login statistics
   * @param {string} userId - User ID
   * @returns {Object} Update result
   */
  static async updateLoginStats(userId) {
    try {
      // Here you would typically update login stats in database
      console.log('Updating login stats for user:', userId);

      return {
        success: true,
        message: 'Login stats updated'
      };
    } catch (error) {
      console.error('Error updating login stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user can create more API keys
   * @param {string} userId - User ID
   * @returns {Object} Check result
   */
  static async canCreateApiKey(userId) {
    try {
      // Here you would typically check user's API key limits
      console.log('Checking API key limits for user:', userId);

      // Mock check - in real app, fetch user data from database
      const user = await this.getUserById(userId);
      
      if (!user.success) {
        return {
          canCreate: false,
          reason: 'User not found'
        };
      }

      const canCreate = user.user.apiKeysUsed < user.user.apiKeysLimit;
      
      return {
        canCreate,
        current: user.user.apiKeysUsed,
        limit: user.user.apiKeysLimit,
        remaining: user.user.apiKeysLimit - user.user.apiKeysUsed
      };
    } catch (error) {
      console.error('Error checking API key limits:', error);
      return {
        canCreate: false,
        reason: 'Error checking limits'
      };
    }
  }

  /**
   * Increment user's API key count
   * @param {string} userId - User ID
   * @returns {Object} Update result
   */
  static async incrementApiKeyCount(userId) {
    try {
      // Here you would typically increment in database
      console.log('Incrementing API key count for user:', userId);

      return {
        success: true,
        message: 'API key count incremented'
      };
    } catch (error) {
      console.error('Error incrementing API key count:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Decrement user's API key count
   * @param {string} userId - User ID
   * @returns {Object} Update result
   */
  static async decrementApiKeyCount(userId) {
    try {
      // Here you would typically decrement in database
      console.log('Decrementing API key count for user:', userId);

      return {
        success: true,
        message: 'API key count decremented'
      };
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