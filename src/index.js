/* global AudioParam */

import { scheduleChange, gotChangesScheduled, getValueAtTime, truncateScheduledChangesAfterTime } from './helpers'

if (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined') {
  // TODO: listen to minValue, maxValue, value and defaultValue
  // TODO: need to be able to get current value, but it doesn't work in FF

  const setValueAtTime = AudioParam.prototype.setValueAtTime
  AudioParam.prototype.setValueAtTime = function (value, startTime) {
    scheduleChange(this, 'setValueAtTime', [value, startTime], startTime)
    setValueAtTime.call(this, value, startTime)
  }

  const linearRampToValueAtTime = AudioParam.prototype.linearRampToValueAtTime
  AudioParam.prototype.linearRampToValueAtTime = function (value, endTime) {
    scheduleChange(this, 'linearRampToValueAtTime', [value, endTime], endTime)
    linearRampToValueAtTime.call(this, value, endTime)
  }

  const exponentialRampToValueAtTime = AudioParam.prototype.exponentialRampToValueAtTime
  AudioParam.prototype.exponentialRampToValueAtTime = function (value, endTime) {
    scheduleChange(this, 'exponentialRampToValueAtTime', [value, endTime], endTime)
    exponentialRampToValueAtTime.call(this, value, endTime)
  }

  const setTargetAtTime = AudioParam.prototype.setTargetAtTime
  AudioParam.prototype.setTargetAtTime = function (target, startTime, timeConstant) {
    scheduleChange(this, 'setTargetAtTime', [target, startTime, timeConstant], startTime)
    setTargetAtTime.call(this, target, startTime, timeConstant)
  }

  const setValueCurveAtTime = AudioParam.prototype.setValueCurveAtTime
  AudioParam.prototype.setValueCurveAtTime = function (values, startTime, duration) {
    scheduleChange(this, 'setValueCurveAtTime', [values, startTime, duration], startTime)
    setValueCurveAtTime.call(this, values, startTime, duration)
  }

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    if (gotChangesScheduled(this)) {
      const valueAtCancelTime = getValueAtTime(this, cancelTime)
      truncateScheduledChangesAfterTime(this, cancelTime)

      this.cancelScheduledValues(cancelTime)
      this.setValueAtTime(valueAtCancelTime, cancelTime)
    }
  }
}
