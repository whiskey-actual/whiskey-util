// external imports
import { LogEngine } from 'whiskey-log'


export class Utilities {

    public static minimumJsonDate:Date = new Date(-8640000000000000);

    public static formatDuration(startTime:Date, endTime:Date) {

      let output = "";

      try {

        let totalTimeInMilliseconds:number=endTime.getTime()-startTime.getTime()

        const elapsedTimeInHours:number = Math.trunc(totalTimeInMilliseconds/1000/60/60);
        totalTimeInMilliseconds -= elapsedTimeInHours*60*60*1000;

        const elapsedTimeInMinutes:number = Math.trunc(totalTimeInMilliseconds/1000/60);
        totalTimeInMilliseconds -= elapsedTimeInMinutes*60*1000;

        const elapsedTimeInSeconds:number = Math.trunc(totalTimeInMilliseconds/1000);
        totalTimeInMilliseconds -= elapsedTimeInSeconds*1000;

        if (elapsedTimeInHours>0) {
          output += `${elapsedTimeInHours}h`
        }
        if(elapsedTimeInHours>0 || elapsedTimeInMinutes>0) {
          output += `${elapsedTimeInMinutes}m`
        }

        // always display seconds
        output += `${elapsedTimeInSeconds}s`

      }
      catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }

      return output;

    }

    public static getProcessingRatePerSecond(countOfItemsCompleted:number = 0, timeStart:Date=new Date(), timeEnd:Date=new Date()):number {

      let output:number = 0

      const elapsedTimeInSeconds:number = (timeEnd.getTime() - timeStart.getTime())/1000;

      try {
        if(countOfItemsCompleted>0 && elapsedTimeInSeconds>0) {
          const processingRatePerSecond:number = countOfItemsCompleted/elapsedTimeInSeconds;
          output = Math.round(processingRatePerSecond);
        }
      }
      catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }

      return output

    }

    public static getProgressMessage(prefix:string='', action:string='', itemsComplete:number=0, itemsTotal:number=0, timeStart:Date=new Date(), timeEnd:Date=new Date()) {

      let output:string = "";

      try {

        if(prefix.length>0) {
          output += prefix + ": "
        }

        if(itemsTotal>0) {
          let ratePerSecond:number = Utilities.getProcessingRatePerSecond(itemsComplete, timeStart, timeEnd)
          const duration = Utilities.formatDuration(timeStart, timeEnd);
          output += `.. ${action} ${itemsComplete} in ${duration} @ ${ratePerSecond}/s`

          const itemsRemaining:number = itemsTotal-itemsComplete;
          if(itemsRemaining>0) {
            const secondsRemaining:number = itemsRemaining/ratePerSecond;
            const eta:Date = new Date(new Date().getTime() + (secondsRemaining*1000))
            output += ` (${itemsRemaining} left; ETA ~${Utilities.formatDuration(new Date(), eta)})`
          }
          else {
            output += ` .. ${action} no records to process`
          }
        }
      }
      catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }

      return output;

    }

    public static CleanedString(objectToClean:any):string|undefined {
      let output:string|undefined=''
      try {
        if(objectToClean) {
          output = objectToClean.toString().trim()
          if(output==='') {
            output = undefined
          } else {
            output = undefined
          }
        }
      } catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }
      return output
    }     

    public static CleanedDate(objectToClean:any):Date|undefined {
      let output:Date|undefined=undefined

      try {

        if(objectToClean) {
          let dateObject:Date = new Date(objectToClean)
          if(dateObject instanceof Date && !isNaN(dateObject.valueOf())) { output = dateObject }
        }
      } catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }

      return output

    }

    public static textToBoolean(stringToAssess:string, yesString:string) {
      let output:boolean=false

      if(stringToAssess.trim()===yesString.trim()) { output=true}

      return output
    }

    public static async executePromisesWithProgress(logStack:string[], promises:Promise<any>[], logFrequency:number=1000) {
      const timeStart:Date = new Date()
      let d:number=0
      const le = new LogEngine(logStack)

      const progressCallback = (p:number)=>{
        if(p>0 && p%logFrequency===0) {
            le.AddLogEntry(LogEngine.Severity.Ok, this.getProgressMessage('', 'performed', p, promises.length, timeStart, new Date()));
        }
      }
      
      progressCallback(0);

      for(const promise of promises) {
          await promise
          .then(() => {
              d++;
              progressCallback(d)
          })
          .catch((err: any) => {
            throw(`${arguments.callee.toString()}: ${err}`)
          })
          
          
      }
      await Promise.all(promises);

      le.AddLogEntry(LogEngine.Severity.Ok, `.. complete; performed ${promises.length} operations in ${this.formatDuration(timeStart, new Date())}`);

      return;
    }

    public static getMaxDateFromObject(jsonObject:any, keysToConsider:string[]):Date {

      let output:Date = Utilities.minimumJsonDate;

      try {

        let dates:Date[] = []
  
        for(let i=0; i<keysToConsider.length; i++) {
          if(Object.keys(jsonObject).includes(keysToConsider[i])) {
            dates.push(new Date(jsonObject[keysToConsider[i]]));
          }
        }
    
        for(let i=0;i<dates.length; i++) {
          if(dates[i]>output) { output=dates[i] }
        }

      } 
      catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }
  
      return output
  
    }

    public static pruneJsonObject(logStack:string[], jsonObject:any, keyToPrune:string[], valueToKeep:any, showDebug:boolean=false):any {

      try {

        const le = new LogEngine(logStack)

        for(let i=0; i<keyToPrune.length; i++) {
          if(Object.keys(jsonObject).includes(keyToPrune[i]) && (jsonObject[keyToPrune[i]]!=valueToKeep || jsonObject[keyToPrune[i]]===undefined)) {
            if(showDebug) { le.AddLogEntry(LogEngine.Severity.Debug, `${jsonObject.deviceName} :: pruning key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`) }
            delete jsonObject[keyToPrune[i]]
          }
          else {
            if(showDebug) { le.AddLogEntry(LogEngine.Severity.Debug, `${jsonObject.deviceName} :: keeping key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`) }
          }
        }
        return jsonObject
        
      } catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }
    }

    public static ldapTimestampToJS(timestamp:string):Date {
      return new Date(parseInt(timestamp) / 1e4 - 1.16444736e13)
    }

}

