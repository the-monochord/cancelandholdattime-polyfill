/* global AudioParam */

import 'audioparam-getvalueattime'
import { isNil, isEmpty, complement } from 'ramda'

const isNotEmpty = complement(isEmpty)

if (!isNil(window.AudioParam) && isNil(AudioParam.prototype.cancelAndHoldAtTime)) {
  if (isNil(AudioParam.prototype.cancelValuesAndHoldAtTime)) {
    AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
      const audioParam = this
      if (isNotEmpty(audioParam._scheduledChanges)) {
        const valueAtCancelTime = audioParam.getValueAtTime(cancelTime)

        audioParam.cancelScheduledValues(cancelTime)
        audioParam.setValueAtTime(valueAtCancelTime, cancelTime)
      }
    }
  } else {
    // Targeting Chrome <57
    AudioParam.prototype.cancelAndHoldAtTime = AudioParam.prototype.cancelValuesAndHoldAtTime
  }
}
