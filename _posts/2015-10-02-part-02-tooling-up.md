---
layout: post
title: "Part 2: Tooling Up"
date: 2015-10-02
description: "Install Ruby, Jekyll and Rouge and a quick primer on what Jekyll gives you."
---

## A Quick Primer on Jekyll

Jekyll is a tool for making static blog sites.
Static means no backing database, just served as files on a server.
Jekyll is nice because it automatically does a bunch with a single command, `jekyll build`:

* Processes Liquid Markup
    - Automatically creates many handy liquid variables
    - Processes the variables for automatically generating indexes, titles, summaries etc.
* Converts Markdown to HTML
    - Write your blog posts in markdown
    - Using markdown is easier and less distracting
* Processes CSS/SASS
    - SASS is a CSS generator, makes CSS maintainable
* Runs plugins
    - Does things such as syntax highlighting and minifying output.

After a build the generated output can be pasted onto a static web-server and job done.

Jekyll also has the handy `jekyll serve` command that monitors and rebuilds automatically, while hosting the result on a localhost server for previewing and testing.
This means the result of all of the processing can be seen immediately.


## Tooling Up

_This is a Windows 7 installation, but only the Ruby installation is OS specific._


### Ruby

Jekyll is written in Ruby so it is required.
Acquire latest Ruby and DevKit installers from [rubyinstaller.org](http://rubyinstaller.org/downloads/).
I used Ruby 2.2.3 x64, however any new version will probably work.

Install Ruby to a directory with no white-space in the name (some Ruby packages require this).
Now extract the DevKit to a permanent directory.
The DevKit is required for the automatic building of some gems (RubyGems is Ruby's package manager, a Gem is a package).

Run `ruby -v` at the command-line should now display the installed version of Ruby.

Next run the install script for the DevKit so that the Ruby installation can use it:

```bash
ruby dk.rb init
ruby dk.rb install
```
{: .reading-width}


### Jekyll and Friends

Now install Jekyll and Rouge using RubyGems. 
Rouge is a syntax highlighter, I'm assuming you want syntax highlighting on your blog.

```bash
gem install jekyll
gem install rouge
```
{: .reading-width}

Run `jekyll -v` to see the version and confirm that it is installed.
I installed Jekyll 2.5.3.

## Create a Not So Fresh New Jekyll Site

Create a new default blog-site with the `jekyll new` command.
Run the `jekyll serve` in the blog folder. It builds the site and then hosts it at `localhost:4000`.
It automatically rebuilds when changes are made so it can be left running in its own window.
It will report the error if a build fails and then continue when the files are modified again.

```bash
jekyll new site-name
cd new site-name
jekyll serve
```
{: .reading-width}

View the site in a browser.

This is a good time to make an initial Git commit.


### The YML Config

The `_config.yml` file is the basic config for the site.
Strip it down to minimal content and customize as I have below.
Most of it is self-explanatory.

I have added some extra options to modify the behaviour of the Kramdown Markdown processor.

```yaml

# This title is used as the masthead on all pages.
title: t3hsite

# This description us used in the index page, RSS and in the meta for any page lacking its own description.
description: "A short description."

baseurl: "" # This is temporarily left blank, should be filled in before hosting on the internet.

# Build settings
markdown: kramdown
kramdown:
  input: GFM # GithHub Flavored Markdown, support for Github style fenced code blocks.
  syntax_highlighter: rouge
  hard_wrap: false # Single line breaks are ignored as in standard Markdown.
  header_offset: 1 # <h#> tags are offset down by one size.
```
{: .reading-width}

`input: GFM`{: .highlight .language-yaml} 
: Allows processing of Github Flavored Markdown. Handy as this is the version of Markdown I most commonly use.

`syntax_highlighter: rouge`{: .highlight .language-yaml} 
: Use Rouge to process the code blocks. I prefer this to the default (Coderay) because it can highlight more things such as bash.

`hard_wrap: true`{: .highlight .language-yaml} 
: This is a personal preference. Tells Kramdown to ignore single new-lines. 
Double new line is a new paragraph.
The only way to get a single new line is to use `<br>`.
This is they way Markdown is meant to behave (and my preference).

`header_offset 1`{: .highlight .language-yaml} 
: This reduces the header level used in the markdown by one when converting it to HTML.
This is done to demote the title of the blog post to H2; H1 is only suitable for use once as the site header (explained in detail later).

## Next

The [next part]({{ site.baseurl }}/2015/part-03-clean-basic-html/) will involve deleting a lot and arranging some fresh clean HTML.