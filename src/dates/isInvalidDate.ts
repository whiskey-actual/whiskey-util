import { invalidDates } from "./invalidDates";

export default function isInvalidDate(value:Date) {
    return !!invalidDates.find(item => {return item.getTime() == value.getTime()})
}