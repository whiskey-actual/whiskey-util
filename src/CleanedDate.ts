import { isDate } from "util/types"
import { minimumJsonDate } from "./minimumJsonDate"

export const CleanedDate= function(objectToClean:any):Date|undefined {
    let output:Date|undefined=undefined

    try {
      
      if(objectToClean && objectToClean!==null) {
        let dateObject:Date = new Date(objectToClean)
        if(!isNaN(dateObject.getTime()) && isDate(dateObject) && !isNaN(dateObject.valueOf()) && dateObject>minimumJsonDate) { output = dateObject }
      }

    } catch(err) {
      throw(`${arguments.callee.toString()} : [${objectToClean}] : ${err}`)
    }

    return output

  }