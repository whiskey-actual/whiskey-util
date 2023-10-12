export function CleanedString(objectToClean:any):string|undefined {
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
