# Mera Asset Portal

Public SharePoint-style marketing asset gallery for Mera Cannabis licensed retailers.

## Overview

This portal lets Canadian cannabis retailers browse and download brand marketing assets (sell sheets, logos, TV ads, web cards, product knowledge docs, brand books) organized by province and brand — no login required.

Admins (Cece) can manage asset URLs and publish weekly inventory HTML via a password-protected `/admin` panel backed by Supabase.

## Stack

- **React 18** + **Vite 5**
- - **Supabase** (Postgres + Auth + RLS)
  - - **react-router-dom v6**
    - - **Tabler Icons** (webfont CDN)
      - - **DM Sans / DM Mono** (Google Fonts)
        - - Deployed on **Vercel**
         
          - ## Project structure
         
          - ```
            mera-asset-portal/
              index.html          # Vite entry (fonts + icons CDN)
              vercel.json         # SPA rewrite rule
              .env.example        # Required env vars
              src/
                main.jsx          # React Router: / and /admin
                App.jsx           # Public retailer portal
                config.js         # Supabase client, PROVINCES, BRANDS, ASSET_TYPES
                index.css         # Global CSS variables & reset
                components/
                  Admin.jsx       # Password-protected admin panel
            ```

            ## Quick start

            See **[mera-asset-portal/SETUP.md](./mera-asset-portal/SETUP.md)** for the full setup guide:

            1. Create the Supabase `assets` and `inventory` tables (SQL in SETUP.md)
            2. 2. Invite admin user(s) in Supabase → Authentication → Users
               3. 3. Copy `.env.example` → `.env` and fill in your Supabase URL + anon key
                  4. 4. `npm install && npm run dev` to run locally
                     5. 5. Push to GitHub and import into Vercel — add the two env vars and deploy
                       
                        6. ## Routes
                       
                        7. | Path | Description |
                        8. |------|-------------|
                        9. | `/` | Public retailer portal — province selector → asset grid |
                        10. | `/admin` | Admin panel — manage SharePoint URLs and inventory HTML |
                       
                        11. ## Adding provinces or brands
                       
                        12. Edit `src/config.js` — add to the `PROVINCES` or `BRANDS` arrays. Redeploy and you're done.
