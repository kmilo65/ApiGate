import { UserService } from '@/lib/userService';

export async function POST(request) {
  try {
    console.log('🧪 Testing UUID fix...');
    
    // Simulate Google OAuth user data with numeric ID
    const mockGoogleUserData = {
      id: '106044303788770255373', // This is the problematic Google ID
      name: 'Test Google User',
      email: 'test-google@example.com',
      image: 'https://example.com/avatar.jpg',
      provider: 'google',
      provider_id: '106044303788770255373'
    };

    console.log('Creating user with Google OAuth ID:', mockGoogleUserData.id);

    // Test user creation with UUID fix
    const createResult = await UserService.createUser(mockGoogleUserData);
    
    if (createResult.success) {
      console.log('✅ User created successfully with UUID:', createResult.user.id);
      
      // Verify the ID is a proper UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(createResult.user.id);
      
      return Response.json({
        success: true,
        message: 'UUID fix test successful',
        user: createResult.user,
        isUuid: isUuid,
        originalGoogleId: mockGoogleUserData.id,
        generatedUuid: createResult.user.id,
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({
        success: false,
        error: 'Failed to create user',
        details: createResult.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Error in UUID fix test:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}