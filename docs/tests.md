# Testing

## Testing the relationship between .value setter and schedulers

https://github.com/WebAudio/web-audio-api/issues/128

Does setting .value during scheduled events cancels events afterwards?

**ramp interruption with manual value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/3/

(mac) Firefox and Safari: value change gets ignored during ramp
(mac) Chrome: value will change and ramp will be recalculated

**scheduled value change interruption with manual value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/4/

(mac) Firefox and Safari: value change gets ignored
(mac) Chrome: value will change and scheduled change will happen too

**ramp interruption with scheduled value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/5/

(mac) Firefox and Safari: value will change and ramp will be recalculated
(mac) Chrome: result is same as when calling .value in the middle of a ramp

**having 2 ramps, where the 1st gets interrupted with a manual value change** - https://jsfiddle.net/lmeszaros/34yqz9nj/7/

(mac) Firefox and Safari: interrupting a ramp with manual value change will not affect future ramps
(mac) Chrome: only the 1st ramp will be interrupted, it does not affect future ramps

_Since this polyfill targets non-chrome browsers, I think it's safe to implement how Firefox behaves._

## Testing how ramps work when value is not set through scheduling

https://github.com/WebAudio/web-audio-api/issues/341

> Schedules a linear continuous change in parameter value from the previous scheduled parameter value to the given value

> If there is no previous event (and keep in mind that setting the value directly is not an event),
> then we can't interpolate, so we return the previous value.

**initializing a ramp without a set event** - https://jsfiddle.net/lmeszaros/ra60yvgh/13/

(mac) Firefox and Safari: ramping is ignored, target value is immediately set, acts like setValueAtTime
(mac) Chrome: ramp works correctly, goes from 0 to 1

**initializing 2 ramps without a set event** - https://jsfiddle.net/lmeszaros/ra60yvgh/16/

(mac) Firefox and Safari: 1st ramping is ignored, second ramp works fine
(mac) Chrome: both ramps work correctly

## Combining the above 2

**setting value after successful ramping** - https://jsfiddle.net/lmeszaros/bqnrfaL2/6/

(mac) Firefox and Safari: first ramp works correctly, set .value after it is ignored, second ramp is okay
(mac) Chrome: first ramp is okay, second ramp starts, then .value is set and ramp recalculates

**setting value after failed ramping** - https://jsfiddle.net/lmeszaros/bqnrfaL2/9/

(mac) Firefox and Safari: first .value set is okay, ramp fails and sets value at it's end, then second .value setting is ignored, ramp works correctly
(mac) Chrome: every ramp works correctly, setting .value acts as setValueAtTime()

### Moving back in time during ramp

**starting a ramp, than move back by 0.9 seconds** - https://jsfiddle.net/lmeszaros/34yqz9nj/39/

(mac) Firefox and Safari: value gets changed and ramp recalculates
(mac) Chrome: value gets changed and ramp recalculates

**starting a ramp, than move back by 1 seconds** - https://jsfiddle.net/lmeszaros/34yqz9nj/40/

(mac) Firefox and Safari: value doesn't change, ramp goes on unchanged
(mac) Chrome: value doesn't change, ramp goes on unchanged

_The conclusion is that setting a time value less, than ctx.currentTime will not always get clamped to ctx.currentTime_
_The clamping only happens for setTargetAtTime's and setValueCurveAtTime's startTime attribute_

https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueCurveAtTime

> A double representing the time (in seconds) after the AudioContext was first created that the change in value will
> happen. If this value is lower than AudioContext.currentTime, it is clamped to currentTime.
