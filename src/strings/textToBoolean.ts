export const textToBoolean = function(stringToAssess:string, yesString:string) {
    let output:boolean=false

    if(stringToAssess.trim()===yesString.trim()) { output=true}

    return output
  }