/**
 * @file showx screenshot server
 * @authoe Dewyzee<xutao05@baidu.com>
 */

const path = require('path');
const Koa = require('koa');
const staticSrc = require('koa-static');
const config = require('./config');
const schedule = require('./lib/components/node-schedule');
const baiyiSchedule = require('./lib/components/node-schedule/baiyi-schedule');
const app = new Koa();

app.use(staticSrc(
    path.join(__dirname, './static')
));

app.use(async (ctx, next) => {
    ctx.throw(404);
});

app.listen(config.port);

schedule();
baiyiSchedule();



