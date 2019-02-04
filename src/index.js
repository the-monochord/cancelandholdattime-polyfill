/* global AudioParam */

import { gotChangesScheduled, getValueAtTime, truncateScheduledChangesAfterTime, bindContextToParams, bindSchedulerToParam } from './helpers'

if (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined') {
  // TODO: listen to minValue, maxValue, value and defaultValue
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

  bindSchedulerToParam('setValueAtTime', 1)
  bindSchedulerToParam('linearRampToValueAtTime', 1)
  bindSchedulerToParam('exponentialRampToValueAtTime', 1)
  // bindSchedulerToParam('setTargetAtTime', 1)
  // bindSchedulerToParam('setValueCurveAtTime', 1)

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    if (gotChangesScheduled(this)) {
      const valueAtCancelTime = getValueAtTime(this, cancelTime)
      truncateScheduledChangesAfterTime(this, cancelTime)

      this.cancelScheduledValues(cancelTime)
      this.setValueAtTime(valueAtCancelTime, cancelTime)
    }
  }
}
