# Gateway Bot Image Sources

> 目录名是 `media/` 不是 `images/`：后端把 `/images/` 整段留给了网关的图片 API
> （`/images/generations`、`/images/edits`、`/images/batches` 等根级路由），
> 放在那里的静态图在真机上会被中间件放行给 API 路由，一律 404。


The Gateway Bot architecture images are responsive crops of the same Unsplash photograph:

- Source: `https://unsplash.com/photos/1511818966892-d7d671e672a2`
- Retrieved: 2026-08-09
- License: Unsplash License (`https://unsplash.com/license`)
- Local treatment: crop, resize, and CSS olive toning

Files:

- `gateway-architecture-desktop.jpg`: desktop hero, 1600 x 1000
- `gateway-architecture-mobile.jpg`: mobile hero, 900 x 1400
- `gateway-access-detail.jpg`: supporting subscription section, 900 x 900
