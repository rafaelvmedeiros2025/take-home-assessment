const ItemsService = require("../services/ItemsService");
const { schemaValidation } = require("../validation/itemsValidation");

class ItemsController {
  // GET /api/items
  async list(req, res, next) {
    try {
      const { q, limit, offset } = req.query;
      const results = await ItemsService.getAll({ q, limit, offset });
      res.json(results);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/items/:id
  async index(req, res, next) {
    try {
      const item = await ItemsService.getById(Number(req.params.id));
      if (!item) {
        const err = new Error("Item not found");
        err.status = 404;
        throw err;
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/items
  async create(req, res, next) {
    try {
      const item = req.body;
      const validationErrors = await schemaValidation(item);
      if (validationErrors) {
        return next({
          error: "Validation failed",
          details: validationErrors,
        });
      }

      const created = await ItemsService.createItem(item);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ItemsController();
