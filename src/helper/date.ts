const moment = require('moment');
require('moment-precise-range-plugin');

export class DateHelper {

    public static getDayDifference(endDate: Date, startDate: Date){
        let diff = moment.preciseDiff(endDate, startDate, true);
        return diff['days'];
    }

    public static getHumanReadableDate(date: Date){
        return moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a');
    }
}