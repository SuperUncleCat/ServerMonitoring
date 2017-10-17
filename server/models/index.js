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

var mission = schedule.scheduleJob(rule, function() {
    State.find(async(err, target) => {
        if (err) {
            console.log(target + " : " + error.toString());
        } else {
            target.forEach(async(element, index) => {
                session.pingHost(element.ip_address, function(error, target, sent, rcvd) {
                    var ms = rcvd - sent;
                    if (ms < 10) {
                        ms = "0" + ms;
                    }
                    if (error) {
                        console.log(target + ": " + error.toString());
                        /*transporter.sendMail(mailOptions(element.server_name, element.ip_address), function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        })*/
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
                                /*if (!doc) {
                                    doc = new State({
                                        ip_address: element.ip_address,
                                        server_name: element.server_name,
                                        jp_name: element.jp_name,
                                        state: "green"
                                    });
                                    doc.save(function(err) {
                                        if (err) console.log(err);
                                    })
                                }*/
                            }
                        })

                    }
                })

            })
        }
    })
/*for (let i = 0; i < targets.length; i++) {
    session.pingHost(targets[i], function(error, target, sent, rcvd) {

        switch (targets[i]) {
        case "192.168.1.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "JT-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "JT-CTI",
                    "jp_name": "JT-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "JT-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "JT-CTI",
                                jp_name: "JT-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.1.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "JT-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "JT-MAIN",
                    "jp_name": "JT-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "JT-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "JT-MAIN",
                                jp_name: "JT-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.2.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "MG-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "MG-CTI",
                    "jp_name": "MG-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "MG-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "MG-CTI",
                                jp_name: "MG-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.2.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "MG-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "MG-MAIN",
                    "jp_name": "MG-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "MG-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "MG-MAIN",
                                jp_name: "MG-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.3.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "OSAKA-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "OSAKA-CTI",
                    "jp_name": "大阪-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "OSAKA-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "OSAKA-CTI",
                                jp_name: "大阪-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.3.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "OSAKA-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "OSAKA-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "OSAKA-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "OSAKA-MAIN",
                                jp_name: "大阪-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.5.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "MATSUMOTO-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "MATSUMOTO-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "MATSUMOTO-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "MATSUMOTO-CTI",
                                jp_name: "松本-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.5.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "MATSUMOTO-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "MATSUMOTO-MAIN",
                    "jp_name": "松本-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "MATSUMOTO-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "MATSUMOTO-MAIN",
                                jp_name: "松本-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.6.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "KANAZAWA-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "KANAZAWA-CTI",
                    "jp_name": "金沢-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "KANAZAWA-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "KANAZAWA-CTI",
                                jp_name: "金沢-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.6.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "KANAZAWA-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "KANAZAWA-MAIN",
                    "jp_name": "金沢-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "KANAZAWA-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "KANAZAWA-MAIN",
                                jp_name: "金沢-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.7.20":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + " : " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "KUMAMOTO-CTI",
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
                    "ip_address": targets[i],
                    "server_name": "KUMAMOTO-CTI",
                    "jp_name": "熊本-CTI",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + " : Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "KUMAMOTO-CTI",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "KUMAMOTO-CTI",
                                jp_name: "熊本-CTI",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        case "192.168.7.100":
            var ms = rcvd - sent;
            if (ms < 10) {
                ms = "0" + ms;
            }
            if (error) {
                console.log(target + ": " + error.toString());
                State.findOneAndUpdate({
                    "server_name": "KUMAMOTO-MAIN",
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
                    "ip_address": targets[i],
                    "server_name": "KUMAMOTO-MAIN",
                    "jp_name": "熊本-MAIN",
                    "state": "red"
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {

                    }
                })
                break;
            } else {
                console.log(target + ": Alive(ms=" + ms + ")" + " " + new Date().toLocaleString().replace('/T/', '').replace('/\../+', ''));
                State.findOneAndUpdate({
                    "server_name": "KUMAMOTO-MAIN",
                }, {
                    "$set": {
                        "state": "green"
                    }
                }, function(err, doc) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        if (!doc) {
                            doc = new State({
                                ip_address: targets[i],
                                server_name: "KUMAMOTO-MAIN",
                                jp_name: "熊本-MAIN",
                                state: "green"
                            });
                            doc.save(function(err) {
                                if (err) console.log(err);
                            })
                        }
                    }
                })
                break;
            }

        }

    })
}*/
})

module.exports = mission