---
layout: post
title: "Encoding and Decoding in Python 3"
date: 2015-10-22 12:00:00
description: "Clear up the confusing and troublesome nature of encoding and decoding in Python 3, especially when utf-8 and the console is involved."
category: article
tags: python
comments_enabled: true
---

* TOC
{:toc .toc}

> Update 2015-26-10: Added information about sys.stdout.buffer.write.

## What

This is an article for people wanting to understand the following error with Python 3:

```
...
UnicodeEncodeError: 'charmap' codec can't encode character
...
```
{: .other-text-width}

Part of an error usually encountered when printing to a console, but possible in many other text situations.
If you are interested in deeply understanding the issue, instead of just copy-pasting SO posts, read on.

## The Problem

Internally Python 3 __always__ uses UTF-8 for its strings.
However the source and or destination of a string may have another encoding.

Python 2 does not strictly store its strings as utf-8 so one may encounter all sorts of bizarre encoding decoding samples that are only applicable to Python 2. This article only concerns Python 3.


### How `print` Works

[Print is a pretty basic function](https://docs.python.org/3/library/functions.html#print) that tries to convert whatever you give it to a string, adds a newline, and the passes it on to `sys.stdout.write`. It has other options, but we're only interested in its default use at the moment.

The `sys.stdout.write` function is [more interesting](https://docs.python.org/3/library/sys.html#sys.stdout):

> The character encoding is platform-dependent. Under Windows, if the stream is interactive (that is, if its isatty() method returns True), the console codepage is used, otherwise the ANSI code page. Under other platforms, the locale encoding is used (see locale.getpreferredencoding()).

This means that `sys.stdout.write` will re-encode whatever you give it to suit the context.
As a result we are required to give it text that is suitable for re-encoding and if we don't we get the encoding error that inspired this article.


### Simple Error Example With `print`

```python
>>> import sys
>>> sys.stdout.encoding
'cp850'
>>> print('hello')
hello
```
{: .reading-width}

In the above example `hello` is a utf-8 string, but the `hello` printed to the console has been re-encoded to [cp850](https://en.wikipedia.org/wiki/Code_page_850).
This all works fine while the string only uses characters available in cp850.

In the next example an attempt is made to print the mathematical delta increment sign, which does not exist in cp850 (the character appears as a triangle "`∆`" the escape in python is `\u2206`):

```python
>>> print('\u2206')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "c:\py34\python-3.4.2.amd64\lib\encodings\cp850.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_map)[0]
UnicodeEncodeError: 'charmap' codec can't encode character '\u2206' in position 0: character maps to <undefined>
```


## Changing the Console for the Text

There are two ways to output utf-8 to the console

 * Use `print` on a utf-8 console
 * Use `sys.stdout.buffer.write` to write the bytes of utf-8 encoded text.

Both of these methods will allow redirection and piping of the utf-8 text, staying in utf-8, however only the text will only appear correctly on the console if the console is set to utf-8.

In the windows command prompt the console's code page can be changed to Unicode (cp65001) before starting Python using `chcp` (if using GitBash type `chcp.com` instead):

```
>chcp 65001
Active code page: 65001
>python
Python 3.4.2 ...
```
{: .reading-width}

After doing so you can work with Unicode to your heart's content:

```python
>>> import sys
>>> sys.stdout.encoding
'cp65001'
>>> print('\u2206')
∆
```
{: .reading-width}

Doing same in Linux involves setting UTF-8 as part of your locale.
This is still something I need to play with myself, so I can't provide more information. 


## Cleaning the Text for the Console

It is not always practical to change to console for the text.
One may want to reliably print whatever the console is capable of printing in the situation.
My solution is a very simple function that replaces characters not compatible with the current console.
Text cleaned in this manner will print without error (but incompatible characters will be replaced with `?`).

```python
import sys

def clean(text, mode='replace'):
    encoding = sys.stdout.encoding
    if(encoding is not 'utf-8'):
        text = text.encode(encoding, mode).decode(encoding)
    return text
```

This causes the original value of the replaced characters to be lost, so if you need to accurately pipe, redirect or view the incompatible utf-8 characters, this is no good.
Also this is inefficient, since the text will be encoded again. You could simply skip the decode and pass the bytes to `sys.stdout.buffer.write` instead of using `print` (more on this later).



## Let's Grok Encode Decode

This is a series of little code samples that should clear up any misconceptions you might have about what the encode and decode functions do.

### string.encode()

The `string.encode('encoding')` function encodes the string into a __bytes object__ of the specified encoding.
It does not create a string, since Python 3 strings are always utf-8 (I stress this point because seeing contradictory Python2 code can result in confusion).

```python
>>> import sys
>>> sys.stdin.encoding
'cp850'
>>> encoded = 'hello'.encode('cp850')
>>> print(encoded)
b'hello'
>>> decoded = encoded.decode('cp850')
>>> print(decoded)
hello
>>> type(encoded)
<class 'bytes'>
>>> type(decoded)
<class 'str'>
```
{: .reading-width}


### string.decode()

The `string.decode('encoding')` function converts a bytes object representing text into an __utf-8__ string.
It always decodes to utf-8 because that what strings are in Python 3.
However the bytes object could be being used to represent any encoding (including utf-8) so that encoding must be specified.

The degrees symbol `º` exists in both Unicode and cp850 (everything should exist in Unicode).
The next code example it working in each encoding and the failures that occur when it is decoded with the wrong encoding.
You should be able to reproduce this example fine as long as your console is using one of these 2 encodings.

> __print(bytes)__
> 
> When you ask Python to print a bytes object it will show the corresponding ASCII text to each byte if it is a printable character.
> If the corresponding ASCII is non-printable or the value is non-ASCII (above 127), it is shown as an escaped hex number, for example ASCII `0x01` (SOH) is escaped as`\x01`.
> Most encodings are compatible with the printable characters of ASCII so interpreting a byte as the ASCII is a good guess of what is meant by it (but by no means guaranteed).

```python
>>> print('\u00ba')
º
>>> degrees = '\u00ba'
>>> print(degrees)
º
>>> degreesCp850 = degrees.encode('cp850')

>>> print(degreesCp850)
b'\xa7'
>>> degreesUtf8 = degrees.encode('utf-8')
>>> print(degreesUtf8)
b'\xc2\xba'
>>> print(degreesCp850.decode('cp850'))
º
>>> print(degreesCp850.decode('utf-8'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xa7 in position 0: invalid start byte
>>> print(degreesUtf8.decode('utf-8'))
º
>>> print(degreesUtf8.decode('cp850'))
┬║
```

The next example uses a string containing only basic printable ASCII compatible characters.
It demonstrates that using incorrect encoding may succeed when using only these basic characters.
Most encodings are purposely designed to act like this, it creates a tolerance for bad encoding on simple text data.

```python
>>> hello = 'hello'
>>> helloCp850 = hello.encode('cp850')
>>> helloUtf8 = hello.encode('utf-8')
>>> print(helloCp850)
b'hello'
>>> print(helloUtf8)
b'hello'
>>> print(hellpCp850.decode('cp-850')
... )
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'hellpCp850' is not defined
>>> print(helloCp850.decode('cp850'))
hello
>>> print(helloUtf8.decode('cp850'))
hello
>>> print(helloUtf8.decode('utf-8'))
hello
>>> print(helloCp850.decode('utf-8'))
hello
```
{: .other-text-width}


## Direct Output To `stdout`

The final method of working with utf-8 or any specified encoding is to send raw bytes directly to `stdout` skipping the automatic encoding. This is the only way to guarantee that your encoding is kept intact, useful when the intent is to have utf-8 (or anything else) output piped or redirected to other places intact.

As mentioned before `sys.stdout.write(string)` encodes by default, however using `sys.stdout.buffer.write(bytes)` skips the automatic encoding allowing you to output whatever you want intact.

The following simple Python script:

```python
import sys

print('1 sys.stdout.encoding: ' + sys.stdout.encoding)

sys.stdout.buffer.write('2 hello\n'.encode())
sys.stdout.buffer.write('3 delta triangle: \u2206\n'.encode())
sys.stdout.buffer.write('4 GPB currency symbol: £\n'.encode())
sys.stdout.buffer.write('5 delta triangle: \u2206\n'.encode('cp850', 'replace'))
sys.stdout.buffer.write('6 GPB currency symbol: £\n'.encode('cp850'))
```

Has the output:

```
1 sys.stdout.encoding: cp850
2 hello
3 delta triangle: Ôêå
4 GPB currency symbol: ┬ú
5 delta triangle: ?
6 GPB currency symbol: £
```
{: .reading-width}

Encode defaults to utf-8, so so `.encode()` is outputting utf-8 encoded text.
This works fine for pure ASCII characters (`hello`) that are encoding-compatible with most code-pages but outputs garbage when it encounters anything beyond basic ASCII, as seen on output lines 3 and 4.

The delta triangle is not compatible with cp850 so it is output as a `?` even when encoded properly.
Note that if the `'replace'` option was not specified, it would have defaulted to `'strict'` mode and crashed with the error that inspired this article.

Notably the British pound symbol `£` can be displayed in cp850 `print('£')`, however the encoding for this symbol is different so it only works when the correct encoding is specified.


### A Pitfall of Writing to `stdout.buffer` 

Now lets have a look at what happens when we redirect the output of the previous example to a text file (`example.py > x.txt`):

```
2 hello
3 delta triangle: âˆ†
4 GPB currency symbol: Â£
5 delta triangle: ?
6 GPB currency symbol: œ
1 sys.stdout.encoding: cp1252
```
{: .reading-width}

The output is in the wrong order, the text output with `print` appears last.
`print` uses `sys.stdout.buffer` (by default) and this buffers the text before output.
Since Python 3.3 `print` now has a flush argument that will prevent this disordering of output.
Otherwise you can use `sys.stdout.flush()` after the print for the same effect.

After doing a search I have found that people seem to be confused about what is buffered by python when and what is buffered by the console and when these bufferings come into effect.

The [Python documentation on this](https://docs.python.org/3/library/sys.html#sys.stdout) is a bit thin for my liking:

> When interactive, standard streams are line-buffered. Otherwise, they are block-buffered like regular text files. You can override this value with the `-u` command-line option.
> 
> > __Note__
> > 
> > To write or read binary data from/to the standard streams, use the underlying binary buffer object. For example, to write bytes to stdout, use `sys.stdout.buffer.write(b'abc')`.
> > 
> > However, if you are writing a library (and do not control in which context its code will be executed), be aware that the standard streams may be replaced with file-like objects like `io.StringIO` which do not support the buffer attribute.

Now I'm lost. I intend to figure this out and update this article accordingly soon.


