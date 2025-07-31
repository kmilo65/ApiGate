/**
 * User Model - Explicit definition of user data structure
 * This model defines all the fields that a user can have in our application
 */

// User roles enum
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// User status enum
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

/**
 * User Model Structure
 * This represents the complete user data structure
 */
export const UserModel = {
  // Primary identification
  id: {
    type: 'uuid',
    required: true,
    description: 'Unique user identifier'
  },

  // Google OAuth data (from NextAuth.js)
  name: {
    type: 'string',
    required: false,
    description: 'User\'s full name from Google account'
  },
  email: {
    type: 'string',
    required: true,
    description: 'User\'s email address'
  },
  emailVerified: {
    type: 'timestamp',
    required: false,
    description: 'Email verification timestamp'
  },
  image: {
    type: 'string',
    required: false,
    description: 'Profile picture URL from Google'
  },

  // Timestamps
  createdAt: {
    type: 'timestamp',
    required: true,
    description: 'Account creation date'
  },
  updatedAt: {
    type: 'timestamp',
    required: true,
    description: 'Last update timestamp'
  },

  // Custom application fields
  role: {
    type: 'enum',
    values: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
    required: true,
    description: 'User role in the application'
  },
  status: {
    type: 'enum',
    values: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE,
    required: true,
    description: 'Account status'
  },
  lastLogin: {
    type: 'timestamp',
    required: false,
    description: 'Last login timestamp'
  },
  loginCount: {
    type: 'integer',
    default: 0,
    required: true,
    description: 'Number of successful logins'
  },

  // API Key Management fields
  apiKeysLimit: {
    type: 'integer',
    default: 10,
    required: true,
    description: 'Maximum API keys allowed'
  },
  apiKeysUsed: {
    type: 'integer',
    default: 0,
    required: true,
    description: 'Current number of API keys'
  },
  preferences: {
    type: 'jsonb',
    default: {},
    required: true,
    description: 'User preferences and settings'
  },

  // Additional Google profile data
  googleId: {
    type: 'string',
    required: false,
    description: 'Google account ID'
  },
  locale: {
    type: 'string',
    required: false,
    description: 'User\'s locale preference'
  },
  timezone: {
    type: 'string',
    required: false,
    description: 'User\'s timezone'
  }
};

/**
 * Session User Model (what gets passed to the client)
 * This is a subset of the full user model for security
 */
export const SessionUserModel = {
  id: {
    type: 'uuid',
    required: true,
    description: 'User ID'
  },
  name: {
    type: 'string',
    required: false,
    description: 'User name'
  },
  email: {
    type: 'string',
    required: true,
    description: 'User email'
  },
  image: {
    type: 'string',
    required: false,
    description: 'Profile image URL'
  },
  role: {
    type: 'enum',
    values: Object.values(USER_ROLES),
    required: true,
    description: 'User role'
  },
  status: {
    type: 'enum',
    values: Object.values(USER_STATUS),
    required: true,
    description: 'Account status'
  }
};

/**
 * User creation/update validation
 */
export const validateUserData = (userData) => {
  const errors = [];

  // Required fields
  if (!userData.email) {
    errors.push('Email is required');
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push('Invalid email format');
  }

  // Role validation
  if (userData.role && !Object.values(USER_ROLES).includes(userData.role)) {
    errors.push('Invalid user role');
  }

  // Status validation
  if (userData.status && !Object.values(USER_STATUS).includes(userData.status)) {
    errors.push('Invalid user status');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false
  },
  apiKeySettings: {
    defaultPermissions: ['read'],
    autoRotate: false,
    rotationPeriod: 30 // days
  }
};

/**
 * Create a new user object with defaults
 */
export const createUserObject = (userData) => {
  return {
    id: userData.id || null,
    name: userData.name || null,
    email: userData.email,
    emailVerified: userData.emailVerified || null,
    image: userData.image || null,
    createdAt: userData.createdAt || new Date(),
    updatedAt: userData.updatedAt || new Date(),
    role: userData.role || USER_ROLES.USER,
    status: userData.status || USER_STATUS.ACTIVE,
    lastLogin: userData.lastLogin || null,
    loginCount: userData.loginCount || 0,
    apiKeysLimit: userData.apiKeysLimit || 10,
    apiKeysUsed: userData.apiKeysUsed || 0,
    preferences: userData.preferences || DEFAULT_USER_PREFERENCES,
    googleId: userData.googleId || null,
    locale: userData.locale || null,
    timezone: userData.timezone || null
  };
};

export default UserModel; 