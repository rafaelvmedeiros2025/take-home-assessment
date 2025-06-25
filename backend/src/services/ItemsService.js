const { readData, writeData } = require("../utils/file");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

class ItemsService {
  async getAll({ q, limit, offset }) {
    const data = await readData();
    let results = [...data];

    // Normalize query
    const query = (q || "").toString().trim().toLowerCase();
    const safeLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    // Filter by name
    if (query) {
      results = results.filter((item) =>
        item.name?.toLowerCase().includes(query)
      );
    }

    const paginated = results.slice(safeOffset, safeOffset + safeLimit);

    return {
      total: results.length,
      limit: safeLimit,
      offset: safeOffset,
      data: paginated,
    };
  }

  async getById(id) {
    const data = await readData();
    return data.find((item) => item.id === id);
  }

  async createItem(item) {
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    return item;
  }
}

module.exports = new ItemsService();
