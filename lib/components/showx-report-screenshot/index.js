/**
 * @file showx report export
 * @author dewyzee<xutao05@baidu.com>
 */

const exec = require('child_process').exec;
const path = require('path');

function getReport() {
    return new Promise((resolve, reject) => {
        let url = path.resolve(__dirname, './report.js');
        let command = 'casperjs ' + url + ' --ignore-ssl-errors=yes';
        exec(command, (err, stdout, stderr) => {
            if ((stdout && stdout === 'fail') || stderr || err) {
                reject('fail');
            }
            resolve('success');
        });
    });
}

module.exports = async function execShell() {
    let result = await getReport();
    return result;
};

