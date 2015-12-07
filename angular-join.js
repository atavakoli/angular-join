(function() {
'use strict';

angular.module('angular-join', [])

.factory('Join', function() {

  /***************
   * NORMALIZERS *
   ***************/

  function normalizeHashFcn(hashFcn) {
    if (typeof hashFcn == 'string' || hashFcn instanceof String) {
      if (hashFcn instanceof String) {
        hashFcn = hashFcn.valueOf();
      }
      return function(e) {
        return e[hashFcn];
      }
    } else if (typeof hashFcn == 'object' && Array.isArray(hashFcn)) {
      return function(e) {
        return JSON.stringify(hashFcn.map(function(prop) {
          return e[prop];
        }));
      }
    } else {
      return hashFcn;
    }
  }

  function normalizeComparator(comparator, options) {
    var stringCompare;
    if (options && options.localeCompare) {
      stringCompare = function(s1, s2) {
        return s1.localeCompare(s2);
      }
    } else {
      stringCompare = function(s1, s2) {
        return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
      }
    }

    if (typeof comparator == 'string' || comparator instanceof String) {
      if (comparator instanceof String) {
        comparator = comparator.valueOf();
      }

      return function(e1, e2) {
        if (typeof e1[comparator] == 'string' || e1[comparator] instanceof String) {
          return stringCompare(e1[comparator], e2[comparator]);
        } else if (typeof e1[comparator].diff == 'function') {
          return e1[comparator].diff(e2[comparator]);
        } else {
          return +e1[comparator] - +e2[comparator];
        }
      }
    } else if (typeof comparator == 'object' && Array.isArray(comparator)) {
      return function(e1, e2) {
        var result = 0;
        comparator.some(function(prop) {
          if (typeof e1[prop] == 'string' || e1[prop] instanceof String) {
            result = stringCompare(e1[prop], e2[prop]);
          } else if (typeof e1[prop].diff == 'function') {
            result = e1[prop].diff(e2[prop]);
          } else {
            result = +e1[prop] - +e2[prop];
          }

          return (result !== 0);
        });
        return result;
      }
    } else {
      return comparator;
    }
  }

  function normalizeSelect(callback) {
    if (typeof callback == 'string' || callback instanceof String) {
      return function(e) {
        var result = {};
        result[callback] = e[callback];
        return result;
      }
    } else if (typeof callback == 'object' && callback.isArray()) {
      return function(e) {
        return callback.reduce(function(prev, prop) {
          prev[prop] = e[prop];
          return prev;
        }, {});
      }
    } else {
      return callback;
    }
  }

  /********
   * JOIN *
   ********/

  function mergeJoin(a2, comparator, callback, options) {
    var a1 = this;
    var a3 = [];

    comparator = normalizeComparator(comparator, options);

    if (!options || !options.sorted) {
      a1 = a1.slice().sort(comparator);
      a2 = a2.slice().sort(comparator);
    }

    function getContiguousLength(src, start) {
      if (start < src.length) {
        var i = start + 1;
        while (i < src.length && comparator(src[start], src[i]) === 0) {
          i++;
        }
        return i - start;
      } else {
        return 0;
      }
    }

    function addLeft(start, end) {
      for (var i = start; i < end; ++i) {
        var newElement = callback(a1[i], null);
        if (newElement) {
          a3.push(newElement);
        }
      }
    }

    function addRight(start, end) {
      for (var i = start; i < end; ++i) {
        var newElement = callback(null, a2[i]);
        if (newElement) {
          a3.push(newElement);
        }
      }
    }

    function addCartesianJoin(start1, end1, start2, end2) {
      for (var i1 = start1; i1 < end1; ++i1) {
        for (var i2 = start2; i2 < end2; ++i2) {
          var newElement = callback(a1[i1], a2[i2]);
          if (newElement) {
            a3.push(newElement);
          }
        }
      }
    }

    var i1 = 0, i2 = 0;

    if (a1.length && a2.length) {
      var len1 = getContiguousLength(a1, i1);
      var len2 = getContiguousLength(a2, i2);

      while (i1 < a1.length && i2 < a2.length) {
        var compare = comparator(a1[i1], a2[i2]);
        if (compare === 0) {
          addCartesianJoin(i1, i1 + len1, i2, i2 + len2);
          i1 += len1;
          i2 += len2;
          len1 = getContiguousLength(a1, i1);
          len2 = getContiguousLength(a2, i2);
        } else if (compare < 0) {
          addLeft(i1, i1 + len1);
          i1 += len1;
          len1 = getContiguousLength(a1, i1);
        } else {
          addRight(i2, i2 + len2);
          i2 += len2;
          len2 = getContiguousLength(a2, i2);
        }
      }
    }

    addLeft(i1, a1.length);
    addRight(i2, a2.length);

    return a3;
  }

  function hashJoin(a2, hashFcn, callback) {
    var a1 = this;
    var a3 = [];
    var addCallback;

    hashFcn = normalizeHashFcn(hashFcn);

    var hashed, scanned;
    if (a1.length < a2.length) {
      hashed = a1;
      scanned = a2;
      addCallback = function(h, s) {
        var newElement = callback(h, s);
        if (newElement) {
          a3.push(newElement);
        }
      };
    } else {
      hashed = a2;
      scanned = a1;
      addCallback = function(h, s) {
        var newElement = callback(s, h);
        if (newElement) {
          a3.push(newElement);
        }
      };
    }

    if (hashed.length === 0) {
      scanned.forEach(function(e) {
        addCallback(null, e);
      });
      return a3;
    } else if (scanned.length === 0) {
      hashed.forEach(function(e) {
        addCallback(e, null);
      });
      return a3;
    }

    var hashTable = {};
    var hash, hashBucket;

    for (var i = 0; i < hashed.length; ++i) {
      var hashedEntry = hashed[i];
      hash = hashFcn(hashedEntry, i, hashed);
      hashBucket = hashTable[hash];
      if (hashBucket) {
        hashBucket.push({ used: false, e: hashedEntry });
      } else {
        hashTable[hash] = [{ used: false, e: hashedEntry }];
      }
    }

    for (i = 0; i < scanned.length; i++) {
      var scannedEntry = scanned[i];
      hash = hashFcn(scannedEntry, i, scanned);
      hashBucket = hashTable[hash];
      if (hashBucket) {
        hashBucket.forEach(function(hashedEntry) {
          addCallback(hashedEntry.e, scannedEntry);
          hashedEntry.used = true;
        });
      } else {
        addCallback(null, scannedEntry);
      }
    }

    Object.keys(hashTable).forEach(function(hash) {
      hashTable[hash].forEach(function(hashedEntry) {
        if (!hashedEntry.used) {
          addCallback(hashedEntry.e, null);
        }
      });
    });

    return a3;
  }

  /************
   * GROUP BY *
   ************/

  function sortGroupBy(comparator, callback, options) {
    var a = this;
    var results = [];

    if (a.length === 0) {
      return results;
    }

    comparator = normalizeComparator(comparator, options);

    if (!options || !options.sorted) {
      a = a.slice().sort(comparator);
    }

    var grouped = callback(null, a[0]);

    for (var i = 1; i < a.length; ++i) {
      if (comparator(a[i-1], a[i]) === 0) {
        grouped = callback(grouped, a[i]);
      } else {
        results.push(grouped);
        grouped = callback(null, a[i]);
      }
    }
    results.push(grouped);

    return results;
  }

  function hashGroupBy(hashFcn, callback) {
    var a = this;
    if (a.length === 0) {
      return [];
    }

    hashFcn = normalizeHashFcn(hashFcn);

    var hashTable = {};

    for (var i = 0; i < a.length; ++i) {
      var e = a[i];
      var hash = hashFcn(e, i, a);
      var grouped = hashTable[hash];
      hashTable[hash] = callback(grouped || null, e);
    }

    return Object.keys(hashTable).map(function(hash) {
      return hashTable[hash];
    });
  }

  /********************
   * FLUENT INTERFACE *
   ********************/

  function selectFrom(input, selectCallback) {
    var query = {
      a: input,
      ops: [],
      mergeJoin: function(a2, comparator, callback) {
        this.ops.push([mergeJoin, a2, comparator, callback]);
        return this;
      },
      hashJoin: function(a2, hashFcn, callback) {
        this.ops.push([hashJoin, a2, hashFcn, callback]);
        return this;
      },
      sortGroupBy: function(comparator, callback) {
        this.ops.push([sortGroupBy, comparator, callback]);
        return this;
      },
      hashGroupBy: function(hashFcn, callback) {
        this.ops.push([hashGroupBy, hashFcn, callback]);
        return this;
      },
      map: function(callback) {
        this.ops.push([Array.prototype.map, normalizeSelect(callback)]);
        return this;
      },
      select: function(callback) {
        // just an alias for map
        return this.map(callback);
      },
      filter: function(callback) {
        this.ops.push([Array.prototype.filter, callback]);
        return this;
      },
      where: function(callback) {
        // just an alias for filter
        return this.filter(callback);
      },
      having: function(callback) {
        // just an alias for filter
        return this.filter(callback);
      },
      sort: function(comparator, options) {
        this.ops.push([function sortCopy(comparator) {
          return this.slice().sort(comparator);
        }, normalizeComparator(comparator, options)]);
        return this;
      },
      orderBy: function(comparator) {
        // just an alias for sort
        return this.sort(comparator);
      },
      slice: function(begin, end) {
        this.ops.push([Array.prototype.slice, begin || 0, end]);
        return this;
      },
      limit: function(len, offset) {
        offset = offset || 0;
        return this.slice(offset, len + offset);
      },
      offset: function(offset) {
        // just syntactic sugar for slice with 1 parameter
        return this.slice(offset || 0);
      },
      inspect: function(callback) {
        this.ops.push([function() { callback(this); return this; }]);
        return this;
      },
      execute: function(options) {
        var _self = this;

        function _execute(deferred) {
          var result = _self.a;
          _self.ops.forEach(function(op) {
            result = op[0].apply(result, op.slice(1));
            if (deferred && deferred.notify) {
              deferred.notify(result);
            }
          });
          return result;
        }

        if (!!options && !!options.async) {
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve(_execute(deferred));
          });
          return deferred.promise;
        } else {
          return _execute();
        }
      }
    };

    if (typeof selectCallback == 'function') {
      query = query.select(normalizeSelect(selectCallback));
    }

    return query;
  }

  function queryWrapper(fcnName) {
    // takes the 1st argument and uses it as 'this'
    return function() {
      var args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      var query = selectFrom(arguments[0]);
      return query[fcnName].apply(query, args).execute();
    };
  }

  var service = { selectFrom: selectFrom };

  // Add all the functions in a query (except inspect & execute) to the service
  //  so that they can be called statically
  angular.forEach(selectFrom([]), function(prop, key) {
    if (['inspect', 'execute'].indexOf(key) < 0 && typeof prop == 'function') {
      service[key] = queryWrapper(key);
    }
  });

  return service;
});

}());
