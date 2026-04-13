# Framer Code Override 使用指南

## 文件说明

1. **EmbedScrollControl.tsx** - Framer Code Override 文件
2. **index.html** - 简化的 3D 模型页面，移除了内部滚动劫持逻辑

## 使用步骤

### 1. 在 Framer 中创建 Code Override

1. 在你的 Framer 项目中，打开左侧的 `Assets` 面板
2. 点击 `+` 按钮，选择 **Code**
3. 命名为 `EmbedScrollControl`
4. 将 `EmbedScrollControl.tsx` 的内容复制粘贴进去并保存

### 2. 设置 Embed 组件

1. 在 Framer 画布上添加一个 **Embed** 组件
2. 在 Embed 的 URL 中填入你的 Vercel 部署地址
3. 设置 Embed 的高度为 **100VH**
4. 设置 Embed 的宽度为 **100%**

### 3. 应用 Code Override

1. 选中 Embed 组件
2. 在右侧属性面板找到 **Code Overrides** 部分
3. 从下拉菜单中选择 `EmbedScrollControl`

## 工作原理

### 外层控制（Framer页面级别）

- 监听 Embed 区域的可见度
- 当 Embed 进入视口时，锁定页面滚动
- 将用户的滚轮/触摸事件转换为进度值（0-1）
- 通过 `postMessage` 发送进度给 iframe 内部

### 内层响应（3D模型页面）

- 接收来自外层的 `SCROLL_PROGRESS` 消息
- 直接设置 GSAP 时间轴的进度
- 驱动 3D 模型的入场动画和文字移动
- 模型加载完成后通知外层可以开始接管滚动

### 退出机制

- 当动画进度达到 100% 时，外层自动解锁页面滚动
- 页面平滑滚动到下一个区域
- 完美的滚动穿透体验

## 优势

1. **完全绕过跨域 iframe 限制** - 不依赖 `preventDefault` 或 `touch-action`
2. **原生 Framer 滚动体验** - 在 Framer 页面级别处理滚动
3. **完美的移动端兼容性** - 支持所有 iOS Safari 和 Android 浏览器
4. **简洁的代码结构** - 内外分离，逻辑清晰
5. **可靠的退出机制** - 动画播完后自动放行到下一页

## 调试

如果遇到问题：

1. 打开浏览器开发者工具的 Console
2. 查看是否有 `3D Model loaded, scroll control ready` 消息
3. 检查 Embed 组件的高度是否为 100VH
4. 确认 Code Override 已正确应用到 Embed 组件上

## 自定义参数

可以在 `EmbedScrollControl.tsx` 中调整的参数：

- `deltaY * 0.001` (桌面滚轮灵敏度)
- `deltaY * 0.002` (移动端触摸灵敏度)
- `intersectionRatio >= 0.6` (可见度触发阈值)
- `setTimeout(..., 200)` (动画完成后的延迟时间)