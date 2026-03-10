# VPS Deployment with GitHub Actions

This guide deploys the current Next.js blog to a single VPS with:

- `Nginx` as reverse proxy
- `PM2` as process manager
- `GitHub Actions` for CI/CD
- `SQLite` as the simplest production database for the current repository

## 1. Recommended Deployment Model

For the current codebase, the simplest production setup is:

1. one Linux VPS
2. one Node.js app process on `127.0.0.1:3000`
3. one `nginx` config forwarding `80/443` to `3000`
4. one persistent SQLite file under `/var/www/blog/shared/prisma/prod.db`

This is enough for a personal blog on a single server.

## 2. Important Limitation

The current Prisma datasource in [`prisma/schema.prisma`](../prisma/schema.prisma) is `sqlite`.

That means:

- single-VPS deployment works well
- multi-instance horizontal scaling is not suitable yet
- if you later switch to PostgreSQL, update both `.env` and `prisma/schema.prisma`

The current repository also does not have formal Prisma migrations yet, so the deploy workflow uses:

```bash
pnpm prisma db push
```

When migrations are added later, replace that step with:

```bash
pnpm prisma migrate deploy
```

## 3. Server Bootstrap

On the VPS, install:

```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo npm install -g pm2
```

Create deploy directories:

```bash
sudo mkdir -p /var/www/blog/current
sudo mkdir -p /var/www/blog/shared/prisma
sudo chown -R $USER:$USER /var/www/blog
```

## 4. Prepare Production Environment File

Copy [`.env.production.example`](../.env.production.example) and create:

```bash
/var/www/blog/shared/.env.production
```

Example:

```bash
DATABASE_URL="file:/var/www/blog/shared/prisma/prod.db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="replace-with-a-random-secret-at-least-32-chars"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
APP_URL="https://your-domain.com"
NODE_ENV="production"
```

If you do not have a domain yet, you can temporarily use:

```bash
NEXTAUTH_URL="http://your_server_ip"
NEXT_PUBLIC_SITE_URL="http://your_server_ip"
APP_URL="http://your_server_ip"
```

## 5. Nginx Reverse Proxy

Use [`deploy/nginx/blog.conf.example`](../deploy/nginx/blog.conf.example) as the base config.

Example:

```bash
sudo cp deploy/nginx/blog.conf.example /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo nginx -t
sudo systemctl restart nginx
```

If you have a domain, add HTTPS after the site is reachable:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 6. Convert Password Login to SSH Key Login

For GitHub Actions deployment, do not use raw server password auth. Use SSH key auth.

Generate a deploy key locally:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

Append the public key to the server:

```bash
mkdir -p ~/.ssh
cat ~/.ssh/github-actions-deploy.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Then test:

```bash
ssh -i ~/.ssh/github-actions-deploy user@your_server_ip
```

## 7. GitHub Repository Secrets

Add these repository secrets in GitHub:

- `SERVER_HOST`: your VPS IP
- `SERVER_PORT`: usually `22`
- `SERVER_USER`: deploy user
- `SERVER_SSH_KEY`: private key content for deployment
- `DEPLOY_PATH`: usually `/var/www/blog`

## 8. CI/CD Workflow

The repository includes:

- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- [`ecosystem.config.cjs`](../ecosystem.config.cjs)

Workflow behavior:

1. trigger on push to `main`
2. run `pnpm lint`
3. run `pnpm typecheck`
4. run `pnpm exec next build --webpack`
5. rsync source code to VPS
6. symlink `/var/www/blog/shared/.env.production` to `.env`
7. run `pnpm install`
8. run `pnpm prisma generate`
9. run `pnpm prisma db push`
10. run `pnpm exec next build --webpack`
11. restart with `pm2`

## 9. First Deployment

After the secrets are configured:

1. merge your deployable code into `main`
2. push to `origin/main`
3. GitHub Actions will deploy automatically
4. open `http://your_server_ip` or your domain

## 10. Process Management Commands

Useful commands on the server:

```bash
pm2 status
pm2 logs blog
pm2 restart blog
pm2 save
pm2 startup
```

Run `pm2 startup` once and execute the command it prints, so the app can auto-start after VPS reboot.

## 11. Notes for the Current Project

- Admin login depends on `NEXTAUTH_URL` / `NEXTAUTH_SECRET`, so these must be correct in production.
- Production admin seeding requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` (optional `ADMIN_NAME`).
- The media upload flow uses browser direct-upload to Cloudflare R2 and stores only final URLs in the database.
- Keep R2 bucket CORS aligned with your frontend origin, otherwise browser-side `PUT` uploads will fail.

## 12. Problems Encountered During Actual Deployment

The first real deployment exposed a few issues that are worth documenting.

### Reverse proxy conflict on the VPS

The guide above assumes `nginx` owns `80/443`, but the actual VPS already had `caddy` listening on `80`.

Before enabling `nginx`, check port ownership first:

```bash
sudo ss -ltnp | grep ':80\|:443'
```

If another reverse proxy is already serving production traffic:

- do not blindly stop or replace it
- inspect its existing site config first
- either add the blog to the current proxy or schedule a controlled cutover

In the actual deployment, the safer choice was to expose the blog through the existing `caddy` setup and disable unused `nginx`.

### Caddy reload may fail when admin API is disabled

If `Caddyfile` contains:

```caddyfile
{
  admin off
}
```

then `caddy reload` / `systemctl reload caddy` may fail even when the config is valid, because the admin API on `127.0.0.1:2019` is unavailable.

In that case:

1. validate config first
2. use service restart instead of reload

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl restart caddy
```

### Adding a new blog subdomain on the existing Caddy-based VPS

The actual VPS already had:

- `caddy` serving `80/443`
- the blog exposed by IP through `/etc/caddy/sites/blog-ip.conf`
- the VPN endpoint using `troy.mileswave.top:343` through `/etc/caddy/233boy/troy.mileswave.top.conf`

In this setup, adding a blog domain such as `blog.mileswave.top` should be done in `caddy`, not `nginx`.

Recommended steps:

1. create a DNS `A` record:
   - `blog.mileswave.top -> 38.85.247.254`
2. if you use Cloudflare, keep `Proxy status` as `DNS only` during initial certificate issuance and troubleshooting
3. verify the domain resolves to the VPS publicly
4. confirm live port ownership on the server
5. add a dedicated site config for the blog domain
6. update the production app URLs
7. validate and restart `caddy`
8. restart the `pm2` blog process so runtime env matches the new domain

Useful checks:

```bash
dig +short blog.mileswave.top
sudo ss -ltnp | grep ':80\|:443\|:343\|:3000'
sed -n '1,120p' /etc/caddy/Caddyfile
ls -la /etc/caddy/sites /etc/caddy/233boy
```

The actual `Caddyfile` pattern on the VPS looked like:

```caddyfile
{
  admin off
  http_port 80
  https_port 443
}
import /etc/caddy/233boy/*.conf
import /etc/caddy/sites/*.conf
```

Create the blog domain site file:

```bash
sudo tee /etc/caddy/sites/blog.mileswave.top.conf >/dev/null <<'EOF'
blog.mileswave.top {
  reverse_proxy 127.0.0.1:3000
}
EOF
```

Update `/var/www/blog/shared/.env.production`:

```bash
NEXTAUTH_URL="https://blog.mileswave.top"
NEXT_PUBLIC_SITE_URL="https://blog.mileswave.top"
APP_URL="https://blog.mileswave.top"
```

Then apply the change:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl restart caddy
PM2_CWD=/var/www/blog/current pm2 restart blog --update-env
```

Expected behavior before TLS is ready:

- `http://blog.mileswave.top` may already redirect to `https://blog.mileswave.top`
- `https://blog.mileswave.top` may still fail until a valid certificate is available

### Fallback when Caddy automatic TLS issuance fails

During the actual `blog.mileswave.top` cutover, `caddy` served the HTTP challenge correctly, but Let's Encrypt production returned ACME errors like:

- `No such challenge`
- `No such authorization`

In that situation:

- DNS and port `80` reachability were already working
- `caddy` automatic issuance was not sufficient
- using `certbot` as a fallback was the fastest safe recovery path

Install `certbot`:

```bash
sudo apt-get update
sudo apt-get install -y certbot
```

Important:

- `certbot --standalone` needs port `80`
- stopping `caddy` briefly will interrupt all services currently proxied by `caddy`, including the blog and any `:343` VPN endpoint it owns

Issue the certificate:

```bash
sudo systemctl stop caddy
sudo certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  -d blog.mileswave.top
```

Then point the site config at the issued certificate:

```bash
sudo tee /etc/caddy/sites/blog.mileswave.top.conf >/dev/null <<'EOF'
blog.mileswave.top {
  tls /etc/letsencrypt/live/blog.mileswave.top/fullchain.pem /etc/letsencrypt/live/blog.mileswave.top/privkey.pem
  reverse_proxy 127.0.0.1:3000
}
EOF
```

Add a renewal deploy hook so `caddy` reloads the renewed certificate:

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/restart-caddy.sh >/dev/null <<'EOF'
#!/bin/sh
systemctl restart caddy
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/restart-caddy.sh
```

Validate and start the proxy again:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl start caddy
```

Useful final checks:

```bash
certbot certificates
curl -I http://blog.mileswave.top
curl -I https://blog.mileswave.top
pm2 status
sudo ss -ltnp | grep ':80\|:443\|:343\|:3000'
```

Expected healthy result:

- `http://blog.mileswave.top` returns `308` redirect to HTTPS
- `https://blog.mileswave.top` returns `200 OK`
- `pm2 status` shows `blog` as `online`
- `caddy` still listens on `:343` if the VPN endpoint is managed there

### GitHub CLI auth must be valid before setting secrets

If you plan to use `gh secret set`, verify auth first:

```bash
gh auth status
```

If the token is invalid, re-authenticate before setting repository secrets:

```bash
gh auth login -h github.com
```

### `pnpm-workspace.yaml` must contain `packages`

`actions/setup-node` with `cache: pnpm` can fail if `pnpm-workspace.yaml` exists but does not declare a `packages` field.

For this single-package repo, keep at least:

```yaml
packages:
  - '.'
```

### CI build needs a temporary `DATABASE_URL`

The app prerenders admin and content pages during `next build`, and those routes access Prisma. On GitHub Actions, `pnpm exec next build --webpack` can fail if `DATABASE_URL` is missing.

A practical CI-safe fix is:

1. set a temporary SQLite `DATABASE_URL`
2. run `pnpm prisma db push`
3. run `pnpm exec next build --webpack`

Example:

```bash
DATABASE_URL="file:./prisma/ci.db" pnpm prisma db push
DATABASE_URL="file:./prisma/ci.db" pnpm exec next build --webpack
```

### Low-memory VPS can OOM during deploy

On a roughly `1GB` VPS, running `pnpm install` and `next build` while the production app is still running can trigger Linux OOM kill (`exit code 137`).

Symptoms usually look like:

- `pnpm install --frozen-lockfile` or `node` gets killed
- `dmesg` shows `Out of memory: Killed process ...`

Recommended mitigation:

1. stop the running `pm2` app before install/build
2. build and deploy
3. start or reload the app after success
4. restore the app automatically if the deploy script fails after stopping it

### Ubuntu cloud-init SSH config can override your hardening

On some Ubuntu VPS images, `/etc/ssh/sshd_config` includes:

```conf
Include /etc/ssh/sshd_config.d/*.conf
```

and files such as `50-cloud-init.conf` may already set:

```conf
PasswordAuthentication yes
```

If that happens, adding a later override may not take effect the way you expect.

Recommended checks:

```bash
sudo sshd -T | egrep '^(pubkeyauthentication|passwordauthentication|kbdinteractiveauthentication|permitrootlogin)'
sudo find /etc/ssh/sshd_config.d -maxdepth 1 -type f | sort
```

Always confirm the final effective SSH settings with `sshd -T`, not only by reading one config file.

## 13. Deployment Verification Checklist

After the first production deployment, verify at least these items:

1. reverse proxy ownership is clear on `80/443`
2. key-based SSH login works in a second terminal before disabling password auth
3. GitHub repository secrets are present and correct
4. the first `main` deployment workflow finishes successfully
5. `pm2 status` shows `blog` as `online`
6. `curl -I http://127.0.0.1:3000/` returns `200 OK`
7. `curl -I http://your_server_ip/` or your domain returns `200 OK`
8. if memory is tight, deploy scripts stop and restore the app safely
9. if Cloudflare is used during first domain cutover, `Proxy status` is `DNS only` until origin TLS is confirmed
10. `curl -I https://blog.mileswave.top` returns `200 OK` after certificate issuance
11. existing `caddy` listeners such as `:343` still exist if they serve other production traffic

## 14. Recommended Next Improvements

After the first deployment is stable, the next infrastructure tasks should be:

1. move uploads to object storage
2. replace SQLite with PostgreSQL if traffic or write concurrency grows
3. add health checks and rollback strategy
4. add a staging environment for `develop`
