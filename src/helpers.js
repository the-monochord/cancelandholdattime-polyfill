/* global BaseAudioContext, AudioParam */

import { reject, equals, isEmpty, propOr, compose, not } from 'ramda'

const scheduleChange = (self, method, params, validUntil) => {
  if (!self._scheduledChanges) {
    self._scheduledChanges = []
  }
  const entry = { method, params }
  const invalidator = setTimeout(() => {
    self._scheduledChanges = reject(equals(entry), self._scheduledChanges)
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
  const originalFn = BaseAudioContext.prototype[creatorName]
  BaseAudioContext.prototype[creatorName] = function (...args) {
    const node = originalFn.apply(this, args)
    params.forEach(param => {
      node[param]._ctx = this
    })
    return node
  }
}

const bindSchedulerToParamMethod = (methodName, timeArgIndex) => {
  const originalFn = AudioParam.prototype[methodName]
  AudioParam.prototype[methodName] = function (...args) {
    scheduleChange(this, methodName, args, args[timeArgIndex])
    originalFn.apply(this, args)
  }
}

const bindSchedulerToParamProperty = (propertyName) => {
  const valueDescriptor = Object.getOwnPropertyDescriptor(AudioParam.prototype, propertyName)

  // TODO

  Object.defineProperty(AudioParam.prototype, propertyName, valueDescriptor)
}

export {
  scheduleChange,
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime,
  bindContextToParams,
  bindSchedulerToParamMethod,
  bindSchedulerToParamProperty
}
