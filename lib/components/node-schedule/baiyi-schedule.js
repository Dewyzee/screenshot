/**
 * @file showx screenshot schedule
 */

const showxBaiyi = require('../showx-report-screenshot/index_baiyi');
const schedule = require('node-schedule');


module.exports = function () {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.hour = [new schedule.Range(5, 6), new schedule.Range(18, 19)];
    rule.minute = [10, 20, 30];
    return schedule.scheduleJob(rule, showxBaiyi);
};
