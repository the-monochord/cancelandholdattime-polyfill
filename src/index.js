/* global AudioParam */

import { isNil } from 'ramda'
import {
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  hijackParamValueSetter
} from './helpers'

if (!isNil(window.AudioParam) && isNil(AudioParam.prototype.cancelAndHoldAtTime)) {
  // bind all the create* functions, which create objects with at least 1 AudioParam among their properties:
  bindContextToParams('createBiquadFilter', ['frequency', 'detune', 'Q', 'gain'])
  bindContextToParams('createBufferSource', ['detune', 'playbackRate'])
  bindContextToParams('createConstantSource', ['offset'])
  bindContextToParams('createDelay', ['delayTime'])
  bindContextToParams('createDynamicsCompressor', ['threshold', 'knee', 'ratio', 'attack', 'release'])
  bindContextToParams('createGain', ['gain'])
  bindContextToParams('createOscillator', ['frequency', 'detune'])
  bindContextToParams('createPanner', ['orientationX', 'orientationY', 'orientationZ', 'positionX', 'positionY', 'positionZ'])
  bindContextToParams('createStereoPanner', ['pan'])

  // hijack param methods and mark which argument has the time
  bindSchedulerToParamMethod('cancelScheduledValues', 0)
  bindSchedulerToParamMethod('setValueAtTime', 1)
  bindSchedulerToParamMethod('linearRampToValueAtTime', 1)
  bindSchedulerToParamMethod('exponentialRampToValueAtTime', 1)

  // TODO: I don't know how the functions below work, I need to research them in order to implement them
  // bindSchedulerToParamMethod('setTargetAtTime', 1)
  // bindSchedulerToParamMethod('setValueCurveAtTime', 1)

  hijackParamValueSetter()

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    const audioParam = this
    if (gotChangesScheduled(audioParam)) {
      const valueAtCancelTime = getValueAtTime(audioParam, cancelTime)
      truncateScheduledChangesAfterTime(audioParam, cancelTime)

      audioParam.cancelScheduledValues(cancelTime)
      audioParam.setValueAtTime(valueAtCancelTime, cancelTime)
    }
  }
}
