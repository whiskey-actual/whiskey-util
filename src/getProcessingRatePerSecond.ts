export function getProcessingRatePerSecond(countOfItemsCompleted:number = 0, timeStart:Date=new Date(), timeEnd:Date=new Date()):number {

    let output:number = 0

    const elapsedTimeInSeconds:number = (timeEnd.getTime() - timeStart.getTime())/1000;

    try {
      if(countOfItemsCompleted>0 && elapsedTimeInSeconds>0) {
        const processingRatePerSecond:number = countOfItemsCompleted/elapsedTimeInSeconds;
        output = Math.round(processingRatePerSecond);
      }
    }
    catch(err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }

    return output

  }