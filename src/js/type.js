(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }

    function isDefined(obj) {
        return obj !== null && obj !== undefined;
    }

    function isTruthy(obj) {
        return isDefined(obj) && obj !== false;
    }

    /**
     * 인자가 배열인지 확인
     * @param {*} obj
     * @return {boolean}
     */
    function isArray(obj) {
        return isDefined(Array.isArray) ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
    }

    function isObject(obj) {
        return obj === Object(obj);
    }

    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    function isNumber(obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
    }

    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    function isBoolean(obj) {
        return Object.prototype.toString.call(obj) === '[object Boolean]';
    }
    ne.type = {
        isDefined: isDefined,
        isTruthy: isTruthy,
        isArray: isArray,
        isObject: isObject,
        isFunction: isFunction,
        isNumber: isNumber,
        isString: isString,
        isBoolean: isBoolean
    };
})(window.ne);
(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 데이터 객체를 확장하는 메서드 (deep copy 는 하지 않는다)
     * @param {object} target - 확장될 객체
     * @param {...object} objects - 프로퍼티를 복사할 객체들
     * @return {object}
     */
    function extend(target, objects) {
        var source,
            prop,
            hasOwnProp = Object.prototype.hasOwnProperty,
            i, len;

        for (i = 1, len = arguments.length; i < len; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProp.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    ne.object = {
        extend: extend
    };

})(window.ne);