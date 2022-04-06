import * as types from '../constants/InitialType';

import validator from 'validator';
import striptags from 'striptags';
import stripchar from 'stripchar';
import moment from 'moment-timezone';

import cryptojs from 'crypto-js';
import serialize from 'serialize-javascript';

export function setTcode(dt, code, lang = types.DF_LANG) {
    const indexTcode = dt.findIndex(r => {
        return r.lang_id === lang && r.text_code === code;
    });

    let val = dt[indexTcode];
    if (val !== undefined) {
        return val[val.text_code];
    }
}

export function defDate(date, iso) {
    if (date) {
        let dx = date.split('-');
        let ax = (iso !== 'id') ? dx[2]+'-'+dx[1]+'-'+dx[0] : dx[0]+'-'+dx[1]+'-'+dx[2];
        return ax; 
    }
}

export function setLocaleDate(date, tz, epoch) {
    tz = (tz) ? tz : [];

    let x = 1;
    switch (date) {
        case 'first':
        case '0000-00-00':
        case '0000-00-00 00:00:00':
                x = 0;
            break;

        default:
    }

    let mmt;
    if (tz[1]) {
        if (tz[2]) {
            // Value: Asia/Jakarta
            mmt = (date && x > 0) ? moment(date).tz(tz[2]) : moment().tz(tz[2]);
        } else {
            // Value: tz (GMT/UTC)
            mmt = (date && x > 0) ? moment(date).utc() : moment().utc();
        }
    } else {
        // Default: Asia/Jakarta
        let tmz = process.env.REACT_TZ || "Asia/Jakarta";
        mmt = (date && x > 0) ? moment(date).tz(tmz) : moment().tz(tmz);
    }

    let d = (!epoch) ? new Date(mmt.format()) : mmt;
    // console.log(mmt.format(), d.getDay(), d.getMonth(), d.getFullYear())

    // let d = (date && x > 0) ? new Date(date) : new Date();
    // if (tz[1]) {
    //     if (tz[2]) {
    //         // Value: Asia/Jakarta
    //         d = new Date(d.toLocaleString('en-US', {timeZone: tz[2]}));
    //     } else {
    //         // Value: tz (GMT/UTC)
    //         d = new Date(d.toLocaleString('en-US', {timeZone: "UTC"}));
    //     }
    // } else {
    //     // Default: Asia/Jakarta
    //     d = new Date(d.toLocaleString('en-US', {timeZone: process.env.REACT_TZ || "Asia/Jakarta"}));
    // }

    return (!epoch) ? d : d.unix();
}

export function setDate(date = '', time, iso, mm, val = 0, type = 'day', plus = true) {
    let tz = (iso) ? iso.split('|') : [];
    iso = (tz[0]) ? tz[0] : false;

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (iso === 'id') {
        monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    }

    let d = setLocaleDate(date, tz, (tz[3] === 'epoch') ? true : false);
    if (tz[3] === 'epoch') return d;

    if (type === 'month') {
        if (val > 0) {
            if (plus) {
                d.setMonth(d.getMonth() + parseInt(val));
            } else {
                d.setMonth(d.getMonth() - parseInt(val));
            }
        }
    } else {
        if (type === 'day') {
            if (val > 0) {
                if (plus) {
                    d.setDate(d.getDate() + parseInt(val));
                } else {
                    d.setDate(d.getDate() - parseInt(val));
                }
            }
        } else {
            if (type === 'hour') {
                if (val > 0) {
                    if (plus) {
                        d.setHours(d.getHours() + parseInt(val));
                    } else {
                        d.setHours(d.getHours() - parseInt(val));
                    }
                }
            } else {
                if (val > 0) {
                    if (plus) {
                        d.setMinutes(d.getMinutes() + parseInt(val));
                    } else {
                        d.setMinutes(d.getMinutes() - parseInt(val));
                    }
                }
            }
        }
    }

    let xday = (date === 'first') ? '01' : ('0' + d.getDate()).slice(-2);
    let xmonth = ('0' + (d.getMonth() + 1)).slice(-2);
    let xdate = (iso === 'id') ? xday + '-' + xmonth + '-' + d.getFullYear() : d.getFullYear() + '-' + xmonth + '-' + xday;
    if (mm) xdate = (iso === 'id') ? xday + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear() : monthNames[d.getMonth()] + ' ' + xday + ', ' + d.getFullYear();

    let xminutes = (time && time.minute && time.minus) ? d.getMinutes() - time.minute : d.getMinutes();
    xminutes = (time && time.minute && time.plus) ? d.getMinutes() + time.minute : xminutes;

    let xho = ('0' + d.getHours()).slice(-2);
    let xmin = ('0' + xminutes).slice(-2);
    let xsec = ('0' + d.getSeconds()).slice(-2);
    let xtime = xho + ':' + xmin + ':' + xsec;

    // if (date) {
    if (time) {
        return xdate + ' ' + xtime;
    } else {
        return xdate;
    }
    // } else {
    //     return xdate + ' ' + xtime;
    // }
}

export function getDaysBetweenDates(d0, d1) {
    var msPerDay = 8.64e7;

    // Copy dates so don't mess them up
    var x0 = new Date(d0);
    var x1 = new Date(d1);

    // Set to noon - avoid DST errors
    x0.setHours(12, 0, 0);
    x1.setHours(12, 0, 0);

    // Round to remove daylight saving errors
    return Math.round((x1 - x0) / msPerDay);
}

export function epochDate(date, tz = 'UTC') {
    date = (date) ? date : false;
    let datenow = setDate(date, true, 'en|tz|' + tz + '|epoch', false, 1, 'month', false);

    return datenow;
}

export function epochDateOld(date, tz = 'UTC') {
    date = (date) ? date : false;
    let datenow = setDate(date, true, 'en|tz' + tz, false, 1, 'month', false);

    let datenx, dates;
    if (date) {
        datenx = date.split(' ');
        dates = datenx[0].split('-');

        if (['30', '31'].indexOf(dates[2]) >= 0) {
            let datenw = datenow.split(' ');
            let datew = datenw[0].split('-');
            let timew = datenw[1].split('-');

            let dday = dates[2], dmonth = eval(dates[1]-1);
            if (parseInt(timew[0]) >= 17 && parseInt(timew[0]) <= 23) {
                dday = eval(dates[2]-1);
            }

            datenow = datew[0] + '-' + dmonth + '-' + dday + ' ' + datenw[1];
        }
    }
    
    datenx = datenow.split(' ');
    dates = datenx[0].split('-');
    let times = datenx[1].split(':');
    let epoch = Date.UTC(dates[0], dates[1], dates[2], times[0], times[1], times[2]);

    return parseInt(epoch.toString().substr(0, 10));
}

export function diffDate(start, end) {
    var startDate = (start) ? new Date(start) : new Date();
    var endDate = (end) ? new Date(end) : new Date();

    // get total seconds between the times
    var delta = Math.abs(endDate.getTime() - startDate.getTime()) / 1000;

    // calculate (and subtract) whole days
    var xdays = Math.floor(delta / 86400);
    delta -= xdays * 86400;
    xdays = (xdays < 10) ? '0' + xdays : xdays;

    // calculate (and subtract) whole hours
    var xhours = Math.floor(delta / 3600) % 24;
    delta -= xhours * 3600;
    xhours = (xhours < 10) ? '0' + xhours : xhours;

    // calculate (and subtract) whole minutes
    var xminutes = Math.floor(delta / 60) % 60;
    delta -= xminutes * 60;
    xminutes = (xminutes < 10) ? '0' + xminutes : xminutes;

    // what's left is seconds
    var xseconds = Math.floor(delta % 60);
    xseconds = (xseconds < 10) ? '0' + xseconds : xseconds;

    return { days: xdays, hours: xhours, minutes: xminutes, seconds: xseconds };
}

export function stripTags(html, allow = [], replace) {
    if (allow) {
        if (replace) {
            return striptags(html, allow, replace);
        } else {
            return striptags(html, allow);
        }
    }
}

export function stripChar(html, replace = '', expect) {
    let sc = stripchar.StripChar;
    switch (expect) {
        default: // EXCEPT alphanumeric
            return sc.RSspecChar(html, replace);
        case 'numeric': // EXCEPT numeric
            return sc.RSExceptNum(html, replace);
        case 'alphabet': // EXCEPT alphabet
            return sc.RSExceptAlpha(html, replace);
        case 'unsalpnum': // EXCEPT underscore alphanumeric
            return sc.RSExceptUnsAlpNum(html, replace);
        case 'unsalphabet': // EXCEPT underscore alphabet
            return sc.RSExceptUnsAlpNum(html, replace);
    }
}

export function md5to(data) {
    return cryptojs.MD5(data).toString();
}

export function encrypto(data, pass, jsonformat) {
    if (jsonformat) {
        return cryptojs.AES.encrypt(serialize(data), (pass) ? pass : process.env.REACT_APP_API_ENCRYPT, {format: cryptoJsonFormatter()});
    } else {
        return cryptojs.AES.encrypt(serialize(data), (pass) ? pass : process.env.REACT_APP_API_ENCRYPT);
    }
}

export function decrypto(data, pass, jsonformat) {
    let decrypt;
    if (jsonformat) {
        data = (typeof data === 'object') ? JSON.stringify(data) : data;
        decrypt = cryptojs.AES.decrypt(data, (pass) ? pass : process.env.REACT_APP_API_ENCRYPT, {format: cryptoJsonFormatter()});
    } else {
        decrypt = cryptojs.AES.decrypt(data, (pass) ? pass : process.env.REACT_APP_API_ENCRYPT);
    }

    return JSON.parse(decrypt.toString(cryptojs.enc.Utf8));
}

export function cryptoJsonFormatter() {
    return {
        stringify: function (cipherParams) {
            var j = {ct: cipherParams.ciphertext.toString(cryptojs.enc.Base64)};
            if (cipherParams.iv) j.iv = cipherParams.iv.toString();
            if (cipherParams.salt) j.s = cipherParams.salt.toString();
            return JSON.stringify(j);
        },
        parse: function (jsonStr) {
            var j = JSON.parse(jsonStr);
            var cipherParams = cryptojs.lib.CipherParams.create({ciphertext: cryptojs.enc.Base64.parse(j.ct)});
            if (j.iv) cipherParams.iv = cryptojs.enc.Hex.parse(j.iv)
            if (j.s) cipherParams.salt = cryptojs.enc.Hex.parse(j.s)
            return cipherParams;
        }
    }
}

export function arrayCheck(arr, value, field, index) {
    if (index) {
        return arr.indexOf(arr.filter(function (v) {
            if (field) {
                if (typeof value === 'object') {
                    return md5to(JSON.stringify(v[field])) === md5to(JSON.stringify(value));
                } else {
                    if (field === 'id') {
                        return v['id'] === value || v['_id'] === value;
                    } else {
                        return v[field] === value;
                    }
                }
            } else {
                return v === value;
            }
        })[0]);
    } else {
        return arr.filter(function (v) {
            if (field) {
                if (typeof value === 'object') {
                    return md5to(JSON.stringify(v[field])) === md5to(JSON.stringify(value));
                } else {
                    if (field === 'id') {
                        return v['id'] === value || v['_id'] === value;
                    } else {
                        return v[field] === value;
                    }
                }
            } else {
                return v === value;
            }
        });
    }
}

export function arrayTemp(data) {
    let tempData;
    if (Object.prototype.toString.call(data) === '[object Array]') {
        tempData = [];
        data.map((v) => {
            tempData.push(v);
        })
    } else {
        tempData = {}
        Object.keys(data).map((v) => {
            tempData[v] = data[v];
        });
    }
    
    return tempData;
}

export function objectString(data, convert) {
    if (!convert) {
        let newdata = [];
        for (const key in data) {
            if (typeof data[key] === 'object') {
                for (const kd in data[key]) {
                    if (typeof data[key][kd] === 'object') {
                        for (const kdd in data[key][kd]) {
                            newdata.push(`${encodeURIComponent(key)}[${encodeURIComponent(kd)}][${encodeURIComponent(kdd)}] = ${encodeURIComponent(data[key][kd][kdd])}`);
                        }
                    } else {
                        newdata.push(encodeURIComponent(key) + '[' + encodeURIComponent(kd) + ']=' + encodeURIComponent(data[key][kd]));
                    }
                }
            } else {
                newdata.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return '?' + newdata.join('&');
    } else {
        if (data) {
            data = data.replace('?', '');
            if (data) {
                data = data.split('&');
                let newdata = [];
                for (const key in data) {
                    let dk = data[key].split('=');
                    // let dkk = []; dkk[decodeURIComponent(dk[0])] = decodeURIComponent(dk[1]);
                    // newdata.push(dkk)

                    let sub = dk[0].split('[');
                    if (sub[1]) {
                        let subs = sub[1].replace(']', '');

                        if (!newdata[sub[0]]) newdata[sub[0]] = {};
                        newdata[sub[0]][subs] = decodeURIComponent(dk[1]);
                    } else {
                        newdata[decodeURIComponent(dk[0])] = decodeURIComponent(dk[1]);
                    }
                    
                }

                return newdata;
            } else {
                return false;
            }
        }
    }
}

export function localStore(key, data, type = 'get') {
    switch(type) {
        case 'get':
            let dt = localStorage.getItem(key);
            return (dt) ? decrypto(dt) : '';
        case 'set':
            localStorage.setItem(key, encrypto(data));
        break;
        case 'remove':
            localStorage.removeItem(key);
        break;
        case 'clear':
            localStorage.clear();
        break;
        default:
    }
}

export function checkForm(state, field, slave = field, message = slave) {
    if (state[field]) {
        if (Object.keys(state[field]).length > 0) {
            let log = 0;
            switch(field) {
                case 'email': 
                    log = 1; 
                    break;
                
                default:
            }

            if (log > 0) {
                state[slave+'Err'] = (!validator.isEmail(state[field])) ? 'Email is not valid' : '';
            }

            if (log === 0) {
                state[slave+'Err'] = (!state[field]) ? message+' is required' : '';
            }
        } else {
            if (state[field]) {
                state[slave+'Err'] = (!state[field]) ? message+' is required' : '';
            } else {
                state[slave+'Err'] = (Object.keys(state[field]).length === 0) ? message+' is required' : '';
            }            
        }
    } else {
        state[slave+'Err'] = (!state[field]) ? message+' is required' : '';
    }

    return state;
}

export function formData(state) {
    const dt = new FormData();

    // Key Level 1
    Object.keys(state).map((k1) => {
        if (['[object Array]', '[object Object]'].indexOf(Object.prototype.toString.call(state[k1])) >= 0) {
            // Array Data
            if (['[object Array]'].indexOf(Object.prototype.toString.call(state[k1])) >= 0) {
                // Key Number of Array
                Object.keys(state[k1]).map((x1) => {
                    if (['[object File]'].indexOf(Object.prototype.toString.call(state[k1][x1])) >= 0) {
                        // Object Data (FILE)
                        dt.append(k1 + '['+x1+']', state[k1][x1])
                    } else {
                        // Key Level 2
                        Object.keys(state[k1][x1]).map((k2) => {
                            if (['[object Array]', '[object Object]'].indexOf(Object.prototype.toString.call(state[k1][x1][k2])) >= 0) {
                                // Array Data
                                if (['[object Array]'].indexOf(Object.prototype.toString.call(state[k1][x1][k2])) >= 0) {
                                    // Key Number of Array
                                    Object.keys(state[k1][x1][k2]).map((x2) => {
                                        if (['[object File]'].indexOf(Object.prototype.toString.call(state[k1][x1][k2][x2])) >= 0) {
                                            // Object Data (FILE)
                                            dt.append(k1 + '['+x1+'].' + k2 + '['+x2+']', state[k1][x1][k2][x2])
                                        } else {
                                            // Key Level 3
                                            Object.keys(state[k1][x1][k2][x2]).map((k3) => {
                                                if (['[object Object]'].indexOf(Object.prototype.toString.call(state[k1][x1][k2][x2][k3])) >= 0) {
                                                    // Object Data
                                                    dt.append(k1 + '['+x1+'].' + k2 + '['+x2+'].' + k3, JSON.stringify(state[k1][x1][k2][x2][k3]))

                                                    // Object.keys(state[k1][x1][k2][x2][k3]).map((o3) => {
                                                    //     dt.append(k1 + '['+x1+'].' + k2 + '['+x2+'].' + k3 + '['+o3+'].', state[k1][x1][k2][x2][k3][o3])
                                                    // })
                                                } else {
                                                    // String Data / Upload File
                                                    dt.append(k1 + '['+x1+'].' + k2 + '['+x2+'].' + k3, state[k1][x1][k2][x2][k3])
                                                }
                                                
                                                return true;
                                            })
                                        }

                                        return true;
                                    })
                                } else {
                                    // Object Data
                                    dt.append(k1 + '['+x1+'].' + k2, JSON.stringify(state[k1][x1][k2]))

                                    // Object.keys(state[k1][x1][k2]).map((o2) => {
                                    //     dt.append(k1 + '['+x1+'].' + k2 + '['+o2+'].', state[k1][x1][k2][o2])
                                    // })
                                } 
                            } else {  
                                // String Data / Upload File
                                dt.append(k1 + '['+x1+'].' + k2, state[k1][x1][k2])
                            }

                            return true;               
                        })
                    }

                    return true;
                })
            } else {
                // Object Data
                dt.append(k1, JSON.stringify(state[k1]))

                // Object.keys(state[k1]).map((o1) => {
                //     dt.append(k1 + '['+o1+'].', state[k1][o1])
                // })
            }           
        } else {
            // String Data / Upload File
            dt.append(k1, state[k1])
        }
        
        return true;
    })

    // // Parse Form Data
    // for (var pair of dt.entries()) {
    //   if (Object.prototype.toString.call(pair[1]) === '[object String]') {
    //     try {
    //       console.log(pair[0], JSON.parse(pair[1]), 1, Object.prototype.toString.call(pair[1])); 
    //     } catch {
    //       console.log(pair[0], pair[1], 2, Object.prototype.toString.call(pair[1])); 
    //     }            
    //   } else {
    //     console.log(pair[0], pair[1], 3, Object.prototype.toString.call(pair[1])); 
    //   }          
    // }

    return dt;
}

export function slashEnter(text) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function colorMixed(random, values) {
    let colors = [];
    if (random) {
        for(let x = 0; x < values.length; x++) {
            colors.push(colorRandom());
        }
    } else {
        colors = ['#20c997','#808080','#f5222d'];
    }

	return colors;
}

export function colorRandom() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color+= letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

export function numberRandom(range, start, end) {
    if (range) {
        return Math.floor(Math.random() * end) + start
    } else {
        return Math.floor(Math.random())
    }    
}

export function formatNumber(dt) {
    let number;
    if (dt !== null && typeof dt === 'number') {
        number = dt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return number;
}

export function retry(fn, retriesLeft = 5, interval = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                setTimeout(() => {
                    if (retriesLeft === 1) {
                        // reject('maximum retries exceeded');
                        reject(error);
                        return;
                    }

                    // Passing on "reject" is the important part
                    retry(fn, interval, retriesLeft - 1).then(resolve, reject);
                }, interval);
            });
    });
}

export function kFormatter(num, digits = 1) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];

    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function timeFormat(val) {
    switch (val) {
        case '00:00': return '12AM';
        case '01:00': return '1AM';
        case '02:00': return '2AM';
        case '03:00': return '3AM';
        case '04:00': return '4AM';
        case '05:00': return '5AM';
        case '06:00': return '6AM';
        case '07:00': return '7AM';
        case '08:00': return '8AM';
        case '09:00': return '9AM';
        case '10:00': return '10AM';
        case '11:00': return '11AM';
        case '12:00': return '12PM';
        case '13:00': return '1PM';
        case '14:00': return '2PM';
        case '15:00': return '3PM';
        case '16:00': return '4PM';
        case '17:00': return '5PM';
        case '18:00': return '6PM';
        case '19:00': return '7PM';
        case '20:00': return '8PM';
        case '21:00': return '9PM';
        case '22:00': return '10PM';
        case '23:00': return '11PM';
    }
}