# Deploy Backend to Render.com (Free)

## Quick Setup (5 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (easiest)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Select your repository (or create one with the fitphone-backend folder)

3. **Configure Service**
   - **Name**: `fitphone-backend` (or your choice)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`

4. **Add Files to Backend Folder**
   Make sure these files exist in `fitphone-backend/`:
   - ✅ `server.py`
   - ✅ `requirements.txt`
   - ✅ `fitphone_pipeline.joblib`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://fitphone-backend.onrender.com`

6. **Update Frontend**
   - Open `fitphone-demo/.env`
   - Change `VITE_API_URL=https://fitphone-backend.onrender.com`
   - Run `npm run build`
   - Upload new `dist/` folder to DirectAdmin

## Alternative: Railway.app

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `fitphone-backend` folder
5. Railway auto-detects Python and deploys
6. Copy the generated URL
7. Update `.env` in frontend with the URL

## Alternative: PythonAnywhere

1. Go to https://www.pythonanywhere.com
2. Create free account
3. Upload `fitphone-backend/` files via Files tab
4. Create new Web App (Flask/Django - choose Manual config)
5. Configure WSGI file to import your FastAPI app
6. Enable CORS for your DirectAdmin domain
7. Use the provided URL (e.g., `yourusername.pythonanywhere.com`)

## Test Backend

Once deployed, test it:
```bash
curl -X POST https://your-backend-url.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "screen_time_hours": 5,
    "work_screen_hours": 2,
    "leisure_screen_hours": 3,
    "stress_level_0_10": 5,
    "productivity_0_100": 60,
    "exercise_minutes_per_week": 150,
    "social_hours_per_week": 5,
    "age": 25,
    "mental_wellness_index_0_100": 70,
    "gender": "Female",
    "occupation": "Student",
    "work_mode": "In-person"
  }'
```

Should return: `{"sleep_quality": 2}` (or another number 1-5)

## Important Notes

- **Free tier**: Render free tier goes to sleep after 15 min of inactivity (first request takes ~30s to wake up)
- **CORS**: The backend is already configured to accept requests from any origin
- **Model file**: Make sure `fitphone_pipeline.joblib` is included in your git repo
- **Keep costs free**: Stay on free tier, upgrade only if needed for production

## Need Help?

If deployment fails, check:
1. `requirements.txt` has all dependencies
2. `fitphone_pipeline.joblib` is in the same folder as `server.py`
3. Build logs for specific errors
