import { createReadStream, createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const FRONT_MATTER = "lorem ipsum\n";
const FRONT_MATTER_ENCODED = Buffer.from(FRONT_MATTER, "utf-8");

const [, , ...args] = process.argv;
if (args.length >= 1) {
  const [rgx, _d] = args;
  const dir = _d ?? ".";
  const RGX_PATTERN = new RegExp(rgx);

  const prependAllMatchedFiles = (await fs.readdir(dir))
    .filter((f) => RGX_PATTERN.test(f))
    .map((file) =>
      (async (f) => {
        let isFirstChunk = true;
        const prependFrontMatter = async function* (source) {
          for await (const chunk of source) {
            const isStartWithFrontMatter =
              0 ===
              chunk
                .slice(0, FRONT_MATTER_ENCODED.length)
                .compare(FRONT_MATTER_ENCODED);
            if (isFirstChunk && !isStartWithFrontMatter) {
              yield FRONT_MATTER_ENCODED;
              isFirstChunk = false;
            }
            yield chunk;
          }
        };

        const after = f + "-lorem";
        await pipeline(
          createReadStream(f),
          prependFrontMatter,
          createWriteStream(after),
        );
        await fs.rm(f);
        await fs.rename(after, f);
      })(path.join(dir, file)),
    );
  await Promise.all(prependAllMatchedFiles);
} else {
  console.info(
    `prepend lorem ipsum to files in DIR that match REGEX_PATTERN

usage: ${path.basename(process.argv[1])} REGEX_PATTERN [DIR]`,
  );
}
