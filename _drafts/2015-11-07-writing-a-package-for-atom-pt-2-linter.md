---
layout: post
title: "Writing a Package for Atom pt 2 - Linter"
date: 2015-11-05 12:00:00
description: "I found the Python linters for Atom unsatisfactory so I decided to create my own. This involved learning to write Atom packages and CoffeeScript. This article transforms a basic package into a linter."
category: article
tags: python lint atom package coffeescript
comments_enabled: true
---

I ran out of steam half-way though writing this. I finished the package but I wasn't particularly enjoying CoffeeScript.
I've finished writing the package with an error-warnings-info indicator.

This continues on from the previous article which created a very basic Atom package. In this article we'll turn it into a python Linter.

## My First Linting Message

The linter API [tell us to paste](https://github.com/atom-community/linter/wiki/Linter-API) the following code into our `/package.json`.

```json
"providedServices": {
  "linter": {
    "versions": {
      "1.0.0": "provideLinter"
    }
  }
}
```

The `providedServices` is for the `services API`, announcing what services our package provides and consumes. In this case we are announcing that we are providing a linter service. The [Atom Community Linter](https://github.com/atom-community/linter/blob/master/package.json) package consumes the linter service and then displays its result on the screen.

One result of this structure is that out linting package does not depend on the Community Linter package, this just provides a service that the Community Linter package automatically finds. This makes it possible to replace the Community Linter with some other custom package without modifying the actual linters.

Next we need to define the `provideLinter` method used to supply the linter service.

```coffeescript
provideLinter: ->
  provider =
    name: 'PyLLint',
    grammarScopes: ['source.python'],
    scope: 'file',
    lintOnFly: false,
    lint: (textEditor) =>
      console.log('Linting.' + textEditor.getPath())
      return  [{
          type: 'Error',
          text: 'Good morning.',
          range:[[0,0], [0,1]],
          filePath: textEditor.getPath()
        }]
```

The required contents of `provider` is most fully defined in [Community Linter's Validate code](https://github.com/atom-community/linter/blob/master/lib/validate.coffee) but it's easier to follow the [documentation example](https://github.com/atom-community/linter/wiki/Linter-API).

The `name` will prefix all linter messages show from our linter. The grammar scope defines the files types that we will lint ([this](https://github.com/execjosh/atom-file-types) is the only list of default scopes I can find).

The `scope` setting indicates if you support linting the whole project. Whole project linting is only triggered on save.

The `lintOnFly` setting defines if you want to support linting changes before the file is saved. The linting interval for this mode is set in Community Linter package settings.

The lint method is where the actual linting is done. In this example it simply print a debug message to the console and then returns an error for the first character of the file. Enough to test that the Community Linter is using our linting package.  


## Linting on a Promise

Out first test linting message is returned immediately. However real linting can take a noticeable amount of time and may involve disk I/O, which means it must be done asynchronously. If the linting was fast, entirely JavaScript and didn't use any I/O then it would be done synchronously like in the test example.

The Community Linter supports the `lint` function returning a `Promise` in order to support async. `Promise` is a [feature of ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor). Some articles on it overflow with beguiling terminology, but [this article](http://www.html5rocks.com/en/tutorials/es6/promises/#toc-async) gives a nice simple description and example.

This next example is equivalent to simply returning the result but using a promise. What we want to do is pass the `resolve` callback function to some async linting code, which will fill lint array and then call `resolve ` when it has finished.   

```coffeescript
lint: (textEditor) ->
  console.log('Linting.' + textEditor.getPath())
  new Promise ((resolve, reject) ->
    resolve([{
      type: 'Error',
      text: 'Good morning.',
      range:[[0,0], [0,1]],
      filePath: textEditor.getPath()
    }])
  )

```



## Child Process

The linting tools I want to use is written in Python, so we need to launch a child process to run it. For this we'll use [Atom's `Buffered Process`](https://atom.io/docs/api/v1.1.0/BufferedProcess), which is a wrapper for [Node.Js's `child_process`](https://nodejs.org/api/child_process.html).
