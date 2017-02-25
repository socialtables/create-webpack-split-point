#!/usr/bin/env node
require("../index.js")(process.argv[3], err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  else {
    process.exit(0);
  }
});
