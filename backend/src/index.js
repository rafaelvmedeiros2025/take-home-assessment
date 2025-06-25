const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const swaggerSpec = require("../docs/swagger");

const { getCookie, notFound } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" }));
// Basic middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Not Found
app.use("*", notFound);

getCookie();

app.listen(port, () =>
  console.log("Backend running on http://localhost:" + port)
);
