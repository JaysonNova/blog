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
- The current media upload flow writes into `public/uploads`, which is fine on one VPS but not ideal for future multi-node deployment.
- The current Next.js `serverActions.bodySizeLimit` is only `2mb`, so large media uploads are not ready for production yet.

## 12. Recommended Next Improvements

After the first deployment is stable, the next infrastructure tasks should be:

1. move uploads to object storage
2. replace SQLite with PostgreSQL if traffic or write concurrency grows
3. add health checks and rollback strategy
4. add a staging environment for `develop`
