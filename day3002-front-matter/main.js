import { createReadStream, createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const FRONT_MATTER = "lorem ipsum\n";
const FRONT_MATTER_ENCODED = Buffer.from(FRONT_MATTER, "utf-8");

const [, , ...args] = process.argv;
if (args.length === 2) {
  const [rgx, dir, ..._] = args;
  const RGX_PATTERN = new RegExp(rgx);

  const interestedFiles = (await fs.readdir(dir))
    .filter((f) => RGX_PATTERN.test(f))
    .map((f) => path.join(dir, f));

  for (const f of interestedFiles) {
    let isFirstChunk = true;
    const after = f + "-lorem";
    await pipeline(
      createReadStream(f),
      async function* (source) {
        for await (const chunk of source) {
          if (
            isFirstChunk &&
            0 !==
              chunk
                .slice(0, FRONT_MATTER_ENCODED.length)
                .compare(FRONT_MATTER_ENCODED)
          ) {
            yield FRONT_MATTER_ENCODED;
            isFirstChunk = false;
          }
          yield chunk;
        }
      },
      createWriteStream(after),
    );
    await fs.rm(f);
    await fs.rename(after, f);
  }
} else {
  console.info("helpful message");
}
