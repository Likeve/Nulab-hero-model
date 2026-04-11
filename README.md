# NŪ LABS · 西林瓶 3D 展示页

浏览器内展示的生化西林瓶 GLB 场景：PBR 材质、HDRI 环境、滚轮触发的入场动画，以及 Trackball 拖拽与松手回弹相机逻辑。

**在线仓库：** [github.com/Likeve/Nulab-hero-model](https://github.com/Likeve/Nulab-hero-model)

---

## 功能概览

- **Three.js** 加载 `xilingping999.glb`（**Draco 网格压缩**；通过 `DRACOLoader` 从 CDN 拉取与当前 Three 版本对齐的 `draco/gltf` 解码器），瓶身玻璃、金属盖、橡胶塞、粉末与双标签独立材质与可见性逻辑（代码内已预留）。
- **HDRI**（默认 `parking_garage_1k.hdr`）经 PMREM 生成环境；支持环境旋转与循环扫光动画。
- **滚轮交互：** 模型就绪后相机先置于**远景**（默认视距 ×`POST_ENTRANCE_ZOOM_FROM_FACTOR`）；首次**向下滚动**播放入场（屏外滑入 + 旋转 + 运动模糊）**全程远景起画**；**dolly 回默认机位** `(0,0,8)` 与瓶身入场在同一 GSAP 时间轴上：**提前 `ZOOM_LEAD`（默认 1s）**开推、**约 3s**、**匀速**（`ease: 'none'`，可调 `POST_ENTRANCE_ZOOM_DUR`）。整段序列结束前会暂时屏蔽页面默认滚动。
- **相机：** TrackballControls，松手后沿路径回弹至默认视角；可选**瓶身绕自身 Y 轴自转**（相机不公转；自转与 **dolly zoom in 同帧启动**，即 `ZOOM_LEAD` 时刻，早于整段入场时间轴结束）。
- **调试 UI（lil-gui）：** 当前版本已**整体注释关闭**，便于正式展示；恢复方式见下文「恢复调试面板」。

---

## Framer 代码组件（上传 GLB / HDR）

仓库内提供 **`framer/NulabBottleHero3D.tsx`**，可将当前场景迁入 Framer 的 **Code** 组件使用。

1. 在 Framer 项目中 **Assets** 或使用外链准备好 `.glb`、`.hdr`。
2. **Code → New File**，粘贴 `NulabBottleHero3D.tsx` 全文（或复制到现有 Code 文件）。
3. 在该 Code 文件的 **Dependencies** 中添加 npm 包：**`three`**、**`gsap`**（版本与本地一致即可，建议 `three@0.164.x`）。
4. 将组件拖入画布；在右侧面板中：
   - **模型 GLB / 环境 HDR**：使用文件槽上传（`ControlType.File`），上传后 Framer 会注入完整 URL；
   - 若暂不上传，可填写 **模型备用 URL** / **HDR 备用 URL**（任意可跨域访问的直链）。
5. 网格命名需与 `index.html` 中一致（如 `jingshugaizi`、`pingsheng1`、`biaoqian` 等），否则材质不会自动匹配。

说明：Code 组件为便于维护的精简移植；与纯 `index.html` 相比已去掉 lil-gui。**`GLTFLoader` / `RGBELoader` / `DRACOLoader`** 使用 `three/examples/jsm/loaders/...`（Draco 解码脚本从 `unpkg` 按 `three` 的 `REVISION` 取与 npm 包一致的 `examples/jsm/libs/draco/gltf/`）；**相机拖拽**在组件内自实现（球坐标 + Pointer），避免导入 `TrackballControls`——Framer 易将其解析到 `@types/three` 下的路径并报错。`three/addons/...` 仅适合带 import map 的浏览器直链。

---

## 本地预览

项目为静态文件，需通过 **HTTP** 访问（避免 `file://` 下模块与纹理跨域问题）。

```bash
cd model
python3 -m http.server 8765
```

浏览器打开：`http://localhost:8765/` 并打开 `index.html`（若目录列表则点选 `index.html`）。

---

## 目录与资源

| 类型 | 说明 |
|------|------|
| `index.html` | 主页面：场景、材质、动画、滚轮门控、（可选）GUI |
| `xilingping999.glb` | 当前入口加载的模型文件（建议 glTF 导出时启用 **Draco**；页面已接好解码器） |
| `*.hdr` | 环境贴图资源，可在代码中切换路径 |
| `bottle.glb` | 备用模型（未默认引用时可作替换参考） |

仓库中另有 `Untitled.glb`、`test_*.js` 等未纳入版本跟踪的本地文件时，可按需自行加入 `.gitignore` 或单独提交。

---

## 恢复调试面板（lil-gui）

在 `index.html` 的 `init` 中搜索 **`GUI_RESTORE`**：

1. 删除占位行 **`let gui = null;`**
2. 去掉以下三处块注释的包裹符号 **`/*` … `*/`**（须**同时**恢复，否则 `gui` / `matFolder` 未定义会报错）  
   - **`GUI_RESTORE_BLOCK_A`** — 光照与环境  
   - **`GUI_RESTORE_BLOCK_B`** — 材质文件夹  
   - **`GUI_RESTORE_BLOCK_C`** — 外部标签与部件显示  

---

## 部署建议

- **Vercel / Netlify / GitHub Pages：** 根目录设为包含 `index.html` 与 `*.glb`、`.hdr` 的文件夹；构建命令留空即可。
- 注意 **GLB / HDR 体积** 与 CDN 缓存；大文件可考虑对象存储 + 改 `loader.load` / `RGBELoader` 的 URL。

---

## 技术栈摘要

- [Three.js](https://threejs.org/) r164（import map + ES modules）
- [GSAP](https://greensock.com/gsap/) 时间轴与相机动画
- [lil-gui](https://lil-gui.georgealways.com/)（可选，默认关闭）

---

## 许可与归属

模型与画面版权归项目方所有；第三方库遵循各自开源协议。
