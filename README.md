# 液态玻璃日历 - Cloudflare Pages 部署

## 项目结构

```
calendar-cf/
├── index.html          # 主页面
├── functions/          # Cloudflare Functions (API)
│   └── api/
│       ├── calendar.js # 日历数据API
│       ├── holidays.js # 假期数据API
│       └── weather.js  # 天气API
└── _headers           # CORS 配置（可选）
```

## 部署方式

### 方式一：Git 集成（推荐）

1. 创建 GitHub/GitLab 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Pages** → **Create a project** → **Connect to Git**
4. 选择仓库，配置：
   - **Production branch**: `main`
   - **Build command**: 留空（无需构建）
   - **Build output directory**: `/` 或 `.`
5. 点击 **Save and Deploy**
6. 访问 `https://your-project.pages.dev`

### 方式二：直接上传

1. 安装 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```

2. 登录 Cloudflare：
   ```bash
   wrangler login
   ```

3. 部署：
   ```bash
   cd calendar-cf
   wrangler pages deploy . --project-name=calendar
   ```

### 方式三：GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@2.0.0
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=calendar
```

## Functions 说明

Cloudflare Functions 自动识别 `functions/` 目录下的文件：

- `/api/calendar` → `functions/api/calendar.js`
- `/api/holidays` → `functions/api/holidays.js`
- `/api/weather` → `functions/api/weather.js`

## 本地测试

```bash
# 安装 Wrangler
npm install -g wrangler

# 本地运行
cd calendar-cf
wrangler pages dev .
```

访问 `http://localhost:8788`

## 注意事项

1. Cloudflare Functions 有请求限制（每天 100,000 次）
2. API 调用使用外部服务 `uapis.cn`，确保该服务可用
3. 天气 API 需要用户允许地理位置权限
