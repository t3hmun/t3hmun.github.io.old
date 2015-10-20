---
layout: post
title:  "Optional Muut Comments Loaded using a Button"
date: 2015-09-08 13:00:00
category: article
tags: muut comments js
description: "Adding comments to a static blog site, entirely loaded using a button."
---

* TOC
{:toc .toc}

I decided to make loading the comments system on my Jekyll blog site optional by making them load on a button press. No downloading of large scripts or contacting the third party comments service until the user decides to.


## What, Why?

Primary purpose of the page is to display content, comments are secondary and should not impact the loading and performance of the page. Also large comments blocks at the bottom of the page create marathon distances to the footer, which I find hurtful to the design of the page. These issues are especially significant on mobile phones where processing power, data and screen-space are precious commodities that should not be wasted.

My solution: load comments dynamically with a minimal block of JavaScript. Minimal means no JQuery or any other cumbersome library. I haven't properly started learning JavaScript yet but the code to do this was really very simple.

On top of all of this, users of my site may not want to have their activity tracked and profiled by the comments service that I use. Adding a button allows them to the user to opt in. Ideally I'd self-host the comments but that requires a good server and I'm not currently ready to spend the money and effort on making that reliable.


## A Litte Bit of Javascript

I'm using [Muut](https://muut.com/) for my comments, but a similar method should work for Disqus or any other system that just involves loading a JavaScript file. Previous to this my page has been entirely JavaScript free. Therefore it would be extreme and wasteful to use something such as JQuery.

When loaded Muut looks for a link with the `class="muut"` attribute and then inserts itself at that link's position. I have Muut on dynamic mode so the link doesn't point to anywhere useful. Therefore I don't want that link to be visible before Muut is loaded, so it is hidden with CSS and then restored in my JavaScript (otherwise the comments would be hidden). 

``` javascript

<div id="load-button" class="load-button">

  <script type="text/javascript">
    function loadcomments(){
      
      //Hide the load button, it is no longer wanted.
      document.getElementById('load-button').style.visibility='hidden'

      //Unhide the moot div.
      document.getElementById('mootdiv').style.display='block'
      
      //Create an element for the script and then shove it in the head.
      var scriptele=document.createElement('script')
      scriptele.setAttribute("type","text/javascript")
      scriptele.setAttribute("src","//cdn.muut.com/1/moot.min.js")
      document.getElementsByTagName("head")[0].appendChild(scriptele)
    }
  </script>
 
  <center><button onclick="loadcomments()">Click to load comments</button></center>
 
</div>

<div class="mootdiv" id="mootdiv">
  <a href="https://muut.com/i/InsertYourMuutIdHere/comments" class="muut" type="dynamic">Loading comments...</a>
</div>

```

``` css
.mootdiv {
    display: none;
}
```

You may notice that I've changed the link Muut uses to position itself to a loading message. That message will stay on screen while the Muut js loads. Muut then replaces itself. Simple hack to keep the user informed. 


## Muut? Y u no Disqus

Disqus irks me. By default it has that links to other articles detritus at the end of the comments block. These kinds of links conjure images of clickbait in my mind, most detrimental to my inner state of calm. Its also large and slow.

Muut appears to be smaller, and it has some neat markdown support. I like the idea of being able to drop code snippets in the comments. Its under heavy development, probably has a few bugs but it is an experiment.

Overall I don't intend to stay with third party comments systems forever since there are all sorts of issues surrounding user tracking and content ownership. I'll set up my own server eventually, but configuring everything properly can be quite a lot of work and I have other priorities at the moment.