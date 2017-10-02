const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      del           = require('del'),
      path          = require('path'),
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
      pack          = require('gulp-tar'),
      gzip          = require('gulp-gzip'),
      sequence      = require('run-sequence'),
      server        = require('karma').Server;

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


gulp.task('bower-main', () => {
    return allJs = gulp.src('./bower.json')
	.pipe(vendorFiles({base: "src/lib"}))
	.pipe(gulpFilter(['**/*.js']))
	.on("error", interceptErrors)
	.pipe(gulp.dest(tmpDir));
});


gulp.task('vendor', ['bower-main'], () => {
    let dest = path.join(config.buildDir, staticRoot); 
    return gulp.src([
	    `${tmpDir}/**/**/*.js`,
	    './src/lib/moment/locale/uk.js',
	    './src/lib/moment/locale/ru.js',
	    './src/lib/puchdb/**/*.js'])
	.pipe(concat('vendor.js'))
        .pipe(devel ? util.noop() : uglify())
	.pipe(gulp.dest(dest))
	.on("error", interceptErrors);
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
		}}))
	    .on('error', interceptErrors)
	    .pipe(rename(page.name +'.html'))
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
        .pipe(devel ? util.noop() : uglify({ mangle: false}))
	.on("error", interceptErrors)
	.pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
});


gulp.task('archiveApp', () => {
    // TODO: uglify
    return gulp.src(['./src/app/archive.js',
		     './src/app/config.js',
		     './src/app/controllers/ArchiveCtl.js'])
	.pipe(concat('archive.js'))
        .pipe(devel ? util.noop() : uglify({ mangle: false}))
	.on("error", interceptErrors)
	.pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
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
        .pipe(devel ? util.noop() : uglify({ mangle: false}))
	.on("error", interceptErrors)
	.pipe(gulp.dest(path.join(config.buildDir, staticRoot)));
});

gulp.task('bundle', buildDeps);

gulp.task('copyToDest', () => {
   return gulp.src([`${config.buildDir}/**/*`])
	.on("error", interceptErrors)
	.pipe(gulp.dest(config.outDir));
});

gulp.task('build', (done) => {
   return sequence('vendor', 'bundle', 'copyToDest', () => {
     done();
   });
});


gulp.task('pack', () => {
   return gulp.src([`${config.buildDir}/**/*`])
   	.pipe(pack(`${packageName}.tar`))
	.pipe(gzip())
	.pipe(gulp.dest('dist'))
	.on("error", interceptErrors)
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
    del.sync([config.buildDir + '*/**', config.outDir + '*/**'], {force: true});
});

gulp.task('test', function(done) {
    new server({
	configFile:__dirname + '/karma.conf.js',
	singleRun: true
    }, done).start();
});
