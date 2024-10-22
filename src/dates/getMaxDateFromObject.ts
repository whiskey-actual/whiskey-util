import isInvalidDate from "./isInvalidDate";

export const getMaxDateFromObject = function(jsonObject:any, keysToConsider:string[]):Date|undefined {
    let output:Date|undefined = undefined;
    try {
        for(let i=0; i<keysToConsider.length; i++) {
        if(Object.keys(jsonObject).includes(keysToConsider[i])) {
          const d = new Date(jsonObject[keysToConsider[i]]);
          if((!output || d>output) && !isInvalidDate(d)) { output = d }
        }
      }
    } 
    catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }
    return output
  }