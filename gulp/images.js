// packages
const fs = require("fs");
const glob = require("glob");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const path = require("path");
const sharp = require("sharp");

// specify transforms
const transforms = [
  {
    src: "./src/assets/img/blogposts/*",
    dist: "./dist/img/blogposts/_1024x576/",
    options: {
      width: 1024,
      height: 576,
      fit: "cover"
    }
  },
  {
    src: "./src/assets/img/blogposts/*",
    dist: "./dist/img/blogposts/_600x600/",
    options: {
      width: 600,
      height: 600,
      fit: "cover"
    }
  },
  {
    src: "./src/assets/img/projects/*",
    dist: "./dist/img/projects/_800x600/",
    options: {
      width: 800,
      height: 600,
      fit: "cover"
    }
  }
];

// Optimize images (src)
function optimiseImages() {
  return gulp
    .src("./src/assets/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./src/assets/img/"));
}

// resize images
function resizeImages(done) {
  transforms.forEach(function(transform) {
    let distDir = transform.dist;
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    let files = glob.sync(transform.src);

    files.forEach(function(file) {
      let filename = path.basename(file);
      sharp(file)
        .resize(transform.options)
        .toFile(`${distDir}/${filename}`)
        .catch(err => {
          console.log(err);
        });
    });
  });
  done();
}

// copy original images to dist
function copyImages(done) {
  // src and dist
  let sourceDir = "./src/assets/img/";
  let distDir = "./dist/img/";

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

// exports (Common JS)
module.exports = {
  resize: resizeImages,
  optimise: optimiseImages,
  copy: copyImages
};
