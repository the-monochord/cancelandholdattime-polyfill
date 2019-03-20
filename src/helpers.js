/* global BaseAudioContext, AudioContext, webkitAudioContext, AudioParam */

import { isEmpty, propOr, compose, not, clamp, without, isNil } from 'ramda'

const AudioContextClass = isNil(window.BaseAudioContext) ? (isNil(window.AudioContext) ? webkitAudioContext : AudioContext) : BaseAudioContext

const scheduleChange = (self, method, params, validUntil) => {
  if (!self._scheduledChanges) {
    self._scheduledChanges = []
  }
  const entry = { method, params }
  const invalidator = setTimeout(() => {
    self._scheduledChanges = without([entry], self._scheduledChanges)
  }, validUntil - self._ctx.currentTime)
  entry.invalidator = invalidator
  self._scheduledChanges.push(entry)
}

const gotChangesScheduled = compose(
  not,
  isEmpty,
  propOr([], '_scheduledChanges')
)

const getValueAtTime = (self, time) => {
  // TODO: evaulate internally stored scheduled values until time based on current value
  return 0
}

const truncateScheduledChangesAfterTime = (self, time) => {
  // TODO: call clearTimeout(invalidator) for every entry, which is after cancelTime
  // TODO: what should happen, if cancelTime intersects with one or more scheduled entries?
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
        node[param]._ctx = ctx
        node[param]._value = node[param].value
      })
      return node
    }
  }
}

const bindSchedulerToParamMethod = (methodName, timeArgIndex) => {
  const originalFn = AudioParam.prototype[methodName]
  AudioParam.prototype[methodName] = function (...args) {
    const audioParam = this
    scheduleChange(audioParam, methodName, args, args[timeArgIndex])
    originalFn.apply(audioParam, args)
    return audioParam
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
  scheduleChange,
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  hijackParamValueSetter
}
