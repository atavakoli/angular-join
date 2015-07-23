angular.module('angularJoinDemo')

.factory('Formatter', function() {
  var indentRegex = /^ */;
  function toSource(fcn, indent) {
    var fcnSource = fcn.toString();

    // Find the shortest indent after the 1st line (1st line is unindented)
    var shortest = fcnSource
      .split(/\n/)
      .slice(1)
      .reduce(function(prev, line) {
        var thisIndent = indentRegex.exec(line)[0];
        if (!prev || thisIndent.length < prev.length) {
          return thisIndent;
        } else {
          return prev;
        }
      }, null);

    // Replace the shortest indent with the provided indent
    if (shortest) {
      var shortestRegex = RegExp('^' + shortest, 'mg');
      return fcnSource.replace(shortestRegex, indent);
    } else {
      return fcnSource;
    }
  }

  function fcnCall(varName, fcnName, params, indent) {
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

    if (varName) {
      return 'var ' + varName + ' = ' + fcnName + '(\n' + paramsStr + '\n);';
    } else {
      return fcnName + '(\n' + paramsStr + '\n);';
    }
  }

  return {
    fcnCall: fcnCall
  };
});
