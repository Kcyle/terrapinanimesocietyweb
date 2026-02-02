import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password, screenings, startDate, meetingTime, location } = body;

    // Validate password
    const adminPassword = import.meta.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get GitHub credentials from environment
    const githubToken = import.meta.env.GITHUB_TOKEN;
    const githubOwner = import.meta.env.GITHUB_OWNER || 'Kcyle';
    const githubRepo = import.meta.env.GITHUB_REPO || 'terrapinanimesocietyweb';
    const filePath = 'src/data/screenings.json';

    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the current file to get its SHA (required for updates)
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'TerrapinAnimeSociety-Admin',
        },
      }
    );

    if (!getFileResponse.ok) {
      const error = await getFileResponse.text();
      console.error('Failed to get file:', error);
      return new Response(JSON.stringify({ error: 'Failed to get current file from GitHub' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileData = await getFileResponse.json();
    const currentSha = fileData.sha;

    // Prepare the new content
    const newContent = {
      screenings: screenings || [],
      startDate: startDate || '',
      meetingTime: meetingTime || '',
      location: location || { buildingCode: 'STP', roomNumber: '0200' },
    };

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(newContent, null, 2))));

    // Update the file via GitHub API
    const updateResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'TerrapinAnimeSociety-Admin',
        },
        body: JSON.stringify({
          message: 'Update screenings via admin panel',
          content: contentBase64,
          sha: currentSha,
          branch: 'master',
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error('Failed to update file:', error);
      return new Response(JSON.stringify({ error: 'Failed to update file on GitHub' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await updateResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Screenings updated successfully! The site will rebuild shortly.',
        commit: result.commit?.sha,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Validate password without making changes
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');

  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response(JSON.stringify({ valid: false, error: 'Admin not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (password === adminPassword) {
    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ valid: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
