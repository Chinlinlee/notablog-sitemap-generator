const path = require("path");

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

(async () => {
    let files = await glob.glob(`**/*.html`, {
        cwd: inputFolder
    });
    let urls = [];
    for (let i = 0 ; i < files.length ; i++) {
        let url = files[i].replace(/\\/, "/");
        urls.push(url);
    }
    let sitemapWriter = new SitemapXmlWriter(baseUrl, urls, output);
    await sitemapWriter.writeSiteMapXml();
})();
