const StatsService = require("../services/StatsService");

class StatsController {
  async list(_, res, next) {
    try {
      const stats = await StatsService.computeStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StatsController();
