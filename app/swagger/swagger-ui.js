const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const config = require("@app/config");

app.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = config.swaggerPort || 9898;
app.listen(port, () => {
  console.log(`Swagger UI is accessible by http://localhost:${port}`);
});

module.exports = app;
