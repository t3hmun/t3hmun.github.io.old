---
layout: post
title: "Encoding and Decoding in Python 3"
date: 2015-10-13 14:15:00
description: "Clear up the confusing and troublesome nature of encoding and decoding in Python 3, especially when utf-8 and the console is involved."
category: article
tags: python
---

This is an article for people wanting to understand the following error with Python 3:

```
...
UnicodeEncodeError: 'charmap' codec can't encode character
...
```
{: .other-text-width}

Part of an error usually encountered when printing to a console, but possible in many other text situations.

## The Problem

Internally Python 3 __always__ uses UTF-8 for its strings.
However the source and or destination of a string may have another encoding.

> Python 2 does not strictly store its strings as utf-8 so one may encounter all sorts of bizarre encoding decoding samples that are only applicable to Python 2. This article only concerns Python 3.

The most simple example is the print function which automatically re-encodes the string to the console's encoding.

```python
>>> import sys
>>> sys.stdin.encoding
'cp850'
>>> print('hello')
hello
>>>
```
{: .reading-width}

In the above example `hello` is a utf-8 string, but the `hello` printed to the console has been re-encoded to [cp850](https://en.wikipedia.org/wiki/Code_page_850).
This all works fine while the string only uses characters available in cp850.

In the next example an attempt is made to print the mathematical delta increment sign (`∆`), which does not exist in cp850:

```python
>>> print('\u2206')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "c:\py34\python-3.4.2.amd64\lib\encodings\cp850.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_map)[0]
UnicodeEncodeError: 'charmap' codec can't encode character '\u2206' in position 0: character maps to <undefined>
```

## Changing the Console for the Text

One solution is to change the console's code page to Unicode (cp65001) before starting Python, which can be done in the windows command prompt using `chcp` (if using GitBash type `chcp.com` instead):


```
>chcp 65001
Active code page: 65001
>python
Python 3.4.2 ...
```
{: .reading-width}

After doing so you can work with Unicode to your hearts content:

```python
>>> import sys
>>> sys.stdin.encoding
'cp65001'
>>> print('\u2206')
∆
```
{: .reading-width}


## Changing the Text for the Console

It is not always practical to change to console for the text.
One may want to reliably print whatever the console is capable of printing in the situation.
My solution is a very simple function that replaces characters not compatible with the current console.
Text cleaned in this manner will print without error (but incompatible characters may be replaced with ?).

```python
import sys

def clean(text, mode='replace'):
    encoding = sys.stdin.encoding
    if(encoding is not 'utf-8'):
        text = text.encode(encoding, mode).decode(encoding)
    return text
```

This causes the replaced characters to be lost so if you need to accurately pipe of view the Unicode characters this is no good.


## Starting to Grok Encode Decode

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

> __print(byteArray)__
> 
> When you ask Python to print a bytes object it will show the corresponding ASCII text to each byte if it is a printable character.
> If the corresponding ASCII is non-printable, it is shown as an escaped hex number, for example `\x01` is `0x01`.
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

