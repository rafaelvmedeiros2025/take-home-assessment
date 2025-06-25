const express = require("express");
const router = express.Router();

const ItemsController = require("../controllers/itemsController");
const StatsController = require("../controllers/statsController");

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get a list of items
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Limit number of items
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: List of items
 */
router.get("/items/", ItemsController.list);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item found
 *       404:
 *         description: Item not found
 */
router.get("/items/:id", ItemsController.index);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create an item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created
 */
router.post("/items/", ItemsController.create);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retrieve aggregated statistics for items
 *     description: Returns summary statistics such as total number of items and average price.
 *     responses:
 *       200:
 *         description: Statistics object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total count of items
 *                 averagePrice:
 *                   type: number
 *                   format: float
 *                   description: Average price of items
 *       500:
 *         description: Internal server error
 */
router.get("/stats/", StatsController.list);

module.exports = router;
