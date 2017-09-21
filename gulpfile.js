<<<<<<< HEAD
const gulp = require('gulp'),
  notify = require('gulp-notify'),
  del = require('del'),
  concat = require('gulp-concat'),
  util = require('gulp-util'),
  minify = require('gulp-minify'),
  gulpFilter = require('gulp-filter'),
  source = require('vinyl-source-stream'),
  cleanCSS = require('gulp-clean-css'),
  fileinclude = require('gulp-file-include'),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename"),
  fs = require("fs"),
  yarn = require("gulp-yarn"),
  merge = require('merge-stream'),
  server = require('karma').Server;

function interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
=======
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
      eslint        = require('gulp-eslint'),
      merge         = require('merge-stream'),
      server        = require('karma').Server;

function  interceptErrors(error) {
    let args = Array.prototype.slice.call(arguments);
    notify.onError({
	title: 'Compile Error',
	message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');
>>>>>>> e3132d610f90f656dee00cfd98a7619f32b8131d
}


const config = JSON.parse(fs.readFileSync('./config.json'));
const db_name = config.db_name || 'database';
const app_name = config.app_name || 'acution.js';
const devel = ('devel' in config) ? config.devel : true;
const main_css = config.main_css || 'bundle.css';
const name = config.name || 'tender';


gulp.task('fonts', () => {
  return gulp.src(config.fonts)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir + '/fonts/'));
});


gulp.task('png-images', () => {
  return gulp.src(config.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir + '/img/'));
});


gulp.task('icons', () => {
  return gulp.src(config.img.icons)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir + '/img/'));
});


gulp.task('yarn', () => {
  return gulp.src(['./package.json'])
    .pipe(yarn())
});


gulp.task('all-js', ['yarn'], () => {
  return gulp.src(config.packages)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('css', () => {
  return gulp.src(config.styles)
    .pipe(concat(main_css))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('htmlPages', () => {
  return merge(config.html.map((page) => {
    return gulp.src('./templates/base.html')
      .pipe(fileinclude({
        prefix: '@@',
        indent: true,
        context: {
          title: page.title,
          name: page.name,
          scripts: page.scripts,
          styles: page.styles,
          controller: page.controller,
          db_name: db_name,
          auctions_server: config.auctions_server
        }
      }))
      .on('error', interceptErrors)
      .pipe(rename(page.name + '.html'))
      .pipe(gulp.dest(config.buildDir));

  }));
});



gulp.task('listingApp', () => {
  // TODO: uglify
  return gulp.src(['./src/app/index.js',
		     './src/app/config.js',
		     './src/app/controllers/ListingCtrl.js'
		    ])
    .pipe(concat('index.js'))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('archiveApp', () => {
  // TODO: uglify
  return gulp.src(['./src/app/archive.js',
		     './src/app/config.js',
		     './src/app/controllers/ArchiveCtl.js'])
    .pipe(concat('archive.js'))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('auctionApp', () => {
  return gulp.src(['./src/app/auction.js',
		     './src/app/filters/*.js',
		     './src/app/translations.js',
		     './src/app/config.js',
		     './src/app/factories/*.js',
		     './src/app/controllers/AuctionCtl.js',
		     './src/app/controllers/OffCanvasCtl.js',
		     './src/app/directives/*.js'])
    .pipe(concat(app_name))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('build', ['all-js', 'css', 'png-images', 'icons', 'htmlPages', 'listingApp', 'archiveApp', 'auctionApp', 'fonts'], () => {

  let css = gulp.src(`${config.buildDir}/${main_css}`)
    .pipe(gulp.dest(config.outDir + '/static/css/'));

  let listPage = gulp.src(`${config.buildDir}/index.html`)
    .pipe(gulp.dest(config.outDir));

  let listApp = gulp.src(`${config.buildDir}/index.js`)
    .pipe(gulp.dest(config.outDir + '/static/'));

  let vendor_js = gulp.src(`${config.buildDir}/vendor.js`)
    .pipe(gulp.dest(config.outDir + '/static/'));

  let archivePage = gulp.src(`${config.buildDir}/archive.html`)
    .pipe(gulp.dest(config.outDir));

  let archiveApp = gulp.src(`${config.buildDir}/archive.js`)
    .pipe(gulp.dest(config.outDir + '/static/'));

  let auctionPage = gulp.src(`${config.buildDir}/${name}.html`)
    .pipe(gulp.dest(config.outDir));

  let auctionApp = gulp.src(`${config.buildDir}/${app_name}`)
    .pipe(gulp.dest(config.outDir + '/static/'));

  let images = gulp.src("build/img/*.png")
    .pipe(gulp.dest(config.outDir + '/static/img/'));

  let fonts = gulp.src("build/fonts/*")
    .pipe(gulp.dest(config.outDir + '/static/fonts/'));

  return merge(css, images, fonts, vendor_js, listPage, listApp, auctionPage, auctionApp, archivePage, archiveApp, fonts);
});

gulp.task('lint', () => {
  return gulp.src(['./src/app/auction.js',
       './src/app/filters/*.js',
       './src/app/translations.js',
       './src/app/config.js',
       './src/app/factories/*.js',
       './src/app/controllers/AuctionCtl.js',
       './src/app/controllers/OffCanvasCtl.js',
       './src/app/directives/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['build']);

gulp.task('clean', function () {
  del.sync([config.buildDir + '*/**', config.outDir + '*/**'], {
    force: true
  });
});

gulp.task('test', function (done) {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
