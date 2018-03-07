/**
 * @file 百意报表截图
 * @author Dewyzee<xutao05@baidu.com>
 */

// 临时需求，没时间抽离，建议与report.js一起抽象出来

/* globals __utils__ */

var date = new Date();
var mon = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
var fileName = date.getFullYear() + '-' + mon + '-' + day;
var idx = 1;

var links = [
    {
        urlLink: 'http://showx.baidu.com/group/baiyi/report/14542',
        size: {
            height: 310
        },
        picName: 'baiyi-all-',
        taskWait: 5000,
        loadWait: 4000,
        loadingCheckWait: 5000,
        loadedCheckWait: 15000,
        chartsNum: 3
    },
    {
        urlLink: 'http://showx.baidu.com/group/baiyi/report/14543',
        size: {
            height: 1580
        },
        picName: 'baiyi-pro-',
        taskWait: 5000,
        loadWait: 4000,
        loadingCheckWait: 5000,
        loadedCheckWait: 15000,
        chartsNum: 15
    },
    {
        urlLink: 'http://showx.baidu.com/group/baiyi/report/14336',
        size: {
            height: 1262
        },
        picName: 'baiyi-pos-',
        taskWait: 5000,
        loadWait: 4000,
        loadingCheckWait: 5000,
        loadedCheckWait: 15000,
        chartsNum: 12
    },
    {
        urlLink: 'http://showx.baidu.com/group/baiyi/report/14544',
        size: {
            height: 975
        },
        picName: 'baiyi-way-',
        taskWait: 5000,
        loadWait: 4000,
        loadingCheckWait: 5000,
        loadedCheckWait: 15000,
        chartsNum: 9
    },
    {
        urlLink: 'http://showx.baidu.com/group/baiyi/report/14545',
        size: {
            height: 626
        },
        picName: 'baiyi-sys-',
        taskWait: 5000,
        loadWait: 4000,
        loadingCheckWait: 5000,
        loadedCheckWait: 15000,
        chartsNum: 6
    }
];

var errorHandler = function (msg) {
    if (msg) {
        this.echo(msg, 'ERROR');
    }
    /* globals phantom */
    phantom.exit();
    this.exit(1);
};

var getScreenShot = function (target) {
    var casper = require('casper').create();
    var checkTimes = 0;
    casper.options.onError = function (msg) {
        errorHandler.call(this, msg);
    };
    // 页面报错提示
    casper.on('page.error', function (msg, trace) {
        this.echo('页面JS报错：' + msg, 'WARNING');
        // 详细错误信息
        if (trace) {
            this.echo('Error:    ' + msg, 'ERROR');
            this.echo('file:     ' + trace[0].file, 'WARNING');
            this.echo('line:     ' + trace[0].line, 'WARNING');
            this.echo('function: ' + trace[0]['function'], 'WARNING');
        }
    });
    // 在页面加载的时候就注入js
    casper.on('resource.received', function (req, networkRequest) {
        // casperjs 运行环境下，无法require path，暂时手动补全运行环境时的资源路径
        this.page.injectJs('./lib/components/showx-report-screenshot/lib/promise.min.js');
    });
    // 登录uuap, 请修改成测试帐号，也可以通过 cookie 登录
    casper.start('xxx',
        function (response) {
            var res;
            try {
                res = JSON.parse(this.getPageContent());
            }
            catch (e) {
                errorHandler.call(this);
            }
            if (!res || !res.data) {
                errorHandler.call(this);
            }
            this.clearCache();
            casper.capture('./static/baiyi/login-uuap-' + fileName + '.png');
        }
    );

    // 设置窗口大小
    casper.viewport(1522, 11650);
    // 设置 userAgent
    casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML'
        + 'open(type_url?: DOMString, replace_name?: DOMString, features?: DOMString, replace?: '
        + 'index.jsboolean), like Gecko) Chrome/46.0.2490.86 Safari/537.36');

    // 打开showx
    if (!target || !target.urlLink) {
        return;
    }
    casper.thenOpen(target.urlLink, function () {
        this.wait(target.taskWait, function () {
            var captureImage = function () {
                try {
                    this.evaluate(function () {
                        var contentWrapper = __utils__.findAll('.wrapper-sm');
                        var toolBar = __utils__.findAll('.chart-toolbar');
                        var hiddenStyle = function (value, index, arr) {
                            value.style.display = 'none';
                        };
                        var setBg = function (value, index, arr) {
                            value.style.backgroundColor = '#fff';
                        };
                        contentWrapper.forEach(setBg);
                        toolBar.forEach(hiddenStyle);
                    });

                    this.capture('./static/baiyi/wmshowx-' + target.picName + fileName + '.png', {
                        top: 110,
                        left: 250,
                        width: 1268,
                        height: target.size.height
                    });
                    this.echo('wmshowx-' + target.picName + fileName + '.png');
                }
                catch (e) {
                    this.echo('fail');
                }
            };

            var checkCanvas = function () {
                var echarts = this.getElementsInfo('canvas');
                if (echarts && (echarts.length === target.chartsNum)) {
                    this.wait(target.loadedCheckWait, captureImage.apply(this));
                }
                else if (checkTimes < 5) {
                    checkTimes++;
                    this.wait(target.loadingCheckWait, checkCanvas.bind(this));
                }
                else {
                    this.echo('loading fail');
                    errorHandler.call(this);
                }
            };
            this.wait(target.loadWait, checkCanvas.bind(this));
        });
    });
    casper.run(function () {
        if (links[idx]) {
            getScreenShot(links[idx++]);
        }
        else {
            phantom.exit();
            this.exit(1);
        }
    });
};

getScreenShot(links[0]);
