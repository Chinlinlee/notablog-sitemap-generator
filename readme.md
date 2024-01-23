# notablog-sitemap-generator

Generate your sitemap for [notablog](https://github.com/dragonman225/notablog)


## Getting Started

> [!IMPORTANT]
> This project is using [pnpm](https://pnpm.io)

1. install packages
```bash
pnpm i
```
2. generate sitemap
```bash
node index.js -i {notablog_public_folder} -u {blog_baseUrl} -o "./sitemap.xml"
```
example:
```bash
node index.js -i ./public -u http://localhost:3000 -o "./sitemap.xml"
```
