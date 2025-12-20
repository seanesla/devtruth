# Deployment Checklist - ML + Gemini Integration

## Pre-Deployment Verification

### 1. Environment Variables

- [ ] Create `.env.local` file
- [ ] Add `GEMINI_API_KEY=AIza...` (get from https://aistudio.google.com/app/apikey)
- [ ] Verify key is valid (test with curl or API health check)
- [ ] For production: Add to Vercel/deployment platform environment variables

### 2. File Structure Verification

```bash
# Run this to verify all files exist:
ls -la lib/ml/inference.ts
ls -la lib/ml/forecasting.ts
ls -la lib/gemini/client.ts
ls -la lib/gemini/prompts.ts
ls -la app/api/gemini/route.ts
ls -la hooks/use-inference.ts
ls -la hooks/use-suggestions.ts
```

All files should exist. If any are missing, check the implementation guide.

### 3. TypeScript Compilation

```bash
# Verify no type errors:
pnpm build

# Or just check types:
pnpm tsc --noEmit
```

Expected: No errors (warnings OK due to `ignoreBuildErrors: true` in next.config.mjs)

### 4. API Route Testing

```bash
# Start dev server:
pnpm dev

# Test health check:
curl http://localhost:3000/api/gemini

# Expected response:
{
  "status": "ok",
  "configured": true,
  "endpoint": "/api/gemini",
  "methods": ["POST"]
}

# Test suggestion generation:
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "stressScore": 75,
    "stressLevel": "high",
    "fatigueScore": 60,
    "fatigueLevel": "tired",
    "trend": "declining"
  }'

# Expected: JSON array with 2-3 suggestion objects
```

### 5. Client-Side Testing

- [ ] Navigate to `/dashboard`
- [ ] Check console for errors
- [ ] Navigate to `/dashboard/suggestions`
- [ ] Verify page loads without errors
- [ ] Check localStorage works (no privacy mode blocking)

## Deployment Steps

### Option A: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add ML and Gemini integration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `pnpm build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `AIza...your-key`
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test deployed API: `https://your-app.vercel.app/api/gemini`

### Option B: Self-Hosted

1. **Build for Production**
   ```bash
   pnpm build
   ```

2. **Set Environment Variables**
   ```bash
   export GEMINI_API_KEY="AIza...your-key"
   ```

3. **Start Server**
   ```bash
   pnpm start
   # Or with PM2:
   pm2 start pnpm --name kanari -- start
   ```

4. **Configure Reverse Proxy (nginx example)**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Post-Deployment Verification

### 1. API Functionality

```bash
# Replace with your deployed URL
DEPLOYED_URL="https://your-app.vercel.app"

# Health check
curl $DEPLOYED_URL/api/gemini

# Suggestion generation
curl -X POST $DEPLOYED_URL/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "stressScore": 75,
    "stressLevel": "high",
    "fatigueScore": 60,
    "fatigueLevel": "tired",
    "trend": "declining"
  }'
```

### 2. Browser Testing

- [ ] Visit deployed site
- [ ] Open browser DevTools → Console
- [ ] Navigate through all dashboard pages
- [ ] Verify no console errors
- [ ] Test localStorage persistence (refresh page, check data persists)

### 3. End-to-End Flow (Once Audio Recording is Implemented)

1. Record voice sample
2. Verify AudioFeatures extracted
3. Check VoiceMetrics calculated
4. Confirm Recording saved to IndexedDB
5. Verify BurnoutPrediction displayed
6. Test Gemini suggestion generation
7. Accept/dismiss suggestions
8. Verify localStorage persistence

## Monitoring & Debugging

### Check Gemini API Usage

- Visit: https://aistudio.google.com/app/apikey
- Monitor: Rate limits (15 requests/minute on free tier)
- Check: Quota usage and errors

### Common Issues

#### Issue: "API key configuration error"
**Solution:**
- Verify `GEMINI_API_KEY` is set in environment
- Check key starts with "AIza"
- Restart server after adding env variable

#### Issue: "Gemini API error (401)"
**Solution:**
- API key is invalid or expired
- Generate new key at https://aistudio.google.com/app/apikey

#### Issue: "Gemini API error (429)"
**Solution:**
- Rate limit exceeded (15 requests/minute)
- Implement caching or request throttling
- Consider upgrading to paid tier

#### Issue: Suggestions not appearing
**Solution:**
- Check browser console for API errors
- Verify `/api/gemini` is accessible (not blocked by CORS)
- Check localStorage is enabled (not in private browsing)

#### Issue: "Invalid suggestion structure"
**Solution:**
- Gemini returned unexpected format
- Check API response in Network tab
- May need to adjust prompt or add retry logic

### Performance Monitoring

```bash
# Check API response times:
time curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"stressScore":75,"stressLevel":"high","fatigueScore":60,"fatigueLevel":"tired","trend":"declining"}'
```

Expected: 1-3 seconds (depending on Gemini API latency)

### Logging

Add to `app/api/gemini/route.ts` for debugging:

```typescript
console.log("[Gemini API] Request:", {
  stressScore,
  stressLevel,
  fatigueScore,
  fatigueLevel,
  trend,
})

console.log("[Gemini API] Response time:", Date.now() - startTime, "ms")
console.log("[Gemini API] Suggestions count:", suggestions.length)
```

## Rate Limit Handling

### Free Tier Limits
- 15 requests per minute
- 1,500 requests per day

### Recommendations
1. **Cache suggestions** (same metrics = reuse for 1 hour)
2. **Debounce requests** (wait 500ms before sending)
3. **Batch updates** (don't fetch on every recording, only when risk changes)

### Implementation Example

```typescript
// Add to hooks/use-suggestions.ts
const cache = new Map<string, { suggestions: Suggestion[], timestamp: number }>()

function getCacheKey(metrics: VoiceMetrics, trend: TrendDirection): string {
  return `${metrics.stressScore}-${metrics.fatigueScore}-${trend}`
}

// In fetchSuggestions:
const cacheKey = getCacheKey(metrics, trend)
const cached = cache.get(cacheKey)

if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
  setSuggestions(cached.suggestions)
  return
}

// ... fetch from API ...

cache.set(cacheKey, { suggestions, timestamp: Date.now() })
```

## Security Checklist

- [ ] API key not exposed in client-side code
- [ ] API key not committed to git (.env.local in .gitignore)
- [ ] API route validates all inputs
- [ ] No sensitive data in error messages
- [ ] HTTPS enabled in production
- [ ] CORS configured appropriately

## Backup & Recovery

### Backup LocalStorage Data

```javascript
// Run in browser console to export suggestions:
JSON.stringify(localStorage.getItem('kanari-suggestions'))

// To restore:
localStorage.setItem('kanari-suggestions', '...')
```

### Backup IndexedDB (Future)

```javascript
// Export all recordings (once implemented):
const db = await openDB('kanari', 1)
const recordings = await db.getAll('recordings')
const backup = JSON.stringify(recordings)
// Save backup to file
```

## Rollback Plan

If issues occur after deployment:

1. **Revert to previous commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Disable Gemini features:**
   - Remove API key from environment
   - App will gracefully handle missing suggestions

3. **Emergency fix:**
   ```bash
   # Disable suggestions page temporarily
   # In app/dashboard/suggestions/page.tsx:
   export default function SuggestionsPage() {
     return <div>Feature temporarily disabled. Check back soon!</div>
   }
   ```

## Success Criteria

Deployment is successful when:

- ✅ `/api/gemini` health check returns `{"status": "ok", "configured": true}`
- ✅ POST to `/api/gemini` returns valid suggestions
- ✅ Dashboard pages load without errors
- ✅ Suggestions persist across page refreshes
- ✅ No console errors in browser
- ✅ No TypeScript compilation errors
- ✅ Gemini API usage within rate limits

## Next Steps After Deployment

1. **Implement Audio Recording** (see CLAUDE.md)
   - Web Audio API integration
   - Meyda feature extraction
   - Silero VAD for voice detection

2. **Add IndexedDB Persistence**
   - Store recordings locally
   - Encrypted storage option
   - Data export functionality

3. **Google Calendar Integration**
   - OAuth 2.0 flow
   - Calendar event creation
   - Conflict detection

4. **Analytics & Monitoring**
   - Track suggestion acceptance rate
   - Monitor API response times
   - User engagement metrics

5. **User Testing**
   - Collect feedback on suggestion quality
   - Test with real voice recordings
   - Iterate on ML heuristics

## Support

If you encounter issues:

1. Check browser console for errors
2. Review API logs (Vercel → Functions → Logs)
3. Test API route with curl
4. Verify environment variables
5. Check Gemini API status: https://status.cloud.google.com/

## Documentation References

- Implementation Guide: `ML_IMPLEMENTATION.md`
- Usage Examples: `USAGE_EXAMPLES.md`
- Project Overview: `CLAUDE.md`
- Type Definitions: `lib/types.ts`

---

**Last Updated:** 2025-12-19
**Version:** 1.0.0 (Initial ML + Gemini Integration)
