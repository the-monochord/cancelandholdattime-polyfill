import { reject, equals, isEmpty, propOr, compose, not } from 'ramda'

const scheduleChange = (self, method, params, validUntil) => {
  if (!self._scheduledChanges) {
    self._scheduledChanges = []
  }
  const entry = { method, params }
  // TODO: how to clean up invalid scheduled data without having a setTimeout() for every entry?
  const invalidator = setTimeout(() => {
    self._scheduledChanges = reject(equals(entry), self._scheduledChanges)
  }, validUntil)
  entry.invalidator = invalidator
  self._scheduledChanges.push(entry)
}

const gotChangesScheduled = compose(
  not,
  isEmpty,
  propOr([], '_scheduledChanges')
)

export {
  scheduleChange,
  gotChangesScheduled
}
