---
layout: post
title: "Bits of Javascript"
date: 2015-11-05 12:00:00
description: "As a programmer learning JavaScript most of it is obvious and self-explanatory, however there are many little niggles and quirks that separate it from other languages. This is just some that I may need to remind myself of."
category: notes
tags: javascript
comments_enabled: true
---

## Hoisting

```javascript
var x = 5;
...other code

// Is equivalent to the following due to hoisting:
var x;
...other code
x = 5;
```

Implicit globals do not have their declaration hoisted.

```javascript
// Comment out the next line to test the rest.
console.log(implicitGlobal); // Reference error, CRASH.
console.log(normalGlobal); // >undefined

a();

console.log(implicitGlobal); // >'bad'
console.log(normalGlobal); // >'meh'

function a (){
    implicitGlobal = 'bad-implicit';
    normalGlobal = 'meh';
}

var normalGlobal = 'surprise';

console.log(implicitGlobal); // >'bad'
console.log(normalGlobal); // >'surprise'
```

## Logic

`&&` and `||` are lazy and return the last lazily tested operand.

```javascript
var truething = {}
var falsething; //undefined (assign 0, '' or false for smae result).
truething && falsething //== falsething
truething || falsething //== truething
falsething && truething //== falsething
falsething || truething //== truething
```

## IIFE Pattern

Immediately Invoked Function Expression

```javascript
(function(){
    //Here we have a new variable scope.    
}());   
```

This is needed if you are iterating and passing values into a closure.
Variables cannot be redeclared in JavaScript, only redefined, hence resulting in side-effects everywhere the var is used.

```javascript
var stuffToDoLater = []
for(var i = 0; i < 5; i++){
    x = someRandomValueFunction();
    (function(){
        // A new var scope to create closureCopy in.
        var closureCopy = x;
        var closingFunct = function(){
            doStuff(closureCopy);
        }
        stuffToDoLater.push(closureCopy)
    }());
}
```

If we used x instead of `closureCopy` in the `closingFunct`, then every `closingFunct` in `stuffToDoLater` would have the same `x` with the last value assigned to it in the loop.


## `this`

Every function has it's own `this` variable.

### `bind`

A new function can be created that is explicitly bound to an object `boundFunc = func.bind(anObject)`, in which case `this` is set to the specified object.

### Methods aand Functions

In methods `this` refers to the object the method belongs to. Other functions, including functions in methods, default `this` to the global object (default to `undefined` in strict mode).  Keep in mind that if a method is assigned to a var it is no longer a method of that object, it becomes a normal function with a default `this`.

```javascript
var objA = {
    val: "a",
    valFun: function(){console.log(this.val)}
}

var objB = {
    val: "b"
}

objA.valFun(); //Output: a

objB.valFun = objA.valFun;
objB.valFun(); //Output: b
objB.valFun = objA.valFun.bind(objA);
objB.valFun(); //Output: a
```

### At the Top Level

Browsers and Node.Js act differently at the top level.

In browsers, at the top level scope outside of any function `this` always returns the global object `Window`.

In Node.Js at the top level `this` is `module.exports`. Note that functions at the top level still default to the global object (or `undefined` in strict mode).


## Browser and Node.JS Structure

In browsers the global object is `Window`. Variables and functions declared at the top level become properties of `Window`.

In Node.Js the global object is called `global`. Variables and functions declared at the top level do not become a part of the global object.

 A lot can be understood from having a quick look at the [source for `node.js`](https://github.com/nodejs/node/blob/34a35919e165cba6d5972e004e6b2cbdf2f4c65a/src/node.js#L951-L968):

```javascript
NativeModule.wrap = function(script) {
  return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
};

NativeModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];

NativeModule.prototype.compile = function() {
  var source = NativeModule.getSource(this.id);
  source = NativeModule.wrap(source);

  var fn = runInThisContext(source, { filename: this.filename });
  fn(this.exports, NativeModule.require, this, this.filename);

  this.loaded = true;
};
```

First thing to notice is the the script is run inside a function wrapper. This means that variables and functions declared at the top level are local variables in the scope of that function. As a result these variables won't pollute the `global` object like they do in browser scripts. However vars defined but not declared with `var` are treated as implicit globals and added to `global` as a result.

From the code we can see that `exports`, `require` and `module` are function parameters. This explains how they are available in the whole script, they aren't just magic global variables.

The next part is a little more difficult to decode; the `runInThisContext()` function, which in turn calls the `ContextifyScript()` function, which appears to call a C compiled core module. It looks like this sets the object context (`exports`) and global context (`global`) for the function:

```javascript
function retThisFunc(){return this};
var varRtFunc = retThisFunc;
obj = {thisProp : this};

// Every entry in the following array evaluates to `true` in Node.Js.
var trueForNodeJs = [
    this == exports,
    this == module.exports,
    this == obj.thisProp,
    global == retThisFunc(),
    global == varRtFunc()
];
```
