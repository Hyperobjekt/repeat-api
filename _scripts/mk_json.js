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
        : (row[key] = row[key]);
    });
    return { ...indexes, ...row };
  });

  processedJson.forEach((row) => {
    let trackIndex = [
      row.state_index || "",
      row.categories_index || "",
      row.subcategories_index || "",
      // row.policy_index || "",
    ].join("-");

    if (!insertTracker.includes(trackIndex)) {
      insertTracker.push(trackIndex);
      finalShapeIndexed[trackIndex] = {
        _state: typeof row.state === "string" ? slug(row.state) : null,
        _category: typeof row.categories === "string" ? slug(row.categories) : null,
        _subcategory: typeof row.subcategories === "string" ? slug(row.subcategories) : null,
        // _policy: typeof row.policy === "string" ? slug(row.policy) : null,
        units: row.units,
        state: row.state,
        category: row.categories,
        subcategory: row.subcategories,
        // policy: row.policy,
        variables: [],
        values: [],
      };
    }

    if (insertTracker.includes(trackIndex)) {
      let policyKeys = Object.keys(row)
        .filter((key) => key.includes("_pol_"))
        .map((key) => key.split("_pol_"));
      let obj = {
        variable: row.variables,
        // repeat: {
        //   deltas: { 2030: 0, 2050: 0 },
        // },
      };

      policyKeys.forEach((key) => {
        obj[key[0]] = obj[key[0]] || {};
        const val = row[`${key[0]}_pol_${key[1]}`];
        obj[key[0]][key[1]] = val === "" ? "N/A" : Number(val.replace("%", ""));
        obj[key[0]].deltas = { 2030: "", 2050: "" };
      });

      if (!finalShapeIndexed[trackIndex].variables.includes(row.variables)) {
        finalShapeIndexed[trackIndex].variables.push(row.variables);
      }
      finalShapeIndexed[trackIndex].values.push(obj);
    }
  });

  Object.keys(finalShapeIndexed).forEach((key) =>
    finalShapeArray.push(finalShapeIndexed[key])
  );

  fs.writeFileSync("_data/repeat_data.json", JSON.stringify(finalShapeArray));
})();
