# Ethan Crazy Eights

一个基于 React + Vite 开发的经典“疯狂 8 点”纸牌游戏。

## 游戏特性
- **动态难度系统**：初始胜率 95%，每赢 3 局胜率降低 5%，最低降至 1%。
- **精美 UI**：使用 Tailwind CSS 和 Framer Motion 打造的流畅动画。
- **全中文界面**：友好的中文交互和规则说明。

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署到 Vercel

本项目可以直接部署到 Vercel。

### 步骤 1：同步到 GitHub
1. 在 GitHub 上创建一个新的仓库。
2. 在本地项目目录运行：
   ```bash
   git init
   ```
3. 添加并提交代码：
   ```bash
   git add .
   git commit -m "Initial commit"
   ```
4. 关联远程仓库并推送：
   ```bash
   git remote add origin <你的仓库URL>
   git branch -M main
   git push -u origin main
   ```

### 步骤 2：在 Vercel 部署
1. 登录 [Vercel](https://vercel.com/)。
2. 点击 **"Add New"** -> **"Project"**。
3. 导入你刚才创建的 GitHub 仓库。
4. Vercel 会自动识别这是一个 Vite 项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**。

部署完成后，你将获得一个可以公开访问的域名。
