export function formatDuration(startTime:Date, endTime:Date) {

    let output = "";

    try {

      let totalTimeInMilliseconds:number=endTime.getTime()-startTime.getTime()

      const elapsedTimeInHours:number = Math.trunc(totalTimeInMilliseconds/1000/60/60);
      totalTimeInMilliseconds -= elapsedTimeInHours*60*60*1000;

      const elapsedTimeInMinutes:number = Math.trunc(totalTimeInMilliseconds/1000/60);
      totalTimeInMilliseconds -= elapsedTimeInMinutes*60*1000;

      const elapsedTimeInSeconds:number = Math.trunc(totalTimeInMilliseconds/1000);
      totalTimeInMilliseconds -= elapsedTimeInSeconds*1000;

      if (elapsedTimeInHours>0) {
        output += `${elapsedTimeInHours}h`
      }
      if(elapsedTimeInHours>0 || elapsedTimeInMinutes>0) {
        output += `${elapsedTimeInMinutes}m`
      }

      // always display seconds
      output += `${elapsedTimeInSeconds}s`

    }
    catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }

    return output;

  }