(function() {
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
        if (!ne.util) {
            ne.util = window.ne.util = {};
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

            parent && ne.util.inherit(obj, parent);

            if (props.hasOwnProperty('static')) {
                ne.util.extend(obj, props.static);
                delete props.static;
            }

            ne.util.extend(obj.prototype, props);

            return obj;
        };

        ne.util.defineClass = defineClass;

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
        if (!ne.util) {
            ne.util = window.ne.util = {};
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

        ne.util.extend = extend;
        ne.util.stamp = stamp;
        ne.util._resetLastId = resetLastId;
        ne.util.keys = Object.keys || keys;

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
        if (!ne.util) {
            ne.util = window.ne.util = {};
        }

        /**
         * 전달된 객체를 prototype으로 사용하는 객체를 만들어 반환하는 메서드
         * @param {Object} obj
         * @return {Object}
         */
        function createObject() {
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
            var prototype = ne.util.createObject(superType.prototype);
            prototype.constructor = subType;
            subType.prototype = prototype;
        }

        ne.util.createObject = createObject();
        ne.util.inherit = inherit;

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
        if (!ne.util) {
            ne.util = window.ne.util = {};
        }

        /**
         * 값이 정의되어 있는지 확인(null과 undefined가 아니면 true를 반환한다)
         * @param {*} obj
         * @param {(String|Array)} [key]
         * @returns {boolean}
         * @example
         *
         * var obj = {a: {b: {c: 1}}};
         * a 가 존재하는지 확인한다(존재함, true반환)
         * ne.util.isExisty(a);
         * => true;
         * a 에 속성 b 가 존재하는지 확인한다.(존재함, true반환)
         * ne.util.isExisty(a, 'b');
         * => true;
         * a 의 속성 b에 c가 존재하는지 확인한다.(존재함, true반환)
         * ne.util.isExisty(a, 'b.c');
         * => true;
         * a 의 속성 b에 d가 존재하는지 확인한다.(존재하지 않음, false반환)
         * ne.util.isExisty(a, 'b.d');
         * => false;
         */
        function isExisty(obj, key) {
            if (arguments.length < 2) {
                return !isNull(obj) && !isUndefined(obj);
            }
            if (!isObject(obj)) {
                return false;
            }

            key = isString(key) ? key.split('.') : key;

            if (!isArray(key)) {
                return false;
            }
            key.unshift(obj);

            var res = ne.util.reduce(key, function(acc, a) {
                if (!acc) {
                    return;
                }
                return acc[a];
            });
            return !isNull(res) && !isUndefined(res);
        }

        /**
         * 인자가 undefiend 인지 체크하는 메서드
         * @param obj
         * @returns {boolean}
         */
        function isUndefined(obj) {
            return obj === undefined;
        }

        /**
         * 인자가 null 인지 체크하는 메서드
         * @param {*} obj
         * @returns {boolean}
         */
        function isNull(obj) {
            return obj === null;
        }

        /**
         * 인자가 null, undefined, false가 아닌지 확인하는 메서드
         * (0도 true로 간주한다)
         *
         * @param {*} obj
         * @return {boolean}
         */
        function isTruthy(obj) {
            return isExisty(obj) && obj !== false;
        }

        /**
         * 인자가 null, undefined, false인지 확인하는 메서드
         * (truthy의 반대값)
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
            var result = isExisty(obj) &&
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

            if (!isExisty(obj)) {
                return true;
            }

            if (isArray(obj) || isArguments(obj)) {
                return obj.length === 0;
            }

            if (isObject(obj) && !isFunction(obj)) {
                ne.util.forEachOwnProperties(obj, function() {
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


        ne.util.isExisty = isExisty;
        ne.util.isUndefined = isUndefined;
        ne.util.isNull = isNull;
        ne.util.isTruthy = isTruthy;
        ne.util.isFalsy = isFalsy;
        ne.util.isArguments = isArguments;
        ne.util.isArray = Array.isArray || isArray;
        ne.util.isObject = isObject;
        ne.util.isFunction = isFunction;
        ne.util.isNumber = isNumber;
        ne.util.isString = isString;
        ne.util.isBoolean = isBoolean;
        ne.util.isHTMLNode = isHTMLNode;
        ne.util.isHTMLTag = isHTMLTag;
        ne.util.isEmpty = isEmpty;
        ne.util.isNotEmpty = isNotEmpty;

    })(window.ne);
    /**
     * @fileoverview 옵저버 패턴을 이용하여 객체 간 커스텀 이벤트를 전달할 수 있는 기능을 제공하는 모듈
     * @author FE개발팀
     * @dependency type.js, collection.js object.js
     */

    (function(ne) {
        'use strict';
        /* istanbul ignore if */
        if (!ne) {
            ne = window.ne = {};
        }
        if (!ne.util) {
            ne.util = window.ne.util = {};
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
                if (!ne.util.isExisty(types)) {
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

                if (ne.util.isObject(types)) {
                    ne.util.forEachOwnProperties(types, function(handler, type) {
                        method.call(this, type, handler, fn);
                    }, this);
                } else {
                    types = types.split(' ');

                    ne.util.forEach(types, function(type) {
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
                    contextId = context && (context !== this) && ne.util.stamp(context);

                if (contextId) {
                    /*
                     context가 현재 인스턴스와 다를 때 context의 아이디로 내부의 해시에서 빠르게 해당 핸들러를 컨트롤 하기 위한 로직.
                     이렇게 하면 동시에 많은 이벤트를 발생시키거나 제거할 때 성능면에서 많은 이점을 제공한다.
                     특히 동시에 많은 엘리먼트들이 추가되거나 해제될 때 도움이 될 수 있다.
                     */
                    var indexKey = type + '_idx',
                        indexLenKey = type + '_len',
                        typeIndex = events[indexKey] = events[indexKey] || {},
                        id = ne.util.stamp(fn) + '_' + contextId; // 핸들러의 id + context의 id

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

                var contextId = context && (context !== this) && ne.util.stamp(context),
                    listeners,
                    id;

                if (contextId) {
                    id = ne.util.stamp(fn) + '_' + contextId;
                    listeners = events[indexKey];

                    if (listeners && listeners[id]) {
                        listeners[id] = null;
                        events[indexLenKey] -= 1;
                    }

                } else {
                    listeners = events[type];

                    if (listeners) {
                        ne.util.forEach(listeners, function(listener, index) {
                            if (ne.util.isExisty(listener) && (listener.fn === fn)) {
                                listeners.splice(index, 1);
                                return true;
                            }
                        });
                    }
                }
            },

            /**
             * 이벤트를 발생시키는 메서드
             *
             * 등록한 리스너들의 실행 결과를 boolean AND 연산하여
             *
             * 반환한다는 점에서 {@link CustomEvents#fire} 와 차이가 있다
             *
             * 보통 컴포넌트 레벨에서 before 이벤트로 사용자에게
             *
             * 이벤트를 취소할 수 있게 해 주는 기능에서 사용한다.
             * @param {string} type
             * @param {*...} data
             * @returns {*}
             * @example
             * // 확대 기능을 지원하는 컴포넌트 내부 코드라 가정
             * if (this.invoke('beforeZoom')) {    // 사용자가 등록한 리스너 결과 체크
         *     // 리스너의 실행결과가 true 일 경우
         *     // doSomething
         * }
             *
             * //
             * // 아래는 사용자의 서비스 코드
             * map.on({
         *     'beforeZoom': function() {
         *         if (that.disabled && this.getState()) {    //서비스 페이지에서 어떤 조건에 의해 이벤트를 취소해야한다
         *             return false;
         *         }
         *         return true;
         *     }
         * });
             */
            invoke: function(type, data) {
                if (!this.hasListener(type)) {
                    return true;
                }

                var args = Array.prototype.slice.call(arguments, 1),
                    events = this._events;

                if (!events) {
                    return true;
                }

                var typeIndex = events[type + '_idx'],
                    listeners,
                    result = true;

                if (events[type]) {
                    listeners = events[type].slice();

                    ne.util.forEach(listeners, function(listener) {
                        if (listener.fn.apply(this, args) === false) {
                            result = false;
                        }
                    }, this);
                }

                ne.util.forEachOwnProperties(typeIndex, function(eventItem) {
                    if (eventItem.fn.apply(eventItem.ctx, args) === false) {
                        result = false;
                    }
                });

                return result;
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
                this.invoke.apply(this, arguments);
                return this;
            },

            /**
             * 이벤트 핸들러 존재 여부 확인
             * @param {string} type 핸들러명
             * @return {boolean}
             */
            hasListener: function(type) {
                var events = this._events,
                    existyFunc = ne.util.isExisty;

                return existyFunc(events) && (existyFunc(events[type]) || events[type + '_len']);
            },

            /**
             * 등록된 이벤트 핸들러의 갯수 반환
             * @param {string} type
             * @returns {number}
             */
            getListenerLength: function(type) {
                var events = this._events,
                    lenKey = type + '_len',
                    length = 0,
                    types,
                    len;

                if (!ne.util.isExisty(events)) {
                    return 0;
                }

                types = events[type];
                len = events[lenKey];

                length += (ne.util.isExisty(types) && ne.util.isArray(types)) ? types.length : 0;
                length += ne.util.isExisty(len) ? len : 0;

                return length;
            },

            /**
             * 단발성 커스텀 이벤트 핸들러 등록 시 사용
             * @param {(object|string)} types 이벤트명:핸들러 객체 또는 이벤트명
             * @param {function()=} fn 핸들러 함수
             * @param {*=} context
             */
            once: function(types, fn, context) {
                var that = this;

                if (ne.util.isObject(types)) {
                    ne.util.forEachOwnProperties(types, function(handler, type) {
                        this.once(type, handler, fn);
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
         * ne.util.CustomEvents.mixin(Model);
         *
         * var model = new Model();
         *
         * model.on('changed', function() {}, this);
         */
        CustomEvents.mixin = function(func) {
            ne.util.extend(func.prototype, CustomEventMethod);
        };

        ne.util.CustomEvents = CustomEvents;

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
        if (!ne.util) {
            ne.util = window.ne.util = {};
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

            if (ne.util.isArray(obj)) {
                for (key = 0, len = obj.length; key < len; key++) {
                    iteratee.call(context || null, obj[key], key, obj);
                }
            } else {
                ne.util.forEachOwnProperties(obj, iteratee, context);
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

            ne.util.forEach(obj, function() {
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


            if (!ne.util.isArray(obj)) {
                keys = ne.util.keys(obj);
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

        ne.util.forEachOwnProperties = forEachOwnProperties;
        ne.util.forEachArray = forEachArray;
        ne.util.forEach = forEach;
        ne.util.toArray = toArray;
        ne.util.map = map;
        ne.util.reduce = reduce;

    })(window.ne);
    /**
     * @fileoverview 함수관련 메서드 모음
     * @author FE개발팀
     */

    (function(ne) {
        'use strict';
        /* istanbul ignore if */
        if (!ne) {
            ne = window.ne = {};
        }
        if (!ne.util) {
            ne.util = window.ne.util = {};
        }

        /**
         * 커링 메서드
         * @param {function()} fn
         * @param {*} obj - this로 사용될 객체
         * @return {function()}
         */
        function bind(fn, obj) {
            var slice = Array.prototype.slice;

            if (fn.bind) {
                return fn.bind.apply(fn, slice.call(arguments, 1));
            }

            /* istanbul ignore next */
            var args = slice.call(arguments, 2);

            /* istanbul ignore next */
            return function() {
                /* istanbul ignore next */
                return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
            };
        }

        ne.util.bind = bind;

    })(window.ne);


    /* istanbul ignore if */
    if (!ne) {
        window.ne = ne = {};
    }
    /* istanbul ignore if */
    if (!ne.component) {
        ne.component = {};
    }

    /**
     * @fileoverview 캘린더 컴포넌트
     * (pug.Calendar 에서 분리)
     * @author 이제인(jein.yi@nhnent.com)
     * @dependency jquery.1.11.1.js, common.js
     */


    /**
     * 캘린더 컴포넌트 클래스
     *
     @constructor
     @param {Object} [options] 초기화 옵션 설정을 위한 객체.
     @param {String} [options.classPrefix="calendar-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
     @param {Number} [options.year=현재년] 초기에 표시될 달력의 연도
     @param {Number} [options.month=현재월] 초기에 표시될 달력의 달
     @param {Number} [options.date=현재일] 초기에 표시될 달력의 일
     @param {String} [options.titleFormat="yyyy-mm"] className이 '[prefix]title' 인 엘리먼트를 찾아서 해당 형식대로 날짜를 출력한다. 다음의 형식을 사용할 수 있다.
     <table>
     <tbody><tr>
     <th>표시형식</th>
     <th>설명</th>
     <th>결과</th>
     </tr>
     <tr>
     <td>yyyy</td>
     <td>4자리 연도</td>
     <td>2010</td>
     </tr>
     <tr>
     <td>yy</td>
     <td>2자리 연도</td>
     <td>10</td>
     </tr>
     <tr>
     <td>mm</td>
     <td>2자리 월</td>
     <td>09</td>
     </tr>
     <tr>
     <td>m</td>
     <td>1자리 월</td>
     <td>9</td>
     </tr>
     <tr>
     <td>M</td>
     <td>monthTitles 옵션 값으로 표시</td>
     <td>SEP</td>
     </tr>
     </tbody></table>
     @param {String} [options.todayFormat="yyyy년 mm월 dd일 (D)"] className이 '[prefix]today' 인 엘리먼트를 찾아서 해당 형식대로 날짜를 출력한다.
     @param {String} [options.yearTitleFormat="yyyy"] className이 '[prefix]year' 인 엘리먼트를 찾아서 해당 형식대로 연도를 출력한다. option의 titleFormat에서 사용할 수 있는 형식에서 연도 표시 형식을 사용할 수 있다.
     @param {String} [options.monthTitleFormat="m"] className이 '[prefix]month' 인 엘리먼트를 찾아서 해당 형식대로 월을 출력한다. option의 titleFormat에서 사용할 수 있는 형식에서 월 표시 형식을 사용할 수 있다.
     @param {Array} [options.monthTitles=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]] 각 월의 이름을 설정할 수 있다. 1월부터 순서대로 배열로 정의한다. option의 titleFormat 표시형식에서 M을 사용하면 여기서 설정된 이름으로 표시할 수 있다.
     @param {Array} [options.dayTitles=["일","월","화","수","목","금","토"]] 각 요일의 이름을 설정할 수 있다. 일요일부터 순서대로 배열로 정의한다. option의 todayFormat 표시형식에서 D을 사용하면 여기서 설정된 이름으로 표시할 수 있다.
     @param {Boolean} [options.isDrawOnload=true] 달력을 로딩과 동시에 바로 표시할 것인지 여부
     @param {jQueryObject} $element 달력 출력을 위한 기준 엘리먼트 (jQuery객체 랩핑된 엘리먼트)
     @example
     var calendar = new ne.component.Calendar({
				sClassPrefix : "calendar-",
				nYear : 1983,
				nMonth : 5,
				nDate : 12,
				sTitleFormat : "yyyy-mm", //설정될 title의 형식
				sYearTitleFormat : "yyyy", //설정될 연 title의 형식
				sMonthTitleFormat : "m", //설정될 월 title의 형식
				monthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], //월의 이름을 설정 "title" 세팅시 적용
				bDrawOnload : true //로딩과 동시에 바로 그릴것인지 여부
			});
     **/
    ne.component.Calendar = ne.util.defineClass(/** @lends ne.component.Calendar.prototype */{
        init: function(option, element) {
            /**
             * 옵션을 저장한다
             * @member
             * @private
             */
            this._option = option;
            /**
             * 루트 엘리먼트를 저장한다
             * @member
             * @private
             */
            this._element = element;
            /**
             * 커스텀이벤트를 저장한다.
             * @member
             * @private
             */
            this._events = {};

            // 기본값 세팅
            var defaultOption = {
                classPrefix: 'calendar-',
                titleFormat: 'yyyy-mm',
                todayFormat: 'yyyy년 mm월 dd일 (D)',
                yearTitleFormat: 'yyyy',
                monthTitleFormat: 'm',
                monthTitles: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                dayTitles: ['일', '월', '화', '수', '목', '금', '토'],
                isDrawOnload: true,
                pickerClass: 'picker-selectable'
            };

            // 갱신
            if (arguments.length > 1) {
                this._option = ne.util.extend(defaultOption, option);
                this._element = element;
            } else {
                this._option = defaultOption;
                this._element = option;
            }
            option = this._option;

            var year = option.year,
                month = option.month,
                date = option.date,
                today = this._setToday(year, month, date);

            // 오늘 날짜의 년, 월, 일이 옵션에 존재하지 않으면 복사해 넣는다.
            ne.util.forEach(today, function(grade, key) {
                option[key] = grade;
            });

            this._assignHTMLElements();
            this._attachEvent();
            this.setDate(option.year, option.month, option.date);

            if (option.isDrawOnload) {
                this.draw();
            }
        },
        /**
         * 오늘날짜를 세팅한다.
         * @param {String} year 연도
         * @param {String} month 월
         * @param {String} date 날짜
         * @return {Object}
         * @private
         */
        _setToday: function(year, month, date) {
            var today;
            // 기본 데이터가 없으면 오늘 날짜를 세팅한다.
            if (year && month && date) {
                this.setDate(year, month, date);
            } else {
                today = ne.component.Calendar.Util.getToday();
                this.setDate(today.year, today.month, today.date);
            }
            return today;
        },
        /**
         * 엘리먼트를 필드에 할당한다.
         *
         * @private
         */
        _assignHTMLElements: function() {

            var classPrefix = this._option.classPrefix,
                $element = this._element,
                $weekTemplate;

            this.$btnPrevYear = $('.' + classPrefix + 'btn-prev-year', $element);
            this.$btnPrevMonth = $('.' + classPrefix + 'btn-prev-mon', $element);
            this.$btnNextMonth = $('.' + classPrefix + 'btn-next-mon', $element);
            this.$btnNextYear = $('.' + classPrefix + 'btn-next-year', $element);
            this.$today = $('.' + classPrefix + 'today', $element);

            this.$title = $('.' + classPrefix + 'title', $element);
            this.$titleYear = $('.' + classPrefix + 'title-year', $element);
            this.$titleMonth = $('.' + classPrefix + 'title-month', $element);

            $weekTemplate = $('.' + classPrefix + 'week', $element);
            this.$weekTemplate = $weekTemplate.clone(true);
            this.$weekAppendTarget = $weekTemplate.parent();

        },
        /**
         * 달력, 전년 전달 다음달 다음년도로 이동하는 이벤트를 건다.
         *
         * @private
         */
        _attachEvent: function() {
            if (ne.util.isNotEmpty(this.$btnPrevYear)) {
                this.$btnPrevYear.click($.proxy(this._onButtonHandle, this, -1, 0));
            }

            if (ne.util.isNotEmpty(this.$btnPrevMonth)) {
                this.$btnPrevMonth.click($.proxy(this._onButtonHandle, this, 0, -1));
            }

            if (ne.util.isNotEmpty(this.$btnNextMonth)) {
                this.$btnNextMonth.click($.proxy(this._onButtonHandle, this, 0, 1));
            }

            if (ne.util.isNotEmpty(this.$btnNextYear)) {
                this.$btnNextYear.click($.proxy(this._onButtonHandle, this, 1, 0));
            }
        },
        /**
         * 달력 버튼을 누를때의 핸들러
         *
         * @param {Number} yearDist 연도 이동 값
         * @param {Number} monthDist 월 이동 값
         * @param {Event} event 클릭 이벤트 객체
         * @private
         */
        _onButtonHandle: function(yearDist, monthDist, event) {
            event.preventDefault();
            this.draw(yearDist, monthDist, true);
        },
        /**
         * Calendar를 그린다.
         *
         * @param {Number} year 연도 값 (ex. 2008)
         * @param {Number} month 월 값 (1 ~ 12)
         * @param {Boolean} [isRelative] 연도와 월 값이 상대 값인지 여부
         * @example
         * calendar.draw(); //현재 설정된 날짜의 달력을 그린다.
         * calendar.draw(2008, 12); //2008년 12월 달력을 그린다.
         * calendar.draw(null, 12); //현재 표시된 달력의 12월을 그린다.
         * calendar.draw(2010, null); //2010년 현재 표시된 달력의 월을 그린다.
         * calendar.draw(0, 1, true); //현재 표시된 달력의 다음 달을 그린다.
         * calendar.draw(-1, null, true); //현재 표시된 달력의 이전 연도를 그린다.
         **/
        draw: function(year, month, isRelative) {

            var classPrefix = this._option.classPrefix,
                date = this.getDate(),
                shownDate = this._getShownDate(),
                util = ne.component.Calendar.Util;
            if (shownDate && ne.util.isExisty(isRelative) && isRelative) {
                var relativeDate = util.getRelativeDate(year, month, 0, shownDate);
                year = relativeDate.year;
                month = relativeDate.month;
            } else if (!ne.util.isExisty(year) && !ne.util.isExisty(month) && !ne.util.isExisty(isRelative)) {
                year = date.year;
                month = date.month;
            } else {
                year = year || shownDate.year;
                month = month || shownDate.month;
            }

            /**
             달력을 그리기 전에 발생하는 커스텀 이벤트

             @param {String} type 커스텀 이벤트명
             @param {Number} year 그려질 달력의 연도
             @param {Number} month 그려질 달력의 월
             @param {Function} stop 레이어 보여주는 것을 중단하는 메서드
             @example
             // beforeDraw 커스텀 이벤트 핸들링
             calendar.on('beforeDraw', function(drawEvent){ ... });

             // 달력이 보여지지 않도록 처리
             calendar.on('beforeShow', function(drawEvent){
					drawEvent.stop();
				});
             **/

            var isComplete = this.invoke('beforeDraw', { year: year, month: month }),
                hasTodayElement = this.$today.length > 0;
            if (!isComplete) {
                return;
            }

            this._setCalendarToday(hasTodayElement);
            this._setCalendarTitle(year, month);

            this._clear(util.getWeeks(year, month));
            this._setShownDate(year, month);

            var today = this.getDate(),
                firstDay = util.getFirstDay(year, month),
                day = 0,
                datePrevMonth = util.getRelativeDate(0, -1, 0, {year: year, month: month, date: 1}),
                dateNextMonth = util.getRelativeDate(0, 1, 0, {year: year, month: month, date: 1}),
                dates = [],
                isPrevMonth,
                isNextMonth,
                $dateContainer,
                tempYear,
                tempMonth,
                param,
                indexOfLastDate;

            // weeks 분리

            this._setWeeks(year, month);

            this._$dateElement = $('.' + classPrefix + 'date', this.$weekAppendTarget);
            this._$dateContainerElement = $('.' + classPrefix + 'week > *', this.$weekAppendTarget);

            // 데이터를 채우고 마지막날 데이터의 인덱스를 받아온다.
            indexOfLastDate = this._fillDates(year, month, dates);

            // 채워진 데이터를 그린다
            ne.util.forEach(dates, function(date, i) {
                isPrevMonth = false;
                isNextMonth = false;
                $dateContainer = $(this._$dateContainerElement[i]);
                tempYear = year;
                tempMonth = month;

                if (i < firstDay) {
                    isPrevMonth = true;
                    $dateContainer.addClass(classPrefix + 'prev-mon');
                    tempYear = datePrevMonth.year;
                    tempMonth = datePrevMonth.month;
                } else if (i > indexOfLastDate) {
                    isNextMonth = true;
                    $dateContainer.addClass(classPrefix + 'next-mon');
                    tempYear = dateNextMonth.year;
                    tempMonth = dateNextMonth.month;
                } else {
                    tempYear = year;
                    tempMonth = month;
                }

                // 주말 표시
                this._setWeekend(day, $dateContainer, classPrefix);

                // 오늘 날짜 표시
                if ((tempYear === today.year) && (parseInt(tempMonth) === today.month) && (date === today.date)) {
                    $dateContainer.addClass(classPrefix + 'today');
                }

                param = {
                    $date: $(this._$dateElement.get(i)),
                    $dateContainer: $dateContainer,
                    year: tempYear,
                    month: tempMonth,
                    date: date,
                    isPrevMonth: isPrevMonth,
                    isNextMonth: isNextMonth,
                    html: date
                };

                $(param.$date).html(param.html.toString());

                this._metaDatas.push({
                    year: tempYear,
                    month: tempMonth,
                    date: date
                });

                day = (day + 1) % 7;

                /**
                 달력을 그리면서 일이 표시될 때마다 발생

                 @param {String} type 커스텀 이벤트명
                 @param {Boolean} isPrevMonth 그려질 날이 이전달의 날인지 여부
                 @param {Boolean} isNextMonth 그려질 날이 다음달의 날인지 여부
                 @param {jQueryObject} $date 날이 쓰여질 대상 엘리먼트
                 @param {jQueryObject} $dateContainer className이 [prefix]week로 설정된 엘리먼트의 자식 엘리먼트, elDate와 같을 수 있음
                 @param {Number} date 그려질 날의 일
                 @param {Number} month 그려질 날의 월
                 @param {Number} year 그려질 날의 연
                 @param {String} html 대상 엘리먼트에 쓰여질 HTML
                 @example
                 // draw 커스텀 이벤트 핸들링
                 calendar.on('draw', function(drawEvent){ ... });

                 // 10일에만 진하게 표시하기 예제
                 calendar.on('draw', function(darwEvent){
                        if(darwEvent.date == 10){
                            darwEvent.$date.html('<b>' + oCustomEvent.sHTML + '</b>');
                        }
                    });
                 **/
                this.fire('draw', param);
            }, this);
            /**
             달력을 모두 그린 후에 발생

             @param {String} sType 커스텀 이벤트명
             @param {Number} nYear 그려진 달력의 연도
             @param {Number} nMonth 그려진 달력의 월
             @example
             // afterDraw 커스텀 이벤트 핸들링
             calendar.on('afterDraw', function(oCustomEvent){ ... });
             **/
            this.fire('afterDraw', { year: year, month: month });
        },
        /**
         * 한주 템플릿을 만든다.
         * @param {Number} year 해당 연도
         * @param {Number} month 해당 월
         * @private
         */
        _setWeeks: function(year, month) {
            var $elWeek,
                weeks = ne.component.Calendar.Util.getWeeks(year, month),
                i;
            for (i = 0; i < weeks; i++) {
                $elWeek = this.$weekTemplate.clone(true);
                $elWeek.appendTo(this.$weekAppendTarget);
                this._weekElements.push($elWeek);
            }
        },
        /**
         * 그려질 데이터들
         *
         * @param {String} year 그려질 연도
         * @param {String} month 그려질 달
         * @param {Array} dates 그려질 날짜 데이터
         * @private
         */
        _fillDates: function(year, month, dates) {

            var util = ne.component.Calendar.Util,
                firstDay = util.getFirstDay(year, month),
                lastDay = util.getLastDay(year, month),
                lastDate = util.getLastDate(year, month),
                datePrevMonth = util.getRelativeDate(0, -1, 0, {year: year, month: month, date: 1}),
                prevMonthLastDate = util.getLastDate(datePrevMonth.year, datePrevMonth.month),
                indexOfLastDate,
                i;

            if (firstDay > 0) {
                for (i = prevMonthLastDate - firstDay; i < prevMonthLastDate; i++) {
                    dates.push(i + 1);
                }
            }
            for (i = 1; i < lastDate + 1; i++) {
                dates.push(i);
            }

            indexOfLastDate = dates.length - 1;

            for (i = 1; i < 7 - lastDay; i++) {
                dates.push(i);
            }

            return indexOfLastDate;
        },
        /**
         * 주말설정
         *
         * @param {Number} day 날짜
         * @param {Object} dateContainer 날짜컨테이너 제이쿼리 엘리먼트 오브젝트
         * @param {String} classPrefix 클래스 프리픽스
         * @private
         */
        _setWeekend: function(day, dateContainer, classPrefix) {
            if (day === 0) {
                dateContainer.addClass(classPrefix + 'sun');
            } else if (day === 6) {
                dateContainer.addClass(classPrefix + 'sat');
            }
        },
        /**
         * 날짜데이터를 돌려준다
         *
         * @returns {Object}
         */
        getDate: function() {
            return this._date;
        },
        /**
         * 현재 달력의 날짜를 설정한다.
         *
         * @param {Number} year 연도 값 (ex. 2008)
         * @param {Number} month 월 값 (1 ~ 12)
         * @param {Number} date 일 값 (1 ~ 31)
         **/
        setDate: function(year, month, date) {
            this._date = {
                year: year,
                month: month,
                date: date
            };
        },
        /**
         * 현재 달력에 표시된 날짜를 설정한다.
         *
         * @param {Number} year 연도
         * @param {Number} month 원
         * @param {Number} date 일
         * @private
         */
        _setShownDate: function(year, month) {
            this._shownDate = {
                year: year,
                month: month,
                date: 1
            };
        },
        /**
         * 현재 달력에 표시된 날짜를 가져온다.
         *
         * @private
         * @returns {Object}
         */
        _getShownDate: function() {
            return this._shownDate || this.getDate();
        },
        /**
         * 달력을 지운다
         *
         * @private
         */
        _clear: function() {
            this._metaDatas = [];
            this._weekElements = [];
            this.$weekAppendTarget.empty();
        },
        /**
         * 현재 달력의 타이틀 영역을 옵션의 타이틀 포멧에 맞게 그린다.
         *
         * @private
         * @param {Number} year 연도 값 (ex. 2008)
         * @param {(Number|String)} month 월 값 (1 ~ 12)
         **/
        _setCalendarTitle: function(year, month) {
            if (month < 10) {
                month = '0' + Number(month);
            }

            var option = this._option,
                $title,
                titleFormat = option.titleFormat,
                replaceMap = this._getReplaceMap(year, month),
                reg;

            $title = this.$title;
            if (ne.util.isNotEmpty($title)) {
                reg = /yyyy|yy|mm|m|M/g;
                this._setTitleText($title, titleFormat, replaceMap, reg);
            }

            $title = this.$titleYear;
            if (ne.util.isNotEmpty($title)) {
                reg = /yyyy|yy/g;
                this._setTitleText($title, option.yearTitleFormat, replaceMap, reg);
            }

            $title = this.$titleMonth;
            if (ne.util.isNotEmpty($title)) {
                reg = /mm|m|M/g;
                this._setTitleText($title, option.monthTitleFormat, replaceMap, reg);
            }


        },
        /**
         * 캘린더의 타이틀을 갱신한다.
         *
         * @param {JQueryObject} $element 갱신될 엘리먼트
         * @param {String} form 변경될 날짜 형식
         * @param {Object} map 정규식에 맞춰서 매칭되는 값을 가진 객체
         * @param {RegExp} reg 변경할 폼을 치환할 정규식
         * @private
         */
        _setTitleText: function($element, form, map, reg) {
            var title = this._getConvertedTitle(form, map, reg);
            $element.text(title);
        },
        /**
         * 폼 변환할 날짜의 맵을 구한다.
         * @param {String} year 연도
         * @param {String} month 월
         * @param {String} [date] 일
         * @returns {Object}
         * @private
         */
        _getReplaceMap: function(year, month, date) {

            var option = this._option,
                yearSub = (year.toString()).substr(2, 2),
                monthLabel = option.monthTitles[month - 1],
                labelkey = new Date(year, month - 1, date || 1).getDay(),
                dayLabel = option.dayTitles[labelkey];

            return {
                yyyy: year,
                yy: yearSub,
                mm: month,
                m: Number(month),
                M: monthLabel,
                dd: date,
                d: Number(date),
                D: dayLabel
            };
        },
        /**
         * 텍스트를 변환하여 돌려준다.
         * @param {String} str 변환할 텍스트
         * @param {Object} map 변환키와 벨류 셋
         * @param {RegExp} reg 변환할 정규식
         * @returns {String} 변환된 문자열
         * @private
         */
        _getConvertedTitle: function(str, map, reg) {
            str = str.replace(reg, function(matchedString) {
                return map[matchedString];
            });
            return str;
        },
        /**
         * 오늘날짜 앨리먼트 여부에 따라 오늘날짜를 그리는 데이터를 만들어 그린다.
         *
         * @param {Boolean} isExistTodayElement 오늘날짜 표시 엘레먼트 존재여부
         * @private
         */
        _setCalendarToday: function(isExistTodayElement) {

            if (!isExistTodayElement) {
                return;
            }

            var $today = this.$today,
                todayFormat = this._option.todayFormat,
                title,
                today = this.getDate(),
                replaceMap = this._getReplaceMap(today.year, today.month, today.date);

            title = this._getConvertedTitle(todayFormat, replaceMap, /yyyy|y|mm|m|M|dd|d|D/g);
            $today.text(title);
        },
        /**
         * 루트 엘리먼트를 돌려준다.
         */
        getElement: function() {
            return this._element;
        }
    });

    ne.util.CustomEvents.mixin(ne.component.Calendar);

    /**
     * 캘린더 유틸성 함수들
     *
     * @module ne.component.Calendar.Util
     * @author FE개발팀 이제인
     */
    ne.component.Calendar.Util = {/** @lends ne.component.Calendar.Util */
        /**
         * 날짜 해시(년, 월, 일) 값을 만들어 리턴한다
         *
         * @method getDateHashTable
         * @param {Date} date 날짜해시를 뽑아날 날짜 데이터 *
         * @returns {{year: *, month: *, date: *}}
         */
        getDateHashTable : function(date) {
            if (arguments.length == 3) {
                return {
                    year: arguments[0],
                    month: arguments[1],
                    date: arguments[2]
                };
            }
            if (arguments.length <= 1) {
                date = date || new Date();
            }
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate()
            };
        },
        /**
         * 컨퍼넌트에 저장된 현재날짜를 돌려준다
         * 현재 날짜가 없을 시, 로컬시간 기준으로 새로 생성하여 돌려준다.
         *
         * @method getToday
         * @static
         * @returns {{year: *, month: *, date: *}}
         */
        getToday: function() {
            var today = this._today || ne.component.Calendar.Util.getDateHashTable(new Date());
            return {
                year: today.year,
                month: today.month,
                date: today.date
            };
        },
        /**
         * today값을 설정한다.
         *
         * @method setToday
         * @static
         * @param {String} year
         * @param {String} month
         * @param {String} date
         * @returns {ne.component}
         */
        setToday: function(year, month, date) {
            if (!this._today) {
                this._today = {};
            }
            this._today.year = year;
            this._today.month = month;
            this._today.date = date;
            return this;
        },
        /**
         * 해당 연월의 주의 수를 구한다.
         *
         * @method getWeeks
         * @static
         * @param {Number} year 년
         * @param {Number} month 월
         * @return {Number} 주 (4~6)
         **/
        getWeeks: function(year, month) {
            var firstDay = this.getFirstDay(year, month),
                lastDate = this.getLastDate(year, month);

            return Math.ceil((firstDay + lastDate) / 7);
        },
        /**
         * 연월일을 포함한 HashTable로부터 유닉스타임을 구한다.
         *
         * @method getTime
         * @static
         * @param {Object} date 날짜 정보가 담긴 객체
         * @param {Number} date.year 년
         * @param {Number} date.month 월
         * @param {Number} date.date 일
         * @return {Number} 유닉스타임 정보
         * @example
         * ne.component.Calendar.Util.getTime({year:2010, month:5, date:12}); // 1273590000000
         **/
        getTime: function(date) {
            return this.getDateObject(date).getTime();
        },
        /**
         * 해당 연월의 첫번째 날짜의 요일을 구한다.
         *
         * @method getFirstDay
         * @static
         * @param {Number} year 년
         * @param {Number} month 월
         * @return {Number} 요일 (0~6)
         **/
        getFirstDay: function(year, month) {
            return new Date(year, month - 1, 1).getDay();
        },
        /**
         * 해당 연월의 마지막 날짜의 요일을 구한다.
         *
         * @method getLastDay
         * @static
         * @param {Number} year 년
         * @param {Number} month 월
         * @return {Number} 요일 (0~6)
         **/
        getLastDay: function(year, month) {
            return new Date(year, month, 0).getDay();
        },
        /**
         * 해당 연월의 마지막 날짜를 구한다.
         *
         * @method getLastDate
         * @static
         * @param {Number} year 년
         * @param {Number} month 월
         * @return {Number} 날짜 (1~31)
         **/
        getLastDate: function(year, month) {
            return new Date(year, month, 0).getDate();
        },
        /**
         * Date 객체를 구한다.
         *
         * @method getDateObject
         * @static
         * @param {Object} htDate 날짜 객체
         * @return {Date} Date 객체 인스턴스 자신
         * @example
         * ne.component.Calendar.Util.getDateObject({year:2010, month:5, date:12});
         * ne.component.Calendar.Util.getDateObject(2010, 5, 12); //연,월,일
         **/
        getDateObject: function(date) {
            if (arguments.length == 3) {
                return new Date(arguments[0], arguments[1] - 1, arguments[2]);
            }
            return new Date(date.year, date.month - 1, date.date);
        },
        /**
         * 연월일을 포함한 HashTable로부터 상대적인 날짜의 HashTable을 구한다.
         *
         * @method getRelativeDate
         * @static
         * @param {Number} year 상대적인 연도 (+/-로 정의)
         * @param {Number} month 상대적인 월 (+/-로 정의)
         * @param {Number} date 상대적인 일 (+/-로 정의)
         * @param {Object} date 연월일 HashTable
         * @return {Object} dateObj연월일을 담은 객체
         * @return {Number} dateObj.year 년도
         * @return {Number} dateObj.month 월
         * @return {Number} dateObj.date 일
         * @example
         * ne.component.Calendar.Util.getRelativeDate(1, 0, 0, {year:2000, month:1, date:1}); // {year:2001, month:1, date:1}
         * ne.component.Calendar.Util.getRelativeDate(0, 0, -1, {year:2010, month:1, date:1}); // {year:2009, month:12, date:31}
         **/
        getRelativeDate: function(year, month, date, dateObj) {
            var beforeDate = new Date(dateObj.year, dateObj.month, dateObj.date),
                beforeYear = beforeDate.getFullYear(),
                isLeapYear = !(beforeYear % 4) && !!(beforeYear % 100) || !(beforeYear % 400),
                endDays = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                isEndDate = (endDays[dateObj.month] === dateObj.date);
            if (isEndDate) {
                dateObj.date = endDays[dateObj.month + month];
            }
            var newDate = new Date(dateObj.year + year, dateObj.month + month - 1, dateObj.date + date),
                hash = this.getDateHashTable(newDate);

            return hash;
        }
    };
    /**
     * @fileoverview 날짜를 선택하는 기능을 구현한다. 특정 범위를 받으면, 그 날짜만 선택 가능하다.
     * @author FE개발팀(이제인 jein.yi@nhnent.com)
     *
     * */
    /* istanbul ignore if */
    if (!window.ne) {
        window.ne = {};
    }
    /* istanbul ignore if */
    if (!ne.component) {
        ne.component = {};
    }

    /**
     * 달력 생성
     * 날짜를 선택한다.
     * 선택한 날짜의 클래스를 비교, picker-selectable혹은 사용자가 지정한 클래스를 보유하고 있으면 getYear, getMonth, getDay를 이용해 날짜를 받아온다.
     * 달력 생성/종료시 커스텀 이벤트를 수행한다.
     * @constructor
     *
     * @param {Object} option DatePicker 옵션값
     *      @param {HTMLElement} option.element DatePicker의 input 창
     *      @param {string} option.date
     *          @param {string} option.date.year 표시날짜
     *          @param {string} option.date.month 표시 월
     *          @param {string} option.date.date 표시 일
     *      @param {String} [option.dateForm] input 창에 표시될 날짜 형식
     *      @param {Object} [option.dateForm] 초기 입력 날짜값
     *      @param {String} [option.defaultCentury] yy 형식일때 자동으로 붙여지는 값 [19|20]
     *      @param {Boolean} [option.isRestrict] 선택가능한 날짜 제한 여부
     *      @param {String} [option.selectableClass] 선택가능한 날짜에 입힐 클래스 이름 생락시 'selectableClass'
     *      @param {Object} [option.startDate] 선택가능한 날짜 시작일
     *      @param {Object} [option.endDate] 선택가능한 날짜 종료일
     * @param {ne.component.Calendar} calendar DatePicker 컴포넌트와 연결될 캘린더 컴포넌트
     * */
    ne.component.DatePicker = ne.util.defineClass(/**@lends ne.component.DatePicker.prototype */{
        init: function(option, calendar) {
            this._calendar = calendar;
            /**
             * 인풋 엘리먼트
             * @type {HTMLElement}
             * @private
             */
            this._element = option.element;
            /**
             * 날짜 표시 형식
             * @type {String}
             * @private
             */
            this._dateForm = option.dateForm || 'yyyy-mm-dd';
            /**
             * 데이터를 해쉬 형식으로 저장
             *
             * @type {Object}
             * @private
             */
            this._date = option.date;
            /**
             * 달력 엘리먼트
             *
             * @type {HTMLElement}
             * @private
             */
            this._$calendarElement = calendar.getElement();
            /**
             * yy-mm-dd형식으로 인풋창에 값을 직접 입력 할 시, 앞에 자동으로 붙을 숫자.
             * @type {String}
             * @private
             */
            this._defaultCentury = option.defaultCentury || '20';
            /**
             * 선택 영역을 제한하는
             * @type {Boolean}
             * @private
             */
            this._isRestrict = !!option.isRestrict;
            /**
             * (선택 제한시) 선택 가능한 날짜엘리먼트에 추가될 클래스명
             * @type {String}
             * @private
             */
            this._selectableClass = option.selectableClass || 'selectableClass';
            /**
             * (선택 제한시) 선택 할 수 있는 첫 날
             * @type {Date}
             * @private
             */
            this._startEdge = this._isRestrict ? this._getDateObject(option.startDate) : null;
            /**
             * (선택 제한시) 선택 할 수 있는 마지막 날
             * @type {Date}
             * @private
             */
            this._endEdge = this._isRestrict ? this._getDateObject(option.endDate) : null;
            this._bindElementEvent();

            // 기본 데이터가 있으면 input에 띄워준다.
            if (option.date) {
                this.insertDate(option.date);
            }

        },
        /**
         * 인풋 엘리먼트에 클릭시 이벤트 바인딩
         * @private
         */
        _bindElementEvent: function() {
            // 데이트 피커 엘리먼트에 이벤트 바인딩.
            $(this._element).on('click', ne.util.bind(this._onClickPicker, this));
            $(this._element).on('keydown', ne.util.bind(this._onKeydownPicker, this));
        },
        /**
         * 레이어가 펼쳐지면 다른 곳을 클릭할 때 달력을 닫히도록 한다.
         * @private
         */
        _bindCloseLayerEvent: function() {
            var layer = ne.util.bind(function(e) {
                if (!$.contains(this._$calendarElement[0], e.target)) {
                    $(document).off('click', layer);
                    this._onKeydownPicker(true);
                    this.close();
                }
            }, this);
            $(document).on('click', layer);
        },
        /**
         * 데이트 객체를 만들어서 리턴한다.
         *
         * @param {Object} datehash
         * @returns {Date}
         * @private
         */
        _getDateObject: function(datehash) {
            if (!datehash) {
                return;
            }
            var date = new Date(datehash.year, datehash.month - 1, datehash.date, 0, 0, 0);
            return date;
        },
        /**
         * 달력의 위치를 조정하고, 달력을 펼친다.
         *
         */
        open: function() {
            // 달력을 물고있는 활성화된 picker가 있으면 닫는다.
            if (this.constructor.enabledPicker) {
                this.constructor.enabledPicker.close();
            }

            var date = this.getDate();
            this._arrangeLayer();
            this._bindToCalendar();

            // 선택영역 제한이 있는지 확인후 선택불가능한 부분을 설정한다.
            if (this._isRestrict) {
                this._bindDrawEventForSelectableRange();
            }

            // 달력 레이어를 뺀 위치에서 마우스 클릭시 달력닫힘
            this._bindCloseLayerEvent();
            // 달력 커스텀이벤트
            this._bindCalendarCustomEvent();

            this._calendar.draw(date.year, date.month, false);
            this._$calendarElement.show();

            this.constructor.enabledPicker = this;
        },
        /**
         * 달력에 걸린 이벤트를 해지하고
         * 달력 레이어를 닫는다.
         */
        close: function() {
            this._unbindClick();
            this._unbindCalendarEvent();
            this._$calendarElement.hide();
        },
        /**
         * 캘린더를 해당 레이어 아래로 이동시킨다.
         *
         * @private
         */
        _arrangeLayer: function() {

            var element = this._$calendarElement,
                bound = this._getBoundingClientRect();

            element.css({
                position: 'absolute',
                left: bound.left + 'px',
                top: bound.bottom + 'px'
            });

        },
        /**
         * 앨리먼트의 BoundingClientRect를 구한다.
         * @param {HTMLElement} element
         * @returns {Object}
         * @private
         */
        _getBoundingClientRect: function(element) {
            element = element || this._element;

            var bound = element.getBoundingClientRect(),
                ceil = Math.ceil;

            bound = {
                left: ceil(bound.left),
                top: ceil(bound.top),
                bottom: ceil(bound.bottom),
                right: ceil(bound.right)
            };

            return bound;
        },
        /**
         * 캘린더가 변경될 때마다 데이터를 갱신하는 이벤트를 검.
         *
         * @private
         */
        _bindToCalendar: function() {
            this._calendar.on('afterDraw', ne.util.bind(function(data) {
                this.setDate(data.year, data.month, data.date);
            }, this));
        },
        /**
         * 앨리먼트에 데이터를 입력한다.
         *
         * @param {Object} date
         */
        insertDate: function(date) {
            console.log(date);
            this._element.value = this._formed(date);
            this.close();
        },
        /**
         * 현재 날짜해시를 받아온다.
         *
         * @returns {Object}
         */
        getDate: function() {
            return this._date;
        },
        /**
         * 데이터 저장
         * @param {String} year 연도
         * @param {String} month 월
         * @param {String} date 날짜
         */
        setDate: function(year, month, date) {
            this._date = this._date || {};
            this._date.year = year || this._date.year;
            this._date.month = month || this._date.month;
            this._date.date = date || this._date.date;
        },
        /**
         * 날짜 폼을 변경한다.
         * @param {String} form
         */
        setForm: function(form) {
            this._dateForm = form || this._dateForm;
        },
        /**
         * 달력에 이벤트를 붙인다.
         * @private
         */
        _bindClick: function() {
            if (!ne.util.isFunction(this._binder)) {
                this._binder = ne.util.bind(this._onClickCalendar, this);
            }
            var $week = this._$calendarElement;
            if (this._isRestrict) {
                $week.find('.' + this._selectableClass).on('click', this._binder);
            } else {
                $week.on('click', this._binder);
            }
        },
        /**
         * 달력 이벤트를 제거한다
         * @private
         */
        _unbindClick: function() {
            var $week = this._$calendarElement;
            if (this._isRestrict) {
                $week.find('.' + this._selectableClass).off('click');
            } else {
                $week.off('click');
            }
        },
        /**
         * 피커 이벤트 핸들러.
         * @private
         */
        _onClickPicker: function(e) {
            e.stopPropagation();
            this.open();
        },
        /**
         * 인풋 상자에서 엔터를 쳤을 경우 이벤트 처리
         * @private
         */
        _onKeydownPicker: function(e) {
            if (e !== true && e.keyCode !== 13) {
                return;
            }
            var value = this._element.value,
                date;

            if (this._isReadOnly || e === true) {
                date = this.getDate();
                this.insertDate(date);
            } else {
                date = this._checkValidDate(value);
                if (date) {
                    this.setDate(date.year, date.month, date.date);
                    this.insertDate(date);
                }
            }
        },
        /**
         * 유효한 날짜 폼인지 확인한다.
         * @param {(Number|String)} value
         * @returns {Object}
         * @private
         */
        _checkValidDate: function(value) {

            var reg = /^([19|20])*\d{2}([-|\/])*(0[1-9]|1[012])([-|\/])*(0[1-9]|[12][0-9]|3[0-1])$/,
                date;

            if (reg.test(value)) {
                date = this._extractDate(value);
                if (!this._checkRestrict(date)) {
                    return date;
                }
            }
        },
        /**
         * 클릭시 발생한 이벤트
         * @param {Event} e
         * @private
         */
        _onClickCalendar: function(e) {
            e.stopPropagation();
            var target = e.target,
                value = (target.innerText || target.textContent || target.nodeValue),
                insertValue;
            if (!isNaN(Number(value))) {
                this.setDate(null, null, value);
                this._calendar.off('draw');

                insertValue = this.getDate();
                this.insertDate(insertValue);

            }
        },
        /**
         * 날짜 해쉬를 받아 양식에 맞춘 값을 생성해 돌려준다.
         *
         * @param {Object} hash 날짜 해시 값
         * @return {String} 폼에 맞춘 날짜 스트링
         * @private
         */
        _formed: function(hash) {
            hash = hash || this._date;
            var year = hash.year,
                month = hash.month,
                date = hash.date;

            month = month < 10 ? ('0' + Number(month)) : month;
            date = date < 10 ? ('0' + Number(date)) : date;

            var form = this._dateForm,
                replaceMap = {
                    yyyy: year,
                    yy: ((year).toString()).substr(2, 2),
                    mm: month,
                    m: Number(month),
                    dd: date,
                    d: Number(date)
                };
            form = form.replace(/yyyy|yy|mm|m|dd|d/g, function callback(key) {
                return replaceMap[key] || '';
            });
            return form;
        },
        /**
         * 데이터를 돌려준다.
         * @param {String} str 사용자가 입력한 텍스트
         * @returns {Object}
         * @private
         */
        _extractDate: function(str) {
            var temp,
                len;
            str = str.replace(/[-|\/]/g, '');
            temp = str.split('');
            len = str.length;
            temp = ne.util.map(temp, function(el, idx) {
                if (idx % 2) {
                    if (idx === 1 && len > 7) {
                        return el;
                    }
                    return el + '-';
                } else {
                    return el;
                }
            });
            // 기본세팅에 맞춰 6자리 날짜입력시, 연도 자릿수를 4자리로 맞춰준다.
            if (len < 7) {
                temp[0] = this._defaultCentury + temp[0];
            }

            str = temp.join('');
            temp = str.split('-');
            return { year: temp[0], month: temp[1], date: temp[2] };
        },
        /**
         * 선택 불가능한 날짜인지 확인한다.
         * @param {Object} datehash 비교할 날짜데이터
         * @returns {boolean}
         * @private
         */
        _checkRestrict: function(datehash) {

            var start = this._startEdge,
                end = this._endEdge,
                date = this._getDateObject(datehash);

            return date < start || date > end;
        },
        /**
         * 선택 가능한 영역에 클래스를 입힌다.
         * @private
         */
        _bindDrawEventForSelectableRange: function() {
            this._calendar.on('draw', ne.util.bind(function(data) {
                if (!this._checkRestrict(data)) {
                    data.$dateContainer.addClass(this._selectableClass);
                }
            }, this));
        },
        /**
         * 달력이 갱신될때 이벤트를 건다.
         * @private
         */
        _bindCalendarCustomEvent: function() {
            this._calendar.on('beforeDraw', ne.util.bind(function() {
                this._unbindClick();
            }, this));
            this._calendar.on('afterDraw', ne.util.bind(function() {
                this._bindClick();
            }, this));
        },
        /**
         * 달력이 닫힐때 이벤트 제거
         * @private
         */
        _unbindCalendarEvent: function() {
            this._calendar.off();
        }
    });


})();