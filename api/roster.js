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
    let rosterUrl = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueId}`;
    if (period) {
      rosterUrl += `&period=${period}`;
    }
    
    // Also get league info for player names
    const leagueInfoUrl = `https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=${leagueId}`;
    
    // Fetch both in parallel
    const [rosterResponse, leagueResponse] = await Promise.all([
      fetch(rosterUrl, { method: 'GET', headers: { 'Accept': 'application/json' } }),
      fetch(leagueInfoUrl, { method: 'GET', headers: { 'Accept': 'application/json' } })
    ]);
    
    if (!rosterResponse.ok) {
      console.error(`Fantrax roster API error: ${rosterResponse.status}`);
      const errorText = await rosterResponse.text();
      return res.status(rosterResponse.status).json({ 
        error: `Fantrax API returned ${rosterResponse.status}`,
        details: errorText
      });
    }
    
    const rosterData = await rosterResponse.json();
    const leagueData = leagueResponse.ok ? await leagueResponse.json() : {};
    
    // Merge player info into roster data
    const result = {
      ...rosterData,
      playerInfo: leagueData.playerInfo || leagueData.players || {}
    };
    
    console.log('Success! Roster data retrieved with player info');
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from Fantrax',
      details: error.message 
    });
  }
}
