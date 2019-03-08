# cancelandholdattime-polyfill

Polyfill for AudioParam.prototype.cancelAndHoldAtTime()

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PXF8ZVL3KPQWE)
[![Build Status](https://travis-ci.org/the-monochord/cancelandholdattime-polyfill.svg?branch=master)](https://travis-ci.org/the-monochord/cancelandholdattime-polyfill)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## What is this project

[AudioParam.prototype.cancelAndHoldAtTime()](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelAndHoldAtTime) is an experimental function in the Web Audio API and only supported by Chrome based browsers.

## Task/TODOs:

* Add builder (rollup with babel)
* Add tests

## Resources

https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelAndHoldAtTime
https://github.com/WebAudio/web-audio-api/issues/341

### Testing the relationship between .value setter and schedulers

https://github.com/WebAudio/web-audio-api/issues/128

Does setting .value during scheduled events cancels events afterwards?

https://jsfiddle.net/lmeszaros/34yqz9nj/3/ - ramp interruption with manual value change demo

(mac) Firefox and Safari: value change gets ignored during ramp
(mac) Chrome: value will change and ramp will be recalculated

https://jsfiddle.net/lmeszaros/34yqz9nj/4/ - scheduled value change interruption with manual value change demo

(mac) Firefox and Safari: value change gets ignored
(mac) Chrome: value will change and scheduled change will happen too

https://jsfiddle.net/lmeszaros/34yqz9nj/5/ - ramp interruption with scheduled value change demo

(mac) Firefox and Safari: value will change and ramp will be recalculated
(mac) Chrome: result is same as when calling .value in the middle of a ramp

_Since this polyfill targets non-chrome browsers, I think it's safe to implement how Firefox behaves._
