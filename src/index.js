/* global AudioParam */

import { isNil } from 'ramda'
import {
  gotChangesScheduled,
  getValueAtTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  hijackParamValueSetter
} from './helpers'

if (!isNil(window.AudioParam) && isNil(AudioParam.prototype.cancelAndHoldAtTime)) {
  if (isNil(AudioParam.prototype.cancelValuesAndHoldAtTime)) {
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

    // bindSchedulerToParamMethod('setTargetAtTime', ??) // timeArg = ??
    // bindSchedulerToParamMethod('setValueCurveAtTime', ??) // timeArg = [1] + [2]

    hijackParamValueSetter()

    AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
      const audioParam = this
      if (gotChangesScheduled(audioParam)) {
        const valueAtCancelTime = getValueAtTime(audioParam, cancelTime)

        audioParam.cancelScheduledValues(cancelTime)
        audioParam.setValueAtTime(valueAtCancelTime, cancelTime)
      }
    }
  } else {
    // Targeting Chrome <57
    AudioParam.prototype.cancelAndHoldAtTime = AudioParam.prototype.cancelValuesAndHoldAtTime
  }
}
