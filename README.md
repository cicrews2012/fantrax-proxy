# Fantrax API Proxy

CORS proxy for accessing Fantrax API from browser-based applications.

## What This Does

Fantrax API blocks requests from browsers (CORS policy). This proxy:
1. Receives requests from your app
2. Calls Fantrax API (server-to-server, no CORS)
3. Returns data to your app

## Deployment to Vercel

### 1. Create Vercel Account
- Go to https://vercel.com/signup
- Sign up with GitHub (easiest)

### 2. Deploy This Proxy

**Option A: Deploy from GitHub (Recommended)**
1. Push this code to GitHub repo
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Click "Deploy"
5. Done! You'll get a URL like: `https://fantrax-proxy.vercel.app`

**Option B: Deploy from Command Line**
```bash
npm install -g vercel
cd fantrax-proxy
vercel
# Follow prompts
```

### 3. Update Your HTML

Replace the Fantrax API call in your `index.html`:

**OLD (doesn't work - CORS blocked):**
```javascript
const response = await fetch('https://www.fantrax.com/fxpa/req', {
  method: 'POST',
  body: JSON.stringify({...})
});
```

**NEW (works - uses proxy):**
```javascript
const response = await fetch(
  `https://YOUR-APP.vercel.app/api/roster?leagueId=${leagueId}`
);
```

## API Endpoints

### GET /api/roster

Fetches team rosters from Fantrax.

**Parameters:**
- `leagueId` (required): Your Fantrax league ID

**Example:**
```
https://your-proxy.vercel.app/api/roster?leagueId=cbla2gq5mhdvy7q4
```

**Response:**
```json
{
  "responses": [{
    "data": {
      "teamRosters": [
        {
          "teamName": "Team Name",
          "rosterItems": [
            {
              "playerName": "Player Name",
              "position": "SP",
              ...
            }
          ]
        }
      ]
    }
  }]
}
```

## Testing Locally

```bash
npm install -g vercel
vercel dev
# Opens at http://localhost:3000
# Test: http://localhost:3000/api/roster?leagueId=cbla2gq5mhdvy7q4
```

## Security

- CORS enabled for all origins (for testing)
- No authentication required (uses Fantrax public API)
- Rate limiting: Vercel free tier limits

## Troubleshooting

**"leagueId is required"**
- Add `?leagueId=YOUR_ID` to URL

**"Fantrax API returned 403"**
- League might be private
- Try making league public in Fantrax settings

**CORS still blocked**
- Clear browser cache
- Check proxy URL is correct
- Verify vercel.json CORS headers

## Files

- `api/roster.js` - Main proxy endpoint
- `vercel.json` - Vercel configuration (CORS headers)
- `package.json` - Project metadata

## Cost

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited API requests
- Free SSL
- Auto-deploys from GitHub

More than enough for personal use!
