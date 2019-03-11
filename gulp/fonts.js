// packages
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// copy fonts to dist
function copyFonts(done) {
  // src and dist
  let sourceDir = "./src/assets/fonts/";
  let distDir = "./dist/fonts/";

  // if dist dir does not exists, make it
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // glob all files
  let files = glob.sync(`${sourceDir}/**/*`, { nodir: true });

  // copy each file to dist dir
  files.forEach(function(file) {
    let srcFile = file;
    let distFile = srcFile.replace(sourceDir, distDir);
    let distDirName = path.dirname(distFile);

    if (!fs.existsSync(distDirName)) {
      fs.mkdirSync(distDirName, { recursive: true });
    }

    if (!fs.existsSync(distFile)) {
      fs.copyFile(srcFile, distFile, err => {
        if (err) throw err;
      });
    }
  });
  done();
}

// exports
module.exports = {
  copy: copyFonts
};
