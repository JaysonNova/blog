# Cloudflare R2 生产配置指南

本文适用于当前博客项目的媒体上传链路：

1. 浏览器请求 `/api/uploads/presign` 获取预签名 URL
2. 浏览器直接 `PUT` 文件到 Cloudflare R2
3. 表单只把最终媒体 URL 提交给 Server Action 入库

当前代码读取的 R2 环境变量定义见：

- [src/lib/server/storage/r2-adapter.ts](/Users/fangtao/Documents/Codebase/blog/src/lib/server/storage/r2-adapter.ts#L33)
- [src/app/api/uploads/presign/route.ts](/Users/fangtao/Documents/Codebase/blog/src/app/api/uploads/presign/route.ts#L27)

## 1. 当前站点信息

- 站点主域名：`https://blog.mileswave.top`
- 生产上传来源 Origin：`https://blog.mileswave.top`

注意：

- Cloudflare R2 的 `AllowedOrigins` 必须是精确的 Origin。
- 不能写成 `https://blog.mileswave.top/`
- 不能带路径，例如 `https://blog.mileswave.top/admin`

## 2. 推荐的生产媒体域名

生产环境建议给 R2 bucket 绑定一个单独的媒体域名，例如：

- `https://media.mileswave.top`

然后将项目中的 `R2_PUBLIC_BASE_URL` 配置为：

```bash
R2_PUBLIC_BASE_URL="https://media.mileswave.top"
```

不建议长期使用 `r2.dev` 作为生产媒体域名。Cloudflare 官方文档明确说明 `r2.dev` 适合非生产流量，生产更应使用自定义域名。

## 3. 需要配置的环境变量

本地 `.env` 或生产环境变量中需要有以下 5 项：

```bash
R2_ACCOUNT_ID="你的 Cloudflare Account ID"
R2_ACCESS_KEY_ID="你的 R2 Access Key ID"
R2_SECRET_ACCESS_KEY="你的 R2 Secret Access Key"
R2_BUCKET="blog-media"
R2_PUBLIC_BASE_URL="https://media.mileswave.top"
```

字段说明：

- `R2_ACCOUNT_ID`：Cloudflare 账户 ID
- `R2_ACCESS_KEY_ID`：R2 的 S3 兼容访问密钥 ID
- `R2_SECRET_ACCESS_KEY`：R2 的 S3 兼容访问密钥 Secret
- `R2_BUCKET`：R2 bucket 名称
- `R2_PUBLIC_BASE_URL`：前端访问对象时使用的公网基础地址

## 4. 在 Cloudflare Dashboard 创建和绑定 R2

### 4.1 创建 bucket

1. 登录 Cloudflare Dashboard
2. 进入 `Storage & databases -> R2 -> Overview`
3. 创建 bucket，例如 `blog-media`

### 4.2 创建 API Token

1. 在 R2 页面进入 `API Tokens`
2. 选择创建 Token
3. 权限选择 `Object Read & Write`
4. 作用范围建议只授权到当前 bucket
5. 保存以下信息：
   - `Access Key ID`
   - `Secret Access Key`

注意：`Secret Access Key` 只会显示一次。

### 4.3 绑定自定义域名

1. 打开该 bucket
2. 进入 `Settings`
3. 找到 `Custom Domains`
4. 添加 `media.mileswave.top`
5. 等待状态变为 `Active`

如果你还没有单独的媒体域名，也可以先临时使用 Cloudflare 提供的 `r2.dev` 地址联调，但生产仍建议切到自定义域名。

## 5. 可直接粘贴到 Cloudflare 的生产 CORS 策略

适用于当前生产站点 `https://blog.mileswave.top` 的最小可用策略：

```json
[
  {
    "AllowedOrigins": ["https://blog.mileswave.top"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

这份策略的含义：

- `AllowedOrigins`
  只允许你的生产站点发起跨域请求
- `AllowedMethods`
  `PUT` 用于浏览器直传
  `GET` 和 `HEAD` 用于对象读取和探测
- `AllowedHeaders`
  当前代码上传时会发送 `Content-Type`
- `ExposeHeaders`
  暴露 `ETag` 供前端在需要时读取
- `MaxAgeSeconds`
  预检请求缓存 1 小时

## 6. 如果你还要保留本地开发上传

如果你希望本地 `http://localhost:3000` 也能直传 R2，把策略改成：

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://blog.mileswave.top"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

如果你只想写生产策略，就不要加入 `localhost`。

## 7. 在 Cloudflare 中添加 CORS 的操作路径

1. 打开 Cloudflare Dashboard
2. 进入 `Storage & databases -> R2 -> Overview`
3. 选择你的 bucket
4. 进入 `Settings`
5. 找到 `CORS Policy`
6. 选择编辑 JSON
7. 粘贴上面的生产 CORS 策略
8. 保存

## 8. 推荐的生产环境变量示例

如果你使用 `media.mileswave.top` 作为媒体域名，生产环境可以配置为：

```bash
DATABASE_URL="file:/var/www/blog/shared/prisma/prod.db"

NEXTAUTH_URL="https://blog.mileswave.top"
NEXTAUTH_SECRET="替换为强随机字符串"
NEXT_PUBLIC_SITE_URL="https://blog.mileswave.top"

APP_URL="https://blog.mileswave.top"
NODE_ENV="production"

R2_ACCOUNT_ID="你的 Account ID"
R2_ACCESS_KEY_ID="你的 Access Key ID"
R2_SECRET_ACCESS_KEY="你的 Secret Access Key"
R2_BUCKET="blog-media"
R2_PUBLIC_BASE_URL="https://media.mileswave.top"
```

## 9. 配置完成后的验证方法

### 9.1 先验证预签名接口

登录管理员后台后，访问媒体上传页：

- [src/app/(admin)/admin/media/page.tsx](/Users/fangtao/Documents/Codebase/blog/src/app/(admin)/admin/media/page.tsx#L46)

浏览器开发者工具 `Network` 里应先看到：

- `POST /api/uploads/presign`

它应返回 `200`。

### 9.2 再验证 R2 直传

随后应看到浏览器对 R2 预签名地址发起：

- `OPTIONS` 预检请求
- `PUT` 上传请求

这两个请求都应成功，不应再出现 CORS 报错。

### 9.3 最后验证数据库入库

上传成功后，Server Action 才会提交最终表单：

- [src/app/(admin)/admin/actions.ts](/Users/fangtao/Documents/Codebase/blog/src/app/(admin)/admin/actions.ts#L143)
- [src/app/(admin)/admin/actions.ts](/Users/fangtao/Documents/Codebase/blog/src/app/(admin)/admin/actions.ts#L178)

如果一切正常，数据库里会保存最终的公网 URL。

## 10. 常见问题

### 10.1 `Missing required environment variable`

说明服务端缺少 `R2_*` 配置，或者改完环境变量后没有重启进程。

### 10.2 `/api/uploads/presign` 返回 401

说明当前用户不是管理员，或登录态失效。

### 10.3 浏览器提示 CORS 错误

优先检查：

- `AllowedOrigins` 是否精确等于 `https://blog.mileswave.top`
- 是否错误写成带 `/` 的 URL
- 是否把路径写进了 Origin
- 是否忘了包含 `PUT`
- 是否忘了包含 `Content-Type`

### 10.4 R2 上传返回 403

通常检查以下几项：

- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` 是否正确
- token 是否具备 `Object Read & Write`
- token 是否已授权目标 bucket
- 上传 URL 是否已过期
- `Content-Type` 是否和预签名时一致

## 11. 官方文档

- Cloudflare R2 CORS 配置：
  https://developers.cloudflare.com/r2/buckets/cors/
- Cloudflare R2 Public Buckets / Custom Domains：
  https://developers.cloudflare.com/r2/buckets/public-buckets/
- Cloudflare R2 API Tokens：
  https://developers.cloudflare.com/r2/api/tokens/
- Cloudflare R2 S3 兼容接入：
  https://developers.cloudflare.com/r2/get-started/s3/
