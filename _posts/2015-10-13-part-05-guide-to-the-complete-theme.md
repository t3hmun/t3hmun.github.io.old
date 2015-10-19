---
layout: post
title: "Part 5: Guide to the Complete Theme"
date: 2015-10-13
description: "I completed the theme, documenting as I went along, this post details the features and how to use them."
---

## Overview

After laying out the basics I proceeded to complete the theme using similar ideas to my original messy [Rather Simple Jekyll Theme]().
However this time I had a the plan in place before proceeding to write it, hence the theme layout is much neater.
It is also comprehensively commented, most of the ideas are laid out at the top of `/css/main.scss` and `_sass/_style.scss`.
Nevertheless an article is a much better format for such documentation.


### Features From the User Perspective

I've accessibility and ease of use were high on my list of priorities in the design.

I've avoided justifying text, leaving a ragged right.
Justified text has a much neater appearance but many people find difficult to read.

I've purposely avoided having menus or content on the sides of the page.
There are many reasons for this:

* Side menus don't flow with the page content.
* Side menus are distracting.
* Side menus are not small screen friendly.
* Side menus don't work with special needs style-sheets.

This site looks acceptable with when the CSS is deleted; this is one way of knowing how well reading mode and accessibility tools will cope with the site.

The header hierarchy is rigorously obeyed. 
Sadly the HTML5 section hierarchy is not created all the way through because Kramdown does not produce HTML5 sections.
However I believe the header hierarchy is enough for most modern tools to work with.


### Features from the Developer Perspective

If you look at the source, the ridiculous amount of comments will be obvious.
This was done to help people who are still learning CSS, HTML and the other stuff with Jekyll.

All sizes and colours are defined in variables in a single file `/css/main.scss` separate from the actual styling CSS.
This means that you do not have to search through reams of CSS to change a size or colour.
Simply find the relevant entry in the main file and change the value once for everything.

Switching to a dark theme requires changing 2 colours and using `rougify` to output a suitable syntax stylesheet (see [Part 4 #Syntax]({{ site.baseurl }}/2015/part-04 css-and-sass-foundation-from-scratch.html#syntax)).

There are very few classes used for styling.
I've tried to stick to the basic HTML tags for most things.
This makes the purpose of the CSS more obvious as most elements things stick to their default use.


## Markdown Usage

To begin with a quick run-down of what the converted markdown looks like.

### Basic Formatting

There is _emphasis_ and __strong__ (Markdown: `_emphasis_` and `__strong__`), all the `_` can be swapped for `*` as with standard Markdown.

This is a normal paragraph of text. I believe that roughly 60 characters per line is suitable for comfortable fast reading, hence these blocks of text are limited in width.

> As you may have noticed this is wider than the main text of this article.
> This is intentional.
> Blockquotes would not read well in the tiny width occupied by normal text.
> This element's with is set via the `$other-text-with` variable.  
> 
> > This is a blockquote inside a blockquote. 
> > There must be an empty ` > ` line before starting this sub-blockquote.

There are three widths that content is grouped and fit into:

1. Content width (`<h#>`):
    - This is the most wide width and bound all page content.
    - Headings are left aligned at this width so they stand out on a wide screen.
    - Code uses content width; code is best viewed in long unbroken lines.
2. Reading width (`<p>`):
    - This is the smallest width, should be between 60 to 80 characters wide.
    - Intended for comfortable reading of lots of text.
    - Too narrow for other content.
3. Other-text width (`<ol>`,`<ul>`,`<dl>`,`<blockquote>`):
    - This is a mix between the other two widths.
    - Intended for feature text element like lists and blockquotes.


### Code

Fenced code blocks of many kinds are supported. The following is an example of a fenced code block beginning with `~~~~~markdown` and ending with `~~~~~`, which results in the block being syntax highlighted as Markdown. 

~~~~~markdown
This is some *syntax highlighted* **Markdown**.

The following is the **Markdown** to insert a Python code block using Github style fencing:

```python
# Some slightly verbose python code.
def add_two_operands_together(first_operand, second_operand):
    result_of_adding_the_operands = first_operand + second_operand
    return result_of_adding_the_operands
```
~~~~~

If that Python example was not wrapped in another fenced code block it output would have been:

```python
# Some slightly verbose python code.
def add_two_operands_together(first_operand, second_operand):
    result_of_adding_the_operands = first_operand + second_operand
    return result_of_adding_the_operands
```

There is also `inline-block monospace` delimited with single back-ticks as with normal Markdown.
However it is also possible to syntax highlight such blocks using some Kramdown specific syntax.

Take this example of an in-line syntax highlighted block of Python: `def add(a, b)`{: .highlight .language-python}.
This was achieved by marking the code span with 2 classes that make Rouge take notice and select the correct language:

```markdown
... block of Python: `def add(a, b)`{: .highlight .language-python}. This was...
```

If you have a particularly small block of code that does not require the full with given to code blocks, it is possible to make the block smaller by applying the `reading-width` or `other-text-width` class to the block.

```python
def add (a, b):
    return a + b
```
{: .reading-width}

This was done by inserting `{: .reading-width}` as the line immediately after the code block.


### Images

By default images resize to fit the reading-with area. 
`![A simple picture]({% raw %}{{ site.baseurl }}{% endraw %}/img/a_picture.png)`:
![A simple picture]({{ site.baseurl }}/img/a_picture.png)

However They can be made to scale to the other sizes by inserting them in a html div:

```html
<div class="other-text-width"><img src="{% raw %}{{ site.baseurl }}{% endraw %}/img/a_picture.png" alt="A simple picture"></div>`
```

<div class="other-text-width"><img src="{{ site.baseurl }}/img/a_picture.png" alt="A simple picture"></div>

```html
<div><img src="{% raw %}{{ site.baseurl }}{% endraw %}/img/a_picture.png" alt="A simple picture"></div>
```

<div><img src="{{ site.baseurl }}/img/a_picture.png" alt="A simple picture"></div>

The `<div>` is required to suppress Kramdown from automatically inserting a `<p>` and also for inserting the width class for the smaller sizes.

### Headings

Although the markdown for the above header is `### Headings` the html is actually `<h4>`.
The `<h1>` tag is only used for the site masthead in order to keep headers consistent with HTML section levels.
The `header_offset 1` option is set in `/_config.yml` to make Kramdown output headings smaller by 1.

As a result of these settings the title of the article uses `<h2>`.
This is automatically inserted using the title in the Yaml-Front-Matter, so the `# Markdown H1` (which produces `<h2>`) should never be typed in the markdown article.

## Heading `##` 3

### Heading `###` 4

#### Heading `####` 5

##### Heading `#####` 6

###### Heading `######` 7

As you can see this is the same size as the previous heading; this is because it's the seventh heading size on the HTML page, which can't exist, so it is defaulted to `<h6>`.
Ideally you don't want to be using that many sizes of headings, but if you do then you must define a custom div for it and apply manually in the Markdown.

## How To Implement

There are a few steps to make this theme your own:

 * Clone or download this repository
 * Make sure you have Jekyll and rouge installed (see [Part 2: Tooling Up]({{ site.baseurl }}/2015/part-02-tooling-up.html))
 * Customize `/_config.yml`
 * Delete or rewrite `/about/`
 * Title and Description in `/index.html`
 * Customise the footer in `/_layouts/base.html`
 * Customise the colours in `/css/main.scss`

Finally you need to write your own blog posts.
If there is anything else that I have forgotten, I'm sure you can figure it out.