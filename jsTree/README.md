# JsTree

jsTree is an experiment to recreate [NeonFlames](29a.ch/sandbox/2011/neonflames/). The algorithm is based of NeonFlames, but a lot of improvements have been done.

It is currently hosted on [a webserver by a friend of mine](http://sheldan.vserver.gdev.at/jstree/).

The basic idea is: You click and drag with the mouse and create particles, which then move on their own according to different parameters.

## Parameters

Color:
The text fields Red, Green, Blue and Alpha are for their RGBA values respectively. The color gets stacked on top of each other, so if a particle moves more often over a point, it gets denser.

The parameters for the Start:

* InitialX: The horizontal velocity the particle starts with.

* InitialY: The vertical velocity the particle starts with.

* Fuzzy Start: Whether to put the currently configured initial velocities into a random function and then use that value as the initial velocity.

The parameters which apply each time the particle moves are:

* Noise: it takes into account the current color of pixel on the background noise image it is on. The x movement depends on red, y on green. 

* Delta Vel Factor: the old velocity gets multiplied with this value. The default value is 0.8 and this keeps the particle from going to fast.

* Fuz: a random number is generated (range +-0.1) and fuz says how big of a factor this number is multiplied with.
 
* Max Age: every time a particle moves, its age increases by one. If the age is over this threshold, the particle stops moving.

* Movement type: There are three different movement types. The default one is the same from NeonFlames. The second one is a variation in which the particles only move in 90 degree angles. 
The third one is a bit weird, as the particles are very fast, but the start to align like a cross. (default noise function)

* Noise function: The first two are the most useful ones. The create something... not weird most of the time. For the other ones to make sense, you might need to play around with the other config.

To apply the config (except dropdowns), you need to exit the text field. If you want to resize the canvas, then you have to hit enter while being in the text field.

## Background Noise 

If you click "Toggle show noise" you can see the image which is being used for the parameter Noise. The basic Noise function has been taken from NeonFlames, but different alternatives have been added.
You can also set the current image you created as the new noise, but beware that the same rules apply: horizontal movement depend on the red part, vertical on green.


## Recording
It is possible to record the canvas and download the .webm of it. This currently works only in Chrome, because it uses the WEBP codec, which is (to my knowledge) only supported there.
For a recording click on the button directly above the canvas.

Recording makes use of [WebRTC](https://github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/Canvas-Recording). This can record the canvas by using [Whammy](https://github.com/antimatter15/whammy) under it.

## Download
Next to the spawn number configuration, there is a label "Download" click this and you will start downloading the current image. It will contain alpha. The black background is just for making it more visible in the browser, but I thought for using it, the transparent background might be useful.

## Known issues

* On my own machine, I often had the issue, that the whole tab lagged in Chrome (Not Firefox) if you dragged the mouse around while spawning particles. This behavior was very random and it occurred randomly.
 I have no fix for this, as (while it occurred) it didn't seem to have a reasoning behind it, and it also only appeared on my local machine.


## Examples
[Album on Imgur](http://imgur.com/a/cLyAv)

[Example webm](https://webmshare.com/0rbBj)

[First movement type](https://webmshare.com/dEDvO)

[Second movement type](https://webmshare.com/q7P5z)
