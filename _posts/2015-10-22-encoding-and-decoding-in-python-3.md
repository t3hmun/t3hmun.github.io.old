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
> Update 2015-27-10: Corrected a boat-load of mistakes, and added more information.

## What

This is an article for people wanting to understand the following error with Python 3:

```
...
UnicodeEncodeError: 'charmap' codec can't encode character
...
```
{: .other-text-width}

Part of an error usually encountered when printing to a console, but possible in many other text situations.
If you are interested in fully understanding the root issue, instead of just copy-pasting SO posts, read on.

## The Problem

Internally Python 3 __always__ uses UTF-8 for its strings.
However the source and or destination of a string may have another encoding.

Python 2 does not strictly store its strings as utf-8 so one may encounter all sorts of bizarre encoding decoding samples that are only applicable to Python 2. This article only concerns Python 3.


### How `print` Works

[Print is a pretty basic function](https://docs.python.org/3/library/functions.html#print) that tries to convert whatever you give it to a string, adds a newline, and the passes it on to `sys.stdout.write`. It has other options, but we're only interested in its default use at the moment.

The `sys.stdout.write` function is [more interesting](https://docs.python.org/3/library/sys.html#sys.stdout):

> The character encoding is platform-dependent. Under Windows, if the stream is interactive (that is, if its isatty() method returns True), the console codepage is used, otherwise the ANSI code page. Under other platforms, the locale encoding is used (see locale.getpreferredencoding()).

This means that `sys.stdout.write` will re-encode whatever you give it to suit the context.
As a result we are required to give it text that is suitable for re-encoding; if we don't we get the encoding error that inspired this article.

Since the documentation is horrifyingly difficult to traverse we can investigate a bit using python itself:

```python
>>> import sys
>>> type(sys.stdout)
<class '_io.TextIOWrapper'>
```
{: .reading-width}

As you can see, `sys.stdout` is actually a [TextIOWrapper](https://docs.python.org/2/library/io.html#io.TextIOWrapper), which has some further relevant documentation.

```python
>>> print(sys.stdout.errors)
strict
>>> print(sys.stdout.encoding)
cp850
>>> print(sys.stdout.line_buffering)
True
```
{: .reading-width}

Now we can see that errors is set to strict, which is the cause of the encoding error, it has detected my console's encoding and it is using line-buffering, which means that the TextIOWrapper buffer is flushed on every newline character.

However, if we put all those lines into a script and then redirect the output to a file the file contains:

```
<class '_io.TextIOWrapper'>
cp1252
strict
False
```
{: .reading-width}

The encoding has changed and line buffering has turned off.
The same happens when the script output is piped to another program.
So much for predictability.
We must be wary.


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

The only practical way to reliably display utf-8 text in a console is to change the console to utf-8 mode. 

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
{: .other-text-width}

This causes the original value of the replaced characters to be lost, so if you need to accurately pipe, redirect or view the incompatible utf-8 characters, this is no good.
Also this is inefficient, since the text will be encoded again. You could simply skip the decode and pass the bytes to `sys.stdout.buffer.write` instead of using `print` (more on this later).


## Let's Grok Encode Decode

This is a series of little code samples that should clear up any misconceptions you might have about what the encode and decode functions do.

### string.encode()

The `string.encode('encoding')` function encodes the string into a __bytes object__ with the specified encoding. 
Bytes are raw data, the bytes object does not have encoding, the data stored in the bytes represent text of an encoding.

In Python 3 you encode from a __utf-8-encoded-string__ to bytes and decode from bytes to a __utf-8-encoded-string__ (I stress this point because seeing contradictory Python2 code can result in confusion).

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

The `bytes.decode('encoding')` function converts a bytes object representing text into an __utf-8__ string.
However the bytes data could be being used to represent any encoding (including utf-8) so that encoding must be specified.
If you decode bytes representing utf-8 text, the data does not change, the underlying data is identical.

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

The final method of working with utf-8 or any specified encoding is to send raw bytes directly to the `stdout` buffer, skipping the automatic encoding. This is the only way to guarantee that your encoding is kept intact, useful when the intent is to have utf-8 (or anything else) output piped or redirected to other places unmodified.

As mentioned before `sys.stdout.write(string)` encodes by default, however using `sys.stdout.buffer.write(bytes)` delivers your bytes directly, unchanged. 

In theory `string.encode('utf-8)` doesn't actually do anything to the data itself, since string is is already utf-8, it just creates a bytes var to so that we can make direct use of the data. The is the equivalent of 'outputting the string directly'.

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

In this example lines 2, 3 and 4 were econded to the default utf-8 before being output.
This works fine for pure ASCII characters (`hello`) that are encoding-compatible with most code-pages but outputs garbage when it encounters anything beyond basic ASCII, as seen on output lines 3 and 4.

The delta triangle character does not exist in cp850 so it is output as a `?` when encoded correctly.
Note that the `'replace'` option was specified. 
The default `'strict'` mode would have broke the script with the error that inspired this article.

Notably the British pound symbol `£` can be displayed in cp850 `print('£')`, however the encoding for this symbol is not the same as in utf-8 so it only appears when encoded correctly.


### Pitfalls of Writing to `stdout.buffer` 

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
By default `stdout` is a [TextIOWrapper](https://docs.python.org/3/library/io.html#io.TextIOWrapper) which inherits from [TextIOBase](https://docs.python.org/3/library/io.html#io.TextIOBase).
It has its own text buffer separate to the underlying [BufferedWriter](https://docs.python.org/3/library/io.html#io.BufferedWriter) (`sys.stdout.buffer`).
This extra middle buffer must be flushed (`sys.stdout.flush()`) before writing directly to the underlying buffer.

Since Python 3.3 `print` has a flush argument that will do the flush for you.

I'm not sure if `sys.stdout.flush()` triggers `sys.stdout.buffer.flush()`, feel free to [investigate](https://github.com/python/cpython/blob/1fe0fd9feb6a4472a9a1b186502eb9c0b2366326/Modules/_io/textio.c#L1244) [further](https://github.com/python/cpython/blob/1fe0fd9feb6a4472a9a1b186502eb9c0b2366326/Modules/_io/textio.c#L2621).

The [Python documentation on this](https://docs.python.org/3/library/sys.html#sys.stdout) mentions line-buffering:

> When interactive, standard streams are line-buffered. Otherwise, they are block-buffered like regular text files. You can override this value with the `-u` command-line option.

However this seems to have nothing to do with this issue, the python interpreter and the console seems to always output immediately, regardless of the lack of line endings and files output out of order even with line endings.


#### `_CHUNK_SIZE` hack

Yet another sneaky method is to set the [undocumented](https://github.com/python/cpython/blob/1fe0fd9feb6a4472a9a1b186502eb9c0b2366326/Modules/_io/textio.c#L1347) chunk size to one:  `sys.stdout._CHUNK_SIZE = 1`.
This is the variable in TextIOWrapper that controls the frequency of text buffer flushes.

__However be careful, this requires at-least 2 characters to be sent at a time to guarantee a flush__; [it only triggers a flush](https://github.com/python/cpython/blob/1fe0fd9feb6a4472a9a1b186502eb9c0b2366326/Modules/_io/textio.c#L1347) when there are more than `chunk_size` characters pending to be written. The minimum allowed value of `chunk_size` is 1, which means the minimum pending characters must be 2 to flush. It handles the entire passed string at once, so strings that have a length of 2 or more will flush fully instantly.

This is a handy hack if you have a lot of code lacking necessary flushes (and none of those string are smaller than 2 characters).

I can't say I fully understand the code, so don't use this hack on any critical code.


## Other Methods of Changing Output

As [mentioned in the documentation](https://docs.python.org/3/library/sys.html#sys.stdout) the output encoding can be changed using the `PYTHONIOENCODING` environment variable.
This approach is not recommended because it can have side effects, it may break other scripts.

### Detach For Pure Binary

It is possible to [detach the TextIOWrapper](https://docs.python.org/2/library/io.html#io.TextIOBase.detach) from stdout, however all this does is break `print` completely and change `sys.stdout.write()` so that it accepts bytes instead of string. This is only useful in porting awkward code from Python 2. 

```python
import sys
# Detach returns the underlying stream, which is a _io.BufferedWriter
# This is unlikely to be a good idea.
sys.stdout = sys.stdout.detach()
```
{: .reading-width}


### Detach and Replace With Encoder

A more interesting idea than just detaching is to replace stdout with a utf-8 encoder:

```python
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach)
```

The `codecs.getwriter()` method returns a function for initialising a writer.
The detached stream is passed as a parameter to create a writer that is then set as stdout.

Now all `print` and `write` calls will be encoded as `utf-8` regardless of the context.
This has the same output effect `sys.stdout.buffer.write(mystring.encode())`, non ASCII text becomes garbled in the console, but piped and redirected text is utf-8 so you can fully work in utf-8. 
Keep in mind that `stdout.buffer` does not exist anymore, since stdout is now a `encodings.utf_8.StreamWriter`.

This is useful when you have a script with many print statements and you want to force utf-8 output for all of them.
This is especially when the output will be redirected to file, and you want that file to be utf-8.


## A Pitfall When Piping 

Be wary, if you pipe utf-8 to another script or program without changing the console codepage to utf-8, the second script's stdin won't magically change to utf-8.
If the second program is a python script it will detect the code-page from the console the same as always and the input will be decoded accordingly.
You will have to force its stdin into utf-8 mode.


## Last Words

ARRGGGGGHHHH it is annoying that everything doesn't work in unicode by default, but this is legacy.
The 256 glyph VGA compatible text mode is still the universal fallback / startup mode for computers these days, meaning that the terminal will always need to be compatible with a basic old code page first.

 * If you need Unicode you will have to specify it at both ends, in and out, or you risk failure.
 * For visible console output, stick to ASCII.

-t3hmun