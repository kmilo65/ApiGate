import { supabase } from '../../lib/supabaseClient';
import { summarizeReadme } from '../summarizer.js';

// GET /api/summaries - List user's summaries
export async function GET(request) {
  try {
    // Get API key from header for authentication
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

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, name, permissions')
      .eq('key', apiKey.trim())
      .single();

    if (keyError || !keyData) {
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

    // Fetch summaries for this API key (you might want to add a summaries table)
    // For now, we'll return an empty array as placeholder
    return new Response(
      JSON.stringify({ 
        success: true,
        data: [],
        count: 0,
        message: 'Summaries endpoint - implement database storage for summaries'
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('GET summaries error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'Failed to process request'
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

// POST /api/summaries - Create new summary from GitHub URL
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

    // Validate GitHub URL format
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

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, name, permissions, last_used')
      .eq('key', apiKey.trim())
      .single();

    if (keyError || !keyData) {
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

    // Update last_used timestamp
    try {
      await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('id', keyData.id);
    } catch (updateError) {
      console.warn('Failed to update last_used timestamp:', updateError);
    }

    // Fetch README content from GitHub
    async function fetchReadmeFromGitHub(gitHubUrl) {
      try {
        // Extract owner and repo from GitHub URL
        const urlParts = gitHubUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        
        // Fetch README content using GitHub API
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/readme`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3.raw',
              'User-Agent': 'ApiGate-Summarizer'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const readmeContent = await response.text();
        return readmeContent;
      } catch (error) {
        console.error('Error fetching README:', error);
        throw new Error(`Failed to fetch README from GitHub: ${error.message}`);
      }
    }

    // Fetch and summarize README
    const readmeContent = await fetchReadmeFromGitHub(cleanGitHubUrl);
    const summary = await summarizeReadme(readmeContent);

    // Store summary in database (you might want to add a summaries table)
    const summaryData = {
      api_key_id: keyData.id,
      github_url: cleanGitHubUrl,
      summary: summary.summary,
      cool_facts: summary.cool_facts,
      created_at: new Date().toISOString()
    };

    // For now, we'll return the summary without storing it
    // You can implement database storage later

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          ...summaryData,
          id: Date.now(), // Temporary ID
          api_key_name: keyData.name
        },
        message: 'Summary created successfully'
      }), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('POST summaries error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
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