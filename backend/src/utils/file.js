const fs = require("fs").promises;
const chokidar = require("chokidar");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../../../data/items.json");

const cache = new Map();

/**
 * Reads JSON data from a file with cache invalidation using chokidar watcher.
 * @returns {Promise<object>} Parsed JSON data
 */
async function readData() {
  if (cache.has(DATA_PATH)) {
    return cache.get(DATA_PATH);
  }

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  cache.set(DATA_PATH, data);

  // Initialize watcher (only once per file)
  chokidar
    .watch(DATA_PATH, { persistent: false, ignoreInitial: true })
    .on("change", async () => {
      try {
        const newRaw = await fs.readFile(DATA_PATH, "utf-8");
        const newData = JSON.parse(newRaw);
        cache.set(DATA_PATH, newData);
        console.log(`[cache] Updated: ${DATA_PATH}`);
      } catch (err) {
        console.error(`[cache] Failed to update cache for: ${DATA_PATH}`, err);
      }
    })
    .on("unlink", () => {
      cache.delete(DATA_PATH);
      console.log(`[cache] Removed from cache: ${DATA_PATH}`);
    });

  return data;
}

/**
 * Writes JSON data to a file and updates the cache immediately.
 * @param {object} data - Data object to serialize and write
 */
async function writeData(data) {
  const stringified = JSON.stringify(data, null, 2);
  await fs.writeFile(DATA_PATH, stringified, "utf-8");
  cache.set(DATA_PATH, data);
}

module.exports = { readData, writeData };
