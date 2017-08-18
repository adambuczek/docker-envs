// generated on 2016-07-06 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const inline = require('inline-source');
const mainNpmFiles = require('gulp-main-npm-files');

const $ = gulpLoadPlugins({
  rename: {
    'gulp-version-number': 'version',
    'gulp-inline-source': 'inline'
  }
});

const reload = browserSync.reload;

const versionOptions = {
  'value' : '%TS%',
  'append' : {
    'key' : 'v',
    'to' : ['js', 'css']
  },
  'output' : {
      'file' : 'version.json'
  }
};

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['Chrome 18']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('vendor-scripts', () => {
  gulp.src(mainNpmFiles())
  .pipe(gulp.dest('.tmp/scripts'))
  .pipe(reload({stream: true}));
});

gulp.task('scripts', ['vendor-scripts'], () => {
  gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('compile-hbs', ['styles', 'scripts'], function () {
  return gulp
      .src('./app/partials/pages/*.html')
      // Load an associated JSON file per post.
      .pipe($.data(function(file) {
          return require(file.path.replace('.html', '.json').replace('pages', 'data'));
      }))
      .pipe($.hb({
          partials: './app/partials/blocks/**/*.hbs',
          helpers: './app/partials/helpers/**/*.js',
          data: './app/partials/data/**/*.json'
      }))
      .pipe(gulp.dest('./app'));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['compile-hbs'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    // .pipe($.if('*.css', $.uncss({
    //     html: ['app/*.html']
    //   })))
    // .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe($.if('*.html', $.replace(/\<((?:script|link)[^\>]+(?:src|href)=(?:"|')[\w\/\.]*?(?:"|')[^\>]*)\>/g, '<$1 inline>'))) // add inline attr to styles and scripts
    .pipe(gulp.dest('dist'));
});

gulp.task('version', () => {
  return gulp.src('dist/*.html')
    .pipe($.version(versionOptions))
    .pipe(gulp.dest('dist'));
});

gulp.task('inline', ['html'], () => {

  var options = {
    attribute: 'inline',
    ignore: ['img']
  };

  return gulp.src('dist/*.html')
    .pipe($.inline(options))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts'], () => {
  browserSync({
    notify: false,
    port: 3000,
    open: false,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  gulp.watch('app/partials/**/*.{hbs,html}', {interval: 1000, mode: 'poll'}, ['compile-hbs']).on('change', reload);
  gulp.watch('app/styles/**/*.scss', {interval: 1000, mode: 'poll'}, ['styles']);
  gulp.watch('app/scripts/**/*.js', {interval: 1000, mode: 'poll'}, ['scripts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    open: false,
    port: 3000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 3000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

});

gulp.task('build', ['lint', 'inline', 'images', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
