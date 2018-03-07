/**
 * @file showx screenshot schedule
 */

const showx = require('../showx-report-screenshot');
const schedule = require('node-schedule');


module.exports = function () {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.hour = [new schedule.Range(5, 6), new schedule.Range(18, 19)];
    rule.minute = [5, 15, 25];
    return schedule.scheduleJob(rule, showx);
};
