import swal from 'sweetalert2/dist/sweetalert2.js'
String.prototype.contains = function (str, ignoreCase = true) {
    if (!this || this === undefined || this === null) return false;
    if (!str) return true;
    str = str.toString();
    return ignoreCase ? this.toLowerCase().includes("" + str.toLowerCase()) : this.includes("" + str);
    //return new RegExp(str, toLower ? "i" : null).test(this);
}


String.prototype.parseJson = function () {
    if (!this) return {};
    return JSON.parse(this);
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.camelcase = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

Number.prototype.toLocaleString = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

//Chuyển số thành các chữ cái ở Phần nghìn, phần trăm...
//Author: Hoang Anh - 12.10.2018
//type: K = Ngàn (N); M = Triệu (Tr); G = Tỷ (T); T = Ngàn tỷ (NT); P = một ngàn triệu triệu (NTT)
Number.prototype.toAbbrNumString = function (type) {
    let number = this;
    // 2 decimal places => 100, 3 => 1000, etc
    let decPlaces = 2;// Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    let abbrev = ["K", "M", "G", "T", "P", "E"];
    if (type && type == 'vn')
        abbrev = ["N", "TR", "T", "NT", "NTT", "HT"];
    //k = thousand (ngàn) - M = million (triệu) - G/B = billion (tỷ)
    //T = trillion (ngàn tỷ) - P = quadrillion (một ngàn triệu triệu) - E = quintillion (hàng tỷ)

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

//Chuyển thành mảng 2 chiều (groupsize = số cột)
Array.prototype.chunk = function (groupsize) {
    if (this.length == 0) return [[]];

    var sets = [], chunks, i = 0;
    var clone = Array.from(this);
    chunks = this.length / groupsize;

    while (i < chunks) {
        sets[i] = clone.splice(0, groupsize);
        i++;
    }
    return sets;
};

Array.prototype.all = function (target) {
    return target.every(v => this.includes(v));
};

//Định dạng lại chuỗi: chỉ có 1 space, strim 2 đầu chuỗi.
String.prototype.toFormatText = function () {
    var value = this.toString().replace(/\s+/g, " ");
    if (value && value.length === 1) {
        value = this.toString().replace(/\s+/g, "")
    }
    return value;
}

Array.prototype.remove = function (func) {
    if (typeof func == 'number') {
        return this.splice(func, 1);
    }
    if (typeof func == 'function') {
        const index = this.findIndex(func);
        if (index >= 0) return this.splice(index, 1);
    }
    return this;
}

Array.prototype.sum = function (func) {
    if (typeof func == 'function') {
        let sum = 0;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (value) sum += value;
        });
        return sum;
    } else {
        let sum = 0;
        this.forEach(item => {
            let value = Number(item);
            if (value) sum += value;
        });
        return sum;
    }
}

Array.prototype.toJson = function () {
    if (!this) return {};
    return JSON.stringify(this);
}

Array.prototype.count = function (func) {
    if (typeof func == 'function') {
        return this.filter(func).length;
    } else {
        return this.length;
    }
}

Array.prototype.contains = function (item) {
    return this.includes(item);
}

Array.prototype.distinct = function () {
    return Array.from(new Set(this));
}

Array.prototype.isNotEmpty = function () {
    return this.length > 0;
}

Array.prototype.any = function (func) {
    if (func) {
        if (typeof func == 'function') {
            return this.some(func);
        }
        return this.some(x => x == func);
    }
    return this.length > 0;
}

Array.prototype.isEmpty = function () {
    return this.length === 0;
}

Array.prototype.lastIndex = function () {
    return this.length - 1;
}

Array.prototype.last = function () {
    return this.slice(-1).pop()
}

Array.prototype.first = function () {
    return this[0];
}

/**
 * @description lấy 1 thuộc tính của object nằm trong mảng.
 * @param {string} key = 'key1.key2 || key
 */
Array.prototype.select = function (key) {
    if (this.length === 0) return this;
    let lst = this;
    const keys = key.split(".");
    keys.map(k => {
        lst = lst.map(item => item[k]).filter(item => item != null)
    });
    return lst;
}

Array.prototype.joinObj = function (key, separator = ',') {
    return this.select(key).join(separator);
}

Array.prototype.uniqueObj = function (objKey) {
    return this.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t[objKey] === item[objKey]
        ))
    );
}
Array.prototype.unique = function () {
    return this.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t === item
        ))
    );
}

Array.prototype.orderBy = function (func) {
    return this.sort((a, b) => {
        return func(a) - func(b);
    });
}

Array.prototype.orderByDesc = function (func) {
    return this.sort((a, b) => {
        return func(b) - func(a);
    });
}

Array.prototype.groupBy = function (func, toArray = true) {
    let obj = this.reduce(function (rv, x) {
        let key = func(x);
        (rv[key] = rv[key] || []).push(x);
        return rv;
    }, {});

    if (toArray) {
        return Object.entries(obj).map(data => ({
            key: data[0],
            items: data[1]
        }));
    }
    return obj;
};

String.prototype.toMoney = function () {
    if (!this) return 0;
    return this.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
String.prototype.toJson = function (defaultValue = {}) {
    if (!this) return defaultValue;
    try {
        return JSON.parse(this);
    } catch {
        console.warn('cannot parse string to json', this);
        return defaultValue;
    }
}
String.prototype.beforeOf = function (char) {
    return this.substr(0, this.indexOf('-'))
}
Number.prototype.toMoney = function () {
    if (!this) return 0;
    return this.toString().toMoney();
}

Array.prototype.max = function (func) {
    if (typeof func == 'function') {
        let max = 0;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (value && max < value) max = value;
        });
        return max;
    } else {
        let max = 0;
        this.forEach(item => {
            let value = Number(item);
            if (value && max < value) max = value;
        });
        return max;
    }
}

Array.prototype.min = function (func) {
    if (typeof func == 'function') {
        let min = 0;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (value && min > value) min = value;
        });
        return min;
    } else {
        let min = 0;
        this.forEach(item => {
            let value = Number(item);
            if (value && min > value) min = value;
        });
        return min;
    }
}

/**
 * enum
 */

window.getEnumLabel = (value, enumList) => {
    const found = (enumList || []).find(item => item.value == value);
    return found ? found.label : value;
}

window.getEnumName = (value, enumList) => {
    const found = (enumList || []).find(item => item.value == value);
    return found ? found.name : value;
}

window.getEnumValue = (name, enumList) => {
    name = name.toLowerCase();
    const found = (enumList || []).find(item => item.name.toLowerCase() == name);
    return found ? found.value : 0;
}

window.homeUrl = location.protocol + '//' + location.host;

window.getUrl = (path = '/') => {
    return homeUrl + path;
};

/**
 * notify - alert - confirm
 *
 * form: ['top', 'bottom']
 * align: ['center', 'left', 'right']
 * type: ['inverse', 'info', 'success', 'warning', 'danger']
 */


window.notify = function (message, type = "info", options = {}) {
    options = {
        icon: '',
        from: 'top',
        align: 'right',
        timer: 1000,
        delay: 2500,
        allow_dismiss: true,
        ...options
    };

    $.notify({
        icon: options.icon,
        message: message,
    }, {
        element: 'body',
        type: type || 'info',
        allow_dismiss: options.allow_dismiss,
        placement: {
            from: options.from,
            align: options.align
        },
        offset: {
            x: 20,
            y: 20
        },
        spacing: 10,
        z_index: 1100,
        delay: options.delay,
        timer: options.timer,
        url_target: '_blank',
        mouse_over: false,
        template: `
        <div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">
            <span data-notify="title">{1}</span>
            <span data-notify="message">{2}</span>
            <span style="position: absolute; top: 7px; right: 4px; font-size: 18px">
                <button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">
                    <i class="zmdi zmdi-close-circle"></i>
                </button>
            </span>
        </div>
        `,
        ...options,
    });
}


/**
 * alert
 *
 * type: [ null, 'question', 'info', 'success', 'warning', 'error']
 */
window.alert = function (title, message, type = null, options = {}) {
    if (message) {
        title = title + "";
        message = message + "";
    } else {
        message = title + "";
        title = "";
    }

    if (type == 'danger') type = 'warning';

    options = {
        type,
        timer: null, //auto close
        confirmButtonClass: 'btn btn-primary',
        confirmButtonText: 'Đồng ý',
        buttonsStyling: false,
        //width: null,
        padding: null,
        animation: true,
        customClass: null,
        ...options
    };

    if (title.length < 20 && message.length < 20) {
        options.width = 250;
    }

    return swal.fire({
        title: title,
        text: message,
        ...options
    });
}

window.confirm = function (title, question, options = {}) {
    if (question) {
        title = title + "";
        question = question + "";
    } else {
        question = title + "";
        title = "";
    }

    options = {
        type: 'question',
        timer: null, //auto close
        buttonsStyling: false,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Bỏ qua',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-secondary',
        ...options
    };

    return swal.fire({
        title: title,
        text: question,
        ...options
    }).then(res => {
        return !!res.value;
    })
}

window.prompt = function (title, options) {
    return swal.fire({
        input: 'text',
        timer: null, //auto close
        buttonsStyling: false,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Bỏ qua',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-secondary',
        allowOutsideClick: false,
        allowEscapeKey: false,
        title,
        text: typeof (options) == 'string' ? options : null,
        ...(typeof (options) == 'object' ? options : null),
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (!value && options && options.required) {
                    resolve(options.requiredText || 'Trường này không được bỏ trống')
                } else {
                    resolve()
                }
            })
        }
    }).then(res => {
        return res.value;
    })
}

window.isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

window.range = (start, end) => {
    return Array.from({
        length: (end)
    }, (v, k) => k + start)
};

window.parseBool = (value) => {
    return value === true || value === 'true';
}

window._setOptions = (k, v) => {
    if (!_isSupportStorage) return {};
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    options[k] = v;
    localStorage.setItem("ecrm:options", JSON.stringify(options));
    return options;
}

window._getOptions = (k, defaultVal = null) => {
    if (!_isSupportStorage) return {};
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    return options[k] ? options[k] : defaultVal
}

window._removeOptions = (k) => {
    if (!_isSupportStorage) return {};
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    if (options[k]) {
        delete options[k];
    }
    localStorage.setItem("ecrm:options", JSON.stringify(options));
    return options;
}

window._uuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

window.isMobile = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

window._isSupportStorage = (() => {
    const mod = 'ecrm';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
})()
