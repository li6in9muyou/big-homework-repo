const http = require("http");
const fs = require("fs");
const path = require("path");
const mp = require("multiparty");

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "OPTION":
      break;
    case "POST":
      if (req.url === "/upload") {
        const form = new mp.Form();
        let thisFile = null;

        form.on("part", (part) => {
          if (!part.filename) {
            return;
          }

          thisFile = path.join(__dirname, "upload", part.filename);
          const writeStream = fs.createWriteStream(thisFile);
          part.pipe(writeStream);
        });

        form.on("close", () => {
          res.end(thisFile ?? "bad path");
        });

        form.parse(req);
      }
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
