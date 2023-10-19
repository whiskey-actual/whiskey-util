import { CleanedDate } from './CleanedDate';
import { minimumJsonDate } from './minimumJsonDate'

export const getMaxDateFromArray = function(dates:(Date[]|(Date[]|undefined))):Date|undefined{
    let output:Date|undefined = undefined
    
    try {

        if(dates?.length) {
            output = CleanedDate(new Date(Math.max(...dates.map( d=> d ? d.getTime() : minimumJsonDate.getTime()))));
        }
    } catch(err) {
        throw `getMaxDateFromArray: ${err}`
    }
    
    return output

}

