import { DataError, HttpError, NetworkError } from './errors';
import request from './request';
import swal from 'sweetalert2/dist/sweetalert2.js'

var qs = require('qs');

const timeout = 120000;

export default ({
    dispatch,
    getState
}) => {
    return next => {
        return action => {
            if (typeof action === 'object' && action.url && !action.type) {
                return apiCall({
                    action,
                    dispatch,
                    getState
                });
            }
            return next(action);
        }
    }
};

const apiCall = ({
    action,
    dispatch,
    getState
}) => {
    const account = getState().account || {};
    const branch = getState().branch || {};
    const token = account.token;
    const locale = _isSupportStorage ? localStorage.getItem("locale") : "vi";

    var {
        host,
        url,
        json,
        method,
        types,
        params,
        meta,
        retry,
        body,
        contentType,
        abortController
    } = action;

    host = host || request.host;

    url = host + url;

    method = !method ? "GET" : method.toUpperCase();

    retry = retry == undefined ? (method == "GET" ? 1 : 0) : retry;

    if (types && types.start) {
        dispatch({
            type: types.start,
            params,
            meta
        });
    }

    if (!contentType && !body) {
        contentType = json != false ? 'application/json' : 'application/x-www-form-urlencoded'
    }

    if (params && !body) {
        if (method != 'GET' && method != 'DELETE') {
            if (json !== false) {
                body = JSON.stringify(params);
            } else {
                body = qs.stringify(params);
            }
        } else {
            let newParams = params;
            url += '?' + qs.stringify(newParams, {
                allowDots: true,
            })
        }
    }

    const opts = {
        method: method,
        headers: {},
        body: body
    };

    if (contentType) {
        opts.headers['Content-Type'] = contentType;
    }

    if (token) {
        opts.headers['Authorization'] = 'Bearer ' + token;
    }

    if (locale) {
        opts.headers['Locale'] = locale;
    }

    if (branch.currentId) {
        opts.headers['BranchId'] = branch.currentId;
    }

    if (abortController && abortController.signal) {
        opts.signal = abortController.signal;
    }

    // console.log('Call ajax', url);

    return new Promise(function (resolve, reject) {
        var rejected = false;

        var timeoutId = setTimeout(function () {
            console.log('time out', url);

            rejected = true;

            if (retry > 0) {
                console.log('retry call ajax', retry, url);

                action.retry = retry - 1;

                if (types && types.retry) {
                    dispatch({
                        type: types.retry,
                        params,
                        meta,
                        url,
                        error
                    });
                }
                return dispatch(action).then(resolve).catch(reject);
            }

            return onError({
                error: 'Timeout',
                message: 'Hết thời gian kết nối.'
            });

        }, timeout);

        fetch(url, opts)
            .then(res => {
                var type = res.headers.get('content-type');
                var msg = res.headers.get('X-Message');
                if (msg) {
                    msg = decodeURIComponent(msg.replace(/\+/g, ' '));
                    swal.fire({
                        title: res.ok ? 'Lưu ý' : 'Cảnh báo',
                        type: res.ok ? 'warning' : 'danger',
                        html: msg.split('~~').filter(text => !!text).join("<br/>")
                    });
                }
                if (!res.ok) {
                    if (res.status == 401) {
                        console.log('not authenticated...')
                        dispatch({
                            type: 'ACCOUNT_LOGOUT'
                        })
                    }

                    if (type && type.match('application/json')) {
                        return res.json()
                            .catch(e => ({}))
                            .then(data => {
                                console.log(data, res);

                                reportError(url, method, JSON.stringify(opts.headers), body, JSON.stringify(data), res.status)

                                throw new HttpError(data, res)
                            });
                    } else {
                        return res.text()
                            .catch(e => null)
                            .then(data => {
                                console.log(data, res);

                                reportError(url, method, JSON.stringify(opts.headers), body, data, res.status)

                                throw new HttpError({
                                    message: data
                                }, res)
                            });
                    }
                }
                if (type && (type.match('application/octet-stream') || type.includes("spreadsheetml"))) {
                    return res.blob();
                }
                return res.json();
            })
            .then(data => {
                clearTimeout(timeoutId);
                return onSuccess(data, resolve, reject);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') return; // nếu chủ động bỏ qua thì ko báo lỗi

                error = (error instanceof HttpError || error instanceof DataError) ? error : new NetworkError(error, url);

                if (!error instanceof HttpError) {
                    const { name, message, stack, type } = error;
                    reportError(url, method, JSON.stringify(opts.headers), body, JSON.stringify({
                        name,
                        message,
                        stack,
                        type
                    }), 502)
                }

                onError(error, reject);
            })
    });

    function onError(error, reject) {
        var noConnection = (error instanceof NetworkError) || error.status >= 500;

        if (types && types.error) {
            dispatch({
                type: types.error,
                params,
                meta,
                url,
                error,
                noConnection
            });
        }

        if (reject) {
            return reject(error);
        } else {
            return Promise.reject(error);
        }
    }

    function onSuccess(data, resolve, reject) {
        if (data) {
            if (data.error) {
                return onError(new DataError(data), reject);
            }

            //dispath
            if (types && types.success) {
                dispatch({
                    type: types.success,
                    params,
                    data,
                    meta
                });
            }
            return resolve(data);
        }
    }
};

function reportError(url, method, headerStr, bodyStr, responseStr, statusCode) {
    const body = JSON.stringify({
        url,
        method,
        headers: headerStr,
        body: bodyStr,
        response: responseStr,
        statusCode
    });

    // fetch("https://services.ecrm.vn/api/reporting/errors", {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: body
    // })
}
