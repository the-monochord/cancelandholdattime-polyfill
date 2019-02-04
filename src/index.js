/* global AudioParam */

import { reject, equals, isEmpty, propOr } from 'ramda'

if (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined') {
  const addScheduledChange = (self, method, params, validUntil) => {
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

  // TODO: listen to minValue, maxValue, value and defaultValue
  // TODO: need to be able to get current value, but it doesn't work in FF

  const setValueAtTime = AudioParam.prototype.setValueAtTime
  AudioParam.prototype.setValueAtTime = function (value, startTime) {
    addScheduledChange(this, 'setValueAtTime', [value, startTime], startTime)
    setValueAtTime.call(this, value, startTime)
  }

  const linearRampToValueAtTime = AudioParam.prototype.linearRampToValueAtTime
  AudioParam.prototype.linearRampToValueAtTime = function (value, endTime) {
    addScheduledChange(this, 'linearRampToValueAtTime', [value, endTime], endTime)
    linearRampToValueAtTime.call(this, value, endTime)
  }

  const exponentialRampToValueAtTime = AudioParam.prototype.exponentialRampToValueAtTime
  AudioParam.prototype.exponentialRampToValueAtTime = function (value, endTime) {
    addScheduledChange(this, 'exponentialRampToValueAtTime', [value, endTime], endTime)
    exponentialRampToValueAtTime.call(this, value, endTime)
  }

  const setTargetAtTime = AudioParam.prototype.setTargetAtTime
  AudioParam.prototype.setTargetAtTime = function (target, startTime, timeConstant) {
    addScheduledChange(this, 'setTargetAtTime', [target, startTime, timeConstant], startTime)
    setTargetAtTime.call(this, target, startTime, timeConstant)
  }

  const setValueCurveAtTime = AudioParam.prototype.setValueCurveAtTime
  AudioParam.prototype.setValueCurveAtTime = function (values, startTime, duration) {
    addScheduledChange(this, 'setValueCurveAtTime', [values, startTime, duration], startTime)
    setValueCurveAtTime.call(this, values, startTime, duration)
  }

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    if (!isEmpty(propOr([], '_scheduledChanges', this))) {
      // TODO: evaulate internally stored scheduled values until cancelTime
      const valueAtCancelTime = 0

      this.cancelScheduledValues(cancelTime)
      this.setValueAtTime(valueAtCancelTime, cancelTime)
    }
  }
}
