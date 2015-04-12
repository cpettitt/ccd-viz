This is a project to visually, and interactively, explore various collision
detection algorithms.

# aabb-aabb-ccd.html

This file has a tool for testing moving AABB and static AABB continuous
collision detection. Both AABBs are draggable and resizable and the vector
angle and magnitude can be altered.

![AABB / AABB CCD](//raw.github.com/cpettitt/ccd-viz/master/aabb-aabb-ccd.png)

# Design Notes

Beyond the original purpose of testing collision detection algorithms this
project presented an opportunity to try out
[RxJS](https://github.com/Reactive-Extensions/RxJS). I'm pretty happy with the
results. `Strob.js` has the code to hook up different shapes using RxJS
Observables. Hooking up most input and output collapses down to a single line,
where data transformation is not required.

It was also a chance to use [interact.js](http://interactjs.io/), which
simplified the code to make AABBs draggable and resizable.

# License

The code in this project is licensed under the terms of the MIT License.
