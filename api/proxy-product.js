export default async function handler(req, res) {
  const baseUrl = 'http://sweete-commerce.somee.com/api';

  try {
    let targetUrl = '';
    let fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'GET') {
      targetUrl = `${baseUrl}/Product`;
    } else if (req.method === 'POST') {
      targetUrl = `${baseUrl}/Order/init`;
      const body = req.body;
      fetchOptions.body = JSON.stringify(body);
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
