#!/usr/bin/mongo --quiet

// var i = 0;
// function doUpload(i) {
//   try {
//     load(`./_data/nzap_data_batch_${i}.js`)
//     db.scenarios.insertMany(scenarios)
//     print(`Batch #${i} done...`)
//     i = i + 1;
//     doUpload(i)
//   } catch (error) {
//     return;
//   }
// }

// doUpload(i)

load('./_data/repeat_data.js')
db.scenarios.insertMany(scenarios)
