# PicSite

本站基于开源项目[picsite](https://github.com/Gloridust/picsite)更改  

更改内容：
- 实现图片展示页的滚动加载功能
- 单击图片操作改为打开灯箱
- 为图片添加标题
- 部分样式调整


## 部署流程

1. 克隆仓库：

2. 安装依赖：
   ```
   npm install
   ```

3. 本地调试：
   ```
   npm run dev
   ```

4. 构建项目：
   ```
   npm run build
   ```

5. 启动生产服务器：
   ```
   npm start
   ```

   现在，您可以通过 `http://localhost:3000` 访问您的网站。

6. 部署到托管平台：
    您可以使用 Vercel 进行一键部署（推荐）。

## 如何添加相册和描述

1. 在 `src/content/albums/` 目录下创建一个新的 Markdown 文件，例如 `nature.md`。

2. 在文件的顶部添加 frontmatter，包括相册的元数据：

   ```markdown
      ---
      coverImage: https://i.dorimu.online/2025/01/31/679c635cc4f52.jpg
      date: '2024-06-10'
      description: "流萤的美图"
      name: "流萤"
      ---
      - [标题](https://i.dorimu.online/2025/01/31/679c635cc4f52.jpg)
      - [标题](https://i.dorimu.online/2025/01/31/679c736eda74d.jpg)
   ```

