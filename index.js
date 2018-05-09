var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var process = require('child_process');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data


app.post('/webhook', function (req, res) {

    var token = req.body['token'],
        event = req.body['event'],
        deploy = 'AUTODEPLOY',
        commitMsgs = req.body['commits'].map(item => item.short_message);
    console.log("token:" + token)
    console.log("event:" + event)
    console.log("commitMsgs:" + commitMsgs)
    console.log("IS AUTODEPLOY:" + commitMsgs[0].includes(deploy))
    if ('fedAkax' === token && event == 'push' && commitMsgs[0].includes(deploy)) {
        process.exec('git pull', {
                'cwd': '/webser/hmp/'
            },
            function (error, stdout, stderr) {
                console.log('stdout========================\n' + stdout);
                console.log('stderr========================\n' + stderr);
                if (error !== null) {
                    res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
                } else {
                    res.send('<pre>done!!!\n' + stdout + '</pre>');
                }
            });
    } else {
        console.log(' failed token ')
        res.send('<pre>token不正确?</pre>');
    }
});




app.set('port', 8082);

var server = app.listen(8082, function () {
    console.log('Listening on port %d', server.address().port);
})

