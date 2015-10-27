---
layout: post
title: Minimal Ubuntu on my Laptop Server
date: 2015-07-24
tags: log ubuntu linux server
category: note
comments_enabled: true
description: "The process of installing a minimal server on a DELL M1530 laptop and connecting the wifi."
---

* TOC
{:toc .toc}

## What

 * Using an old laptop (DELL M1530) as a low power server.
 * Minimal install of Ubuntu with only the essential packages for server.
 * This is a log to remind myself, but may be useful if you are doing something similar.

## Image

Downloaded [Ubuntu 15.04 "Vivid Vervet" minimal iso](https://help.ubuntu.com/community/Installation/MinimalCD) and used [Linux Live USB](http://www.linuxliveusb.com/) to put it on a USB mass storage device.

## Booting

`F2` is bios menu, `F11` is boot menu

USB boot, normal install, WiFi detected and connected without issue.

## GB Keyboard issue

Used press keys to auto detect keyboard, `gb` detected. **WARNING: The keyboard seems to be in US configuration when setting the user password.**


## Partitioning

Guided whole disk with LVM (total wipe starting fresh), all defaults, no issues (except for the GRUB issue later).
**Note down the name of the disk (if it is not `\dev\sda` then you may have to manually choose the it on the GRUB install stage).**


## Packages

 * OpenSSH server

Just SSH so that the server can be remotley configured from a more comfortable computer.

**WARNING: This will boot to a blank screen. Ctrl-Alt-F1 to get tty1 up.** This appears to be due to a [bug](https://bugs.launchpad.net/ubuntu/+source/grub2/+bug/695658)

## Waiting

... install is a bit slow, at-least 30 minutes

## Bootloader

GRUB will fail to install. This appears to be a bug in the installer, automatically choosing `\dev\sda`, which is the memory stick I'm installing from. 

After failure the the installer shows its menu. Select install Grub again, then choose no to manaully choose the GRUB disk. Enter `\dev\sdb` (this should be correct for single disk systems).

GRUB should install and the system restarts

## Booting

It may boot to a blank screen. Despair not. The computer may be configured to boot to a non-existent GUI. Press `Ctrl-Alt-F1` to get tty. 


## Login

If the password contains any characters that have different positions on a US keyboard, those letters may differ from what is expected. Refer to an image of a US keyboard to decode the password.


## WiFi from the Terminal

No GUI WiFi application installed. I was hoping the installation would have setup the same WiFi. No Luck. On the bright side, the essential WiFi packages (`iw` and `wpasupplicant`) are installed. 

**It turns out that there is no need to fear configuring WiFi from the Terminal.**

Let's begin:

```bash
ifconfig
```
{: .reading-width}

No wlan entry, need to activate it.

```bash
sudo ifconfig wlan0 up
ifconfig
```
{: .reading-width}

Now there is a `wlan0` entry.

```bash
sudo iwlist wlan0 scan
```
{: .reading-width}

That's a lot of console spam.

```bash
sudo iwlist wlan0 scan | grep SSID
```
{: .reading-width}

This produces a nice list of wireless networks, confirming that my network is in range.

The SSID-password pair for the wireless need to be appended to the `/ect/wpa_supplicant.conf`. Then a connection can be made using that config.

The Internet suggested that I do:

```bash
sudo wpa_passphrase "ssid" "password" >> /etc/wpa_supplicant.conf
```

However this results in `permission denied`, the sudo doesn't apply to the redirection. I just created the file in `~` and then

```bash
sudo cp ~/wpa_supplicant.conf /etc/wpa_supplicant.conf
```

The way to append with sudo is to use `tee -a` (a for append). Also skip the `-a` if you want to discard old connections and overwrite. Tee also echoes the output.

```bash
wpa_passphrase "ssid" "password" | sudo tee -a wpa_supplicant.conf
```

Now to make the connection (add `-B` to run in background):

```bash
wpa_supplicant -D wext -i wlan0 -c /etc/wpa_supplicant.conf
```

`wext` is the generic Linux wireless driver that currently applies to most devices.

It starts up, spews out some errors, but it rapidly get to `wlan0: CTRL-EVENT-CONNECTED`... which means a connection has happened. At this point i switch to the next tty `ctrl-alt-F2`

```bash
iw wlan0 link
```
{: .reading-width}

This shows that it is connected to the correct SSID.

```bash
sudo dhclient wlan0
```
{: .reading-width}

This will get an ip address. Connection complete. I ping the router and then the BBC to check the local net and the Internet are working.

Stuff all that in a script and it's actually easier than using a fiddly icon in the system tray:

__connect.sh__:

```bash
wpa_supplicant -D wext -B -i wlan0 -c /etc/wpa_supplicant.conf
```

Execute permission: 

```
chmod +x connect.sh
```

Run: `./connect`


## Config and Installing Software

Laptops aren't fun to work on so after the network is connected I fold the laptop into a ventilated corner and SSH in from my Windows 7 PC.

I don't use putty for SSH. I've started using [MobaXterm](http://mobaxterm.mobatek.net/). It has a more friendly UI and a solid X-server; this means I can run GUI apps on the laptop but view them in a window on my PC.

These are my core programs:

 * git
 * gitk
 * sublime-text - (type `subl` to launch from a terminal) sometimes its more convenient than vim.
 * a browser? (maybe something light I can run over ssh on MobaXterm)
 
Logging temps is rather important on the laptop. The GPU (8600M GT) really heats up, might need to be repasted soon.

 * lm-sensors
 * psensor - this makes nice live charts. Not really necessary.
 * sensord - logs to syslog.


**VirtualBox**: Need to enable Vt-x, the option is in the POST section of the bios.
