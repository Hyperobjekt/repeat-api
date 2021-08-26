// https://nzap-repeat-project.nn.r.appspot.com/v1/load_filters

let url = "https://nzap-repeat-project.nn.r.appspot.com/v1/load_filters";
if (process.argv[2] === "production")
  url = "https://nzap-repeat-project.nn.r.appspot.com/v1/load_filters";
if (process.argv[2] === "staging")
  url = "https://staging-dot-nzap-repeat-project.nn.r.appspot.com/v1/load_filters";
if (process.argv[2] === "dev") url = "http://localhost:5000/v1/load_filters";

const request = require("request");
const fs = require("fs");
const options = {
  method: "GET",
  url,
  headers: {},
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  fs.writeFileSync("_data/nzap_filters.json", response.body);
});
