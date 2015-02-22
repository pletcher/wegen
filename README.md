# Wegen
Dead-simple client-side routing with an eye towards Flux architectures


## Usage

[Wegen](http://en.wiktionary.org/wiki/weg#Dutch)

```javascript
// A brief introduction in pseudocode (more to come)

var routes = [
  '/thing/:id', // passed directly to page.js
  doSomethingAwesome  
]

var wegen = new Wegen(routes);

function doSomethingAwesome(err, response[, context]) {
  if (err) {
    return handleError(err);
  }

  Dispatcher.dispatch({
    actionType: 'ROUTE_CHANGED',
    component: require('../thing.jsx'),
    context: context
  });

  Dispatcher.dispatch({
    actionType: 'THING_RECEIVED',
    thing: response.thing
  });
}

```


## Dependencies

[page.js](http://visionmedia.github.io/page.js/)

[nprogress](http://ricostacruz.com/nprogress/)


# License
The MIT License (MIT)

Copyright (c) 2015 Charles Pletcher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
