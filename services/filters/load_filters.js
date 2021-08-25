const router = require("express").Router();
const _m = require("../../_middlewares");
const slug = require("slug");
let categoryColorMap = {};
// const data = require('../../_data/nzap_filters.json')
const setField = (req, field) => {
  req.locals.distinctField = field;
  return;
};
const setup = (req, res, next) => {
  req.locals = { collection: "scenarios" };
  next();
};
const slugify = (str) => {
  if (!str || str === "NA") return "";
  if (str.charAt(str.length - 1) === "+") return slug(`${str} positive`);
  if (str.charAt(str.length - 1) === "-") return slug(`${str} negative`);
  return slug(str);
};

const capitalize = (str) =>
  str
    .split(" ")
    .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
    .join(" ");

const getUsStates = (req, res, next) => {
  let db = req.app.get("db");
  let agg = db
    .collection("scenarios")
    .aggregate([{ $group: { _id: { state: "$state", _state: "$_state" } } }])
    .toArray();
  agg.then((results) => {
    let usStates = results
      .filter((doc) => doc._id.state)
      .map((doc) => ({
        label: capitalize(doc._id.state),
        slug: doc._id._state || slug(doc._id.state),
      }));
    let lead = usStates.filter((doc) => doc.slug === "national");
    let follow = usStates
      .filter((doc) => doc.slug !== "national")
      .sort((a, b) => (a.slug < b.slug ? -1 : 1));
    res.locals.usStates = [...lead, ...follow];
    next();
  });
};
const getYearsField = (req, res, next) => {
  let db = req.app.get("db");
  let agg = db
    .collection("scenarios")
    .aggregate([{ $group: { _id: { year: "$year", _year: "$_year" } } }])
    .toArray();
  agg.then((results) => {
    res.locals.years = results
      .sort((a, b) => (a._id._year < b._id._year ? -1 : 1))
      .filter((doc) => doc._id.year)
      .map((doc) => ({
        label: doc._id.year.replace(/\D/g, ""),
        slug: doc._id._year,
      }));
    next();
  });
};
const getScenariosField = (req, res, next) => {
  let db = req.app.get("db");
  let agg = db
    .collection("scenarios")
    .aggregate([
      { $group: { _id: { scenario: "$scenario", _scenario: "$_scenario" } } },
    ])
    .toArray();
  agg.then((results) => {
    res.locals.scenarios = results
      .filter((doc) => doc._id.scenario)
      .map((doc) => ({ label: doc._id.scenario, slug: doc._id._scenario }));
    next();
  });
};
const getFilterLevelOneField = (req, res, next) => {
  let db = req.app.get("db");
  // let agg = db.collection('scenarios').aggregate([
  //   { $group: { _id: { filter_level_1: '$filter_level_1', _filter_level_1: '$_filter_level_1', alt_l1: '$alt_l1' } } }
  // ]).toArray();
  let agg = db
    .collection("scenarios")
    .aggregate([
      { $group: { _id: { category: "$category", _category: "$_category" } } },
    ])
    .toArray();
  agg.then((results) => {
    res.locals.levelOneFilters = results
      .filter((e) => e._id.category !== "NA")
      .filter((doc) => doc._id.category)
      .sort((a, b) => (a._id.alt_l1 < b._id.alt_l1 ? -1 : 1))
      .map((doc, i) => {
        let index = (i + 1) % 6;
        index = index ? index : 6 - index;
        let categorySlug = doc._id._category || slug(doc._id.category),
          color = `table-${index}`;
        categoryColorMap[categorySlug] = color;

        return {
          label: doc._id.category,
          slug: categorySlug,
          color,
        };
      });
    next();
  });
};

const assembleFilterLevelTwo = async (req, res, next) => {
  let db = req.app.get("db");
  let agg = db
    .collection("scenarios")
    .aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            _category: "$_category",
            subcategory: "$subcategory",
            _subcategory: "$_subcategory",
            alt_l1: "$alt_l1",
            alt_l2: "$alt_l2",
          },
        },
      },
    ])
    .toArray();
  agg.then((results) => {
    res.locals.levelTwoFilters = results
      .filter((e) => e._id.subcategory !== "NA")
      .filter((doc) => doc._id.subcategory)
      .sort((a, b) => (a._id.alt_l2 < b._id.alt_l2 ? -1 : 1))
      .map((doc) => ({
        label: doc._id.subcategory,
        slug: doc._id._subcategory || slug(doc._id.subcategory),
        levelOneLabel: doc._id.category,
        levelOneSlug: doc._id._category || slug(doc._id.category),
        color: categoryColorMap[doc._id._category || slug(doc._id.category)],
      }));
    next();
  });
};

const done = (req, res) => {
  res.status(200).json(res.locals);
};

router.get(
  "/",
  setup,
  // UsStates (geo)
  getUsStates,
  // Years (year)
  // getYearsField,
  // Scenarios (scenario)
  // getScenariosField,
  // FilterLevelOne (scenario)
  getFilterLevelOneField,
  // // FilterLevelTwo (scenario)
  assembleFilterLevelTwo,
  done
);

module.exports = router;
