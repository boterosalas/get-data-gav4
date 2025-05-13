const express = require("express");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");
require("dotenv").config();
const { getDateRange } = require("./utils/dateUtils");

const app = express();
const PORT = process.env.PORT || 3000;
const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials,
});

const PROPERTY_ID = process.env.GA4_PROPERTY_ID; // Reemplaza con el ID real

app.get("/api/analytics", async (req, res) => {
  const {
    startDate,
    endDate,
    dimensions = "",
    metrics = "",
    filterName = "",
    filterValue = "",
    matchType = "CONTAINS",
  } = {
    ...getDateRange(),
    ...req.query,
  };
  const dimensionList = dimensions
    .split(",")
    .map((name) => ({ name: name.trim() }));
  const metricList = metrics.split(",").map((name) => ({ name: name.trim() }));
  // Construcción condicional de dimensionFilter
  const dimensionFilter =
    filterName && filterValue
      ? {
          filter: {
            fieldName: filterName,
            stringFilter: {
              matchType: matchType.toUpperCase(), // Debe ir en mayúsculas
              value: filterValue,
            },
          },
        }
      : undefined;
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensionList,
      metrics: metricList,
      ...(dimensionFilter && { dimensionFilter }),
    });

    const result = response.rows.map((row) => {
      const obj = {};
      dimensionList.forEach((d, i) => {
        obj[d.name] = row.dimensionValues[i]?.value;
      });
      metricList.forEach((m, i) => {
        obj[m.name] = row.metricValues[i]?.value;
      });
      return obj;
    });

    res.json(result);
  } catch (error) {
    console.error("Error al consultar Google Analytics:", error);
    res.status(500).json({ error: "Error al consultar Google Analytics" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
