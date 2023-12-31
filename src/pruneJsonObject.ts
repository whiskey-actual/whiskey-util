import { LogEngine } from "whiskey-log"

export const pruneJsonObject = function(logEngine:LogEngine, jsonObject:any, keyToPrune:string[], valueToKeep:any):any {

    try {

      for(let i=0; i<keyToPrune.length; i++) {
        if(Object.keys(jsonObject).includes(keyToPrune[i]) && (jsonObject[keyToPrune[i]]!=valueToKeep || jsonObject[keyToPrune[i]]===undefined)) {
          logEngine.AddLogEntry(LogEngine.EntryType.Remove, `${jsonObject.deviceName} :: pruning key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`)
          delete jsonObject[keyToPrune[i]]
        }
        else {
          logEngine.AddLogEntry(LogEngine.EntryType.Remove, `${jsonObject.deviceName} :: keeping key: ${[keyToPrune[i]]} (${jsonObject[keyToPrune[i]]})`)
        }
      }
      return jsonObject
      
    } catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }
  }