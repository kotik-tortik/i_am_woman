'use strict'

const gulp = require("gulp");
// const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const less = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const server = require("browser-sync").create();

// gulp.task("babel", function () {
//   return gulp.src("source/js/**/*.js")
//     .pipe(babel({
//       presets: [
//         ['@babel/preset-env',
//           {
//             "targets": {
//               "chrome": "58",
//               "ie": "11"
//             }
//           }
//         ]
//       ]
//     }))
//     .pipe(gulp.dest('build/js'));
// });

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/content/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img/content"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff2,woff}",
    "source/*.html",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("source/*.html", gulp.series("build", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("build", "refresh"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "webp"
  // "babel"
));

gulp.task("start", gulp.series("build", "server"));