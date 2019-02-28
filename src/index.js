/* global AudioParam */

import {
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  bindSchedulerToParamProperty
} from './helpers'

if (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined') {
  // TODO: need to be able to get current value, but it doesn't work in FF

  bindContextToParams('createBiquadFilter', ['frequency', 'detune', 'Q', 'gain'])
  bindContextToParams('createBufferSource', ['detune', 'playbackRate'])
  bindContextToParams('createConstantSource', ['offset'])
  bindContextToParams('createDelay', ['delayTime'])
  bindContextToParams('createDynamicsCompressor', ['threshold', 'knee', 'ratio', 'attack', 'release'])
  bindContextToParams('createGain', ['gain'])
  bindContextToParams('createOscillator', ['frequency', 'detune'])
  bindContextToParams('createPanner', ['orientationX', 'orientationY', 'orientationZ', 'positionX', 'positionY', 'positionZ'])
  bindContextToParams('createStereoPanner', ['pan'])

  bindSchedulerToParamMethod('setValueAtTime', 1)
  bindSchedulerToParamMethod('linearRampToValueAtTime', 1)
  bindSchedulerToParamMethod('exponentialRampToValueAtTime', 1)

  // TODO: I don't know how the functions below work, I need to research them in order to implement them
  // bindSchedulerToParamMethod('setTargetAtTime', 1)
  // bindSchedulerToParamMethod('setValueCurveAtTime', 1)

  bindSchedulerToParamProperty('minValue')
  bindSchedulerToParamProperty('maxValue')
  bindSchedulerToParamProperty('defaultValue')
  bindSchedulerToParamProperty('value')

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    if (gotChangesScheduled(this)) {
      const valueAtCancelTime = getValueAtTime(this, cancelTime)
      truncateScheduledChangesAfterTime(this, cancelTime)

      this.cancelScheduledValues(cancelTime)
      this.setValueAtTime(valueAtCancelTime, cancelTime)
    }
  }
}
