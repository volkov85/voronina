const {src, dest, watch, series, parallel} = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemaps = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const autoprefixer = require(`gulp-autoprefixer`);
const cleanCSS = require(`gulp-clean-css`);
const rename = require(`gulp-rename`);
const htmlmin = require(`gulp-htmlmin`);
const uglify = require(`gulp-uglify`);
const pipeline = require(`readable-stream`).pipeline;
const modernizr = require(`gulp-modernizr`);
const imagemin = require(`gulp-imagemin`);
const imageminPngquant = require(`imagemin-pngquant`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const webp = require(`gulp-webp`);
const del = require(`del`);
const browserSync = require(`browser-sync`).create();

// Компиляция файлов *.css из *.scss с автопрефиксером и минификацией
function css() {
  return src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: require(`scss-resets`).includePaths
    }).on(`error`, sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/css`))
    .pipe(browserSync.stream());
}
exports.css = css;

// Минификация файлов *.html
function html() {
  return src(`source/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(`build`));
}
exports.html = html;

// Минификация файлов скриптов *.js
function js() {
  return pipeline(
    src(`source/js/*.js`),
    uglify(),
    rename({
      suffix: `.min`
    }),
    dest(`build/js`)
  );
}
exports.js = js;

// Генерация файла библиотеки Modernizr
exports.modernizr = function () {
  return src(`fake`, {
    allowEmpty: true
  })
    .pipe(modernizr({
      options: [`setClasses`],
      crawl: false,
      tests: [`webp`]
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(dest(`build/js`));
};

// Сжатие файлов изображений
exports.img = function () {
  return src([
    `source/img/*.{png,jpg,svg}`,
    `!source/img/icon-*.svg`
  ])
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.7, 0.9]
      }),
      imageminMozjpeg({
        quality: 75
      }),
      imagemin.svgo()
    ]))
    .pipe(dest(`build/img`));
};

// Генерация файлов изображений в формате *.webp
exports.webp = function () {
  return src(`source/img/*.{png,jpg}`)
    .pipe(webp({
      quality: 90
    }))
    .pipe(dest(`build/img`));
};

// Удаление файлов в папке build перед копированием
function clean() {
  return del(`build`);
}
exports.clean = clean;

// Копирование файлов в папку build
function copy() {
  return src([
    `source/fonts/**/*.{woff,woff2}`,
    `source/img/**`,
    `!source/img/icon-*.svg`,
    `source/*.ico`
  ], {
    base: `source`
  })
    .pipe(dest(`build`));
}
exports.copy = copy;

// Запуск сервера Browsersync
function server() {
  browserSync.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch(`source/sass/**/*.{scss,sass}`, css);
  watch(`source/*.html`, series(html, refresh));
}
exports.server = server;

// Автообновление страницы
function refresh(done) {
  browserSync.reload();
  done();
}
exports.refresh = refresh;

// Создание сборки проекта
exports.build = series(
  clean,
  parallel(copy, css, js, html)
);

// Создание сборки проекта и запуск сервера Browsersync
exports.start = series(
  clean,
  parallel(copy, css, js, html),
  server
);
