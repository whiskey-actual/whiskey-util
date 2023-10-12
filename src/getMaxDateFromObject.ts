import { minimumJsonDate } from "./minimumJsonDate";

export const getMaxDateFromObject = function(jsonObject:any, keysToConsider:string[]):Date|undefined {
    let output:Date|undefined = minimumJsonDate;
    try {
        for(let i=0; i<keysToConsider.length; i++) {
        if(Object.keys(jsonObject).includes(keysToConsider[i])) {
          const d = new Date(jsonObject[keysToConsider[i]]);
          if(d>output) { output = d}
        }
      }
      if(output===minimumJsonDate) { output=undefined }
    } 
    catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }
    return output
  }