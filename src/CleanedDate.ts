import { minimumJsonDate } from "./minimumJsonDate"

export function CleanedDate(objectToClean:any):Date|undefined {
    let output:Date|undefined=undefined

    try {

      if(objectToClean && objectToClean!==null) {
        let dateObject:Date = new Date(objectToClean)
        if(dateObject instanceof Date && !isNaN(dateObject.valueOf()) && dateObject>minimumJsonDate) { output = dateObject }
      }
    } catch(err) {
      throw(`${arguments.callee.toString()} : [${objectToClean}] : ${err}`)
    }

    return output

  }