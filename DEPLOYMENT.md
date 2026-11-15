# Guru Kripa Astrology & Gems Stone - Deployment Guide

This document provides step-by-step instructions to deploy the full-stack platform live on cloud hosting services (**Render** for Backend, **Vercel** for Frontend & Admin Panel).

---

## 1. Prerequisites
- **GitHub Repository**: [gurukripa_astrology_gemestone_store](https://github.com/enquirybazaarin-ctrl/gurukripa_astrology_gemestone_store.git)
- **MongoDB Atlas Database**: Already configured on `cluster0.9xnhxqy.mongodb.net/gurukripa_gemstone`
- **Vercel Account**: [vercel.com](https://vercel.com)
- **Render Account**: [render.com](https://render.com)

---

## 2. Deploying Backend on Render

1. Log in to [render.com](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repo `gurukripa_astrology_gemestone_store`.
4. Configure the settings:
   - **Name**: `gurukripa-gemstone-backend`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** > **Add Environment Variable** and add the following:
   ```env
   NODE_ENV=production
   PORT=5000
   API_VERSION=v1
   MONGODB_URI=mongodb+srv://enquirybazaarin_db_user:Guruji-2023@cluster0.9xnhxqy.mongodb.net/gurukripa_gemstone?retryWrites=true&w=majority
   JWT_SECRET=super_secure_jwt_secret_gurukripa_dev_2026
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=super_secure_refresh_secret_gurukripa_dev_2026
   JWT_REFRESH_EXPIRE=7d
   CSRF_SECRET=csrf_super_secure_secret_gurukripa_dev
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ADMIN_URL=https://your-admin-domain.vercel.app
   ```
6. Click **Create Web Service**.
7. Once deployed, note your Render backend URL (e.g., `https://gurukripa-gemstone-backend.onrender.com`).

---

## 3. Deploying Customer Store (Frontend) on Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import the `gurukripa_astrology_gemestone_store` repository.
4. In the configuration screen:
   - **Project Name**: `gurukripa-astrology-store`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`Frontend`**.
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<YOUR-RENDER-BACKEND-URL>/api/v1`
     *(e.g., `https://gurukripa-gemstone-backend.onrender.com/api/v1`)*
6. Click **Deploy**.
7. Once completed, copy your live frontend URL.

---

## 4. Deploying Admin Panel on Vercel

1. In Vercel, click **Add New...** > **Project** again.
2. Select the same repository: `gurukripa_astrology_gemestone_store`.
3. In the configuration screen:
   - **Project Name**: `gurukripa-admin-panel`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`Admin_panel`**.
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<YOUR-RENDER-BACKEND-URL>/api/v1`
5. Click **Deploy**.

---

## 5. Post-Deployment Linking (Final Step)

1. Return to your Render dashboard for `gurukripa-gemstone-backend`.
2. Go to **Environment** tab.
3. Update `FRONTEND_URL` and `ADMIN_URL` with your exact live Vercel domains:
   - `FRONTEND_URL` = `https://<your-frontend-project>.vercel.app`
   - `ADMIN_URL` = `https://<your-admin-project>.vercel.app`
4. Click **Save Changes** (Render will automatically redeploy with CORS permissions).

---

## 6. Admin Credentials
- **Admin Login URL**: `https://<your-admin-project>.vercel.app/login`
- **Email**: `admin@gurukripagems.com`
- **Password**: `GuruKripa@Admin2026`
- **Astrologer Helpline**: `+91 93236 00011`
