const router = require("express").Router();
const _m = require("../../_middlewares");
const neatCsv = require("neat-csv");
const slug = require("slug");

const fs = require("fs");

router.get("/", async (req, res) => {
  let insertTracker = [],
    finalShapeIndexed = {},
    finalShapeArray = [];
  const dataCSV = fs.readFileSync("_data/repeat_data.csv", {
    encoding: "utf8",
    flag: "r",
  });
  let dataJSON = await neatCsv(dataCSV);

  let processedJson = dataJSON.map((row) => {
    let indexes = {};
    let rowKeys = Object.keys(row).forEach((key) => {
      isNaN(row[key])
        ? (indexes[`${key}_index`] = slug(row[key]))
        : (row[key] = Number(row[key]));
    });
    return { ...indexes, ...row };
  });

  processedJson.forEach((row) => {
    let trackIndex = [
      row.state_index || "",
      row.categories_index || "",
      row.subcategories_index || "",
      row.policy_index || "",
    ].join("-");
    if (insertTracker.includes(trackIndex)) {
      let obj = {
        variable: row.variables,
        history: { 2020: Math.round(row.history_2020) },
        policy: {
          2030: Math.round(row.current_policy_2030),
          2050: Math.round(row.current_policy_2050),
        },
        repeat: {
          2030: Math.round(row.repeat_policy_2030),
          2050: Math.round(row.repeat_policy_2050),
          deltas: { 2030: 0, 2050: 0 },
        },
        core: {
          2030: Math.round(row.core_policy_2030),
          2050: Math.round(row.core_policy_2050),
        },
      };
      if (!finalShapeIndexed[trackIndex].variables.includes(row.variables)) {
        finalShapeIndexed[trackIndex].variables.push(row.variables);
      }
      return finalShapeIndexed[trackIndex].values.push(obj);
    }
    if (!insertTracker.includes(trackIndex)) {
      insertTracker.push(trackIndex);
      return (finalShapeIndexed[trackIndex] = {
        state: row.state,
        category: row.categories,
        subcategory: row.subcategories,
        policy: row.policy,
        variables: [],
        values: [],
      });
    }
  });

  Object.keys(finalShapeIndexed).forEach((key) =>
    finalShapeArray.push(finalShapeIndexed[key])
  );

  fs.writeFileSync("_data/repeat_data.json", JSON.stringify(finalShapeArray));
  res.status(200).send(`${finalShapeArray.length} Saved!`);
});

module.exports = router;
