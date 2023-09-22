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

    public static padString(stringToPad:string, padCharacter:string=' ', width:number=16, padSide:Utilities.Direction=Direction.Right) {
      if (typeof stringToPad === 'undefined') {
        return padCharacter;
      }
      else if (stringToPad.length>width) {
        return stringToPad.substring(0,width-3) + '..'
      }
      else {

        const padString:string = Array(width-stringToPad.length).join(padCharacter).toString()

        if (padSide===Direction.Left) {
          return (padString + stringToPad)
        } else {
          return (stringToPad + padString)
        }
      }
    }

    public static getDateTimeString():string {

      let output:string = '';
    
      try {
        // parse the date/time ourselves, so we don't have any dependencies.
        const timestamp = new Date();
        const d = timestamp.getDate();
        const m = timestamp.getMonth() + 1;
        const y = timestamp.getFullYear();
        const date = `${y}-${m <= 9 ? "0" + m : m}-${d <= 9 ? "0" + d : d}`;
    
        const h = timestamp.getHours();
        const mm = timestamp.getMinutes();
        const s = timestamp.getSeconds();
        const time = `${h <= 9 ? "0" + h : h}:${mm <= 9 ? "0" + mm : mm}:${
          s <= 9 ? "0" + s : s
        }`;
    
        output = `${date} ${time}`
    
      } catch (err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }
    
      return output;
    
    }
    
    public static getCallStackString():string {
    
      let output:string = '';
    
      try {
    
        let pathElements = [];
        const callStack = new Error().stack?.split('\n');
    
        if(callStack) {
    
          const functionsToIgnore = [
            'Object.<anonymous>',
            'Server.<anonymous>',
            'Object.onceWrapper',
            'Server.emit',
            'emitListeningNT',
            'Module._compile',
            'Module._extensions..js',
            'Module.load',
            'Module._load',
            'Function.executeUserEntryPoint',
            'process.processTicksAndRejections',
            'getCallStackString',
            'WhiskeyLog.AddLogEntry'
          ]
    
          for(let i=1; i<callStack.length; i++) {
    
            const functionName = "" + callStack[i].trim().split(' ')[1];
    
            if(!functionsToIgnore.includes(functionName) && !functionName.startsWith("node:") && !functionName.startsWith("WhiskeyUtilities.")) {
              pathElements.push(functionName);
            }
    
          }
    
          if(pathElements.length>0) {
            output = pathElements.reverse().join(":");
          }
    
        }
    
      } catch (err) {
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
            le.AddLogEntry(LogEntrySeverity.Ok, this.getProgressMessage('', 'performed', p, promises.length, timeStart, new Date()));
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

      le.AddLogEntry(LogEntrySeverity.Ok, `.. complete; performed ${promises.length} operations in ${this.formatDuration(timeStart, new Date())}`);

      return;
    }

    public static getMaxDateFromObject(jsonObject:any, keysToConsider:string[]):Date {

      let output:Date = minimumJsonDate

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
            if(showDebug) { le.AddLogEntry(LogEntrySeverity.Debug, `${jsonObject.deviceName} :: pruning key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`) }
            delete jsonObject[keyToPrune[i]]
          }
          else {
            if(showDebug) { le.AddLogEntry(LogEntrySeverity.Debug, `${jsonObject.deviceName} :: keeping key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`) }
          }
        }
        return jsonObject
        
      } catch(err) {
        throw(`${arguments.callee.toString()}: ${err}`)
      }
    }

    public ldapTimestampToJS(timestamp:string):Date {
      return new Date(parseInt(timestamp) / 1e4 - 1.16444736e13)
    }

}