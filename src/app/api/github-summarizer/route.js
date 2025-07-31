import { supabase } from '../../lib/supabaseClient';
import { summarizeReadme } from '../summarizer.js';

export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    if (!body || !body.gitHubUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'GitHub URL is required',
          success: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { gitHubUrl } = body;

    // Validate GitHub URL format with specific pattern
    const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;
    if (typeof gitHubUrl !== 'string' || gitHubUrl.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid GitHub URL format',
          success: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const cleanGitHubUrl = gitHubUrl.trim();
    
    if (!githubUrlPattern.test(cleanGitHubUrl)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid GitHub URL format. Expected: https://github.com/username/repository',
          success: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Extract API key from x-api-key header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key is required in x-api-key header',
          success: false 
        }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate API key format (basic validation)
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key format',
          success: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const cleanApiKey = apiKey.trim();

    // Query Supabase for API key validation
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, permissions, last_used')
      .eq('key', cleanApiKey)
      .single();

    // Handle Supabase errors
    if (error) {
      console.error('Supabase error:', error);
      
      // Handle specific Supabase errors
      if (error.code === 'PGRST116') {
        // No rows returned (invalid API key)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API key',
            success: false 
          }), 
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Other database errors
      return new Response(
        JSON.stringify({ 
          error: 'Database error occurred',
          success: false 
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // API key is valid
    if (data && data.id) {
      // Update last_used timestamp
      try {
        await supabase
          .from('api_keys')
          .update({ last_used: new Date().toISOString() })
          .eq('id', data.id);
      } catch (updateError) {
        // Log but don't fail the request for this
        console.warn('Failed to update last_used timestamp:', updateError);
      }

      // TODO: Add GitHub summarization logic here
      // This is where you'll implement the actual GitHub URL summarization
      // You can use libraries like:
      // - GitHub API to fetch repository information
      // - AI/ML models for summarization
      // - Web scraping for additional context
      // - Integration with external summarization services

      // For now, return a placeholder response

      // Helper function to fetch README.md content from a GitHub repo
      async function fetchReadmeFromGitHub(gitHubUrl) {
        try {
          // Extract owner and repo from the URL
          const match = gitHubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
          if (!match) return null;
          const owner = match[1];
          const repo = match[2];

          // Try to fetch README from main branch, then fallback to master
          const branches = ['main', 'master'];
          for (const branch of branches) {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
            const res = await fetch(rawUrl);
            if (res.ok) {
              return await res.text();
            }
          }
          // If not found, return null
          return null;
        } catch (err) {
          console.error('Error fetching README.md:', err);
          return null;
        }
      }

      // Fetch the README.md content
      const readmeText = await fetchReadmeFromGitHub(gitHubUrl);

      // Print README.md text to console
      console.log('=== README.md Content ===');
      console.log(readmeText || 'No README.md found');
      console.log('=== End README.md Content ===');

      // Summarize the README content
      const { summary, cool_facts } = await summarizeReadme(readmeText);
      
      return new Response(
        JSON.stringify({ 
          message: 'GitHub summarization completed successfully',
          summary: summary,
          cool_facts: cool_facts
        }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Fallback for invalid API key
    return new Response(
      JSON.stringify({ 
        error: 'Invalid API key',
        success: false 
      }), 
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('GitHub summarizer API route error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          success: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Handle other unexpected errors
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 