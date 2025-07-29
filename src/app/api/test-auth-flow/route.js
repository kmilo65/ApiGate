import { UserService } from '@/lib/userService';

export async function POST(request) {
  try {
    console.log('🧪 Testing complete auth flow...');
    
    // Simulate user data from Google OAuth
    const mockUserData = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      provider: 'google',
      provider_id: 'google_' + Date.now()
    };

    console.log('Creating test user with data:', mockUserData);

    // Test user creation
    const createResult = await UserService.createUser(mockUserData);
    
    if (createResult.success) {
      console.log('✅ User created successfully:', createResult.user);
      
      // Test getting user by email
      const getUserResult = await UserService.getUserByEmail(mockUserData.email);
      
      if (getUserResult.success) {
        console.log('✅ User retrieved successfully:', getUserResult.user);
        
        // Test updating login stats
        const updateStatsResult = await UserService.updateLoginStats(getUserResult.user.id);
        
        return Response.json({
          success: true,
          message: 'Complete auth flow test successful',
          user: createResult.user,
          retrievedUser: getUserResult.user,
          statsUpdate: updateStatsResult,
          timestamp: new Date().toISOString()
        });
      } else {
        return Response.json({
          success: false,
          error: 'Failed to retrieve user',
          details: getUserResult.error,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      return Response.json({
        success: false,
        error: 'Failed to create user',
        details: createResult.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Error in auth flow test:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}