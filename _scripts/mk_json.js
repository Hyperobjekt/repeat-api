const neatCsv = require("neat-csv");
const slug = require("slug");
const fs = require("fs");

(async () => {
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
      let policyKeys = Object.keys(row)
        .filter((key) => key.includes("_policy_"))
        .map((key) => key.split("_policy_"));
      let obj = {
        variable: row.variables,
        repeat: {
          deltas: { 2030: 0, 2050: 0 },
        },
      };

      policyKeys.forEach((key) => {
        obj[key[0]] = obj[key[0]] || {};
        obj[key[0]][key[1]] = Number(row[`${key[0]}_policy_${key[1]}`]);
      });

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
})();
