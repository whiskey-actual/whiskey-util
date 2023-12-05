import { LogEngine } from "whiskey-log";
import { getProgressMessage } from "./getProgressMessage";
import { formatDuration } from "./formatDuration";

export const executePromisesWithProgress = async function(logEngine:LogEngine, promises:Promise<any>[], logFrequency:number=1000) {
    logEngine.logStack.push("executePromisesWithProgress")
    logEngine.AddLogEntry(LogEngine.EntryType.Info, `executing ${promises.length} commands ..`);
    try {

      const timeStart:Date = new Date()
      let d:number=0

      const progressCallback = (p:number)=>{
        if(p>0 && p%logFrequency===0) {
            logEngine.AddLogEntry(LogEngine.EntryType.Info, getProgressMessage('', 'performed', p, promises.length, timeStart, new Date()));
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
            throw(`${err}`)
          })
          
          
      }
      await Promise.all(promises);

      logEngine.AddLogEntry(LogEngine.EntryType.Success, `.. complete; performed ${promises.length} operations in ${formatDuration(timeStart, new Date())}`);

    } catch(err) {
      logEngine.AddLogEntry(LogEngine.EntryType.Error, `${err}`)
      throw(err)
    } finally {
      logEngine.logStack.pop()
    }

    return;
  }