gulp-ex-css-url-adjuster
=====================
This package is forked from [gulp-css-url-adjuster](https://github.com/trentearl/gulp-css-url-adjuster)

---
What does this fork change
- add support for append file md5
- prepend differently for relative path and absolute path

For example:

```css
/* test.css */
.cool-background {
  background-image: url('coolImage.jpg');
  background-image: url('/coolImage.jpg');
  background-image: url('data:image/jpg;base64,/9j/ke4uvs');
  background-image: url('http://img.cdn.com/coolImage.jpg');
}
```

```js
/* gulpfile.js */
const gulp = require('gulp');
const urlAdjuster = require('gulp-ex-css-url-adjuster');

gulp.task('fixCssUrl', function () {
  return gulp.src('test.css')
    .pipe(urlAdjuster({
      prepend: '/absolute/only',// this will only affect absolute url
      prependRelative: 'relative/only', // this will only affect the relative url
      append: '?@MD5&fallback',// if the file can be found, then calculate the md5 as the appending tag; if the file cannot be found, then use the `fallback` as the appending tag
      root: 'test'// for absolute path use `<app root path> + root` to find the file, when calculate the md5
    }))
    .pipe(gulp.dest('dist'));
});

```
```css
/* result dist/test.css */

.cool-background {
  background-image: url('relative/only/coolImage.jpg?<md5 code of this image file or the fallback string>');
  background-image: url('/absolute/only/coolImage.jpg?<md5 code of this image file or the fallback string>');
  background-image: url('data:image/jpg;base64,/9j/ke4uvs');
  background-image: url('http://img.cdn.com/coolImage.jpg');
}
```
---
**Below is the original READEME file**

This package allows gulp to change css urls

css file:
```css
.cool-background {
    background-image: url('coolImage.jpg');
}
```
```js
var urlAdjuster = require('gulp-css-url-adjuster');

gulp.src('style.css').
  pipe(urlAdjuster({
    prepend: '/image_directory/',
    append: '?version=1',
  }))
  .pipe(gulp.dest('modifiedStyle.css'));
```
```css
.cool-background {
    background-image: url('/image_directory/coolImage.jpg?version=1');
}
```

only adjust relative paths:
```css
.cool-background {
    background-image: url('coolImage.jpg');
}

.neato-background {
    background-image: url('/images/neatoImage.jpg');
}
```
```js
gulp.src('style.css').
  pipe(urlAdjuster({
    prependRelative: '/image_directory/',
  }))
  .pipe(gulp.dest('modifiedStyle.css'));
```
```css
.cool-background {
    background-image: url('/image_directory/coolImage.jpg');
}

.neato-background {
    background-image: url('/images/neatoImage.jpg');
}
```
or replace path to another:
```css
.cool-background {
    background-image: url('/old/path/coolImage.jpg');
}

.neato-background {
    background-image: url('/old/path/images/neatoImage.jpg');
}
```
```js
gulp.src('style.css').
  pipe(urlAdjuster({
    replace:  ['/old/path','/brand/new'],
  }))
  .pipe(gulp.dest('modifiedStyle.css'));
```
```css
.cool-background {
    background-image: url('/brand/new/coolImage.jpg');
}

.neato-background {
    background-image: url('/brand/new/images/neatoImage.jpg');
}
```
