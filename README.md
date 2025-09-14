<h1 align="center">
  <img src="https://ouonnki.site/upload/logo.svg" alt="OuonnkiTV Logo" width="80"/><br/>
  OuonnkiTV
</h1>

<p align="center">
  现代化、可扩展的视频搜索与播放前端。
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="License"/></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen" alt="Node.js >=20"/>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9.15.4-blue" alt="pnpm >=9.15.4"/>
  <img src="https://img.shields.io/badge/vite-%5E6.3.5-yellowgreen" alt="Vite"/>
  <a href="https://github.com/Ouonnki/OuonnkiTV/stargazers"><img src="https://img.shields.io/github/stars/Ouonnki/OuonnkiTV?style=social" alt="GitHub stars"/></a>
</p>

<p align="center">
  <a href="#-简介">简介</a> ·
  <a href="#-特性">特性</a> ·
  <a href="#-快速开始">快速开始</a> ·
  <a href="#-视频源导入功能">导入</a> ·
  <a href="#-环境变量">环境变量</a> ·
  <a href="#-项目结构">结构</a> ·
  <a href="#-技术栈">技术栈</a> ·
  <a href="#-贡献">贡献</a> ·
  <a href="#-许可证">许可证</a>
</p>

---

<details>
<summary><strong>📑 目录（展开 / 收起）</strong></summary>

- [🚀 一键部署](#-一键部署)
  - [🔁 Fork 同步与更新](#-fork-同步与更新)
    - [方式一：GitHub Action 自动强制镜像（已内置）](#方式一github-action-自动强制镜像已内置)
    - [方式二：GitHub 原生 Sync Fork（推荐给不需要自动化的开发者）](#方式二github-原生-sync-fork推荐给不需要自动化的开发者)
- [📖 简介](#-简介)
- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
  - [🛠 环境依赖](#-环境依赖)
  - [💻 本地开发](#-本地开发)
  - [📦 构建 \& 预览](#-构建--预览)
  - [🐳 Docker 部署](#-docker-部署)
    - [方式一：使用 Docker Compose（推荐）](#方式一使用-docker-compose推荐)
    - [方式二：使用预构建镜像](#方式二使用预构建镜像)
- [🔄 视频源导入功能](#-视频源导入功能)
  - [导入方式](#导入方式)
    - [1. 本地文件导入 📁](#1-本地文件导入-)
    - [2. JSON 文本导入 📝](#2-json-文本导入-)
    - [3. URL 导入 🌐](#3-url-导入-)
  - [JSON格式说明](#json格式说明)
  - [使用步骤](#使用步骤)
- [🌳 环境变量](#-环境变量)
  - [基础配置](#基础配置)
  - [初始视频源配置](#初始视频源配置)
    - [在 Vercel 中配置](#在-vercel-中配置)
- [🗂 项目结构](#-项目结构)
- [⚙️ 配置](#️-配置)
- [📋 常用命令](#-常用命令)
- [🧱 技术栈](#-技术栈)
- [🤝 贡献](#-贡献)
- [📜 许可证](#-许可证)
- [⚠️ 免责声明](#️-免责声明)
- [⭐ Star 趋势](#-star-趋势)

</details>

## 🚀 一键部署

点击下面按钮，一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ouonnki/OuonnkiTV&build-command=pnpm%20build&install-command=pnpm%20install&output-directory=dist)

**Vercel手动详细部署方法**
- Fork 或克隆本仓库到您的 GitHub/GitLab 账户
- 登录 Vercel，点击 "New Project"
- 导入您的仓库
- 在 "Build & Output Settings" 中配置：
  - Install Command：`pnpm install`
  - Build Command：`pnpm build`
  - Output Directory：`dist`
- ⚠️ 重要：在 "Settings" > "Environment Variables" 中添加 `VITE_PROXY_URL`，值为 `/api/proxy?url=`
- 点击 "Deploy"

### 🔁 Fork 同步与更新

保持你的 Fork 与上游（`Ouonnki/OuonnkiTV`）最新有两种方式：

#### 方式一：GitHub Action 自动强制镜像（已内置）
工作流：`/.github/workflows/sync.yml`

| 项 | 说明 |
| --- | --- |
| 名称 | Sync Upstream (Force Mirror) |
| 触发 | 每日 UTC 02:00 / 手动 `Run workflow` |
| 策略 | 若 Fork 的 `main` 没有独立提交 → `git reset --hard upstream/main` + force push；有独立提交则跳过 |
| 风险 | 会重写 `main`（仅在无独立提交时），勿在 `main` 直接改代码 |

使用建议：
1. 自定义改动放在 `custom/*` 或 feature 分支
2. 需要立即同步：进入你 Fork 的 Actions → 选择该 Workflow → Run workflow
3. 想改成“安全合并”模式：注释强制覆盖步骤，启用文件中已提供的合并示例（`git merge`）

修改上游（多级 Fork 场景）：编辑文件中的 `git remote add upstream ...` 将地址替换为你的上游源。

#### 方式二：GitHub 原生 Sync Fork（推荐给不需要自动化的开发者）

1. 打开你的 Fork 仓库主页
2. 若看到 “Sync fork” / “Fetch upstream” 按钮：点击 → 选择 “Update branch”
3. 若按钮显示 “This branch is up to date” 则无需操作

（若按钮未显示，可使用 CLI 手动同步）

CLI 手动同步：
```bash
git remote add upstream https://github.com/Ouonnki/OuonnkiTV.git # 只需首次
git fetch upstream
git checkout main
# 合并方式（保留分叉提交）
git merge upstream/main
# 或使用 rebase（线性历史）
# git rebase upstream/main
git push origin main
```

---

## 📖 简介

**OuonnkiTV** 是一个由 **React + Vite + TypeScript** 打造的现代化前端应用，用于聚合搜索与播放网络视频资源，支持跨端播放、搜索与观看历史、以及可配置的视频源管理。项目在 LibreSpark/LibreTV 的基础上进行了重构与增强（模块化、状态管理优化、交互体验提升）。

## ✨ 特性

| 类别 | 特性 | 说明 |
| ---- | ---- | ---- |
| 搜索 | 🔍 实时搜索提示 | 支持历史记录与建议联想 |
| 播放 | ▶️ 流畅播放 | 基于 `xgplayer`，支持 HLS / MP4 |
| 详情 | 📝 内容展示 | 标题、封面、简介清晰呈现 |
| 记录 | 🕒 历史追踪 | 自动保存观看 / 搜索历史，可清理 |
| 导入 | 🔄 批量导入 | 文件 / JSON 文本 / URL 多方式导入视频源 |
| 设置 | ⚙️ 个性化 | 主题、偏好可配置 |
| 性能 | 🚀 优化策略 | 代码分割、缓存与按需加载 |
| 适配 | 📱 响应式 | 移动 / 桌面自适应布局 |
| 稳定 | 🧪 状态管理 | 基于 Zustand，数据结构清晰 |

## 🚀 快速开始

### 🛠 环境依赖

- **Node.js** >= 20.0.0
- **pnpm** >= 9.15.4

```bash
# 克隆仓库
git clone https://github.com/Ouonnki/OuonnkiTV.git
cd OuonnkiTV

# 安装依赖
pnpm install
```

### 💻 本地开发

```bash
pnpm run dev
# 访问 http://localhost:3000
```

### 📦 构建 & 预览

```bash
pnpm run build
pnpm run preview
# 访问 http://localhost:4173
```

### 🐳 Docker 部署

#### 方式一：使用 Docker Compose（推荐）

```bash
# 1. 复制环境变量模板（可选）
cp .env.docker .env

# 2. 启动服务
docker-compose up -d

# 3. 访问应用
# http://localhost:3000
```

**环境变量配置**（可选）：
编辑 `.env` 文件来自定义配置：
```bash
# 代理服务器URL
VITE_PROXY_URL=https://api.codetabs.com/v1/proxy?quest=

# 初始视频源配置
VITE_INITIAL_VIDEO_SOURCES=[{"name":"示例源","url":"https://api.example.com","isEnabled":true}]
```

#### 方式二：使用预构建镜像

```bash
# 拉取最新镜像
docker pull ghcr.io/ouonnki/ouonnkitv:latest

# 运行容器
docker run -d -p 3000:80 \
  -e VITE_PROXY_URL=https://api.codetabs.com/v1/proxy?quest= \
  ghcr.io/ouonnki/ouonnkitv:latest
```

**可用镜像标签：**
- `latest` - 最新稳定版
- `main` - 主分支最新代码
- `v1.0.0` - 指定版本

**常用命令：**
```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 🔄 视频源导入功能

支持多种方式快速配置多个视频源：

### 导入方式

#### 1. 本地文件导入 📁
- 支持 JSON 格式文件
- 拖拽或点击选择文件
- 自动验证文件格式

#### 2. JSON 文本导入 📝
- 直接粘贴 JSON 配置
- 实时语法检查
- 支持多行格式化

#### 3. URL 导入 🌐
- 从远程 URL 获取配置
- 支持 GitHub、Gitee 等代码托管平台
- 自动处理网络请求

### JSON格式说明

**基本格式：**
```json
[
  {
    "id": "source1",
    "name": "示例视频源",
    "url": "https://api.example.com/search",
    "detailUrl": "https://api.example.com/detail",
    "isEnabled": true
  }
]
```

**字段说明：**
- `id`: 源的唯一标识符（可选，系统会自动生成）
- `name`: 视频源显示名称（必需）
- `url`: 搜索API地址（必需）
- `detailUrl`: 详情API地址（可选，默认使用 url）
- `isEnabled`: 是否启用该源（可选，默认为 true）

**支持格式：**
- ✅ 单个对象：`{"name":"源名称","url":"API地址"}`
- ✅ 对象数组：`[{"name":"源1","url":"API1"},{"name":"源2","url":"API2"}]`
- ✅ 多行格式化 JSON
- ✅ 紧凑单行 JSON

### 使用步骤

1. **进入设置页面**：点击右上角设置图标
2. **打开导入功能**：点击"导入源"按钮
3. **选择导入方式**：
   - 📁 **文件导入**：点击选择 JSON 文件或拖拽文件到页面
   - 📝 **文本导入**：将 JSON 配置粘贴到文本框中
   - 🌐 **URL导入**：输入包含 JSON 配置的 URL 地址
4. **确认导入**：点击"开始导入"按钮
5. **查看结果**：系统会显示导入成功的源数量，并自动关闭导入窗口

**导入特性：**
- 🔄 **自动去重**：重复的源会被自动过滤
- ✅ **数据验证**：自动检查 JSON 格式和必需字段
- 🚨 **错误提示**：详细的错误信息帮助排查问题
- 📝 **Toast通知**：实时反馈导入状态
- 🎯 **批量处理**：一次可导入多个视频源

## 🌳 环境变量

### 基础配置

部署到 Vercel 时，需要在 Vercel 仪表盘的 **Environment Variables** 中添加以下变量：
- `VITE_PROXY_URL`：`/api/proxy?url=`

本地开发可在项目根目录创建 `.env.local` 文件，并添加：
```env
VITE_PROXY_URL=https://cors.zme.ink/
```

### 初始视频源配置

您可以通过环境变量预配置视频源，应用启动时会自动加载这些源。

**支持 URL 配置：**
除了直接填写 JSON 配置内容外，`VITE_INITIAL_VIDEO_SOURCES` 也支持填写一个包含视频源 JSON 的在线链接（如 GitHub Raw、Gitee、个人服务器等）。
当检测到该环境变量为 URL 时，系统会自动拉取该链接内容作为初始视频源。

**示例：**
```env
VITE_INITIAL_VIDEO_SOURCES=https://raw.githubusercontent.com/yourname/yourrepo/main/sources.json
```

该功能适用于需要集中维护、动态更新视频源配置的场景。

#### 在 Vercel 中配置

1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加新变量 `VITE_INITIAL_VIDEO_SOURCES`
3. 填入您的 JSON 格式视频源配置
4. 重新部署项目

**支持的配置格式：**

```bash
# 单行格式（适合简单配置）
[{"id":"source1","name":"示例源1","url":"https://api.example1.com","isEnabled":true}]

# 多行格式（推荐，更易维护）
[
  {
    "id": "source1",
    "name": "示例源1",
    "url": "https://api.example1.com",
    "isEnabled": true
  },
  {
    "id": "source2",
    "name": "示例源2",
    "url": "https://api.example2.com",
    "detailUrl": "https://detail.example2.com",
    "isEnabled": false
  }
]
```

**字段说明：**
- `id`: 源的唯一标识符（可选，会自动生成）
- `name`: 源的显示名称（必需）
- `url`: 源的API地址（必需）
- `detailUrl`: 详情API地址（可选，默认使用url）
- `isEnabled`: 是否启用（可选，默认为true）

**注意事项：**
- 在 Vercel 中可以直接使用多行格式，平台会自动处理
- 确保 JSON 格式正确，字段名必须用双引号
- 本地开发时可参考 `.env.example` 文件中的示例

---

## 🗂 项目结构

```text
.
├─ api/                  本地开发代理配置
├─ public/               静态资源
├─ src/                  源代码
│  ├─ assets/            图像与 SVG
│  ├─ components/        通用组件
│  ├─ config/            全局配置
│  ├─ hooks/             自定义 Hooks
│  ├─ pages/             页面组件
│  ├─ router/            路由配置
│  ├─ services/          API 服务封装
│  ├─ store/             全局状态 (Zustand)
│  ├─ styles/            样式与 TailwindCSS
│  ├─ types/             TypeScript 类型定义
│  ├─ App.tsx            根组件
│  └─ main.tsx           渲染入口
├─ vite.config.ts        Vite 配置
├─ tsconfig.json         TypeScript 配置
└─ package.json          依赖与脚本
```

---

## ⚙️ 配置

- **`src/config/api.config.ts`**：后端 API 地址与超时配置
- **`src/config/analytics.config.ts`**：统计与日志埋点配置
- **`api/proxy.ts`**：本地开发代理规则

## 📋 常用命令

| 命令             | 描述             |
| ---------------- | ---------------- |
| `pnpm run dev`   | 启动开发服务器   |
| `pnpm run build` | 生产环境构建     |
| `pnpm run preview` | 预览生产包     |
| `pnpm run lint`  | ESLint 检查      |

---

## 🧱 技术栈

| 分层 | 技术 | 用途 |
| ---- | ---- | ---- |
| 前端框架 | React 19 + TypeScript | 组件化与类型安全 |
| 构建工具 | Vite 6 | 极速开发与构建 |
| UI & 动画 | TailwindCSS 4 / Framer Motion / HeroUI | 样式与交互动效 |
| 播放器 | xgplayer / xgplayer-hls | 视频播放核心 |
| 状态管理 | Zustand + Immer | 轻量状态与不可变数据 | 
| 时间处理 | Day.js | 时间格式化与相对时间 |
| 部署 | Vercel | 托管与边缘加速 |

---

## 🤝 贡献

欢迎通过提交 [Issue](https://github.com/Ouonnki/OuonnkiTV/issues) 或 [Pull Request](https://github.com/Ouonnki/OuonnkiTV/pulls) 贡献代码、文档或想法。

建议流程：
1. Fork 仓库并创建特性分支：`feat/your-feature`
2. 保持提交简洁、语义化（如 `feat: add xxx`）
3. 提交 PR 并描述改动动机与效果
4. 关联 Issue（若有）

## 📜 许可证

本项目遵循 [Apache License 2.0](LICENSE)。

## ⚠️ 免责声明

**本项目仅作为视频搜索与聚合工具，不存储、上传或分发任何视频内容；所有内容均来自第三方 API 的搜索结果。若发现侵权，请联系原始内容提供方进行处理。**

开发者不对使用本项目造成的任何直接或间接后果负责。使用前请确保遵守当地法律法规。

---

## ⭐ Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=Ouonnki/OuonnkiTV&type=Date)](https://star-history.com/#Ouonnki/OuonnkiTV&Date)

如果本项目对你有帮助，欢迎 ⭐ Star 支持，让更多人看到它。🙌