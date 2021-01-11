const freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global;

/** Detect free variable `globalThis` */
// eslint-disable-next-line no-undef
const freeGlobalThis = typeof globalThis === 'object' && globalThis !== null && globalThis.Object == Object && globalThis;

const freeSelf = typeof self === 'object' && self !== null && self.Object === Object && self;

const root = freeGlobalThis || freeGlobal || freeSelf || Function('return this')();

export function formatParams(params) {
  let _params = { ...params };
  if (params && params.pagination) {
    _params = {
      ..._params,
      currentPage: _params.pagination.currentPage,
      pageSize: _params.pagination.pageSize
    };
    delete _params.pagination;
  }

  return _params;
}

export function parseTime(time, cFormat) {
  if (!time) return '';
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    S: date.getMilliseconds(),
    a: date.getDay()
  };
  return format.replace(/{([ymdhisSa])+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return [ '一', '二', '三', '四', '五', '六', '日' ][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
}

export function parseBool(v) {
  if (v === null) {
    return ''
  }
  return v ? '是' : '否';
}

export function mapKV(value, data = [], key = 'text', valueKey = 'value') {
  if (value || value === 0) {
    const t = data.find(item => item[valueKey] == value) || {};
    return t[key] || value;
  }
  return '';
}

/**
 * 金额格式化
 * @param value
 * @param digits
 * @param currency
 * @param locale
 * @return {string}
 */
export function currency(value, digits = 2, currency = 'CNY', locale = 'zh-CN') {
  if(value === null) {
    return ''
  }
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    currency: currency,
    minimumFractionDigits: digits
  }).format(value);
}

function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

/**
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 */
export function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function';

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= maxWait);
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}

export function getRandom(randomFlag, minLength, maxLength) {
  let str = '';
  let range = minLength;
  const num = '0123456789';
  const code = 'abcdefghijklmnopqrstuvwxyz';
  const arr = [ ...num.split(''), ...code.split(''), ...code.toUpperCase().split('') ];
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (maxLength - minLength)) + minLength;
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
