// __tests__/statsController.test.js

const StatsController = require("../src/controllers/StatsController");
const StatsService = require("../src/services/StatsService");

jest.mock("../src/services/StatsService");

describe("StatsController", () => {
  let res, next;

  beforeEach(() => {
    res = { json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return stats JSON on success", async () => {
      const fakeStats = { total: 10, averagePrice: 99.99 };
      StatsService.computeStats.mockResolvedValue(fakeStats);

      await StatsController.list(null, res, next);

      expect(StatsService.computeStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeStats);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if service throws", async () => {
      const error = new Error("fail");
      StatsService.computeStats.mockRejectedValue(error);

      await StatsController.list(null, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
