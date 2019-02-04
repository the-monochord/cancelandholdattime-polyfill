import { reject, equals, isEmpty, propOr, compose, not } from 'ramda'

const scheduleChange = (self, method, params, validUntil) => {
  if (!self._scheduledChanges) {
    self._scheduledChanges = []
  }
  const entry = { method, params }
  const invalidator = setTimeout(() => {
    self._scheduledChanges = reject(equals(entry), self._scheduledChanges)
  }, validUntil - self.context.currentTime)
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

export {
  scheduleChange,
  gotChangesScheduled,
  getValueAtTime,
  truncateScheduledChangesAfterTime
}
