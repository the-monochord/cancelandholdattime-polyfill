# cancelandholdattime-polyfill

Polyfill for AudioParam.prototype.cancelAndHoldAtTime()

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PXF8ZVL3KPQWE)
[![Build Status](https://travis-ci.org/the-monochord/cancelandholdattime-polyfill.svg?branch=master)](https://travis-ci.org/the-monochord/cancelandholdattime-polyfill)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## What is this project

[AudioParam.prototype.cancelAndHoldAtTime()](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelAndHoldAtTime) is an experimental function in the Web Audio API and only supported by Chrome based browsers.

## Installation

### Method 1 - add the built version to your code

Download and add `https://github.com/the-monochord/cancelandholdattime-polyfill/blob/master/dist/cancelandholdattime-polyfill.min.js` to your js files, then add it to your html page before other webaudio scripts with a script tag.

### Method 2 - ES6 import in a nodejs project

Add the polyfill to your nodejs project by running `npm i cancelandholdattime-polyfill`.

Then import it in your main script:

```javascript
import 'cancelandholdattime-polyfill'

// ... other imports
```

### Method 3 - add it to your project in build time with webpack

Add the polyfill to your nodejs project by running  `npm i cancelandholdattime-polyfill`.

Then add it to the webpack config before other files in the entry point:

```javascript
// webpack.config.js
const config = {
  entry: {
    'youroutput': [
      'cancelandholdattime-polyfill/dist/cancelandholdattime-polyfill.min.js',
      './src/index.js'
    ]
  },
  // ...
}
```

## Resources

* https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelAndHoldAtTime
* https://webaudio.github.io/web-audio-api/#AudioParam-methods
