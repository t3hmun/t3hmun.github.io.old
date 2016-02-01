---
layout: post
title: "Writing a Package for Atom pt 1 - Basics"
date: 2015-11-05 12:00:00
description: "I found the Python linters for Atom unsatisfactory so I decided to create my own. This involved learning to write Atom packages and CoffeeScript. This article starts by creating the most basic Atom package and explaining it."
category: article
tags: python lint atom package coffeescript
comments_enabled: true
---

* TOC
{:toc .toc}


## What

This article details how to create a basic package for Atom and explains the reason for everything along the way.

## Why

I've been testing out Atom as a general code editor, and it does seem to have potential.
It does take more than a second to load, making it still inferior to Sublime for instant text file hacking, but it seems nicer as a light-weight IDE. 

Anyway I decided I wanted to run [Pylint](http://www.pylint.org/) (and later [Pylama](https://github.com/klen/pylama)) automatically as I write code, highlighting syntax errors as you type is a lot quicker than running the linter in the console afterwards.
I tried the [community Linter packages](https://github.com/AtomLinter) and they failed to satisfy me.
They didn't separate errors warnings and other messages, which doesn't suit the way I work. Also the linter packages seemed to work inconsistently.

So I've decided to write my own python linter package for Atom, which is also an opportunity to learn CoffeeScript and more JS at the same time.


## Default Atom Package

> This project was done in Windows using GitBash as a console.


### Using the Generator

Atom has a package generator installed by default, it creates a simple skeleton project to start you off.

Press `ctrl-shit-p` to bring up the Atom command palette and then type until you can select `Package Generator: Generate Package`. It will ask you to enter the the path you want and create the default skeleton package.


### Installing the Package

We've created a package but we have not installed it yet.
The basic way to manually install packages is to copy it into the package directory `~/.atom/packages/`, however that is not a great way to develop packages.

Open the project directory in a console and type `apm link --dev`. This creates a symlink to your project from the atom package directory (`~/.atom/dev/packages/<name-of-package>/`). Without the `--dev` option it would have installed in the main package directory, but dev mode is more practical.


### Using Dev Mode to Test

Run an Atom instance in dev mode (`atom -d`). You can continue running a non dev-mode instance of Atom for editing the project; the package was installed in the dev folder so it will only run in the Dev mode window.

The package should be visible in the right at the bottom of the packages part of the settings. The default project also adds a context menu option, keyboard shortcut and en entry in the packages menu (`alt-p`).

Pressing `ctrl-alt-R` in the dev window will reload it, without affecting the normal Atom instance. This way you can edit the package in a normal Atom instance and then reload the dev window to test the changes.


## What Programming Language?

The package is written in CoffeeScript, which is a language that compiles down to Javascript.
The next logical question is *what is interpreting the Javascript*.

Lying underneath Atom is a project that is now called [Electron](http://blog.atom.io/2015/04/23/electron.html), which is built on top of Node.js and Chromium. What this means for us is that most Node.js APIs are available, provided directly by Atom. So we will be using nodey Javascript written in CoffeeScript.

 It should be noted that I am relatively new to the modern Javascript world, so I'll by explaining quirks from this perspective.


## Cutting Down to Basics

The default project has a lot of stuff I have no interest in. It is too complex as a first package.


### `package.json`

This is the main config file for the package, modify obvious things like name, description, license and repository. You can remove the `activationCommands` for now, without specifying it the packages is activated when Atom loads. This is the easy option for developing, though it is good practice to active only when required.

```coffeescript
{
  "name": "python-lama-lint",
  "main": "./lib/python-lama-lint",
  "version": "0.0.1",
  "description": "A nice python linter.",
  "keywords": [],
  "repository": "https://github.com/t3hmun/python-lama-lint",
  "license": "MIT",
  "engines": {
    "atom": ">=1.0.0 <2.0.0"
  },
  "dependencies": {}
}
```

### Coffeescript Files

The lib folder contains the main code files. Start by deleting `/lib/<project-name>-view.coffee`.  Next we cut down the main file, `/lib/<project-name>.coffee`.

The first line of the script is a [Node.js style require], which loads `CompositeDisposable` from the `atom` module. The syntax used is shorthand for `CompositeDisposable = require('atom').CompositeDisposable`.

The second line uses the special `module.exports` object, this makes things public, accessible through require the module system that `require` is a part of. The [Node.js docs on modules](https://nodejs.org/api/modules.html) explains this system properly. Note: This is actually an implementation of something called CommonJS modules, which is referred to in various [CoffeeScript tutorials](https://arcturo.github.io/library/coffeescript/06_applications.html) that are also worth reading.

The `activate` method is required, it is run when the module is activated. I have put a log message here so that we know that our package is being run. IF we don't get the console message we know it is completely broken.

Next we set up the

> __CoffeeScript Syntax__
>
> `@` is an alias for `this`.
>
> `->` is short for function declaration, the parameters go in parenthesis before it, definition after. When `=>`is used, `this` is passed into the function as a var and then uses it instead of `this` when `@` is used. This makes sure that `@` refers to the `this` in the current context when the function is passed into a new context where `this` is a different object.
>
> Parenthesis are optional when calling a function as long as you provide at-least one argument. With no arguments or parenthesis, the function is treated as a var and not called.
>
> Much of CoffeeScript is self-explanatory from its similarity to Javascript, but if you have any doubts, test bits of code at the [CoffeeScript website](http://coffeescript.org/#try:potato).

The `CompositeDisposable` object is just a handy container for disposable object, allowing many to be disposed in one go. In this example it's not really necessary; the `@subscriptions` var could be removed altogether, assigning the `atom.commands.add...` directly to another var and disposing of it directly in the deactivate method.

The `atom.commands.add()` method [adds a command](https://atom.io/docs/api/v1.1.0/CommandRegistry#instance-add) to Atom's [CommandRegistry](https://atom.io/docs/api/v1.1.0/CommandRegistry) so that it can be used within Atom.

`deactivate` is another automatically run method, called when the package is disabled (the user may do this manually in settings). Here we clean up the command registered earlier. If we had registered many commands we would have added them all to the same `@subscriptions` object so that we can dispose of them all in that single `@subscriptions.dispose()` line.

The final 2 lines are a simple testing method used to show us that our package is alive and working.

```coffeescript
{CompositeDisposable} = require 'atom'
module.exports = PythonLamaLint =
  activate: (state) ->
    # Output to the console, handy to know that the plugin has activated.
    console.log 'activated'
    # CompositeDisposable a handy container for disposable
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', 'python-lama-lint:alive': => @alive()
  deactivate: ->
    @subscriptions.dispose()
  alive: ->
    console.log 'is alive'
```


### Keymap and menu

The cson files in the menus and keymaps folders add key-bindings and menus to Atom. You should make sure they refer to the command you added in your main CoffeeScript file, so i replaced `toggle` with `alive`.


## Result

Now we have a simple package that confirms it is working in the console. Basic but hopefully you should understand what __everything__ does.

In the next article I'll start transforming this into an actual linter package.

In [part 2]({{ site.baseurl }}/article/2015/writing-a-package-for-atom-pt-2-linter) I start writing a linter and then get bored.
