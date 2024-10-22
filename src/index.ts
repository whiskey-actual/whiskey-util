import { executePromisesWithProgress } from './progress/executePromisesWithProgress';
// dates
import { formatDuration } from './progress/formatDuration';
import { getMaxDateFromObject } from './dates/getMaxDateFromObject';
import getMaxDateFromArray from './dates/getMaxDateFromArray';
import { ldapTimestampToJS } from './dates/ldapTimestampToJS';
// input sanitization
import { CleanedString } from './strings/CleanedString';
import { CleanedDate } from './dates/CleanedDate';
import { textToBoolean } from './strings/textToBoolean';
import { pruneJsonObject } from './pruneJsonObject'
// output
import { getProcessingRatePerSecond } from './progress/getProcessingRatePerSecond';
import { getProgressMessage } from './progress/getProgressMessage';
import { doesRegexMatch } from './strings/doesRegexMatch';
import { getAlphaArray } from './strings/AlphaArray';
import isInvalidDate from './dates/isInvalidDate';

export = {

  // dates
  CleanedDate,
  getMaxDateFromArray,
  getMaxDateFromObject,
  isInvalidDate,
  ldapTimestampToJS,

  // strings
  CleanedString,
  textToBoolean,
  doesRegexMatch,
  getAlphaArray,

  // progress
  formatDuration,
  getProcessingRatePerSecond,
  getProgressMessage,
  executePromisesWithProgress,
  
  // etc
  pruneJsonObject,
  
  
}