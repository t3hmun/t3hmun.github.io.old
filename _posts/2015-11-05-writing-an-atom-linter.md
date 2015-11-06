---
layout: post
title: "Writing an Python Linter for Atom"
date: 2015-11-05 12:00:00
description: "I found the Python linters for Atom unsatisfactory so I decided to create my own. This involved learning to write Atom packages and Coffee-script."
category: article
tags: python lint atom
comments_enabled: true
---

* TOC
{:toc .toc}


## What, Why

I've been testing out Atom as a general code editor, and it does seem to have potential.
It does take more than a second to load, making it still inferior to Sublime for instant text file hacking, but it seems nicer as a light-weight IDE.
The plugins for Sublime are a little messy, I get the feeling that Atom is just a bit easier to work with out of the box.

Anyway I decided I wanted to run [Pylint](http://www.pylint.org/) (and [Pylama](https://github.com/klen/pylama)) automatically as I write code, highlighting syntax errors as you type is a lot quicker than running the linter in the console afterwards.
I tried the [community Linter packages](https://github.com/AtomLinter) and they failed to satisfy me.
They didn't separate errors warnings and other messages, which doesn't suit the way I work. Also the linter packages seemed to work inconsistently.  


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

Pressing `ctrl-shift-R` in the dev window will reload it, without affecting the normal Atom instance. This way you can edit the package in a normal Atom instance and then reload the dev window to test the changes.
