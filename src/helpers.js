/* global BaseAudioContext, AudioContext, webkitAudioContext, AudioParam */

import { isEmpty, prop, compose, not, clamp, isNil, reject } from 'ramda'

const AudioContextClass = isNil(window.BaseAudioContext) ? (isNil(window.AudioContext) ? webkitAudioContext : AudioContext) : BaseAudioContext

const removeOutdatedSchedulements = audioParam => {
  audioParam._scheduledChanges = reject(entry => entry.targetTime < audioParam._ctx.currentTime, audioParam._scheduledChanges)
  return audioParam
}

const scheduleChange = (audioParam, method, params, targetTime) => {
  // TODO: if we already have an entry scheduled for the marked time, then override it with this entry
  // TODO: if we get a cancelScheduledValues method, then remove subsequent entries
  const entry = { method, params, targetTime }
  audioParam._scheduledChanges.push(entry)
  removeOutdatedSchedulements(audioParam)
}

// gotChangesScheduled :: audioParam -> bool
const gotChangesScheduled = compose(
  not,
  isEmpty,
  prop('_scheduledChanges')
)

const getValueAtTime = (audioParam, time) => {
  if (gotChangesScheduled(audioParam)) {
    // TODO: evaulate internally stored scheduled values until time based on current value
    return 0
  } else {
    return audioParam._value
  }
}

// The AudioContext, on which the createX function was called is not accessible from the created AudioNode's params.
// This will bind the AudioContext to the AudioParam's _ctx property.
//
// Example:
//   const osc = ctx.createOscillator()
//   console.log(osc.frequency._ctx === ctx) // true
const bindContextToParams = (creatorName, params) => {
  const originalFn = AudioContextClass.prototype[creatorName]
  if (!isNil(originalFn)) {
    AudioContextClass.prototype[creatorName] = function (...args) {
      const ctx = this
      const node = originalFn.apply(ctx, args)
      params.forEach(param => {
        const audioParam = node[param]
        audioParam._ctx = ctx
        audioParam._value = audioParam.value
        audioParam._scheduledChanges = []
      })
      return node
    }
  }
}

const bindSchedulerToParamMethod = (methodName, timeArgIndex) => {
  const originalFn = AudioParam.prototype[methodName]
  if (!isNil(originalFn)) {
    AudioParam.prototype[methodName] = function (...args) {
      const audioParam = this
      scheduleChange(audioParam, methodName, args, args[timeArgIndex])
      originalFn.apply(audioParam, args)
      return audioParam
    }
  }
}

// older Firefox versions always return the defaultValue when reading the value from an AudioParam
// the correct current value can be read from audioParam._value
const hijackParamValueSetter = () => {
  const descriptor = Object.getOwnPropertyDescriptor(AudioParam.prototype, 'value')
  const originalSetter = descriptor.set
  descriptor.set = function (newValue) {
    const audioParam = this
    // value change gets ignored in Firefox and Safari, if there are changes scheduled
    if (!gotChangesScheduled(audioParam)) {
      audioParam._value = clamp(audioParam.minValue, audioParam.maxValue, newValue)
      originalSetter.call(audioParam, newValue)
    }
  }
  Object.defineProperty(AudioParam.prototype, 'value', descriptor)
}

export {
  removeOutdatedSchedulements,
  scheduleChange,
  gotChangesScheduled,
  getValueAtTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  hijackParamValueSetter
}
