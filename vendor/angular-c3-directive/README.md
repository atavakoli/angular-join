angular-c3-directive
====================

Dead simple AngularJS directive for the C3.js chart library

Installation
------------

Installation is performed using [Bower](http://bower.io). The only dependencies
are [AngularJS][] and [C3.js][].

```
bower install angular-c3-directive
```

Usage
-----

In your HTML:

```html
<html ng-app="myApp">

  ...

  <script src="angular.js"></script>
  <script src="d3.js"></script> <!-- Required by C3.js -->
  <script src="c3.js"></script>
  <script src="angular-c3.js"></script>

  ...

  <div c3="chart"></div>

  ...

</html>
```

In your JavaScript, you need to inject `c3` as a dependency.

```javascript
angular.module('myApp', ['c3'])
```

In your controller, the object passed into the `c3` attribute is the same as
that passed into [`c3.generate()`][c3.generate], except without the `bindto`
property.

```javascript
$scope.chart = {
  data: {
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 50, 20, 10, 40, 15, 25]
    ]
  }
};
```

The chart is updated whenever the object or any of its properties are modified.

[AngularJS]: https://github.com/angular/bower-angular
[C3.js]: https://github.com/masayuki0812/c3
[c3.generate]: http://c3js.org/gettingstarted.html#generate
