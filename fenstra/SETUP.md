# Fenstra — Setup Guide

Follow these steps in order. Total time: about 30–40 minutes.

---

## What you need before starting
- A computer (Mac, Windows, or Linux)
- An email address
- A web browser

You do **not** need to know how to code. You'll copy and paste a few things, that's all.

---

## STEP 1 — Install Node.js (one-time, 5 minutes)

Node.js is what runs the app on your computer.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (the big green button on the left)
3. Run the installer, click Next through everything, finish

To check it worked: open a terminal (Mac: press `Cmd + Space`, type "Terminal", hit enter. Windows: press Start, type "PowerShell", hit enter) and type:
```
node --version
```
You should see something like `v20.17.0`. If you do, it worked.

---

## STEP 2 — Create a free Supabase account (5 minutes)

Supabase is your database and user login system.

1. Go to **https://supabase.com**
2. Click **Start your project** → sign up with GitHub or email
3. Once logged in, click **New project**
4. Fill in:
   - **Name:** `fenstra` (or whatever you like)
   - **Database password:** click Generate, then **copy and save this password somewhere safe** — you won't need it often but do not lose it
   - **Region:** pick **West EU (London)** — closest to UK users
5. Click **Create new project** and wait ~2 minutes while it sets up

---

## STEP 3 — Run the database schema (3 minutes)

This creates the tables (users, projects, enquiries, etc.) and the security rules.

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from the zip on your computer (right-click → Open With → TextEdit / Notepad)
4. **Copy everything** in that file
5. **Paste it** into the Supabase SQL editor
6. Click **Run** (bottom right, or press Ctrl+Enter)
7. You should see "Success. No rows returned." at the bottom — that means it worked

---

## STEP 4 — Get your Supabase API keys (2 minutes)

1. In Supabase, click **Project Settings** (gear icon, bottom left) → **API**
2. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key (under "Project API keys") — a long string starting with `eyJ...`
3. Keep this tab open; you'll paste these in the next step.

---

## STEP 5 — Set up the project on your computer (5 minutes)

1. **Unzip** the `fenstra.zip` file to your Desktop (or anywhere). You'll get a folder called `fenstra`.

2. Open a **terminal** and navigate to that folder:
   - **Mac:** `cd ~/Desktop/fenstra`
   - **Windows:** `cd C:\Users\YourName\Desktop\fenstra`

3. Install the app's dependencies (this downloads the code libraries it needs). Type:
   ```
   npm install
   ```
   Wait ~2 minutes. You'll see a lot of scrolling text — that's normal.

4. Create the environment file. In the `fenstra` folder, find `.env.local.example` and **duplicate it, renaming the copy to `.env.local`** (with the dot at the front).

5. Open `.env.local` in any text editor and paste in your Supabase values from Step 4:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-long-key...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   Save the file.

---

## STEP 6 — Run it locally! (1 minute)

In the terminal (still in the fenstra folder), type:
```
npm run dev
```

After a few seconds you'll see:
```
▲ Next.js 14.2.15
- Local:  http://localhost:3000
```

Open **http://localhost:3000** in your browser. You should see the Fenstra landing page. 🎉

Try clicking **Create free account**, sign up with your email, check your inbox for the verification link, click it, and you're in your dashboard.

---

## STEP 7 — Make yourself an admin (1 minute)

By default, new accounts are "customer" role. To promote yourself to admin:

1. Go back to Supabase → **SQL Editor** → **New query**
2. Paste this, replacing the email with yours:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@yours.co.uk';
   ```
3. Click **Run**
4. Log out and log back in on your Fenstra site — you'll now see admin menus.

---

## STEP 8 — Put it on the internet with Vercel (10 minutes)

This gives you a real live URL like `fenstra.vercel.app`.

### 8a. Create a GitHub account (if you don't have one)
1. Go to **https://github.com** → sign up (free)

### 8b. Push your code to GitHub
1. Download **GitHub Desktop** from https://desktop.github.com (easiest option)
2. Install and sign in
3. In GitHub Desktop: **File → Add local repository** → select your `fenstra` folder
4. Click "Create a repository" when it offers
5. Click **Publish repository** (top right). Uncheck "Keep this code private" if you want, or leave it ticked.

### 8c. Deploy to Vercel
1. Go to **https://vercel.com** → sign up with GitHub
2. Click **Add New → Project**
3. Find your `fenstra` repo in the list → click **Import**
4. Before clicking Deploy, expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` = leave blank for now, you'll add it in a moment
5. Click **Deploy**. Wait ~2 minutes.
6. When it's done, Vercel gives you a URL like `https://fenstra-abc123.vercel.app`
7. **Copy that URL**, go back to Vercel → Settings → Environment Variables → edit `NEXT_PUBLIC_SITE_URL` → paste the URL, save
8. Also in Vercel → Deployments → click the three dots on the latest → Redeploy

### 8d. Tell Supabase about your live URL
1. In Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g. `https://fenstra-abc123.vercel.app`)
3. Under **Redirect URLs**, add `https://your-vercel-url.vercel.app/auth/callback`
4. Save

**You're live!** 🚀 Share the URL with anyone.

---

## STEP 9 (optional) — Connect a custom domain

If you own a domain like `fenstra.co.uk`:
1. In Vercel → your project → **Settings → Domains** → add your domain
2. Vercel shows you DNS records to add — paste them into your domain registrar (GoDaddy, Namecheap, etc.)
3. Wait 5–60 minutes for DNS to propagate
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars and the Supabase URLs to match the new domain

---

## Troubleshooting

**"npm: command not found"** — Node.js didn't install properly. Restart your terminal, or reinstall Node.js.

**App loads but signup fails** — Double-check `.env.local` has no typos and you restarted `npm run dev` after editing it.

**Verification email doesn't arrive** — Check spam. Or in Supabase → Authentication → Users, manually click the user and "Confirm email".

**"Error: relation 'public.profiles' does not exist"** — You forgot Step 3. Go run the schema SQL.
 
---

## What's included vs what's not

**Fully working:**
- Sign up, email verification, login, logout
- Forgot password + reset via email
- Change password
- Role-based dashboards (customer, staff, admin)
- Design configurator with live SVG preview + pricing
- Save projects (user-isolated — users cannot see each other's data, enforced at database level via Row-Level Security)
- Enquiries (customers send, staff/admin respond)
- Survey booking (customers book, staff/admin manage status)
- Profile / password settings
- PDF-style quote export (via browser print dialog)
- Admin: manage all users + roles, products catalogue, pricing logic with live preview

**Admin pages** — Users management (role changes, search, stats), Products catalogue (add/edit/remove windows, doors, materials, colours, glazing, hardware), and Pricing logic (base prices, material multipliers, glazing/hardware upgrades, VAT, live preview calculator).

---

## Cost summary
- Supabase free tier: 50,000 monthly active users, 500MB database — £0
- Vercel free tier: plenty for small/medium traffic — £0
- Domain name (optional): ~£10/year at Namecheap or similar

**Total to launch: £0.**
