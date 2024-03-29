const fsP = require("fs/promises");
const path = require("path");

const dayjs = require("dayjs");
const XmlWriter = require("xml-writer");

const urlJoin = require("./urlJoin");
const { formatXml } = require("./formatXml");

class SitemapXmlWriter {
    constructor(baseUrl, pages, dest) {
        /** @type { string } */
        this.baseUrl = baseUrl;
        /** @type { import("./types").Page[] } */
        this.pages = pages;
        /** @type { string } */
        this.dest = dest;

        if (!path.isAbsolute(dest)) {
            this.dest = path.resolve(path.join(process.cwd(), dest));
        }
    }

    async writeSiteMapXml() {
        let xmlWriter = new XmlWriter();
        xmlWriter.startDocument("1.0", "UTF-8");
        xmlWriter.startElement("urlset");
        xmlWriter.writeAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
        xmlWriter.writeAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        xmlWriter.writeAttribute("xsi:schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd");

        // append blog root first
        await this.addUrl(xmlWriter, { url: this.baseUrl, lastmod: dayjs().format() }, "1.0");

        for (let i = 0; i < this.pages.length; i++) {
            await this.addUrl(xmlWriter, this.pages[i]);
        }
        xmlWriter.endDocument();
        let xmlResult = formatXml(xmlWriter.toString());
        await fsP.writeFile(this.dest, xmlResult, "utf-8");
        console.log(`generated sitemap: ${this.dest}`);
    }

    /**
     * @param {any} xmlWriter
     * @param {import("./types").Page} page
     */
    async addUrl(xmlWriter, page, priority="0.8") {
        xmlWriter.startElement("url");
        if (page.url === this.baseUrl) {
            xmlWriter.writeElement("loc", this.baseUrl);
        } else {
            xmlWriter.writeElement("loc", urlJoin(this.baseUrl, page.url));
        }
        xmlWriter.writeElement("lastmod", page.lastmod);
        xmlWriter.writeElement("priority", priority);
        xmlWriter.endElement();
    }
}



module.exports.SitemapXmlWriter = SitemapXmlWriter;