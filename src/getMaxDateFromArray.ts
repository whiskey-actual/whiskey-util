import { minimumJsonDate } from './minimumJsonDate'

export const getMaxDateFromArray = function(dates:Date[]):Date|undefined{
    let output:Date|undefined = undefined
    try {
        output = new Date(Math.max(...dates.map( d=> d ? d.getTime() : minimumJsonDate.getTime())));
        if(output===minimumJsonDate) { output = undefined }
    } catch(err) {
        throw `getMaxDateFromArray: ${err}`
    }
    return output
}

