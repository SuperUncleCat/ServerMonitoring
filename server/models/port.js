const mongoose = require('mongoose')
const ping = require("net-ping")
const schedule = require("node-schedule");
const stateSchema = require('./State')
const logSchema = require('./Log')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
/*mongoose.connect('mongodb://127.0.0.1:27017/monitor', {
    useMongoClient: true
});

mongoose.Promise = global.Promise;*/

var State = mongoose.model("State", stateSchema);
var Log = mongoose.model("Log", logSchema);

var session = ping.createSession();

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.kagoya.net',
    auth: {
        user: 'kir080295.system',
        pass: '1vmlbo45dm'
    }
}))

var mailOptions = (element, address) => ({
    from: 'sysadmin@togo-sec.co.jp',
    to: 'h-zhang@junction.tokyo',
    subject: element + ' ' + 'server is down!',
    text: 'The' + ' ' + element + ' ' + 'with ip address of' + ' ' + address + ' ' + 'is not responding!'
})

/*var mailOptions = {
    from: 'chickenruntest@gmail.com',
    to: 'h-zhang@junction.tokyo',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
}*/

var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);
var net = require('net');
var mission = schedule.scheduleJob(rule, function() {
    State.find(async(err, target) => {
        if (err) {
            console.log(target + " : " + error.toString());
        } else {
            target.forEach(async(element, index) => {
                var sock = new net.Socket();
                sock.setTimeout(2500);
                sock.on('connect', function() {
                    console.log(element.ip_address + ':' + element.port + ' is up.');
                    State.findOneAndUpdate({
                        "_id": element._id,
                    }, {
                        "$set": {
                            "state": "green"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {
                        }
                    })
                    sock.destroy();
                }).on('error', function(e) {
                    console.log(element.ip_address + ':' + element.port + ' is down: ' + e.message);
                    State.findOneAndUpdate({
                        "_id": element._id,
                    }, {
                        "$set": {
                            "state": "red"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                    Log.create({
                        "ip_address": element.ip_address,
                        "pors": element.port,
                        "server_name": element.server_name,
                        "port": element.port,
                        "jp_name": element.jp_name,
                        "state": "red"
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                }).on('timeout', function(e) {
                    console.log(element.ip_address + ':' + element.port + ' is down: timeout');
                    State.findOneAndUpdate({
                        "_id": element._id,
                    }, {
                        "$set": {
                            "state": "red"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                    Log.create({
                        "ip_address": element.ip_address,
                        "pors": element.port,
                        "server_name": element.server_name,
                        "port": element.port,
                        "jp_name": element.jp_name,
                        "state": "red"
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                }).connect(element.port, element.ip_addresse);
            })
        /*target.forEach(async(element, index) => {
            session.pingHost(element.ip_address, function(error, target, sent, rcvd) {
                var ms = rcvd - sent;
                if (ms < 10) {
                    ms = "0" + ms;
                }
                if (error) {
                    console.log(target + ": " + error.toString());
                    transporter.sendMail(mailOptions(element.server_name, element.ip_address), function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
                    State.findOneAndUpdate({
                        "server_name": element.server_name,
                    }, {
                        "$set": {
                            "state": "red"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                    Log.create({
                        "ip_address": element.ip_address,
                        "pors": element.port,
                        "server_name": element.server_name,
                        "port": element.port,
                        "jp_name": element.jp_name,
                        "state": "red"
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })

                } else {
                    console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                    State.findOneAndUpdate({
                        "server_name": element.server_name,
                    }, {
                        "$set": {
                            "state": "green"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {
                        }
                    })

                }
            })

        })*/
        }
    })
})

module.exports = mission