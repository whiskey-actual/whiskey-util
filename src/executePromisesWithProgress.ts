import { LogEngine } from "whiskey-log";
import { getProgressMessage } from "./getProgressMessage";
import { formatDuration } from "./formatDuration";

export async function executePromisesWithProgress(logEngine:LogEngine, promises:Promise<any>[], logFrequency:number=1000) {
    logEngine.logStack.push("executePromisesWithProgress")
    logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Note, `executing ${promises.length} commands ..`);
    try {

      const timeStart:Date = new Date()
      let d:number=0

      const progressCallback = (p:number)=>{
        if(p>0 && p%logFrequency===0) {
            logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Success, getProgressMessage('', 'performed', p, promises.length, timeStart, new Date()));
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

      logEngine.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Success, `.. complete; performed ${promises.length} operations in ${formatDuration(timeStart, new Date())}`);

    } catch(err) {
      logEngine.AddLogEntry(LogEngine.Severity.Error, LogEngine.Action.Note, `${err}`)
      throw(err)
    } finally {
      logEngine.logStack.pop()
    }

    return;
  }