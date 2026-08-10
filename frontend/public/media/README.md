# Gateway Bot Image Sources

> 目录名是 `media/` 不是 `images/`：后端把 `/images/` 整段留给了网关的图片 API
> （`/images/generations`、`/images/edits`、`/images/batches` 等根级路由），
> 放在那里的静态图在真机上会被中间件放行给 API 路由，一律 404。

> **落地页已经不用照片了。** 首屏原来是一整张 Unsplash 玻璃幕墙，订阅段是同一张图的
> 另一个裁切。这类图任何一个 SaaS 落地页都能换上去而毫无违和 —— 等于没有表达，
> 而且是被别人撞图的常见来源。现在首屏底纹、路由图、订阅账本全部是 CSS / 字符画画的，
> 零静态资源。**加新配图前先想清楚它是不是又在填面积。**
>
> 剩下这两个文件只因为还有真实引用才留着，删之前请先改掉引用方：
>
> - `gateway-architecture-desktop.jpg` — 只作 `frontend/index.html` 的 `og:image`
>   社交卡片用。因此已从 1600×1000 缩到 1200×750（`sips -Z 1200`），
>   它不再需要按首屏大图的分辨率进二进制。
> - `gateway-architecture-mobile.{jpg,webp}` — `src/components/layout/AuthLayout.vue`
>   的登录页背景。

前端是 `//go:embed all:dist` 编进 Go 二进制的，这个目录里每一个字节都会变成
二进制体积，没有 CDN 可以卸载。

Source and licensing:

- Source: `https://unsplash.com/photos/1511818966892-d7d671e672a2`
- Retrieved: 2026-08-09
- License: Unsplash License (`https://unsplash.com/license`)
- Local treatment: crop, resize, and CSS toning
