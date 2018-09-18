var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("browser-sync").create();

var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var plumber = require("gulp-plumber");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");  
// gulp 3 
var run = require("run-sequence");
var del = require("del");

gulp.task("clean", function() {
  return del("build/*");
});

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    // causes problems with style.css
    // .pipe(postcss([
    //   autoprefixer()
    // ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// gulp.task("sprite", function() {
//   return gulp.src("sourcs/img/icon-*.svg")
//     .pipe(svgStore({
//       inlineSvg: true
//     }))
//     .pipe(rename("sprite.svg"))
//     .pipe(gulp.dest("build/img"));
// });

gulp.task("html", function() {
  return gulp.src("source/*.html")
    // .pipe(posthtml([
    //   include() //inlining svg
    // ]))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png, jpg, svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
      // imagemin.svgo()
      ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{jpg, png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on('change', server.reload);
  // gulp.watch("build/*.html")
});

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "images",
    "style",
    // "sprite",
    "html",
    done
  );
});