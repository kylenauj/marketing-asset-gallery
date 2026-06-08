# Mera Asset Portal — Setup Guide

## 1. Supabase — create the table

In your Supabase project, go to the SQL editor and run:

```sql
create table assets (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  province text not null,
  asset_type text not null,
  label text,
  sharepoint_url text,
  file_size text,
  is_new boolean default false,
  updated_at timestamptz default now(),
  unique (brand, province, asset_type)
);

-- Enable RLS
alter table assets enable row level security;

-- Public: retailers can read connected assets (no login needed)
create policy "Public read"
  on assets for select
  using (sharepoint_url is not null and sharepoint_url != '');

-- Admin: only authenticated Supabase users can write
create policy "Authenticated write"
  on assets for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

## 2. Create Cece's admin account in Supabase

Go to Supabase → Authentication → Users → Invite user.
Enter Cece's email. She'll receive a link to set her own password.
That's the login she uses at `/admin`. Add more users the same way.

## 3. Environment variables

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL` — from Supabase → Settings → API
- `VITE_SUPABASE_ANON_KEY` — from Supabase → Settings → API (anon/public key)

## 4. Deploy to Vercel

1. Push this folder to a new GitHub repo
2. Import it in Vercel
3. Add the two env vars under Project → Settings → Environment Variables
4. Deploy

## 5. How Cece uses the admin panel

- Go to `your-domain.vercel.app/admin`
- Sign in with her Supabase email + password
- Select the province tab at the top
- For each brand, paste the SharePoint URL into the relevant asset type row
- Hit Save — it goes live immediately for retailers
- Tick "New" to show the green badge on fresh uploads
- Click "Sign out" when done

## 6. Share with retailers

Send them: `your-domain.vercel.app`

They select their province and browse. No login, no account needed.

## 7. Adding provinces or brands

Edit `src/config.js` — add to the `PROVINCES` or `BRANDS` arrays.
For brands, add the new provinces to the `provinces` array on that brand object.
Redeploy and you're done.

## 8. Inventory table (add this SQL too)

In Supabase SQL editor, also run:

```sql
create table inventory (
  id uuid default gen_random_uuid() primary key,
  province text not null,
  html text not null,
  updated_at timestamptz default now()
);

alter table inventory enable row level security;

create policy "Public read inventory"
  on inventory for select
  using (true);

create policy "Authenticated write inventory"
  on inventory for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```
