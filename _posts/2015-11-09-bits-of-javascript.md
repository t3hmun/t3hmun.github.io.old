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

### In a Method

Normally `this` refers to the object that the function is __called__ inside of. For a method `this` would be the object that it is defined in. For a function called in a method it would be the object of the method that it is called from. Keep in mind that if a method is assigned to a var it is no longer a method of that object, it becomes a normal function.

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

A new function can be created that is explicitly bound to an object `ft = f.bind(anObject)`, in which case `this` is set to the specified object, ignoring the object that it is called from.


### At the Top Level

In browsers, at the top level, outside of any function, `this` always returns the global object `global`  which is usually `Window`. Any variables declared at that top level also become properties of that global object.

Scripts run in Node.Js have different rules for the top level, a lot can be understood from having a quick look at the [source for `node.js`](https://github.com/nodejs/node/blob/34a35919e165cba6d5972e004e6b2cbdf2f4c65a/src/node.js#L951-L968):

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

First thing to notice is the the script is run inside a function wrapper. This means that variables declared at the top level are local variables in the scope of that function. As a result these variables wont pollute the global object like they do in browser scripts.

From the code we can see that `exports`, `require` and `module` are function parameters. This explains how they are available in the whole script, they aren't just magic global variables.

The next part is a little more difficult to decode; the `runInThisContext()` function, which in turn calls the `ContextifyScript()` function, which appears to call a C compiled core module. I looks like this sets the object and global context for the function.
