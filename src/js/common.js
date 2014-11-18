/**
 * @fileoverview 클래스와 비슷한방식으로 생성자를 만들고 상속을 구현할 수 있는 메소드를 제공하는 모듈
 * @author FE개발팀
 * @dependency inheritance.js, object.js
 */

(function(ne) {
    'use strict';
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 객체의 생성및 상속을 편하게 도와주는 메소드
     * @param {*} [parent] 상속받을 생성자.
     * @param {Object} props 생성할 생성자의프로토타입에 들어갈 멤버들
     * @param {Function} props.init 인스턴스가 생성될때 실행됨
     * @param {Object} props.static 생성자의 클래스 맴버형태로 들어갈 멤버들
     * @returns {*}
     * @example
     *
     * var Parent = defineClasss({
     *     init: function() {
     *         this.name = 'made by def';
     *     },
     *     method: function() {
     *         //..can do something with this
     *     },
     *     static: {
     *         staticMethod: function() {
     *              //..do something
     *         }
     *     }
     * });
     *
     * var Child = defineClass(Parent, {
     *     method2: function() {}
     * });
     *
     *
     * Parent.staticMethod();
     *
     * var parentInstance = new Parent();
     * console.log(parentInstance.name); //made by def
     * parentInstance.staticMethod(); // Error
     *
     *
     * var childInstance = new Child();
     * childInstance.method();
     * childInstance.method2();
     *
     *
     */
    var defineClass = function(parent, props) {
        var obj;

        if (!props) {
            props = parent;
            parent = null;
        }

        obj = props.init || function(){};

        parent && ne.inherit(obj, parent);

        if (props.hasOwnProperty('static')) {
            ne.extend(obj, props.static);
            delete props.static;
        }

        ne.extend(obj.prototype, props);

        return obj;
    };

    ne.defineClass = defineClass;

})(window.ne);
/**
 * @fileoverview 간단한 상속 시뮬레이션
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 전달된 객체를 prototype으로 사용하는 객체를 만들어 반환하는 메서드
     * @param {Object} obj
     * @return {Object}
     */
    function createObject(){
        function F() {}

        return function(obj) {
            F.prototype = obj;
            return new F;
        };
    }

    /**
     * 단순 prototype 확장을 응용한 상속 메서드
     *
     * **주의점**
     *
     * 단순 프로토타입 확장 기능만 제공하므로 자식 생성자의 prototype을 덮어쓰면 안된다.
     *
     * @example
     * function Animal(leg) {
     *     this.leg = leg;
     * }
     *
     * Animal.prototype.growl = function() {
     *     // ...
     * };
     *
     * function Person(name) {
     *     this.name = name;
     * }
     *
     * // 상속
     * core.inherit(Person, Animal);
     *
     * // 이 이후부터는 프로퍼티 편집만으로 확장해야 한다.
     * Person.prototype.walk = function(direction) {
     *     // ...
     * };
     * @param {function} subType 자식 생성자 함수
     * @param {function} superType 부모 생성자 함수
     */
    function inherit(subType, superType) {
        var prototype = ne.createObject(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }

    ne.createObject = createObject();
    ne.inherit = inherit;

})(window.ne);
/**
 * @fileoverview
 * @author FE개발팀
 */

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
            i,
            len;

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

    /**
     * @type {number}
     */
    var lastId = 0;

    /**
     * 객체에 unique한 ID를 프로퍼티로 할당한다.
     * @param {object} obj - ID를 할당할 객체
     * @return {number}
     */
    function stamp(obj) {
        obj.__fe_id = obj.__fe_id || ++lastId;
        return obj.__fe_id;
    }

    function resetLastId() {
        lastId = 0;
    }

    /**
     * 객체를 전달받아 객체의 키목록을 배열로만들어 리턴해준다.
     * @param obj
     * @returns {Array}
     */
    var keys = function(obj) {
        var keys = [],
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    };

    ne.extend = extend;
    ne.stamp = stamp;
    ne._resetLastId = resetLastId;
    ne.keys = Object.keys || keys;

})(window.ne);
/**
 * @fileoverview 타입체크 모듈
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 인자가 null 또는 undefined가 아닌지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isDefined(obj) {
        return obj !== null && obj !== undefined;
    }

    /**
     * 인자가 null, undefined, false가 아닌지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isTruthy(obj) {
        return isDefined(obj) && obj !== false;
    }

    /**
     * 인자가 null, undefined, false인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isFalsy(obj) {
        return !isTruthy(obj);
    }


    var toString = Object.prototype.toString;

    /**
     * 인자가 arguments 객체인지 확인
     * @param {*} obj
     * @return {boolean}
     */
    function isArguments(obj) {
        var result = isDefined(obj) &&
            ((toString.call(obj) === '[object Arguments]') || 'callee' in obj);

        return result;
    }

    /**
     * 인자가 배열인지 확인
     * @param {*} obj
     * @return {boolean}
     */
    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * 인자가 객체인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * 인자가 함수인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isFunction(obj) {
        return toString.call(obj) === '[object Function]';
    }

    /**
     * 인자가 숫자인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    }

    /**
     * 인자가 문자열인지 확인하는 메서드
     * @param obj
     * @return {boolean}
     */
    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * 인자가 불리언 타입인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isBoolean(obj) {
        return toString.call(obj) === '[object Boolean]';
    }

    /**
     * 인자가 HTML Node 인지 검사한다. (Text Node 도 포함)
     * @param {HTMLElement} html
     * @return {Boolean} HTMLElement 인지 여부
     */
    function isHTMLNode(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement || !!html.nodeType));
        }
        return !!(html && html.nodeType);
    }
    /**
     * 인자가 HTML Tag 인지 검사한다. (Text Node 제외)
     * @param {HTMLElement} html
     * @return {Boolean} HTMLElement 인지 여부
     */
    function isHTMLTag(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement));
        }
        return !!(html && html.nodeType && html.nodeType === 1);
    }
    /**
     * null, undefined 여부와 순회 가능한 객체의 순회가능 갯수가 0인지 체크한다.
     * @param {*} obj 평가할 대상
     * @return {boolean}
     */
    function isEmpty(obj) {
        var key,
            hasKey = false;

        if (!isDefined(obj)) {
            return true;
        }

        if (isArray(obj) || isArguments(obj)) {
            return obj.length === 0;
        }

        if (isObject(obj) && !isFunction(obj)) {
            ne.forEachOwnProperties(obj, function() {
                hasKey = true;
                return false;
            });

            return !hasKey;
        }

        return true;

    }

    /**
     * isEmpty 메서드와 반대로 동작한다.
     * @param {*} obj 평가할 대상
     * @return {boolean}
     */
    function isNotEmpty(obj) {
        return !isEmpty(obj);
    }


    ne.isDefined = isDefined;
    ne.isTruthy = isTruthy;
    ne.isFalsy = isFalsy;
    ne.isArguments = isArguments;
    ne.isArray = Array.isArray || isArray;
    ne.isObject = isObject;
    ne.isFunction = isFunction;
    ne.isNumber = isNumber;
    ne.isString = isString;
    ne.isBoolean = isBoolean;
    ne.isHTMLNode = isHTMLNode;
    ne.isHTMLTag = isHTMLTag;
    ne.isEmpty = isEmpty;
    ne.isNotEmpty = isNotEmpty;

})(window.ne);
/**
 * @fileoverview 옵저버 패턴을 이용하여 객체 간 커스텀 이벤트를 전달할 수 있는 기능을 제공하는 모듈
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 이벤트 핸들러에 저장되는 단위
     * @typedef {object} eventItem
     * @property {object.<string, object>} eventObject
     * @property {function()} eventObject.fn 이벤트 핸들러 함수
     * @property {*} [eventObject.ctx] 이벤트 핸들러 실행 시 컨텍스트 지정가능
     */


    /**
     * 커스텀 이벤트 클래스
     * @constructor
     * @exports CustomEvents
     * @class
     */
    function CustomEvents() {

        /**
         * 이벤트 핸들러를 저장하는 객체
         * @type {object.<string, eventItem>}
         * @private
         */
        this._events = {};
    }

    var CustomEventMethod = /** @lends CustomEvents */ {
        /**
         * 인스턴스가 발생하는 이벤트에 핸들러를 등록하는 메서드
         * @param {(object|String)} types - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()=} fn - 이벤트 핸들러 목록
         * @param {*=} context
         * @example
         * // 첫 번째 인자에 이벤트명:핸들러 데이터 객체를 넘긴 경우
         * instance.on({
         *     zoom: function() {},
         *     pan: function() {}
         * }, this);
         *
         * // 여러 이벤트를 한 핸들러로 처리할 수 있도록 함
         * instance.on('zoom pan', function() {});
         */
        on: function(types, fn, context) {
            this._toggle(true, types, fn, context);
        },

        /**
         * 인스턴스에 등록했던 이벤트 핸들러를 해제할 수 있다.
         * @param {(object|string)=} types 등록 해지를 원하는 이벤트 객체 또는 타입명. 아무 인자도 전달하지 않으면 모든 이벤트를 해제한다.
         * @param {Function=} fn
         * @param {*=} context
         * @example
         * // zoom 이벤트만 해제
         * instance.off('zoom', onZoom);
         *
         * // pan 이벤트 해제 (이벤트 바인딩 시에 context를 넘겼으면 그대로 넘겨주어야 한다)
         * instance.off('pan', onPan, this);
         *
         * // 인스턴스 내 모든 이벤트 해제
         * instance.off();
         */
        off: function(types, fn, context) {
            if (!ne.isDefined(types)) {
                this._events = null;
                return;
            }

            this._toggle(false, types, fn, context);
        },

        /**
         * on, off 메서드의 중복 코드를 줄이기 위해 만든 on토글 메서드
         * @param {boolean} isOn
         * @param {(Object|String)} types - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()=} fn - 이벤트 핸들러 목록
         * @param {*=} context
         * @private
         */
        _toggle: function(isOn, types, fn, context) {
            var methodName = isOn ? '_on' : '_off',
                method = this[methodName];

            if (ne.isObject(types)) {
                ne.forEachOwnProperties(types, function(handler, type) {
                    method.call(this, type, handler, fn);
                }, this);
            } else {
                types = types.split(' ');

                ne.forEach(types, function(type) {
                    method.call(this, type, fn, context);
                }, this);
            }
        },

        /**
         * 내부적으로 실제로 이벤트를 등록하는 로직을 담는 메서드.
         *
         * 옵션에 따라 이벤트를 배열에 등록하기도 하고 해시에 등록하기도 한다.
         *
         * 두개를 사용하는 기준:
         *
         * 핸들러가 이미 this바인딩이 되어 있고 핸들러를 사용하는 object가 같은 종류가 동시다발적으로 생성/삭제되는 경우에는 context인자를
         * 전달하여 해시의 빠른 접근 속도를 이용하는 것이 좋다.
         *
         * @param {(object.<string, function()>|string)} type - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()} fn - 이벤트 핸들러
         * @param {*=} context
         * @private
         */
        _on: function(type, fn, context) {
            var events = this._events = this._events || {},
                contextId = context && (context !== this) && ne.stamp(context);

            if (contextId) {
                /*
                 context가 현재 인스턴스와 다를 때 context의 아이디로 내부의 해시에서 빠르게 해당 핸들러를 컨트롤 하기 위한 로직.
                 이렇게 하면 동시에 많은 이벤트를 발생시키거나 제거할 때 성능면에서 많은 이점을 제공한다.
                 특히 동시에 많은 엘리먼트들이 추가되거나 해제될 때 도움이 될 수 있다.
                 */
                var indexKey = type + '_idx',
                    indexLenKey = type + '_len',
                    typeIndex = events[indexKey] = events[indexKey] || {},
                    id = ne.stamp(fn) + '_' + contextId; // 핸들러의 id + context의 id

                if (!typeIndex[id]) {
                    typeIndex[id] = {
                        fn: fn,
                        ctx: context
                    };

                    // 할당된 이벤트의 갯수를 추적해 두고 할당된 핸들러가 없는지 여부를 빠르게 확인하기 위해 사용한다
                    events[indexLenKey] = (events[indexLenKey] || 0) + 1;
                }
            } else {
                // fn이 이미 this 바인딩이 된 상태에서 올 경우 단순하게 처리해준다
                events[type] = events[type] || [];
                events[type].push({fn: fn});
            }
        },

        /**
         * 실제로 구독을 해제하는 메서드
         * @param {(object|string)=} type 등록 해지를 원하는 핸들러명
         * @param {function} fn
         * @param {*} context
         * @private
         */
        _off: function(type, fn, context) {
            var events = this._events,
                indexKey = type + '_idx',
                indexLenKey = type + '_len';

            if (!events) {
                return;
            }

            var contextId = context && (context !== this) && ne.stamp(context),
                listeners,
                id;

            if (contextId) {
                id = ne.stamp(fn) + '_' + contextId;
                listeners = events[indexKey];

                if (listeners && listeners[id]) {
                    listeners[id] = null;
                    events[indexLenKey]--;
                }

            } else {
                listeners = events[type];

                if (listeners) {
                    ne.forEach(listeners, function(listener, arr, index) {
                        if (ne.isDefined(listener) && (listener.fn === fn)) {
                            listeners.splice(index, 1);
                            return true;
                        }
                    });
                }
            }
        },

        /**
         * 이벤트를 발생시키는 메서드
         * @param {string} type 이벤트 타입명
         * @param {(object|string)=} data 발생과 함께 전달할 이벤트 데이터
         * @return {*}
         * @example
         * instance.fire('move', { direction: 'left' });
         *
         * // 이벤트 핸들러 처리
         * instance.on('move', function(moveEvent) {
         *     var direction = moveEvent.direction;
         * });
         */
        fire: function(type, data) {
            if (!this.hasListener(type)) {
                return this;
            }

            var event = ne.extend({}, data, {type: type, target: this}),
                events = this._events;

            if (!events) {
                return;
            }

            var typeIndex = events[type + '_idx'],
                listeners;

            if (events[type]) {
                listeners = events[type].slice();

                ne.forEach(listeners, function(listener) {
                    listener.fn.call(this, event);
                }, this);
            }

            ne.forEachOwnProperties(typeIndex, function(eventItem) {
                eventItem.fn.call(eventItem.ctx, event);
            });

            return this;
        },

        /**
         * 이벤트 핸들러 존재 여부 확인
         * @param {string} type 핸들러명
         * @return {boolean}
         */
        hasListener: function(type) {
            var events = this._events,
                isDefineMethod = ne.isDefined;

            return isDefineMethod(events) && (isDefineMethod(events[type]) || events[type + '_len']);
        },

        /**
         * 단발성 커스텀 이벤트 핸들러 등록 시 사용
         * @param {(object|string)} types 이벤트명:핸들러 객체 또는 이벤트명
         * @param {function()=} fn 핸들러 함수
         * @param {*=} context
         */
        once: function(types, fn, context) {
            var that = this;

            if (ne.isObject(types)) {
                ne.forEachOwnProperties(types, function(type) {
                    this.once(type, types[type], fn)
                }, this);

                return;
            }

            function onceHandler() {
                fn.apply(context, arguments);
                that.off(types, onceHandler, context);
            }

            this.on(types, onceHandler, context);
        }

    };

    CustomEvents.prototype = CustomEventMethod;
    CustomEvents.prototype.constructor = CustomEvents;

    /**
     * 커스텀 이벤트 기능을 믹스인할 때 사용하는 메서드
     * @param {function()} func 생성자 함수
     * @example
     * // 모델 클래스 변경 시 컨트롤러에게 알림을 주고 싶은데
     * // 그 기능을 모델 클래스 자체에게 주고 싶다
     * function Model() {}
     *
     * // 커스텀 이벤트 믹스인
     * ne.CustomEvents.mixin(Model);
     *
     * var model = new Model();
     *
     * model.on('changed', function() {}, this);
     */
    CustomEvents.mixin = function(func) {
        ne.extend(func.prototype, CustomEventMethod);
    };

    ne.CustomEvents = CustomEvents;

})(window.ne);
/**
 * @fileoverview 객체나 배열을 다루기위한 펑션들이 정의 되어있는 모듈
 * @author FE개발팀
 * @dependency type.js, object.js
 */

(function(ne) {
    'use strict';
    if (!ne) {
        ne = window.ne = {};
    }

    /**
     * 배열나 유사배열를 순회하며 콜백함수에 전달한다.
     * 콜백함수가 false를 리턴하면 순회를 종료한다.
     * @param {Array} arr
     * @param {Function} iteratee  값이 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     *
     * var sum = 0;
     *
     * forEachArray([1,2,3], function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     */
    function forEachArray(arr, iteratee, context) {
        var index = 0,
            len = arr.length;

        for (; index < len; index++) {
            if (iteratee.call(context || null, arr[index], index, arr) === false) {
                break;
            }
        }
    }


    /**
     * obj에 상속된 프로퍼티를 제외한 obj의 고유의 프로퍼티만 순회하며 콜백함수에 전달한다.
     * 콜백함수가 false를 리턴하면 순회를 중료한다.
     * @param {object} obj
     * @param {Function} iteratee  프로퍼티가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     * var sum = 0;
     *
     * forEachOwnProperties({a:1,b:2,c:3}, function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     **/
    function forEachOwnProperties(obj, iteratee, context) {
        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (iteratee.call(context || null, obj[key], key, obj) === false) {
                    break;
                }
            }
        }
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 데이터를 콜백함수에 전달한다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(ex2 참고)
     * 콜백함수가 false를 리턴하면 순회를 종료한다.
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     *
     * //ex1)
     * var sum = 0;
     *
     * forEach([1,2,3], function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     *
     * //ex2) 유사 배열사용
     * function sum(){
     *     var factors = Array.prototype.slice.call(arguments); //arguments를 배열로 변환, arguments와 같은정보를 가진 새 배열 리턴
     *
     *     forEach(factors, function(value){
     *          ......
     *     });
     * }
     *
     **/
    function forEach(obj, iteratee, context) {
        var key,
            len;

        if (ne.isArray(obj)) {
            for (key = 0, len = obj.length; key < len; key++) {
                iteratee.call(context || null, obj[key], key, obj);
            }
        } else {
            ne.forEachOwnProperties(obj, iteratee, context);
        }
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 콜백을 실행한 리턴값을 배열로 만들어 리턴한다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(forEach example참고)
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @returns {Array}
     * @example
     * map([0,1,2,3], function(value) {
     *     return value + 1;
     * });
     *
     * => [1,2,3,4];
     */
    function map(obj, iteratee, context) {
        var resultArray = [];

        ne.forEach(obj, function() {
            resultArray.push(iteratee.apply(context || null, arguments));
        });

        return resultArray;
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 콜백을 실행한 리턴값을 다음 콜백의 첫번째 인자로 넘겨준다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(forEach example참고)
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @returns {*}
     * @example
     * reduce([0,1,2,3], function(stored, value) {
     *     return stored + value;
     * });
     *
     * => 6;
     */
    function reduce(obj, iteratee, context) {
        var keys,
            index = 0,
            length,
            store;


        if (!ne.isArray(obj)) {
            keys = ne.keys(obj);
        }

        length = keys ? keys.length : obj.length;

        store = obj[keys ? keys[index++] : index++];

        for (; index < length; index++) {
            store = iteratee.call(context || null, store, obj[keys ? keys[index] : index]);
        }

        return store;
    }
    /**
     * 유사배열을 배열 형태로 변환한다.
     * - IE 8 이하 버전에서 Array.prototype.slice.call 이 오류가 나는 경우가 있어 try-catch 로 예외 처리를 한다.
     * @param {*} arrayLike 유사배열
     * @return {Array}
     * @example


     var arrayLike = {
        0: 'one',
        1: 'two',
        2: 'three',
        3: 'four',
        length: 4
    };
     var result = toArray(arrayLike);

     => ['one', 'two', 'three', 'four'];
     */
    function toArray(arrayLike) {
        var arr;
        try {
            arr = Array.prototype.slice.call(arrayLike);
        } catch (e) {
            arr = [];
            forEachArray(arrayLike, function(value) {
                arr.push(value);
            });
        }
        return arr;
    }

    ne.forEachOwnProperties = forEachOwnProperties;
    ne.forEachArray = forEachArray;
    ne.forEach = forEach;
    ne.toArray = toArray;
    ne.map = map;
    ne.reduce = reduce;

})(window.ne);

