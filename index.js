var rework = require('rework');
var reworkUrl = require('rework-plugin-url');
var through = require('through2');
var urlTwister = require('url-twister');

module.exports = function (options) {
  function prependUrls (file) {
    return rework(file.contents.toString(), {source: file.path})
      .use(reworkUrl(function (url) {
        return urlTwister(url, file.path, options);
      }))
      .toString();
  }

  return through.obj(function (file, enc, cb) {
    var css = prependUrls(file);
    file.contents = new Buffer(css);

    this.push(file);
    cb();
  });
};
