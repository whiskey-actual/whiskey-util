import { isDate } from "util/types"
import isInvalidDate from "./isInvalidDate"

export const CleanedDate= function(objectToClean:any):Date|undefined {
    let output:Date|undefined=undefined

    try {

      let invalidDates:Date[] = [
        new Date()
      ]
      
      if(objectToClean && objectToClean!==null) {
        let dateObject:Date = new Date(objectToClean)
        if(!isNaN(dateObject.getTime()) && isDate(dateObject) && !isNaN(dateObject.valueOf()) && !isInvalidDate(dateObject)) { output = dateObject }
      }

    } catch(err) {
      throw(`${arguments.callee.toString()} : [${objectToClean}] : ${err}`)
    }

    return output

  }