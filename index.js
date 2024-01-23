const fs = require("fs");
const path = require("path");

const dayjs = require("dayjs");
const cheerio = require("cheerio");
const { program } = require("commander");
const glob = require("glob");
const { SitemapXmlWriter } = require("./sitemap-writer");

program.requiredOption("-i, --input <folder>", "Your website static root folder");
program.requiredOption("-u, --url <url>", "Your website url");
program.requiredOption("-o, --output <file>", "output file");

program.parse();

const options = program.opts();

let inputFolder = options.input;
let baseUrl = options.url;
let output = options.output;

if (!path.isAbsolute(inputFolder)) {
    inputFolder = path.resolve(path.join(process.cwd(), inputFolder));
}

function getPages(files) {
    let pages = [];
    for (let file of files) {
        let page = {
            url: file.replace(/\\/, "/"),
            lastmod: getLastModInPage(file)
        }
        pages.push(page);
    }
    return pages;
}

function getLastModInPage(file) {
    let absFile = path.join(inputFolder, file);
    if (path.basename(absFile) === "index.html") {
        return dayjs().format();
    }
    let pageContent = fs.readFileSync(absFile, "utf-8");
    const $ = cheerio.load(pageContent);
    let date = $(".DateTagBar__Date").text().split("Posted on ").at(1);
    if (!date) return dayjs().format();
    let lastMod = dayjs(date, "ddd, MMM DD, YYYY").format("YYYY-MM-DD");
    return lastMod;
}

(async () => {
    let files = await glob.glob(`**/*.html`, {
        cwd: inputFolder
    });
    let pages = getPages(files);
    let sitemapWriter = new SitemapXmlWriter(baseUrl, pages, output);
    await sitemapWriter.writeSiteMapXml();
})();
