(function() {
'use strict';

angular.module('angular-join', [])

.factory('Join', function() {
  function mergeJoin(a1, a2, comparator, callback, options) {
    var i1 = 0, i2 = 0;
    var a3 = [];
  
    if (options && options.sort) {
      a1.sort(comparator);
      a2.sort(comparator);
    }
    
    while (i1 < a1.length && i2 < a2.length) {
      var compare = comparator(a1[i1], a2[i2]);
      var newElement;
      if (compare === 0) {
        newElement = callback(a1[i1++], a2[i2++]);
      } else if (compare < 0) {
        newElement = callback(a1[i1++], null);
      } else {
        newElement = callback(null, a2[i2++]);
      }
      if (newElement) {
        a3.push(newElement);
      }
    }
    while (i1 < a1.length) {
      a3.push(callback(a1[i1++], null));
    }
    while (i2 < a2.length) {
      a3.push(callback(null, a2[i2++]));
    }
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
        a3.push(callback(h, s));
      };
    } else {
      hashed = a2;
      scanned = a1;
      addCallback = function(h, s) {
        a3.push(callback(s, h));
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

  return {
    mergeJoin: mergeJoin,
    hashJoin: hashJoin
  };
});

}());
