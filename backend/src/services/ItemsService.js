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
    // Check if item with same name already exists (case-insensitive)
    const exists = data.some(
      (existingItem) =>
        existingItem.name.toLowerCase() === item.name.toLowerCase()
    );

    if (exists) {
      // Return null or throw an error — aqui escolhi lançar erro
      const error = new Error("Item already exists");
      error.status = 409; // HTTP 409 Conflict
      throw error;
    }

    item.id = Date.now();
    data.push(item);
    await writeData(data);
    return item;
  }
}

module.exports = new ItemsService();
