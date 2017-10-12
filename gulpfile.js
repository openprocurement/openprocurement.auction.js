const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      del           = require('del'),
      concat        = require('gulp-concat'),
      util          = require('gulp-util'),
      vendorFiles   = require('gulp-main-bower-files'),
      minify        = require('gulp-minify'),
      gulpFilter    = require('gulp-filter'),
      source        = require('vinyl-source-stream'),
      cleanCSS      = require('gulp-clean-css'),
      fileinclude   = require('gulp-file-include'),
      uglify        = require('gulp-uglify'),
      rename        = require("gulp-rename"),
      fs            = require("fs"),
      merge         = require('merge-stream'),
      sourcemaps    = require('gulp-sourcemaps'),
      render        = require('gulp-nunjucks-render'),
      filenamelist  = require('gulp-filenamelist');

function  interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}


const config = JSON.parse(fs.readFileSync('./config.json'));
const db_name = config.db_name || 'database';
const app_name = config.app_name || 'auction.js';
const devel = ('devel' in config) ? config.devel : true;
const main_css = config.main_css || 'bundle.css';


gulp.task('fonts', () => {
  return gulp.src(config.fonts)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir+'/fonts/'));
});


gulp.task('png-images', () => {
  return gulp.src(config.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('icons', () => {
  return gulp.src(config.img.icons)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir+'/img/'));
});

//gulp.task('bower-main', () => {
//  return allJs = gulp.src('./bower.json')
//    .pipe(vendorFiles({base: "src/lib"}))
//    .pipe(gulpFilter(['**/*.js']))
//    .pipe(gulp.dest(config.buildDir + '/vendor/'));
//});


//"vendor/pouchdb/dist/pouchdb.js",
//"vendor/event-source-polyfill/eventsource.min.js",
//"vendor/angular-cookies/angular-cookies.min.js",
//"vendor/angular-ellipses/src/truncate.js",
//"vendor/angular-timer/dist/angular-timer.min.js",
//"vendor/angular-translate/angular-translate.min.js",
//"vendor/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
//"vendor/angular-translate-storage-local/angular-translate-storage-local.min.js",
//"vendor/angular-growl-2/build/angular-growl.js",
//"vendor/angular-gtm-logger/angular-gtm-logger.min.js",
//"static/js/app.js",
//"static/js/utils.js",
//"static/js/translations.js",
//"static/js/controllers.js",
//"vendor/moment/locale/uk.js",


gulp.task('js:tenders_vendor',  () => {
  // TODO: uglify only on debug == false\
  // TODO: cdnizer - https://www.npmjs.com/package/gulp-cdnizer
  return gulp.src(config.modules.tenders.js.vendor)
//  .pipe(sourcemaps.init())
//  .pipe(concat('auction_bundle.js', {newLine: ';\n'}))
//  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.buildDir + '/static/js/vendor' ))
//  .on('end', () => {
//    del([config.buildDir + '/vendor'])
//  });
});


gulp.task('js:tenders_app',  () => {
  // TODO: uglify only on debug == false\
  // TODO: cdnizer - https://www.npmjs.com/package/gulp-cdnizer
  return gulp.src(config.modules.tenders.js.src)
//  .pipe(sourcemaps.init())
//  .pipe(concat('auction_bundle.js', {newLine: ';\n'}))
//  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.buildDir + '/static/js/app' ))
//  .on('end', () => {
//    del([config.buildDir + '/vendor'])
//  });
});


//gulp.task('all-js', ['bower-main'], () => {
//  // TODO: uglify only on debug == false
//  return gulp.src([
//    config.buildDir + '/vendor/angular/angular.min.js',
//    config.buildDir + '/vendor/**/**/*.js',
//    './src/lib/moment/locale/uk.js',
//    './src/lib/moment/locale/ru.js',
//    './src/lib/puchdb/**/*.js'])
//  .pipe(concat('vendor.js'))
//  .pipe(devel ? util.noop() : uglify())
//  .pipe(gulp.dest(config.buildDir));
//});
//
//gulp.task('all-js', ['bower-main'], () => {
//  // TODO: uglify only on debug == false
//  return gulp.src([
//    config.buildDir + '/vendor/angular/angular.min.js',
//    config.buildDir + '/vendor/**/**/*.js',
//    './src/lib/moment/locale/uk.js',
//    './src/lib/moment/locale/ru.js',
//    './src/lib/puchdb/**/*.js'])
//  .pipe(concat('vendor.js'))
//  .pipe(devel ? util.noop() : uglify())
//  .pipe(gulp.dest(config.buildDir))
//  .on('end', () => {
//    del([config.buildDir + '/vendor'])
//  });
//});


gulp.task('css', () => {
  return gulp.src(config.styles)
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('htmlPages', function () {
    return gulp.src('templates/tender.html')
    .pipe(render({
      path: 'templates/',
      data: config,
    }))
    .pipe(gulp.dest(config.buildDir));

});


//gulp.task('htmlPages', () => {
//  return merge(config.html.map((page) => {
//    return gulp.src('./templates/base.html')
//    .pipe(fileinclude({
//      prefix: '@@',
//      indent: true,
//      context: {
//        title: page.title,
//        name: page.name,
//        scripts: page.scripts,
//        controller: page.controller,
//        db_url: config.dbUrl,
//        db_name: db_name,
//        auctions_server: config.auctions_server
//      }}))
//    .on('error', interceptErrors)
//    .pipe(rename(page.name +'.html'))
//    .pipe(gulp.dest(config.buildDir));
//
//  }));
//});


gulp.task('listingApp', () => {
  return gulp.src(['./src/app/index.js',
    './src/app/config.js',
    './src/app/controllers/ListingCtrl.js'
    ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('archiveApp', () => {
  return gulp.src(['./src/app/archive.js',
    './src/app/config.js',
    './src/app/controllers/ArchiveCtl.js'])
    .pipe(concat('archive.js'))
    .pipe(gulp.dest(config.buildDir));
});


//gulp.task('auctionApp', () => {
//  return gulp.src([])
//    .pipe(concat(app_name))
//    .pipe(devel ? util.noop() : uglify({ mangle: false}))
//    .pipe(gulp.dest(config.buildDir));
//});


gulp.task('build', ['js:auction_bundle', 'css', 'png-images', 'icons', 'htmlPages', 'listingApp', 'archiveApp', 'fonts'], () => {

  let css = gulp.src(`${config.buildDir}/${main_css}`)
      .pipe(gulp.dest(config.outDir + '/static/css/'));

  let listPage = gulp.src(`${config.buildDir}/index.html`)
      .pipe(gulp.dest(config.outDir));

  let listApp = gulp.src(`${config.buildDir}/index.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let vendor_js = gulp.src(`${config.buildDir}/auction_bundle.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let archivePage = gulp.src(`${config.buildDir}/archive.html`)
      .pipe(gulp.dest(config.outDir));

  let archiveApp = gulp.src(`${config.buildDir}/archive.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let auctionPage = gulp.src(`${config.buildDir}/tender.html`)
      .pipe(gulp.dest(config.outDir));

//  let auctionApp = gulp.src(`${config.buildDir}/${app_name}`)
//      .pipe(gulp.dest(config.outDir + '/static/'));

  let png = gulp.src("build/*.png")
      .pipe(gulp.dest(config.outDir + '/static/img/'));

  let icons = gulp.src("build/img/*.png")
      .pipe(gulp.dest(config.outDir+ '/static/img/'));

  let fonts = gulp.src("build/fonts/*")
      .pipe(gulp.dest(config.outDir+'/static/fonts/'));

  let fonts2 = gulp.src("build/fonts/*")
      .pipe(gulp.dest(config.outDir+'/fonts/'));


  return merge(css, png, vendor_js, listPage, listApp, auctionPage, archivePage, archiveApp, fonts, fonts2, icons);
});


gulp.task('default', ['clean', 'build']);

gulp.task('clean', function () {
  del.sync([config.buildDir + '*/**', config.outDir + '*/**'], {force: true});
});
