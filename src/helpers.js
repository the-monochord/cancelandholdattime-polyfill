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

const bindContextToParams = (functionName, params) => {
  const originalFn = BaseAudioContext.prototype[functionName]
  BaseAudioContext.prototype[functionName] = function (...args) {
    const node = originalFn.apply(this, args)
    params.forEach(param => {
      node[param]._ctx = this
    })
    return node
  }
}

const bindSchedulerToParam = (functionName, timeArgIndex) => {
  const originalFn = AudioParam.prototype[functionName]
  AudioParam.prototype[functionName] = function (...args) {
    scheduleChange(this, functionName, args, args[timeArgIndex])
    originalFn.apply(this, args)
  }
}

export {
  scheduleChange,
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime,
  bindContextToParams,
  bindSchedulerToParam
}
