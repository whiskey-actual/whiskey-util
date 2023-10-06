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

    public static CleanedString(objectToClean:any):string|undefined {
      let output:string|undefined=undefined
      try {
        if(objectToClean && objectToClean!==null && output!=='') {
          output = objectToClean.toString().trim()
        }
      } catch(err) {
        throw(`${arguments.callee.toString()} : [${objectToClean}] : ${err}`)
      }
      return output
    }     

    public static CleanedDate(objectToClean:any):Date|undefined {
      let output:Date|undefined=undefined

      try {

        if(objectToClean && objectToClean!==null) {
          let dateObject:Date = new Date(objectToClean)
          if(dateObject instanceof Date && !isNaN(dateObject.valueOf()) && dateObject>this.minimumJsonDate) { output = dateObject }
        }
      } catch(err) {
        throw(`${arguments.callee.toString()} : [${objectToClean}] : ${err}`)
      }

      return output

    }

    public static textToBoolean(stringToAssess:string, yesString:string) {
      let output:boolean=false

      if(stringToAssess.trim()===yesString.trim()) { output=true}

      return output
    }

    public static async executePromisesWithProgress(logEngine:LogEngine, promises:Promise<any>[], logFrequency:number=1000) {
      logEngine.logStack.push("executePromisesWithProgress")
      logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Note, `executing ${promises.length} commands ..`);
      try {

        const timeStart:Date = new Date()
        let d:number=0

        const progressCallback = (p:number)=>{
          if(p>0 && p%logFrequency===0) {
              logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Success, this.getProgressMessage('', 'performed', p, promises.length, timeStart, new Date()));
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

        logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Success, `.. complete; performed ${promises.length} operations in ${this.formatDuration(timeStart, new Date())}`);

      } catch(err) {
        logEngine.AddLogEntry(LogEngine.Severity.Error, LogEngine.Action.Note, `${err}`)
        throw(err)
      } finally {
        logEngine.logStack.pop()
      }
      
      

      return;
    }

    public static getMaxDateFromObject(jsonObject:any, keysToConsider:string[]):Date|undefined {

      let output:Date|undefined = Utilities.minimumJsonDate;

      try {
  
        for(let i=0; i<keysToConsider.length; i++) {
          if(Object.keys(jsonObject).includes(keysToConsider[i])) {
            const d = new Date(jsonObject[keysToConsider[i]]);
            console.debug(`${keysToConsider[i]}: ${d.toDateString}`)
            if(d>output) { output = d}
          }
        }

        if(output===this.minimumJsonDate) {
          output=undefined
        }

      } 
      catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }

      console.debug(`output: ${output?.toString}`)
  
      return output
  
    }

    public static pruneJsonObject(logEngine:LogEngine, jsonObject:any, keyToPrune:string[], valueToKeep:any):any {

      try {

        for(let i=0; i<keyToPrune.length; i++) {
          if(Object.keys(jsonObject).includes(keyToPrune[i]) && (jsonObject[keyToPrune[i]]!=valueToKeep || jsonObject[keyToPrune[i]]===undefined)) {
            logEngine.AddLogEntry(LogEngine.Severity.Debug, LogEngine.Action.Remove, `${jsonObject.deviceName} :: pruning key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`)
            delete jsonObject[keyToPrune[i]]
          }
          else {
            logEngine.AddLogEntry(LogEngine.Severity.Debug, LogEngine.Action.Success, `${jsonObject.deviceName} :: keeping key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`)
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

    public static doesRegexMatch(stringToAssess:string, regexStrings:string[]):boolean {

      let isMatch:boolean=true;

      for(let regex in regexStrings) {
        const re = new RegExp(regex)
        if(!re.test(stringToAssess)) { isMatch=false }
      }

      return isMatch

    }

}

