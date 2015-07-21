(function() {
'use strict';

angular.module('angular-join', [])

.factory('Join', function() {

  /********
   * JOIN *
   ********/

  function mergeJoin(a1, a2, comparator, callback, options) {
    var a3 = [];
  
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

    addLeft(i1, a1.length);
    addRight(i2, a2.length);

    return a3;
  }
  
  function hashJoin(a1, a2, hashFcn, callback) {
    var a3 = [];
    var addCallback;
    
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

  function sortGroupBy(a, comparator, callback, options) {
    var results = [];

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

  function hashGroupBy(a, hashFcn, callback) {
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

  return {
    mergeJoin: mergeJoin,
    hashJoin: hashJoin,
    sortGroupBy: sortGroupBy,
    hashGroupBy: hashGroupBy
  };
});

}());
