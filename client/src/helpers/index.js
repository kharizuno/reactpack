import validator from 'validator';
import striptags from 'striptags';
import stripchar from 'stripchar';

import cryptojs from 'crypto-js';
import serialize from 'serialize-javascript';

export function defDate(date, iso) {
    if (date) {
        let dx = date.split('-');
        let ax = (iso !== 'id') ? dx[2]+'-'+dx[1]+'-'+dx[0] : dx[0]+'-'+dx[1]+'-'+dx[2];
        return ax; 
    }
}

export function setDate(date = '', time, iso, mm, val = 0, type = 'day', plus = true) {
    let tz = (iso) ? iso.split('|') : [];
    iso = (tz[0]) ? tz[0] : false;

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (iso === 'id') {
        monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    }

    let x = 1;
    switch (date) {
        case '0000-00-00':
        case '0000-00-00 00:00:00':
                x = 0;
            break;

        default:
    }
    
    let d = (date && x > 0) ? new Date(date) : new Date();
    if (tz[1]) {
        if (tz[2]) {
            // Value: Asia/Jakarta
            d = new Date(d.toLocaleString('en-US', {timeZone: tz[2]}));
        } else {
            // Value: tz (GMT/UTC)
            d = new Date(d.toLocaleString('en-US', {timeZone: "UTC"}));
        }
    } else {
        // Default: Asia/Jakarta
        d = new Date(d.toLocaleString('en-US', {timeZone: process.env.REACT_TZ || "Asia/Jakarta"}));
    }

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

    let xday = ('0' + d.getDate()).slice(-2);
    let xmonth = ('0' + (d.getMonth() + 1)).slice(-2);
    let xdate = (iso === 'id') ? xday + '-' + xmonth + '-' + d.getFullYear() : d.getFullYear() + '-' + xmonth + '-' + xday;
    if (mm)  xdate = (iso === 'id') ? xday + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear() :  monthNames[d.getMonth()] + ' ' + xday + ', ' + d.getFullYear();

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

export function epochDate(date) {
    date = (date) ? date : false;
    let datenow= setDate(date, true, 'en|tz', false, 1, 'month', false);
    
    let datenx = datenow.split(' ');
    let dates = datenx[0].split('-');
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

     return {days: xdays, hours: xhours, minutes: xminutes, seconds: xseconds};
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

export function encrypto(data) {
    return cryptojs.AES.encrypt(serialize(data), process.env.REACT_APP_API_ENCRYPT);
}

export function decrypto(data) {
    let decrypt = cryptojs.AES.decrypt(data, process.env.REACT_APP_API_ENCRYPT);
    return JSON.parse(decrypt.toString(cryptojs.enc.Utf8));
}

export function arrayCheck(arr, value, field, index) {
    if (index) {
        return arr.indexOf(arr.filter(function(v){
            if (field) {
                if (field === 'id') {
                    return v['id'] === value || v['_id'] === value;
                } else {
                    return v[field] === value;
                }                
            } else {
                return v === value;
            }            
        })[0]);
    } else {
        return arr.filter(function(v){
            if (field) {
                if (field === 'id') {
                    return v['id'] === value || v['_id'] === value;
                } else {
                    return v[field] === value;
                } 
            } else {
                return v === value;
            }
        });
    }
    
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
        return '?'+newdata.join('&');
    } else {
        if (data) {
            data = data.replace('?', '');
            if (data) {
                data = data.split('&');
                let newdata = [];
                for (const key in data) {
                    let dk = data[key].split('=');
                    let dkk = []; dkk[decodeURIComponent(dk[0])] = decodeURIComponent(dk[1]);
                    newdata.push(dkk)
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
    if (dt !== null) {
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