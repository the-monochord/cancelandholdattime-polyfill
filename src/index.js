/* global AudioParam */

if (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined') {
  // TODO: need to be able to get current value, but it doesn't work in FF
  // TODO: how to clean up invalid scheduled data without having a setTimeout() for every entry?

  const setValueAtTime = AudioParam.prototype.setValueAtTime
  AudioParam.prototype.setValueAtTime = function (value, startTime) {
    // TODO: save scheduling to an internal storage
    setValueAtTime.call(this, value, startTime)
  }

  const linearRampToValueAtTime = AudioParam.prototype.linearRampToValueAtTime
  AudioParam.prototype.linearRampToValueAtTime = function (value, endTime) {
    // TODO: save scheduling to an internal storage
    linearRampToValueAtTime.call(this, value, endTime)
  }

  const exponentialRampToValueAtTime = AudioParam.prototype.exponentialRampToValueAtTime
  AudioParam.prototype.exponentialRampToValueAtTime = function (value, endTime) {
    // TODO: save scheduling to an internal storage
    exponentialRampToValueAtTime.call(this, value, endTime)
  }

  const setTargetAtTime = AudioParam.prototype.setTargetAtTime
  AudioParam.prototype.setTargetAtTime = function (target, startTime, timeConstant) {
    // TODO: save scheduling to an internal storage
    setTargetAtTime(target, startTime, timeConstant)
  }

  const setValueCurveAtTime = AudioParam.prototype.setValueCurveAtTime
  AudioParam.prototype.setValueCurveAtTime = function (values, startTime, duration) {
    // TODO: save scheduling to an internal storage
    setValueCurveAtTime(values, startTime, duration)
  }

  AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
    // TODO: evaulate internally stored scheduled values until cancelTime
    const valueAtCancelTime = 0

    this.cancelScheduledValues(cancelTime)
    this.setValueAtTime(valueAtCancelTime, cancelTime)
  }
}
