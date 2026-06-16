export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).send('Missing path parameter');
  }

  // The base ngrok URL
  // We can hardcode it since the user's ngrok URL is static
  const targetUrl = `https://cinema-jackal-disclose.ngrok-free.dev/${path}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Add cache headers for performance
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    // Stream the image buffer to the client
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
}
