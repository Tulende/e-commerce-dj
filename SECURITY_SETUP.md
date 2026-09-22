# Production authentication setup

The authentication API requires two Cloudflare secrets. Do not add their values to GitHub, `wrangler.toml`, or any frontend file.

1. Run the database migration once against D1:

   `npx wrangler d1 execute soundrent-db --remote --file=./migrations/0001_secure_auth.sql`

2. In Cloudflare Dashboard, open **Workers & Pages** > **e-commerce-dj** > **Settings** > **Variables and Secrets**, then add encrypted secrets:

   - `AUTH_SECRET`: a unique, random string of at least 32 characters.
   - `ADMIN_SETUP_CODE`: a private one-time code used only to create an administrator account.

3. Deploy the updated project. Create the administrator account once, then rotate `ADMIN_SETUP_CODE` to a new private value.

The browser only retains a signed session token. Passwords are hashed with PBKDF2 in the Cloudflare Function and stored only as hashes in D1.
