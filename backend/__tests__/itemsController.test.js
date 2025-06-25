// itemsController.test.js

const ItemsController = require("../src/controllers/ItemsController");
const ItemsService = require("../src/services/ItemsService");
const { schemaValidation } = require("../src/validation/itemsValidation");

// Mock dependencies
jest.mock("../src/services/ItemsService");
jest.mock("../src/validation/itemsValidation");

describe("ItemsController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res), // for chaining
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return list of items", async () => {
      const fakeData = [{ id: 1, name: "Item 1" }];
      ItemsService.getAll.mockResolvedValue(fakeData);

      await ItemsController.list(req, res, next);

      expect(ItemsService.getAll).toHaveBeenCalledWith({
        q: undefined,
        limit: undefined,
        offset: undefined,
      });
      expect(res.json).toHaveBeenCalledWith(fakeData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if service throws", async () => {
      const error = new Error("fail");
      ItemsService.getAll.mockRejectedValue(error);

      await ItemsController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("index", () => {
    it("should return an item when found", async () => {
      const item = { id: 1, name: "Item 1" };
      req.params.id = "1";
      ItemsService.getById.mockResolvedValue(item);

      await ItemsController.index(req, res, next);

      expect(ItemsService.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(item);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with 404 error if item not found", async () => {
      req.params.id = "99";
      ItemsService.getById.mockResolvedValue(null);

      await ItemsController.index(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Item not found");
      expect(err.status).toBe(404);
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should call next with error if service throws", async () => {
      const error = new Error("fail");
      req.params.id = "1";
      ItemsService.getById.mockRejectedValue(error);

      await ItemsController.index(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create and return new item on valid input", async () => {
      const newItem = { name: "New Item", category: "Category", price: 10 };
      req.body = newItem;
      schemaValidation.mockResolvedValue(null);
      const createdItem = { ...newItem, id: 12345 };
      ItemsService.createItem.mockResolvedValue(createdItem);

      await ItemsController.create(req, res, next);

      expect(schemaValidation).toHaveBeenCalledWith(newItem);
      expect(ItemsService.createItem).toHaveBeenCalledWith(newItem);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with validation error if schemaValidation fails", async () => {
      const invalidItem = { name: "Invalid" }; // missing category, price
      req.body = invalidItem;
      const validationError = { errors: ["category is required"] };
      schemaValidation.mockResolvedValue(validationError);

      await ItemsController.create(req, res, next);

      expect(schemaValidation).toHaveBeenCalledWith(invalidItem);
      expect(next).toHaveBeenCalledWith({
        error: "Validation failed",
        details: validationError,
      });
      expect(ItemsService.createItem).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should call next with error if createItem throws", async () => {
      const validItem = { name: "Valid", category: "Cat", price: 10 };
      req.body = validItem;
      schemaValidation.mockResolvedValue(null);
      const error = new Error("fail");
      ItemsService.createItem.mockRejectedValue(error);

      await ItemsController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
