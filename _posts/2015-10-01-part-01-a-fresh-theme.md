---
layout: post
title: "Part 1: A Fresh Jekyll Site"
date: 2015-10-01
description: "This is documentation of my attempt to make a Jekyll blog-site from scratch, deleting most of the default cruft, justifying every single line for maximum understanding. Learning good HTML5 and CSS along the way."
---

## What

This is a guide through my attempt to build a Jekyll blog-site design from scratch, deleting most of the default cruft, justifying every single line written for maximum understanding.
This is my way of creating a nice theme for my site and learning good HTML5 and CSS/SASS along the way. 

I've added extra detail so that it can work as a tutorial to fast-forward people to my level of understanding on these topics. This is not for people who are unfamiliar with code, I assume that the reader is able to understand simple scripting such as a Liquid Markup for loop without help.
I also assume that the reader can vaguely understand HTML and CSS.

This project is about finding out about looking at the details and nuances that make good site design. 


> __A short rant on responsive design:__
>
> Although I agree that a website should properly adapt to any screen type, I am not convinced by the 'responsive design' fad.
> Most of the responsive design I've seen encourages inconsistency, essentially hacking a page to act like totally different pages.
> I'm not interested in playing spot the hidden menu.
> Blog sites have no benefit in being as complicated as they are.


## Why?

I have tried modifying the themes made by others but it has never been a satisfying experience.
Most of the CSS/SASS that I have encountered previously has been painful to modify, it's impossible to know what the original designer was thinking.
The edited CSS rapidly degenerates into an impenetrable mess with more quirks than Internet Explorer.
On top of that it simply never feels like my own design, the original template is always echoing.


## Why Jekyll?

* A static blog-site is all I need
* Convenient
* Easy to use

I've already fiddled with Jekyll and it is satisfactory.
I've considered trying other things or even writing my own tool-chain, but that seems excessive, too many better things to be doing.

I'm not using GitHub's version of Jekyll.
GitHub is still fine to host the site, but the generation has to be offline.
GitHub compatibility limits the features available and ends up being tedious.

## Next

In the [next part]({{ site.baseurl }}/2015/part-02-tooling-up/) we begin by installing Ruby, Jekyll and related tools.