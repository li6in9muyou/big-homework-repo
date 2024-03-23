const http = require("http");
const fs = require("fs");
const path = require("path");
const mp = require("multiparty");

function discardFurtherAncestors(path, furthest) {
  const firstIdxToTake = path.indexOf(furthest);
  if (firstIdxToTake < 0) {
    return [];
  }

  return path.slice(firstIdxToTake);
}

const UPLOAD_ROOT = "upload";

const server = http.createServer((req, res) => {
  if (req.url !== "/upload") {
    res.writeHead(404);
    res.end();
    return;
  }
  switch (req.method) {
    case "GET":
      fs.readFile("upload.html", (err, data) => {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });
        res.write(data);
        res.end();
      });
      break;
    case "POST":
      const form = new mp.Form();
      let thisFile = null;

      form.on("error", (e) => {
        res.statusCode = 500;
        res.end(`error: ${JSON.stringify(e)}`);
      });
      form.on("part", (part) => {
        if (!part.filename) {
          return;
        }

        thisFile = path.join(__dirname, UPLOAD_ROOT, part.filename);
        const writeStream = fs.createWriteStream(thisFile);
        part.pipe(writeStream);
      });

      form.on("close", () => {
        if (thisFile === null) {
          console.error("upload at close event, thisFile is null");
          res.writeHead(500, "upload at close event, thisFile is null");
        }

        const pathFromUploadRoot = path.join(
          ...discardFurtherAncestors(thisFile.split(path.sep), UPLOAD_ROOT),
        );
        res.end(pathFromUploadRoot);
      });

      form.parse(req);
      break;
    default:
      res.statusCode = 400;
      res.end();
      break;
  }
});

const port = 13333;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
