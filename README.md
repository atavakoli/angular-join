angular-join
============

An AngularJS service providing RDBMS `JOIN` & `GROUP BY` functionality for
JavaScript arrays.

[Demo/Documentation][docs]

Installation
------------

If you're using [Bower](http://bower.io/):

```
bower install angular-join --save
```

Angular JOIN does not have any dependencies beside Angular itself.

Include the `angular-join.js` script in your HTML:

```html
<script src="path/to/angular-join.js"></script>
```

Add `'angular-join'` as a dependency in your Angular app:

```javascript
angular.module('myApp', ['angular-join']);
```

Inject `Join` in your Angular modules as needed. For example:

```javascript
angular.module('myApp')
.controller('MyCtrl', ['$scope', 'Join', function($scope, Join) {
  // Use the Join service
}]);
```

Usage
-----

This module provides the `Join` service, which exposes functions to perform
SQL-JOIN and SQL-GROUP-BY style operations on JavaScript arrays.

### hashJoin

This function implements a version of the [Hash Join][] algorithm. It is
appropriate when the source arrays are small and unsorted, and if the resulting
array does not need to be returned in any particular order. For large sorted
arrays, `mergeJoin` is much more efficient.

```javascript
Join.hashJoin(left, right, hashFcn, callback)
```

**Arguments**

- `left` (array)
  - The lefthand array in the join operation.
- `right` (array)
  - The righthand array in the join operation.
- `hashFcn` (function)
  - Function executed as `hashFcn(e)`, where `e` is an element of `left` or
    `right`, and returning a number or string. Values of `e` for which
    `hashFcn(e)` returns the same value are considered equal and will be joined
    as specified by the `callback` function.

    Returning the same value for all inputs can be used to implement
    cross/cartesian joins (though a nested pair of for-loops may be more
    efficient).
- `callback` (function)
  - Function executed as `callback(e1, e2)`, where `e1` and `e2` are elements
    of `left` and `right`, respectively (or null; see below). If the returned
    value is not falsy, it is added to the array returned by `hashJoin`.

    For each pair of `e1` and `e2` where `hashFcn(e1) == hashFcn(e2)`,
    `callback(e1, e2)` is called once per pair. Returning a value only when
    neither `e1` or `e2` are null can be used to implement inner joins.

    For each `e1` where there is no matching `e2`, `callback(e1, null)` is
    called once. Correspondingly, for each `e2` where there is no matching `e1`,
    `callback(null, e2)` is called once. Returning a value in these cases can
    be used to implement left/right/full outer joins.

    Returning a value when _only_ one of `e1` or `e2` is non-null can be used
    to implement left/right anti-joins.

**Returns**

- (array)
  - The join of `left` and `right`: for each call to
    `callback(left[m], right[n])` returning a non-falsey value, that element is
    added to the returned array.


### mergeJoin

This function implements a version of the [Sort-Merge Join][] algorithm. It is
much more efficient than `hashJoin` when the source arrays already sorted
(see `options.sorted` below).

```javascript
Join.mergeJoin(left, right, comparator, callback[, options])
```

**Arguments**

- `left` (array)
  - The lefthand array in the join operation.
- `right` (array)
  - The righthand array in the join operation.
- `comparator` (function)
  - Function executed as `comparator(e1, e2)`, where `e1` and `e2` are elements
    of `left` and `right`, respectively, and has the exact same spec as
    [compareFunction in Array.prototype.sort()][Array.sort]. If
    `comparator(e1, e2) === 0`, then `e1` and `e2` are considered equal and
    will be joined as specified by the `callback` function.

    Returning `0` for all inputs can be used to implement cross/cartesian joins
    (though a nested pair of for-loops may be more efficient).
- `callback` (function)
  - Function executed as `callback(e1, e2)`, where `e1` and `e2` are elements
    of `left` and `right`, respectively (or null; see below). If the returned
    value is not falsy, it is added to the array returned by `mergeJoin`.

    For each pair of `e1` and `e2` where `comparator(e1, e2) === 0`,
    `callback(e1, e2)` is called once per pair. Returning a value only when
    neither `e1` or `e2` are null can be used to implement inner joins.

    For each `e1` where there is no matching `e2`, `callback(e1, null)` is
    called once. Correspondingly, for each `e2` where there is no matching `e1`,
    `callback(null, e2)` is called once. Returning a value in these cases can
    be used to implement left/right/full outer joins.

    Returning a value when _only_ one of `e1` or `e2` is non-null can be used
    to implement left/right anti-joins.
- `options` (object)
  - _Optional_
  - Object containing the following properties:
    - `sorted` (boolean) : If `true`, this signifies that both input arrays are
      already sorted according to `comparator`. This provides a significant
      performance boost. Default is `false`.

**Returns**

- (array)
  - The join of `left` and `right`: for each call to
    `callback(left[m], right[n])` returning a non-falsey value, that element is
    added to the returned array.


### hashGroupBy

This function implements hash-based GROUP BY functionality on arrays; it is
similar to [Array.prototype.reduce()][Array.reduce], except that the returned
result is always an array and the `previousValue` is the last value returned
for the group that the `currentValue` belongs to, according to `hashFcn`.

```javascript
Join.hashGroupBy(input, hashFcn, callback)
```

**Arguments**

- `input` (array)
  - The input array in the group-by operation.
- `hashFcn` (function)
  - Function executed as `hashFcn(e)`, where `e` is an element of `input`, and
    returning a number or string. Values of `e` for which `hashFcn(e)` returns
    the same value are considered to be in the same group with respect to calls
    to the `callback` function.

    Returning the same value for all inputs will result in a return value
    equivalent to `[input.reduce(callback, null)]`.
- `callback` (function)
  - Function executed as `callback(previousValue, e)`, where `e` is an element
    of `input` and `previousValue` is the last value returned by `callback` for
    the group to which `e` belongs. If `e` is the first element in its group,
    then `previousValue === null`. The last value returned for each group is
    included in the array returned by `hashGroupBy`.

    This function must always return a value.

    Always returning `e`, or always returning `previousValue` if it is not null,
    can be used to implement DISTINCT functionality (i.e. only one element from
    `input` per group is included in the final returned array).

**Returns**

- (array)
  - An array having one element per group (as defined by `hashFcn`), where that
    element is the last value returned by `callback` for that group.

    [Array.prototype.filter()][Array.filter] may be called on the returned array
    to implement HAVING functionality.


### sortGroupBy

This function implements sort-based GROUP BY functionality on arrays; it is
similar to [Array.prototype.reduce()][Array.reduce], except that the returned
result is always an array and the `previousValue` is the last value returned
for the group that the `currentValue` belongs to, according to `comparator`.
It is slightly more efficient than `hashGroupBy` if the input array is already
sorted (see `options` below).

```javascript
Join.sortGroupBy(input, comparator, callback, options)
```

**Arguments**

- `input` (array)
  - The input array in the group-by operation.
- `comparator` (function)
  - Function executed as `comparator(e1, e2)`, where `e1` and `e2` are elements
    of `input`, and has the exact same spec as
    [compareFunction in Array.prototype.sort()][Array.sort]. If
    `comparator(e1, e2) === 0`, then `e1` and `e2` are considered to be part of
    the same group with respect to calls to the `callback` function.

    Returning `0` for all inputs will result in a return value equivalent to
    `[input.reduce(callback, null)]`.
- `callback` (function)
  - Function executed as `callback(previousValue, e)`, where `e` is an element
    of `input` and `previousValue` is the last value returned by `callback` for
    the group to which `e` belongs. If `e` is the first element in its group,
    then `previousValue === null`. The last value returned for each group is
    included in the array returned by `sortGroupBy`.

    This function must always return a value.

    Always returning `e`, or always returning `previousValue` if it is not null,
    can be used to implement DISTINCT functionality (i.e. only one element from
    `input` per group is included in the final returned array).
- `options` (object)
  - _Optional_
  - Object containing the following properties:
    - `sorted` (boolean) : If `true`, this signifies that `input` array is
      already sorted with respect to `comparator`. This provides a slight
      performance boost. Default is `false`.

**Returns**

- (array)
  - An array having one element per group (as defined by `comparator`), where
    that element is the last value returned by `callback` for that group.

    [Array.prototype.filter()][Array.filter] may be called on the returned array
    to implement HAVING functionality.


[docs]: http://atavakoli.github.io/angular-join
[Hash Join]: http://en.wikipedia.org/wiki/Hash_join
[Sort-Merge Join]: http://en.wikipedia.org/wiki/Sort-merge_join
[Array.sort]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[Array.reduce]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
[Array.filter]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
