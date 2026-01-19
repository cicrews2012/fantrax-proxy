// Fantrax API Proxy - Bypasses CORS restrictions
export default async function handler(req, res) {
  // Enable CORS for your GitHub Pages site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { leagueId, method = 'getRosters' } = req.query;
  
  if (!leagueId) {
    return res.status(400).json({ error: 'leagueId is required' });
  }
  
  try {
    console.log(`Fetching rosters for league: ${leagueId}`);
    
    // Try authenticated request with user credentials
    const response = await fetch('https://www.fantrax.com/fxpa/req', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `userSecretKey=vocazvbjlcp76mt9` // Authentication
      },
      body: JSON.stringify({
        msgs: [{
          method: 'getRosters',
          data: { 
            leagueId: leagueId,
            view: 'STATS'
          }
        }]
      })
    });
    
    if (!response.ok) {
      console.error(`Fantrax API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Fantrax API returned ${response.status}` 
      });
    }
    
    const data = await response.json();
    console.log('Success! Returning data');
    
    // Return the Fantrax response
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from Fantrax',
      details: error.message 
    });
  }
}
