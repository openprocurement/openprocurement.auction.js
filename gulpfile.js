const gulp = require('gulp'),
  notify = require('gulp-notify'),
  del = require('del'),
  path = require('path'),
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
  merge = require('merge-stream'),
  eslint = require('gulp-eslint'),
  pack = require('gulp-tar'),
  gzip = require('gulp-gzip'),
  sequence = require('run-sequence'),
  server = require('karma').Server;


function interceptErrors(error) {
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
const name = config.name || 'tender';
const staticRoot = 'static'
const fontDir = `${staticRoot}/fonts/`;
const imgDir = `${staticRoot}/img/`;
const cssDir = `${staticRoot}/css/`;
const packageName = 'openprocurement.auction.js';
const tmpDir = '/tmp/insider';
const buildDeps = ['css', 'png-images', 'icons', 'htmlPages', 'auctionApp', 'fonts', 'archiveApp', 'listingApp'];


gulp.task('fonts', () => {
  let dest = path.join(config.buildDir, fontDir);
  return gulp.src(config.fonts)
    .on('error', interceptErrors)
    .pipe(gulp.dest(dest));
});


gulp.task('png-images', () => {
  let dest = path.join(config.buildDir, imgDir);
  return gulp.src(config.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(dest));
});


gulp.task('icons', () => {
  let dest = path.join(config.buildDir, imgDir);
  return gulp.src(config.img.icons)
    .on('error', interceptErrors)
    .pipe(gulp.dest(dest));
});


gulp.task('all-js', () => {
  let dest = path.join(config.buildDir, staticRoot);
  console.log(dest)
  return gulp.src(config.packages)
    .pipe(concat('vendor.js'))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(dest))
    .on('error', util.log);
});


gulp.task('css', () => {
  let dest = path.join(config.buildDir, cssDir);
  return gulp.src(config.styles)
    .pipe(concat(main_css))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(dest));
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
  return gulp.src(config.listingApp)
    .pipe(concat('index.js'))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
});


gulp.task('archiveApp', () => {
  return gulp.src(config.archiveApp)
    .pipe(concat('archive.js'))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
});


gulp.task('auctionApp', () => {
  return gulp.src(config.auctionApp)
    .pipe(concat(app_name))
    .pipe(devel ? util.noop() : uglify({
      mangle: false
    }))
    .on("error", interceptErrors)
    .pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
});


gulp.task('pack', () => {
  return gulp.src([`${config.buildDir}/**/*`])
    .pipe(pack(`${packageName}.tar`))
    .pipe(gzip())
    .pipe(gulp.dest('dist'))
    .on("error", interceptErrors)
});


gulp.task('lint', () => {
  return gulp.src(config.appUtils)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('clean', function () {
  del.sync([config.buildDir + '*/**', config.outDir + '*/**'], {
    force: true
  });
});


gulp.task('bundle', buildDeps);


gulp.task('copyToDest', () => {
  return gulp.src([`${config.buildDir}/**/*`])
    .on("error", interceptErrors)
    .pipe(gulp.dest(config.outDir));
});


gulp.task('build', (done) => {
  return sequence('all-js', 'bundle', 'copyToDest', () => {
    done();
  });
});


gulp.task('default', ['build']);


gulp.task('test', function (done) {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
