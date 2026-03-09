const cwd = process.env.PM2_CWD || process.cwd()
const port = process.env.PORT || '3000'

module.exports = {
  apps: [
    {
      name: 'blog',
      cwd,
      script: 'node_modules/next/dist/bin/next',
      args: `start -p ${port}`,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: port,
      },
    },
  ],
}
