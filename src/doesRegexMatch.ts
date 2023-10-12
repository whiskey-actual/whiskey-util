export function doesRegexMatch(stringToAssess:string, regexStrings:string[]):boolean {

    let isMatch:boolean=true;

    for(let regex in regexStrings) {
      const re = new RegExp(regex)
      if(!re.test(stringToAssess)) { isMatch=false }
    }

    return isMatch

  }