export function HttpError(error, res) {
    if (res.status == 401) {
        this.error = "Lỗi";
        this.message = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại";
    }
    else if (res.status == 403) {
        this.error = "Lỗi";
        this.message = "Bạn chưa được phân quyền để thực hiện thao tác này";
    }
    else {
        this.error = error.error || error.Message || "Có lỗi xẩy ra";
        this.message = error.message || error.error_description || error.MessageDetail || error.ExceptionMessage || res.statusText || "Lỗi không xác định";
    }
    this.status = res.status;
    this.statusText = res.statusText;
    this.url = res.url;
    this.stack = new Error().stack.split('\n').slice(1).join('\n');
    this.type = 'http';
    this.name = error.name;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.toString = function () {
    return `Http: ${this.error}\n${this.message}`;
};

export function NetworkError(error, url) {
    this.error = error.error || "Lỗi kết nối tới server";
    this.message = error.message == 'Failed to fetch' ? 'Lỗi kết nối tới server' : (error.message || "Không có kết nối");
    this.stack = error.stack && error.stack.replace('TypeError', 'NetworkError');
    this.url = url;
    this.type = 'network';
    this.name = error.name;
}
NetworkError.prototype = Object.create(Error.prototype);
NetworkError.prototype.toString = function () {
    return `Network: ${this.error}\n${this.message}`;
};

export function DataError(error, url) {
    for (let key in error) {
        this[key] = error[key];
    }
    this.error = error.error || "Lỗi dữ liệu";
    this.url = url;
    this.type = 'data';
    this.name = error.name;
}
DataError.prototype = Object.create(Error.prototype);
DataError.prototype.toString = function () {
    return `Data: ${this.error}\n${this.message}`;
};