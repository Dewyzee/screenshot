/**
 * @file showx report screenshot
 * @author dewyzee<xutao05@baidu.com>
 */

var casper = require('casper').create();
var date = new Date();
var mon = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
var fileName = date.getFullYear() + '-' + mon + '-' + day;
var checkTimes = 0;

var errorHandler = function (msg) {
    if (msg) {
        this.echo(msg, 'ERROR');
    }
    /* globals phantom */
    phantom.exit();
    this.exit(1);
};

casper.options.onError = function (msg) {
    errorHandler.call(this, msg);
};

var captureImage = function () {
    try {
        this.evaluate(function () {
            /* globals __utils__ */
            var contentWrapper = __utils__.findAll('.wrapper-sm');
            var detailLink = __utils__.findAll('.detail-link');
            var toolBar = __utils__.findAll('.chart-toolbar');
            var hiddenStyle = function (value, index, arr) {
                value.style.display = 'none';
            };
            var setBg = function (value, index, arr) {
                value.style.backgroundColor = '#fff';
            };
            contentWrapper.forEach(setBg);
            detailLink.forEach(hiddenStyle);
            toolBar.forEach(hiddenStyle);
        });

        casper.capture('./static/wmshowx-' + fileName + '.png', {
            top: 112,
            left: 250,
            width: 950,
            height: 1300
        });
        this.echo('wmshowx-' + fileName + '.png');
    }
    catch (e) {
        this.echo('fail');
    }
};

var checkCanvas = function () {
    var echarts = this.getElementsInfo('canvas');
    if (echarts && (echarts.length === 6)) {
        captureImage.apply(this);
    }
    else if (checkTimes < 5) {
        checkTimes++;
        this.wait(5000, checkCanvas.bind(this));
    }
    else {
        this.echo('loading fail');
        errorHandler.call(this);
    }
};

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
    casper.page.injectJs('./lib/components/showx-report-screenshot/lib/promise.min.js');
});


// 登录uuap, 请修改成测试帐号，也可以通过 cookie 登录
// 这里的地址是公共账号登录地址
casper.start('xxxx', function (response) {
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
    casper.capture('./static/login-uuap-' + fileName + '.png');
});


// 设置窗口大小
casper.viewport(1522, 11650);
// 设置 userAgent
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML'
    + 'open(type_url?: DOMString, replace_name?: DOMString, features?: DOMString, replace?: '
    + 'index.jsboolean), like Gecko) Chrome/46.0.2490.86 Safari/537.36');

// 打开showx
// 这里的地址是报表页url
casper.thenOpen('xxx', function () {
    this.wait(10000, function () {
        var captureImage = function () {
            try {
                this.evaluate(function () {
                    var contentWrapper = __utils__.findAll('.wrapper-sm');
                    var detailLink = __utils__.findAll('.detail-link');
                    var toolBar = __utils__.findAll('.chart-toolbar');
                    var hiddenStyle = function (value, index, arr) {
                        value.style.display = 'none';
                    };
                    var setBg = function (value, index, arr) {
                        value.style.backgroundColor = '#fff';
                    };
                    contentWrapper.forEach(setBg);
                    detailLink.forEach(hiddenStyle);
                    toolBar.forEach(hiddenStyle);
                });

                casper.capture('./static/wmshowx-' + fileName + '.png', {
                    top: 112,
                    left: 250,
                    width: 950,
                    height: 1300
                });
                this.echo('wmshowx-' + fileName + '.png');
            }
            catch (e) {
                this.echo('fail');
            }
        };

        var checkCanvas = function () {
            var echarts = this.getElementsInfo('canvas');
            if (echarts && (echarts.length === 6)) {
                this.wait(15000, captureImage.apply(this));
            }
            else if (checkTimes < 5) {
                checkTimes++;
                this.wait(5000, checkCanvas.bind(this));
            }
            else {
                this.echo('loading fail');
                errorHandler.call(this);
            }
        };
        this.wait(40000, checkCanvas.bind(this));
    });
});

casper.run();
