angular-join
============

[![Build Status][travis-img]][travis]
[![Bower][bower-img]][bower]
[![License][license-img]](LICENSE)

An AngularJS service providing RDBMS functionality for JavaScript arrays.

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

Usage
-----

This module provides the `Join` service, which exposes functions to create
SQL-like queries on JavaScript arrays.

Inject `Join` in your Angular modules as needed. For example:

```javascript
angular.module('myApp')
.controller('MyCtrl', ['$scope', 'Join', function($scope, Join) {
  // Use the Join service
}]);
```

The `Join` service is mainly used to create new *query* objects via
`Join.selectFrom(...)`, but all functions below can also be called statically.


The Query Object
----------------

The *query* object represents an SQL-like query constructed using the API
described below. A query is constructed with a starting array and using
method-chaining to queue operations that will transform that array and/or join
it to other arrays.  Each call will perform the requested operation on the
results of the previous operation; this allows a query to be incrementally
constructed using a [fluent interface][].

New queries are constructed using the `Join.selectFrom` function, which takes
an array as the starting data on which to perform subsequent operations.

**Neither the starting array nor any other input arrays are ever modified;**
**all operations create a new array to be returned or passed in as the input**
**of the next operation.**

None of the operations in the query are performed until the `.execute()`
function is called, which returns the array resulting from sequentially running
all the operations queued on the query, which allows them to be constructed in
one place and executed in another. If called with the `{async: true}` option,
a [promise object][] is returned instead, which is resolved with the final
array and notified with the intermediate results of each operation in the query.


### selectFrom

```sql
SELECT ... FROM input ...
```

Returns a new query object that uses `input` as its starting array.

**Note: `.selectFrom()` is a function of the `Join` service, and not of a**
**query object.**

This is usually the first in a chain of function calls to create a more
complex query. If the optional `callback` is included, then subsequent
operations are applied to a new array whose elements are the return values of
`callback` applied to each element of `input`. Providing the callback works
identically to calling `Join.selectFrom(input).select(callback)` instead.


#### Syntax

```javascript
Join
  .selectFrom(input[, callback])
```

#### Arguments

- `input` (array)
  - The input array to start the query.
- `callback` (function/string/array)
  - *Optional*
  - Function executed as `callback(e)`, where `e` is an element of `input`.
    This is used to transform the `input` elements (e.g. by selecting only a
    subset of their properties) before other operations are chained to the
    query, and works identically to [Array.prototype.map()][].
  - If a string is passed in, then only that property of the elements of `input`
    is included in the resulting array.
  - If an array of property names is passed in, then only those properties of
    the elements of `input` are included in the resulting array.
  - Unlike the SQL SELECT command, which specifies the fields to return at the
    end of a query, the `callback` only specifies the array elements to provide
    to the next operation, meaning if you want SQL-like behaviour, call
    `.select` as the last operation in the query.
  - `Join.selectFrom(input, callback)` is equivalent to
    `Join.selectFrom(input).select(callback)`.

#### Returns

- *query*
  - A query object with `input` (optionally transformed by `callback`) as the
    starting array.

---

### execute

```sql
SELECT ...
  ...
  ; /* THIS PART */
```

Runs the query and returns the resulting array, or a [promise object][]
that resolves to the resulting array (see `options` below).

This function may be called more than once on the same query, but in
non-asynchronous mode (which is the default), the query operations are
re-executed each time it is called; therefore, it is more efficient in these
cases to call it once and save the result.


#### Syntax

```javascript
query
  .execute([options])
```

#### Arguments

- `options` (object)
  - *Optional*
  - Object containing the following properties:
    - `async` (boolean): If true, then instead of returning the resulting
      array, execute the query asynchronously and return a [promise object][]
      that resolves to the resulting array. The promise's notify callback will
      be called on each intermediate array returned by each operation in the
      query, which may be used for debugging. Default is false.

#### Returns

- array/promise
  - If the `{async: true}` option was not used, the array resulting from
    executing the query is returned. Otherwise, a [promise object][] is
    returned that resolves to the resulting array, which also gets notified
    with the intermediate arrays returned by each operation in the query.

---

### select / map

```sql
SELECT ...
```

Transforms each element in the query results with the return values of
`callback`.

The `.select` and `.map` functions are equivalent and both are provided as
syntactic sugar.

`Join.selectFrom(input).select(callback)` is equivalent to
`Join.selectFrom(input, callback)`.


#### Syntax

```javascript
query
  .select(callback) // or .map(callback)
```

#### Arguments

- `callback` (function/string/array)
  - *Optional*
  - Function executed as `callback(e)`, where `e` is an element of the query
    array.  This is used to transform the elements (e.g. by selecting only a
    subset of their properties) before other operations are chained to the
    query, and works identically to [Array.prototype.map()][].
  - If a string is passed in, then only that property of the query array
    elements is included in the resulting array.
  - If an array of property names is passed in, then only those properties of
    the elements of the query array are included in the resulting array.
  - Unlike the SQL SELECT command, which specifies the fields to return at the
    end of a query, the `callback` only specifies the array elements to provide
    to the next operation, meaning if you want SQL-like behaviour, call
    `.select` as the last operation in the query.

#### Returns

- *query*
  - A query object where each element of the previous query's results have been
    replaced by the values returned by `callback`.

---

### where / having / filter

```sql
SELECT ... FROM ...
  WHERE ...  /* THIS PART */
  GROUP BY ...
  HAVING ... /* AND/OR THIS PART */
```

Filter the query results to only include elements passing the test implemented
by `callback`.

The `.where`, `.having`, and `.filter` functions are all equivalent and are
provided as syntactic sugar to make query construction more SQL-like; in
particular, `.having` is provided to be used after a `*GroupBy` operation.


#### Syntax

```javascript
query
  .where(callback) // or .having|.filter(callback)
```

#### Arguments

- `callback` (function)
  - Function executed as `callback(e)`, where `e` is an element of the query
    array. The resulting query contains only those elements for which a truthy
    value is returned, identically to [Array.prototype.filter()][].

#### Returns

- *query*
  - A query object where only elements of the previous query's results having
    `callback(e) == true` are included.

---

### orderBy / sort

```sql
SELECT ...
  ORDER BY ...
```

Sort the query results according to `comparator`.

The `.orderBy` and `.sort` functions are equivalent and both are provided as
syntactic sugar.


#### Syntax

```javascript
query
  .orderBy(comparator[, options]) // or .sort(comparator[, options])
```

#### Arguments

- `comparator` (function/string/array)
  - Function executed as `comaprator(e1, e2)`, where `e1` and `e2` are elements
    of the query array. The resulting query's results are sorted according to
    the returned values.
  - This function follows the same spec as [Array.prototype.sort()][], except
    that instead of sorting in-place, a new array will be created (as is the
    case with every query operation).
  - If a string is passed in, then the query elements are sorted by that
    property in ascending order. If the property itself is a string, then
    [String.prototype.localeCompare()][] is used to sort the query results; if
    the property is an object with a `diff()` function, then this function is
    expected to have the same spec as the callback in
    [Array.prototype.sort()][], and it is used to sort the query results.
    Otherwise, the properties are converted to numbers and used for sorting.
  - If an array of property names is passed in, then the query elements are
    sorted in ascending order by each property in sequence, following the same
    logic on each property as described above.
- `options` (object)
  - *Optional*
  - Object containing the following properties:
    - `localeCompare` (boolean): If `true`, this signifies that strings should
      be sorted using the `localeCompare` function. If `false` (default),
      strings are sorted according to each character's Unicode code point value.
      This parameter is only used if `comparator` is a string or an array of
      property names.  Setting this parameter to `true` results in  generally
      slower sorts for string properties, but may be necessary if the properties
      are locale-sensitive.

#### Returns

- *query*
  - A query object whose elements are sorted according to `comparator(e1, e2)`.

---

### limit / offset

```sql
SELECT ...
  LIMIT ... [OFFSET ...]
```

Returns a slice of the query results according the specified length and/or
offset.

The `.limit(length, offset)` function is equivalent to
`.slice(offset, offset + length)`, and `.offset(offset)` is equivalent to
`.slice(offset)`. The variants are provided as syntactic sugar.

Calling `.limit(length, offset)` is equivalent to calling
`.offset(offset).limit(length)`.


#### Syntax

```javascript
query
  .limit(length[, offset])

query
  .offset(offset)
```

#### Arguments

- `length` (number)
  - The maximum length to which to limit the query result. If this is longer
    than the length of the curren query result, then the result is limited up
    to and including the last element.
- `offset` (number)
  - *Optional for `limit()`*
  - The starting index (zero-based) of the returned query result, before
    limiting to a specified length.

#### Returns

- *query*
  - A query object whose results are a slice of the previous results.

---

### slice

```sql
SELECT ...
  LIMIT ... [OFFSET ...]
```

Returns a slice of the query results according the specified begin and end.

This function follows the same spec as [Array.prototype.slice()][].

The `.slice(begin, end)` function is equivalent to `.limit(begin, end - begin)`,
and `.slice(begin)` is equivalent to `.offset(begin)`. The variants are
provided as syntactic sugar.


#### Syntax

```javascript
query
  .slice([begin[, end]])
```

#### Arguments

- `begin` (number)
  - *Optional*
  - The index (zero-based) of the query result at which to begin extraction.
    Default is 0.
- `end` (number)
  - *Optional*
  - The index (zero-based) of the query result before which to end extraction.
    Default is the end of the current query result.

#### Returns

- *query*
  - A query object whose results are a slice of the previous results.

---

### hashJoin

```sql
SELECT ...
  FROM ...
  [INNER|LEFT|RIGHT|FULL OUTER|CROSS] JOIN ... USING (...) /* THIS PART */
```

Joins the query result to another array using a version of the [Hash Join][]
algorithm.

It is appropriate when the source arrays are small and unsorted, and if the
resulting array does not need to be returned in any particular order. For large
sorted arrays, `mergeJoin` is much more efficient.


#### Syntax

```javascript
query
  .hashJoin(right, hashFcn, callback)
```

#### Arguments

- `right` (array)
  - The righthand array in the join operation.
- `hashFcn` (function/string/array)
  - Function executed as `hashFcn(e)`, where `e` is an element of the current
    query result (the "left" array) or `right`, and returning a number or
    string. Values of `e` for which `hashFcn(e)` returns the same value are
    considered equal and will be joined as specified by the `callback` function.
  - If a string is passed in, then that property of each array element is used
    as the hash. For example, passing in "x" is roughly equivalent to passing
    in `function(e) { return e['x']; }`.
  - If an array of property names is passed in, then the JSON representation of
    an array of those properties from each array element is used as the hash.
    For example, passing in `['x', 'y']` is equivalent to passing in
    `function(e) { return JSON.stringify([e.x, e.y]); }`.
  - Using the function version and returning the same value for all inputs can
    be used to implement cross/cartesian joins.
- `callback` (function)
  - Function executed as `callback(e1, e2)`, where `e1` and `e2` are elements
    of the current query result and `right`, respectively (or null; see below).
    If the returned value is truthy, it is added to the query result.
  - For each pair of `e1` and `e2` where `hashFcn(e1) == hashFcn(e2)`,
    `callback(e1, e2)` is called once per pair. Returning a value only when
    neither `e1` or `e2` are null can be used to implement inner joins.
  - For each `e1` where there is no matching `e2`, `callback(e1, null)` is
    called once. Correspondingly, for each `e2` where there is no matching `e1`,
    `callback(null, e2)` is called once. Returning a value in these cases can
    be used to implement left/right/full outer joins.
  - Returning a value when only one of `e1` or `e2` is non-null can be used to
    implement left/right anti-joins.

#### Returns

- *query*
  - A query object whose result is the join of the previous query result (the
    "left" array) and `right`: for each call to `callback(left[m], right[n])`
    returning a truthy value, that element is added to the query result.

---

### mergeJoin

```sql
SELECT ...
  FROM ...
  [INNER|LEFT|RIGHT|FULL OUTER|CROSS] JOIN ... USING (...) /* THIS PART */
```

Joins the query result to another array using a version of the
[Sort-Merge Join][] algorithm.

It is much more efficient than `hashJoin` when the source arrays already sorted
(see `options.sorted` below).


#### Syntax

```javascript
query
  .mergeJoin(right, comparator, callback[, options])
```

#### Arguments

- `right` (array)
  - The righthand array in the join operation.
- `comparator` (function/string/array)
  - Function executed as `comparator(e1, e2)`, where `e1` and `e2` are
    elements of the current query result (the "left" array) and `right`,
    respectively, and has the same spec as `compareFunction` in
    [Array.prototype.sort()][]. If `comparator(e1, e2) === 0`, then `e1` and
    `e2` are considered equal and will be joined as specified by the `callback`
    function.
  - If a string is passed in, then the query elements are sorted by that
    property in ascending order. If the property itself is a string, then
    [String.prototype.localeCompare()][] is used to sort the query results; if
    the property is an object with a `diff()` function, then this function is
    expected to have the same spec as the callback in
    [Array.prototype.sort()][], and it is used to sort the query results.
    Otherwise, the properties are converted to numbers and used for sorting.
  - If an array of property names is passed in, then the query elements are
    sorted in ascending order by each property in sequence, following the same
    logic on each property as described above.
- `callback` (function)
  - Function executed as `callback(e1, e2)`, where `e1` and `e2` are elements
    of the current query result (the "left" array) and `right`, respectively
    (or null; see below). If the returned value is truthy, it is added to the
    query result.
  - For each equivalent pair of `e1` and `e2`, `callback(e1, e2)` is called
    once per pair. Returning a value only when neither `e1` or `e2` are null
    can be used to implement inner joins.
  - For each `e1` where there is no matching `e2`, `callback(e1, null)` is
    called once. Correspondingly, for each `e2` where there is no matching
    `e1`, `callback(null, e2)` is called once. Returning a value in these cases
    can be used to implement left/right/full outer joins.
  - Returning a value when only one of `e1` or `e2` is non-null can be used to
    implement left/right anti-joins.
- `options` (object)
  - *Optional*
  - Object containing the following properties:
    - `sorted` (boolean): If `true`, this signifies that both input arrays are
      already sorted according to `comparator`. This provides a significant
      performance boost. Default is `false`.
    - `localeCompare` (boolean): If `true`, this signifies that strings should
      be sorted using the `localeCompare` function. If `false` (default),
      strings are sorted according to each character's Unicode code point value.
      This parameter is only used if `comparator` is a string or an array of
      property names.  Setting this parameter to `true` results in  generally
      slower sorts for string properties, but may be necessary if the properties
      are locale-sensitive.

#### Returns

- *query*
  - A query object whose result is the join of the previous query result
    (the "left" array) and `right`: for each call to `callback(left[m], right[n])`
    returning a truthy value, that element is added to the query result.

---

### hashGroupBy

```sql
SELECT ... /* AGGREGATE FUNCTIONS */
  FROM ...
  ...
  GROUP BY ... /* THIS PART */
```

Reduces query result elements that have the same hash into single elements.
Group membership is defined by the `hashFcn` function, where equal elements
(i.e. where `hashFcn(e1) === hashFcn(e2)`) belong to the same group.

The result is similar to partitioning the query elements into sub-arrays of
elements that have the same hash (according to `hashFcn`), calling
[Array.prototype.reduce()][] on each, and returning an array of each returned
value.


#### Syntax

```javascript
query
  .hashGroupBy(hashFcn, callback)
```

#### Arguments

- `hashFcn` (function/string/array)
  - Function executed as `hashFcn(e)`, where `e` is an element of the current
    query result, and returning a number or string. Values of `e` for which
    `hashFcn(e)` returns the same value are considered to be in the same group.
  - If a string is passed in, then that property of each array element is used
    as the hash. For example, passing in "x" is roughly equivalent to passing
    in `function(e) { return e['x']; }`.
  - If an array of property names is passed in, then the JSON representation of
    an array of those properties from each array element is used as the hash.
    For example, passing in `['x', 'y']` is equivalent to passing in
    `function(e) { return JSON.stringify([e.x, e.y]); }`.
- `callback` (function)
  - Function executed as `callback(previousValue, e)`, where `e` is an element
    of the current query result and `previousValue` is the last value returned
    by `callback` for the group to which `e` belongs. On the first call for a
    particular group, `previousValue === null`. The last value returned for
    each group is the one included for that group in the query result array.
  - This function must always return a value.

#### Returns

- *query*
  - A query object whose result has one element per group (as defined by
    `hashFcn`), where that element is the last value returned by `callback` for
    that group.

---

### sortGroupBy

```sql
SELECT ... /* AGGREGATE FUNCTIONS */
  FROM ...
  ...
  GROUP BY ... /* THIS PART */
```

Reduces query result elements that are equal into single elements. Group
membership is defined by the `comparator` function, where equal elements
(i.e. where `comparator(e1, e2) === 0`) belong to the same group.

The result is similar to partitioning the query elements into sub-arrays of
elements that are equal (according to `comparator`), calling
[Array.prototype.reduce()][] on each, and returning an array of each returned
value.


#### Syntax

```javascript
query
  .sortGroupBy(comparator, callback[, options])
```

#### Arguments

- `comparator` (function/string/array)
  - Function executed as `comparator(e1, e2)`, where `e1` and `e2` are elements
    of the current query result. This function has the same spec as
    `compareFunction` in [Array.prototype.sort()][]. If
    `comparator(e1, e2) === 0`, then `e1` and `e2` are considered to be in the
    same group.
  - If a string is passed in, then the query elements are sorted by that
    property in ascending order. If the property itself is a string, then
    [String.prototype.localeCompare()][] is used to sort the query results; if
    the property is an object with a `diff()` function, then this function is
    expected to have the same spec as the callback in
    [Array.prototype.sort()][], and it is used to sort the query results.
    Otherwise, the properties are converted to numbers and used for sorting.
  - If an array of property names is passed in, then the query elements are
    sorted in ascending order by each property in sequence, following the same
    logic on each property as described above.
- `callback` (function)
  - Function executed as `callback(previousValue, e)`, where `e` is an element
    of the current query result and `previousValue` is the last value returned
    by `callback` for the group to which `e` belongs. On the first call for a
    particular group, `previousValue === null`. The last value returned for
    each group is the one included for that group in the query result array.
  - This function must always return a value.
- `options` (object)
  - *Optional*
  - Object containing the following properties:
    - `sorted` (boolean): If `true`, this signifies that both input arrays are
      already sorted according to `comparator`. This provides a significant
      performance boost. Default is `false`.
    - `localeCompare` (boolean): If `true`, this signifies that strings should
      be sorted using the `localeCompare` function. If `false` (default),
      strings are sorted according to each character's Unicode code point value.
      This parameter is only used if `comparator` is a string or an array of
      property names.  Setting this parameter to `true` results in  generally
      slower sorts for string properties, but may be necessary if the properties
      are locale-sensitive.

#### Returns

- *query*
  - A query object whose result has one element per group (as defined by
    `comparator`), where that element is the last value returned by `callback`
    for that group.

---

### inspect

**Note: This function has is no analogue in SQL.**

Inspect the current query result using the provided callback.

This may be inserted in the middle of query construction to inspect or extract
the array at that point in execution. The provided `callback` function will be
called with the result array as its only argument. This is similar to using the
notify callback when calling `.execute({async: true})`, except that (unlike
the notify callback) different `.inspect()` callbacks may be inserted at
different points in the query execution.

The main difference between this function and `.execute()` is that instead of
an array or a promise, this function returns the query object, allowing you to
continue constructing your query. Also, like other operations, the callback is
not executed until `.execute()` is called.

The two main use-cases for this function are debugging and efficiency.
For example, the intermediate results in the Fluent Demo on the
[documentation page][docs] were constructed using `.inspect()` inserted at
various points within the construction of a single query. This is more
efficient and less code than construcing/executing multiple queries for each
step.


#### Syntax

```javascript
query
  // operations
  .inspect(callback)
  // more operations
```

#### Arguments

- `callback` (function)
  - Function executed as `callback(arr)`, where `arr` is the query result array
    (i.e. the array constructed by earlier operations in this query, and used
    as input to subsequent operations).

#### Returns

- *query*
  - A query object whose results are the same as those passed into `callback`.

---

Static Functions
----------------

If all you want to do is use a single operation, all of the functions above
(excluding `inspect`, and `execute`) have static versions in the `Join`
service. They are called by putting the input array, the one normally passed
into `selectFrom`, as the first argument. In fact, excluding the exceptions
above, `Join.operation(input, ...)` is equivalent to
`Join.selectFrom(input).operation(...).execute()`.

The static versions currently do not have an asynchronous mode. That is,
there is no way to have them return a [promise object][] instead of the
resulting array, as can be done on query objects with `.execute({async:true})`.


[docs]: http://atavakoli.github.io/angular-join
[fluent interface]: http://en.wikipedia.org/wiki/Fluent_interface
[promise object]: http://docs.angularjs.org/api/ng/service/$q
[Hash Join]: http://en.wikipedia.org/wiki/Hash_join
[Sort-Merge Join]: http://en.wikipedia.org/wiki/Sort-merge_join
[String.prototype.localeCompare()]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
[Array.prototype.map()]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[Array.prototype.sort()]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[Array.prototype.reduce()]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
[Array.prototype.filter()]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

[travis-img]: https://travis-ci.org/atavakoli/angular-join.svg
[travis]: https://travis-ci.org/atavakoli/angular-join

[bower-img]: http://img.shields.io/bower/v/angular-join.svg
[bower]: http://bower.io/search/?q=angular-join

[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
