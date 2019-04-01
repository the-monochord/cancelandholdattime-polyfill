# Testing

## Testing the relationship between .value setter and schedulers

https://github.com/WebAudio/web-audio-api/issues/128

Does setting .value during scheduled events cancels events afterwards?

**ramp interruption with manual value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/3/

(mac and windows) Firefox and Safari: value change gets ignored during ramp
(mac and windows) Chrome: value will change and ramp will be recalculated

**scheduled value change interruption with manual value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/4/

(mac and windows) Firefox and Safari: value change gets ignored
(mac and windows) Chrome: value will change and scheduled change will happen too

**ramp interruption with scheduled value change demo** - https://jsfiddle.net/lmeszaros/34yqz9nj/5/

(mac and windows) Firefox and Safari: value will change and ramp will be recalculated
(mac and windows) Chrome: result is same as when calling .value in the middle of a ramp

**having 2 ramps, where the 1st gets interrupted with a manual value change** - https://jsfiddle.net/lmeszaros/34yqz9nj/7/

(mac and windows) Firefox and Safari: interrupting a ramp with manual value change will not affect future ramps
(mac and windows) Chrome: only the 1st ramp will be interrupted, it does not affect future ramps

_Since this polyfill targets non-chrome browsers, I think it's safe to implement how Firefox behaves._

## Testing how ramps work when value is not set through scheduling

https://github.com/WebAudio/web-audio-api/issues/341

> Schedules a linear continuous change in parameter value from the previous scheduled parameter value to the given value

> If there is no previous event (and keep in mind that setting the value directly is not an event),
> then we can't interpolate, so we return the previous value.

**initializing a ramp without a set event** - https://jsfiddle.net/lmeszaros/ra60yvgh/13/

(mac and windows) Firefox and Safari: ramping is ignored, target value is immediately set, acts like setValueAtTime
(mac and windows) Chrome: ramp works correctly, goes from 0 to 1

**initializing 2 ramps without a set event** - https://jsfiddle.net/lmeszaros/ra60yvgh/16/

(mac and windows) Firefox and Safari: 1st ramping is ignored, second ramp works fine
(mac and windows) Chrome: both ramps work correctly

## Combining the above 2

**setting value after successful ramping** - https://jsfiddle.net/lmeszaros/bqnrfaL2/6/

(mac and windows) Firefox and Safari: first ramp works correctly, set .value after it is ignored, second ramp is okay
(mac and windows) Chrome: first ramp is okay, second ramp starts, then .value is set and ramp recalculates

**setting value after failed ramping** - https://jsfiddle.net/lmeszaros/bqnrfaL2/9/

(mac and windows) Firefox and Safari: first .value set is okay, ramp fails and sets value at it's end, then second .value setting is ignored, ramp works correctly
(mac and windows) Chrome: every ramp works correctly, setting .value acts as setValueAtTime()

### Moving back in time during ramp

**starting a ramp, than move back by 0.9 seconds** - https://jsfiddle.net/lmeszaros/34yqz9nj/39/

(mac) Firefox and Safari: value gets changed to 3 at invocationTime and ramp recalculates from that point
(mac) Chrome: value gets changed to 3 at invocationTime and ramp recalculates from that point
(windows) Firefox and Chrome: value doesn't change, ramp goes on unchanged

**starting a ramp, than move back by 1 seconds** - https://jsfiddle.net/lmeszaros/34yqz9nj/40/

(mac) Firefox and Safari: value doesn't change, ramp goes on unchanged
(mac) Chrome: value doesn't change, ramp goes on unchanged
(windows) Firefox and Chrome: value doesn't change, ramp goes on unchanged

_The conclusion is that setting a time value less, than ctx.currentTime will not always get clamped to ctx.currentTime_
_The clamping only happens for setTargetAtTime's and setValueCurveAtTime's startTime attribute_

https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueCurveAtTime

> A double representing the time (in seconds) after the AudioContext was first created that the change in value will
> happen. If this value is lower than AudioContext.currentTime, it is clamped to currentTime.

**Found the reason:**

`setTimeout(() => { console.log(ctx.currentTime - 1) } , 1000)`

The console.log will reveal, that less, than 1000 milliseconds have passed and ctx.currentTime - 1 will be less, than 0.
This is an issue of setTimeout, not the webaudio api.

## changing value back in time

**cancelling scheduled values, then set value before it** - https://jsfiddle.net/lmeszaros/491dxvqL/4/

firefox and chrome works the same: volume starts at 0, then at 1 (invocationTime) the volume changes to 0.5

**cancelling scheduled values, then set value after it** - https://jsfiddle.net/lmeszaros/491dxvqL/5/

firefox and chrome works the same: volume starts at 0, then at 1.5 (invocationTime - 0.5) the volume changes to 0.5

### Conclusion

targetTime in setValueAtTime(targetTime) clamps to invokation time, when targetTime < invocationTime
if there are ramps going at that time, then they will recalculate from the set value at invocationTime, it will not try to interpolate where should the ramp be

## immediate overriding

**setting value to 0.5 and 0 in the same time in the past** - https://jsfiddle.net/lmeszaros/49n6sva5/4/
**setting value to 0 and 0.5 in the same time in the past** - https://jsfiddle.net/lmeszaros/49n6sva5/5/
**setting value to 0.5 and 0 in the same time in the future** - https://jsfiddle.net/lmeszaros/49n6sva5/7/
**setting value to 0 and 0.5 in the same time in the future** - https://jsfiddle.net/lmeszaros/49n6sva5/6/

the same happens in all browsers: the later setValueAtTime overrides the prior ones

## cancelling scheduled values, then setting new ones

**cancelling scheduled values, then setting new ones** - https://jsfiddle.net/lmeszaros/491dxvqL/12/

firefox and chrome behaves the same: volume setting to 1 will be cancelled, but setting to 0.5 will work
