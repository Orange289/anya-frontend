'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	fileinclude = require('gulp-file-include'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	cssimport = require('gulp-cssimport'),
	rename = require('gulp-rename'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-csso'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require('browser-sync'),
	rimraf = require('rimraf'),
	zip = require('gulp-zip'),
	reload = browserSync.reload;

var paths = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		js: 'src/scripts/**/*.js',
		sass: 'src/styles/**/*.scss',
		sassEntry: 'src/styles/base.scss',
		html: 'src/templates/*.html',
		img: 'src/assets/img/*.{png,svg,jpg,gif,ico,webp}',
		fonts: 'src/assets/fonts/**/*.{woff,woff2}'
	},
	watch: {
		html: 'src/templates/',
		js: 'src/scripts/**/*.js',
		sass: 'src/styles/**/*.scss',
		sassEntry: 'src/styles/base.scss',
		html: 'src/templates/',
		img: 'src/assets/img/*.{png,svg,jpg,gif,ico,webp}',
		fonts: 'src/assets/fonts/**/*.{woff,woff2}'
	},
	archive: './archive',
	clean: './build/*/*'
};

var config = {
    server: {
        baseDir: './build'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: 'Orange'
};

gulp.task('html:build', function () {
	gulp.src(paths.src.html)
		.pipe(
			fileinclude({
				prefix: '@@',
				basepath: '@file'
			})
		)
		.pipe(gulp.dest(paths.build.html))
		.pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(paths.src.js)
				.pipe(plumber())
		.pipe(rigger())
        .pipe(gulp.dest(paths.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(paths.src.sassEntry)
				.pipe(plumber())
				.pipe(sassGlob())
        .pipe(sass())
				.pipe(cssimport({extensions: ['css']}))
		.pipe(prefixer())
				.pipe(cssmin())
				.pipe(rename('style.css'))
        .pipe(gulp.dest(paths.build.css))
        .pipe(reload({stream: true}));
});

// images

gulp.task('image:build', function() {
	gulp.src(paths.src.img)
			.pipe(plumber())
			.pipe(gulp.dest(paths.build.img))
			.pipe(imagemin({
									progressive: true,
									svgoPlugins: [{removeViewBox: false}],
									use: [pngquant()],
									interlaced: true
							}))
			.pipe(gulp.dest(paths.build.img))

})

gulp.task('fonts:build', function() {
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([paths.watch.html], function() {
        gulp.start('html:build');
    });
    watch([paths.watch.sass], function() {
        gulp.start('style:build');
    });
	watch([paths.watch.sassEntry], function() {
			gulp.start('style:build');
	});
    watch([paths.watch.js], function() {
        gulp.start('js:build');
    });
    watch([paths.watch.img], function() {
        gulp.start('image:build');
    });
    watch([paths.watch.fonts], function() {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(paths.clean, cb);
});

gulp.task('zip', function () {
	gulp.src('./build/**')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest(paths.archive))
})


gulp.task('default', ['clean', 'build', 'webserver', 'watch']);
