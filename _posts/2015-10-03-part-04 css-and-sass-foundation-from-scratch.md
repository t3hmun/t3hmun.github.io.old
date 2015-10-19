---
layout: post
title: "Part 3: Laying a CSS and SASS Foundation from Scratch"
date: 2015-10-04
description: Removing the default CSS for a Jekyll site and laying a nice SASS foundation for building on.
---

## Creating a CSS base

The default Jekyll blog site already has a load of CSS; it already has a formatted layout.
This is neither wanted or needed, so it has all been deleted.

Begin by creating a new `/_sass/` folder.
The is the default folder set in Jekyll for files to be used by SASS and not directly used in the website. 
A main stylesheet will be written that imports and combines these files.

> __SASS__
> 
> [SASS](http://sass-lang.com/) is a language/tool for generating CSS files.
> CSS usually get ridiculously overcomplicated as a website grows.
> SASS is an extension to CSS adding variables and extra syntax to make it easier to maintain.
> The SASS files are automatically converted into standard CSS so no special support is required to use SASS.


### Normalize

The implementation of CSS and HTML is not consistent across web browsers.
In order to create a consistent basic appearance the first CSS file will be [normalize.css](https://github.com/necolas/normalize.css/). Rename it to `_normalize.scss` and put it in the `/_sass/` folder. The extension is changed to `scss` because it is going to be processed with SASS.

> __normalize.css__
>
> HTML is not an exact standard, it was slowly built up over time. 
> As a result many tags appear and behave differently in each browser.
> normalize.css is a project to maintain a CSS file that creates a consistent look and behaviour across browsers.

An alternative approach is to use a CSS reset style-sheet that remove all formatting, forcing the developer to explicitly define everything.
Normalize seems better suited to this project since it directly deals with oddities and bugs, while leaving useful standard behaviour intact.

While it would be educational to do a line by line analysis of `normalize.css` , that is outside the scope of this project. Instead it will be referred to something it directly affects is modified in the CSS.


### Syntax

Syntax highlighting is an essential feature of any code related blog.

This step assumes the Rouge is installed (`gem install rouge`) and it is set as a build option for kramdown in `config.yml` (`syntax_highlighter: rouge`).

The syntax highlighter applies class attributes to segments of code and then a syntax stylesheet is used to apply approriate colours to those segments.  
Rouge will output syntax stylesheets using the rougify command:

```bash
cd _sass
rougify style monokai > _syntax.scss
```
{: .reading-width}

In this example the _monokai_ theme is chosen See [the rouge source](https://github.com/jneen/rouge/tree/master/lib/rouge/themes) for the names of other themes. Rouge supports the stylesheets used by 

### Main CSS File

Now create a `/css/` folder.
Notice that the name of this folder does not start with a `_`, it is a normal folder and will be output as-is unless a file has YAML front matter, in which case Jekyll will attempt to process it first (the underscore is not magical, it is just a convention). 


In the /css/ folder create `main.scss` with the following content:

```sass
---
# Files that are not in special directories require these YAML front matter to be processed by Jekyll.
---
@charset "utf-8";
// This is our main SASS file that brings together all the scss files to generate a main CSS file. 


// Import partials from `sass_dir` (defaults to `_sass`)
@import
        "normalize",
        "syntax"
;
```

This will generate a main.css, importing the specified scss files in order into the website output.


### Include in the Head

Add the stylesheet next to the metadata in `_includes/head.html` to apply it to the website:

```html
{% raw %}<link rel="stylesheet" href="{{ site.baseurl }}/css/main.css">{% endraw %}
```

Run `jekyll serve` in the project folder using the command line, then view it from `localhost:4000` in a browser.


A simple website with a consistent appearance across browsers has been achieved (and pretty syntax colours).


## Custom CSS

So far no custom CSS has been written.
Although this basic foundation is functional, there is a lot that can be improved in terms of usability and style.

Make a new scss file in the sass folder, for example: `/_sass/_style.scss`.

Add the file to the bottom of the imports list in `/css/main.scss`.
It is important to have it at the bottom of the list so that it overrides the CSS produced from the other files. 

An obvious bit of CSS to start with is to give the body a margin:

```css
body {
    margin: 10px;
}
```
{: .reading-width}

Reading without a margin is uncomfortable.
Here a set size in px, not em.
This is because the size of the margin should not depend on the text size, this risks giant margins that fill up the page, or tiny margins that serve no real purpose. This is especially an issue on mobile phones where margins are competing for a tiny screen space.

Code blocks lack an internal margin so let that be the next addition:

```css
pre {
    padding: 10px;
}
```
{: .reading-width}

_It is important to understand the difference between padding and margin._
_I have not had time to write about this, but you should make sure you fully understand and experiment with swapping the two._

## Using SASS Variables for Maintainability and Consistency

Now there are 2 css elements with the same value.
It seems likely that these values should stay the same.
This is a nice opportunity to try out SASS variables.

Add this to the middle of the `/css/main.scss` file:

```scss
$base-gutter: 10px;
```
{: .reading-width}

Now replace each occurrence of `10px` in `/style.css` with `$base-gutter`.
This is a SASS variable.


From this point on all sizes and colours will be defined in `/css/main.scss` as a variable.
This allows instant modification of colours and sizes from a clean un-cluttered file.
As the style customisation grows the `style.scss` will grow large and hard coded colours and sizes can become very hard to track down.
This also helps maintain consistency as it forces the developer to refer to their palette of sizes and colours defined in the main file.
Prevents the proliferation of odd and mismatched features.


## Next

Now this is a truly minimal Jekyll theme with syntax highlighting.

The [next part]({{ site.baseurl }}/2015/part-05-guide-to-the-complete-theme) will be about appling formatting that _I believe_ is most suitable for a blog.
Even if you disagree with it, it should be interesting. 