angular.module('angularJoinDemo')

.factory('Formatter', function() {
  var indentRegex = /^ +/;

  function toSource(fcn, indent, bodyOnly) {
    var fcnSource = fcn.toString();

    var lines = fcnSource.split(/\n/);
    if (bodyOnly) {
      lines = lines.slice(1, -1);
    }

    // Find the shortest indent after the 1st line (1st line is unindented)
    var shortest = lines
      .reduce(function(prev, line) {
        var thisIndent = indentRegex.exec(line);
        if (thisIndent && (!prev || thisIndent[0].length < prev.length)) {
          return thisIndent[0];
        } else {
          return prev;
        }
      }, null);

    // Replace the shortest indent with the provided indent
    if (shortest) {
      var shortestRegex = RegExp('^' + shortest);
      return lines
        .map(function(line) { return line.replace(shortestRegex, indent); })
        .join('\n');
    } else {
      return fcnSource;
    }
  }

  var startTagRegex = /^ *\/\/START.*$/;
  var endTagRegex = /^ *\/\/END.*$/;
  var excludeTagRegex = /^ *\/\/EXCLUDE:(.*)$/;
  var excludeLineTagRegex = /^.*\/\/EXCLUDE *$/;

  function toFilteredSource(fcn, indent, bodyOnly) {
    if (indent === undefined) {
      indent = '';
    }

    var started = false;
    var excludes = [excludeLineTagRegex];
    return toSource(fcn, indent, bodyOnly).split('\n').filter(function(line) {
      if (!started && startTagRegex.test(line)) {
        started = true;
        return false;
      } else if (started && endTagRegex.test(line)) {
        started = false;
        return false;
      } else if (excludeTagRegex.test(line)) {
        excludes.push(RegExp(excludeTagRegex.exec(line)[1]));
        return false;
      } else if (started) {
        return !excludes.some(function(filter) {
          return filter.test(line);
        });
      } else {
        return false;
      }
    }).join('\n');
  }

  function fcnCall(firstLine, params, indent) {
    if (indent === undefined) {
      indent = '  ';
    }

    paramsStr = params.map(function(param) {
      switch (typeof param) {
      case 'string':
        return indent + param;
      case 'function':
        return indent + toSource(param, indent);
      }
    }).join(',\n');

    return (firstLine ? firstLine + '\n' : '') + paramsStr + '\n);';
  }

  return {
    toSource: toSource,
    toFilteredSource: toFilteredSource,
    fcnCall: fcnCall
  };
});
