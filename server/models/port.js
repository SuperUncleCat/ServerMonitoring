const mongoose = require('mongoose')
const ping = require("net-ping")
const schedule = require("node-schedule");
const stateSchema = require('./State')
const emailSchema = require('./Email')
const logSchema = require('./Log')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
/*mongoose.connect('mongodb://127.0.0.1:27017/monitor', {
    useMongoClient: true
});

mongoose.Promise = global.Promise;*/

var State = mongoose.model("State", stateSchema);
var Email = mongoose.model("Email", emailSchema);
var Log = mongoose.model("Log", logSchema);

var session = ping.createSession();

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.kagoya.net',
    auth: {
        user: 'kir080295.system',
        pass: '1vmlbo45dm'
    }
}))

var mailOptions_one = (element, address, port, email) => ({
    from: 'sysadmin@togo-sec.co.jp',
    to: email,
    subject: 'port of' + ' ' + port + ' ' + element + ' ' + 'server is down!',
    text: 'port of' + ' ' + port + ' ' + element + ' ' + address + ' ' + 'is not responding!'
})

var mailOptions_two = (element, address, email) => ({
    from: 'sysadmin@togo-sec.co.jp',
    to: email,
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
                if (element.p_check) {
                    var sock = new net.Socket();
                    sock.setTimeout(10000);
                    sock.on('connect', function() {
                        console.log(element.ip_address + ':' + element.port + ' is up.');
                        State.findOneAndUpdate({
                            "_id": element._id,
                        }, {
                            "$set": {
                                "port_state": "green",
                                "email_mark": false
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
                        if (element.email_mark !== true) {
                            Email.find({}, function(err, docs) {
                                if (docs) {
                                    docs.forEach((ele, num) => {
                                        transporter.sendMail(mailOptions_one(element.jp_name, element.ip_address, element.port, ele.email_address), function(error, info) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        State.findOneAndUpdate({
                            "_id": element._id,
                        }, {
                            "$set": {
                                "port_state": "red",
                                "email_mark": true
                            }
                        }, function(err, doc) {
                            if (err) {
                                console.log(err.toString());
                            } else {

                            }
                        })
                        Log.create({
                            "server_name": element.server_name,
                            "jp_name": element.jp_name,
                            "ip_address": element.ip_address,
                            "port": element.port,
                            "port_state": "red",
                            "ping_state": element.ping_state
                        }, function(err, doc) {
                            if (err) {
                                console.log(err.toString());
                            } else {

                            }
                        })
                    }).on('timeout', function(e) {
                        console.log(element.ip_address + ':' + element.port + ' is down: timeout');
                        if (element.email_mark !== true) {
                            Email.find({}, function(err, docs) {
                                if (docs) {
                                    docs.forEach((ele, num) => {
                                        transporter.sendMail(mailOptions_one(element.jp_name, element.ip_address, element.port, ele.email_address), function(error, info) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        State.findOneAndUpdate({
                            "_id": element._id,
                        }, {
                            "$set": {
                                "port_state": "red",
                                "email_mark": true
                            }
                        }, function(err, doc) {
                            if (err) {
                                console.log(err.toString());
                            } else {

                            }
                        })
                        Log.create({
                            "server_name": element.server_name,
                            "jp_name": element.jp_name,
                            "ip_address": element.ip_address,
                            "port": element.port,
                            "port_state": "red",
                            "ping_state": element.ping_state
                        }, function(err, doc) {
                            if (err) {
                                console.log(err.toString());
                            } else {

                            }
                        })
                    }).connect(element.port, element.ip_address)
                } else {
                    State.findOneAndUpdate({
                        "_id": element._id
                    }, {
                        "$set": {
                            "port_state": "yellow"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                }

                if (element.is_check) {
                    session.pingHost(element.ip_address, function(error, target, sent, rcvd) {
                        var ms = rcvd - sent;
                        if (ms < 10) {
                            ms = "0" + ms;
                        }
                        if (error) {
                            console.log(target + ": " + error.toString());
                            if (element.email_sent !== true) {
                                Email.find({}, function(err, docs) {
                                    if (docs) {
                                        docs.forEach((ele, num) => {
                                            transporter.sendMail(mailOptions_two(element.jp_name, element.ip_address, ele.email_address), function(error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            })
                                        })
                                    }
                                })
                            }

                            State.findOneAndUpdate({
                                "_id": element._id,
                            }, {
                                "$set": {
                                    "ping_state": "red",
                                    "email_sent": true
                                }
                            }, function(err, doc) {
                                if (err) {
                                    console.log(err.toString());
                                } else {

                                }
                            })
                            Log.create({
                                "server_name": element.server_name,
                                "jp_name": element.jp_name,
                                "ip_address": element.ip_address,
                                "port": element.port,
                                "port_state": element.port_state,
                                "ping_state": "red"
                            }, function(err, doc) {
                                if (err) {
                                    console.log(err.toString());
                                } else {

                                }
                            })

                        } else {
                            console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                            State.findOneAndUpdate({
                                "_id": element._id,
                            }, {
                                "$set": {
                                    "ping_state": "green",
                                    "email_sent": false
                                }
                            }, function(err, doc) {
                                if (err) {
                                    console.log(err.toString());
                                } else {
                                }
                            })
                        }
                    })
                } else {
                    State.findOneAndUpdate({
                        "_id": element._id
                    }, {
                        "$set": {
                            "ping_state": "yellow"
                        }
                    }, function(err, doc) {
                        if (err) {
                            console.log(err.toString());
                        } else {

                        }
                    })
                }
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