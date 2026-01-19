// Fantrax API Proxy - Official API v1.2
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { leagueId, period } = req.query;
  
  if (!leagueId) {
    return res.status(400).json({ error: 'leagueId is required' });
  }
  
  try {
    console.log(`Fetching team rosters for league: ${leagueId}, period: ${period || 'current'}`);
    
    // Use official Fantrax API endpoint
    let url = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueId}`;
    if (period) {
      url += `&period=${period}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Fantrax API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Fantrax API returned ${response.status}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('Success! Roster data retrieved');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from Fantrax',
      details: error.message 
    });
  }
}
