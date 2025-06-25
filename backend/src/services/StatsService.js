const { readData } = require("../utils/file");

class StatsService {
  constructor() {
    this.cachedStats = null;
    this.cacheTimestamp = 0;
    this.cacheTTL = 60 * 1000; // 1 min cache TTL
  }

  async computeStats() {
    // Use cached stats if fresh
    if (this.cachedStats && Date.now() - this.cacheTimestamp < this.cacheTTL) {
      return this.cachedStats;
    }

    // Get data from cached readData (chokidar handles updating cache on file changes)
    const items = await readData();

    if (!Array.isArray(items) || items.length === 0) {
      this.cachedStats = { total: 0, averagePrice: 0 };
      this.cacheTimestamp = Date.now();
      return this.cachedStats;
    }

    // Heavy CPU calculation example
    const total = items.length;
    const sumPrice = items.reduce((acc, item) => acc + (item.price || 0), 0);
    const averagePrice = sumPrice / total;

    // Cache result & timestamp
    this.cachedStats = { total, averagePrice };
    this.cacheTimestamp = Date.now();

    return this.cachedStats;
  }
}

module.exports = new StatsService();
