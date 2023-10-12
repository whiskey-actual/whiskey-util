import { getProcessingRatePerSecond } from "./getProcessingRatePerSecond";
import { formatDuration } from "./formatDuration";

export const getProgressMessage = function(prefix:string='', action:string='', itemsComplete:number=0, itemsTotal:number=0, timeStart:Date=new Date(), timeEnd:Date=new Date()) {

    let output:string = "";

    try {

      if(prefix.length>0) {
        output += prefix + ": "
      }

      if(itemsTotal>0) {
        let ratePerSecond:number = getProcessingRatePerSecond(itemsComplete, timeStart, timeEnd)
        const duration = formatDuration(timeStart, timeEnd);
        output += `.. ${action} ${itemsComplete} in ${duration} @ ${ratePerSecond}/s`

        const itemsRemaining:number = itemsTotal-itemsComplete;
        if(itemsRemaining>0) {
          const secondsRemaining:number = itemsRemaining/ratePerSecond;
          const eta:Date = new Date(new Date().getTime() + (secondsRemaining*1000))
          output += ` (${itemsRemaining} left; ETA ~${formatDuration(new Date(), eta)})`
        } else {
          output += `.. done.`
        }
      } else {
        output += ` .. ${action} no records to process`
      }
    }
    catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }

    return output;

  }