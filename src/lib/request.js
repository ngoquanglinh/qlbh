class Request {
    host = null;

    constructor() {
        this.host = location.protocol + '//' + location.host;
    }

    url = path => {
        if (path && path.match(/^\s*http/i)) {
            return path;
        }
        if (path && !path.match(/^\s*\//)) {
            path = '/' + path;
        }
        return this.host + (path || "");
    }

    absoluteUrl = path => {
        if (path) {
            return path.replace(new RegExp(this.host, "i"), "");
        }
        return "/";
    }

    decode = path => {
        return decodeURIComponent(path);
    }

    encode = path => {
        return encodeURIComponent(path);
    }
}

export default new Request();