---
layout: post
title:  "Sublime File Type Specific Theme"
date: 2015-08-08 17:00:00
category: note
tags: sublime theme markdown
---

Setting a separate theme for a single filetype in Sublime 3 is quite simple.
The Markdown Extended package combined the Monokai Extended colour scheme is great but I prefer a different colour scheme for everything else.

  * Open a file of the relevant type.
  * Preferences > Settings - More > Syntax Specific - User
  * Add: `"color_scheme" : "Packages/Name of package/Name of theme.tmTheme"`

Finding out the name of the theme:

 * Prefences > `Browse Packages` to open package folder.
 * If the package has its own folder there, just find the filename.
 * Otherwise visit the `../Installed Packages` folder.
 * Find the package, open with 7zip and find the filename.

This is what my `Markdown Extended.sublime-settings` file looks like now:

``` json
{
    "extensions":
    [
        "md"
    ],

    "color_scheme" : "Packages/Monokai Extended/Monokai Extended.tmTheme"
}
```

