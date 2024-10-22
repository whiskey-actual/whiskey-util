import { executePromisesWithProgress } from './executePromisesWithProgress';
// dates
import { formatDuration } from './formatDuration';
import { getMaxDateFromObject } from './dates/getMaxDateFromObject';
import getMaxDateFromArray from './dates/getMaxDateFromArray';
import { ldapTimestampToJS } from './dates/ldapTimestampToJS';
// input sanitization
import { CleanedString } from './CleanedString';
import { CleanedDate } from './dates/CleanedDate';
import { textToBoolean } from './textToBoolean';
import { pruneJsonObject } from './pruneJsonObject'
// output
import { getProcessingRatePerSecond } from './getProcessingRatePerSecond';
import { getProgressMessage } from './getProgressMessage';
import { doesRegexMatch } from './doesRegexMatch';
import { getAlphaArray } from './AlphaArray';

export = {
  getMaxDateFromArray,
  formatDuration,
  getProcessingRatePerSecond,
  getProgressMessage,
  CleanedString,
  CleanedDate,
  executePromisesWithProgress,
  textToBoolean,
  getMaxDateFromObject,
  pruneJsonObject,
  ldapTimestampToJS,
  doesRegexMatch,
  getAlphaArray
}