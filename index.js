var rework = require('rework');
var reworkUrl = require('rework-plugin-url');
var through = require('through2');
var path = require('path');
var md5File = require('md5-file');

function partition (tag) {
  var ret = typeof tag === 'string' && tag.match(/^\?@(MD5)(?:&(.*))?$/);
  ret = ret ? {type: 'MD5', fallback: ret[2] || ''} : {type: 'OTHER', fallback: tag};
  return ret;
}

module.exports = function (options) {
  var prepend = options.prepend;
  var replace = options.replace;
  var root = options.root
    ? path.join(__dirname, options.root)
    : __dirname;
  var prependRelative = options.prependRelative;
  var append = partition(options.append);

  function prependUrls (file) {
    return rework(file.contents.toString())
      .use(reworkUrl(function (url) {
        if (url.match(/^(?:data:|http:|https:|ftp:)/)) {
          return url;
        } else {
          var newUrl = url;
          // prepend
          if (prepend && url.charAt(0) === '/') { // absolute path
            newUrl = path.join(prepend, newUrl);
          } else if (prependRelative) {
            newUrl = path.join(prependRelative, newUrl);
          }
          // add tag
          var dir = file.path ? path.dirname(file.path) : __dirname;
          var tag = append.fallback;
          if (append.type === 'MD5') {
            var filePath = url.charAt(0) === '/'
              ? path.join(root, url)
              : path.resolve(dir, url);
            try {
              tag = md5File.sync(filePath);
            } catch (e) {}
          }
          if (tag) {
            if (typeof tag === 'function') {
              newUrl = tag(url);
            } else {
              tag = ('?' + tag).replace(/^\?\?/, '?');
              newUrl = newUrl + tag;
            }
          }
          // replace url
          if (replace) {
            if (typeof replace === 'function') {
              newUrl = replace(url);
            } else {
              newUrl = newUrl.replace(replace[0], replace[1]);
            }
          }

          return newUrl.replace('//', '/');
        }
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
