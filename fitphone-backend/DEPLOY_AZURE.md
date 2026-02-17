# Deploy Backend to Azure App Service

## Prerequisites
- Azure for Students account (you have this ✓)
- Azure CLI installed (we'll install it)

## Step 1: Install Azure CLI

Open PowerShell and run:
```powershell
winget install Microsoft.AzureCLI
```

Or download from: https://aka.ms/installazurecliwindows

After installation, close and reopen your terminal.

## Step 2: Login to Azure

```powershell
az login
```

This will open your browser - login with your student account.

## Step 3: Create Resource Group

```powershell
# Set your preferred region (westeurope, northeurope, etc.)
az group create --name fitphone-rg --location westeurope
```

## Step 4: Create App Service Plan (Free Tier)

```powershell
az appservice plan create --name fitphone-plan --resource-group fitphone-rg --sku F1 --is-linux
```

**Note:** F1 is the free tier. If you want better performance (recommended), use:
```powershell
az appservice plan create --name fitphone-plan --resource-group fitphone-rg --sku B1 --is-linux
```
B1 costs ~$13/month but you have student credits!

## Step 5: Create Web App

```powershell
az webapp create --resource-group fitphone-rg --plan fitphone-plan --name fitphone-backend-YOURNAME --runtime "PYTHON:3.11"
```

**Important:** Replace `YOURNAME` with something unique (e.g., your student ID or initials) because the name must be globally unique.

Your app URL will be: `https://fitphone-backend-YOURNAME.azurewebsites.net`

## Step 6: Configure Startup Command

```powershell
az webapp config set --resource-group fitphone-rg --name fitphone-backend-YOURNAME --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app"
```

## Step 7: Deploy Your Code

Navigate to the backend folder and deploy:

```powershell
cd C:\Users\aleix\Dev\University\Semester4\GroupProject\fit-phone\fitphone-backend

# Create a zip file
Compress-Archive -Path * -DestinationPath deploy.zip -Force

# Deploy the zip
az webapp deployment source config-zip --resource-group fitphone-rg --name fitphone-backend-YOURNAME --src deploy.zip
```

## Step 8: Enable CORS

```powershell
az webapp cors add --resource-group fitphone-rg --name fitphone-backend-YOURNAME --allowed-origins "https://i548036.hera.fontysict.net" "http://localhost:5173"
```

## Step 9: Verify Deployment

Check if it's running:
```powershell
az webapp browse --resource-group fitphone-rg --name fitphone-backend-YOURNAME
```

Test the API:
```powershell
curl https://fitphone-backend-YOURNAME.azurewebsites.net/predict -Method POST -Headers @{"Content-Type"="application/json"} -Body '{
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

## Step 10: Update Frontend

1. Open `fitphone-demo/.env`
2. Change the URL:
   ```
   VITE_API_URL=https://fitphone-backend-YOURNAME.azurewebsites.net
   ```
3. Rebuild frontend:
   ```powershell
   cd C:\Users\aleix\Dev\University\Semester4\GroupProject\fit-phone\fitphone-demo
   npm run build
   ```
4. Upload `dist/` folder to DirectAdmin

## Alternative: Deploy via VS Code (Easier!)

1. Install "Azure App Service" extension in VS Code
2. Click Azure icon in sidebar
3. Sign in to Azure
4. Right-click on fitphone-backend folder
5. Select "Deploy to Web App"
6. Follow the prompts

## Troubleshooting

### Check logs if deployment fails:
```powershell
az webapp log tail --resource-group fitphone-rg --name fitphone-backend-YOURNAME
```

### Restart the app:
```powershell
az webapp restart --resource-group fitphone-rg --name fitphone-backend-YOURNAME
```

### View all settings:
```powershell
az webapp config show --resource-group fitphone-rg --name fitphone-backend-YOURNAME
```

## Cost Management

- **Free tier (F1):** $0/month but limited (1GB RAM, 60 min/day compute)
- **Basic tier (B1):** ~$13/month (1.75GB RAM, unlimited) - **Recommended for demos**
- Your student credits should easily cover B1 for the entire semester!

## Clean Up (After Semester)

Delete everything to stop charges:
```powershell
az group delete --name fitphone-rg --yes
```

## Need Help?

- Check Azure Portal: https://portal.azure.com
- View your Web App → Deployment Center for deployment status
- View Log stream for real-time logs
