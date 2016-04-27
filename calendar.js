(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
tui.util.defineNamespace('tui.component.Calendar', require('./src/js/calendar'));

},{"./src/js/calendar":2}],2:[function(require,module,exports){
/**
 * @fileoverview Calendar component(from Pug component)
 * @author NHN Ent. FE dev team. <dl_javascript@nhnent.com>
 * @dependency jquery ~1.8.3, ne-code-snippet ~1.0.2
 */

'use strict';
var utils = require('./utils');

var util = tui.util,
    CONSTANTS = {
        relativeMonthValueKey: 'relativeMonthValue',
        prevYear: 'prev-year',
        prevMonth: 'prev-month',
        nextYear: 'next-year',
        nextMonth: 'next-month',
        calendarHeader: null,
        calendarBody: null,
        calendarFooter: null,
        defaultClassPrefixRegExp: /calendar-/g,
        titleRegExp: /yyyy|yy|mm|m|M/g,
        titleYearRegExp: /yyyy|yy/g,
        titleMonthRegExp: /mm|m|M/g,
        todayRegExp: /yyyy|yy|mm|m|M|dd|d|D/g
    };

CONSTANTS.calendarHeader = [
    '<div class="calendar-header">',
    '<a href="#" class="rollover calendar-btn-' + CONSTANTS.prevYear + '">이전해</a>',
    '<a href="#" class="rollover calendar-btn-' + CONSTANTS.prevMonth + '">이전달</a>',
    '<strong class="calendar-title"></strong>',
    '<a href="#" class="rollover calendar-btn-' + CONSTANTS.nextMonth + '">다음달</a>',
    '<a href="#" class="rollover calendar-btn-' + CONSTANTS.nextYear + '">다음해</a>',
    '</div>'].join('');

CONSTANTS.calendarBody = [
    '<div class="calendar-body">',
        '<table>',
            '<thead>',
                '<tr>',
                   '<th class="calendar-sun">Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fa</th><th class="calendar-sat">Sa</th>',
                '</tr>',
            '</thead>',
            '<tbody>',
                '<tr class="calendar-week">',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                '</tr>',
            '</tbody>',
        '</table>',
    '</div>'].join('');

CONSTANTS.calendarFooter = [
    '<div class="calendar-footer">',
        '<p>오늘 <em class="calendar-today"></em></p>',
    '</div>'].join('');


/**
 * Calendar component class
 * @constructor
 * @param {Object} [option] A options for initialize
 *     @param {HTMLElement} option.element A root element
 *     @param {string} [option.classPrefix="calendar-"] A prefix class for markup structure
 *     @param {number} [option.year=this year] A year for initialize
 *     @param {number} [option.month=this month] A month for initialize
 *     @param {string} [option.titleFormat="yyyy-mm"] A title format. This component find title element by className '[prefix]title'
 *     @param {string} [option.todayFormat = "yyyy Year mm Month dd Day (D)"] A today format. This component find today element by className '[prefix]today'
 *     @param {string} [option.yearTitleFormat = "yyyy"] A year title formant. This component find year title element by className '[prefix]year'
 *     @param {string} [option.monthTitleFormat = "m"] A month title format. This component find month title element by className이 '[prefix]month'
 *     @param {Array} [option.monthTitles = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]] A label of each month.
 *     @param {Array} [option.dayTitles = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]] A label for day. If you set the other option todayFormat 'D', you can use this name.
 * @example
 * var calendar = new tui.component.Calendar({
 *                    element: '#layer',
 *                    classPrefix: "calendar-",
 *                    year: 1983,
 *                    month: 5,
 *                    titleFormat: "yyyy-mm", // title
 *                    todayFormat: "yyyy / mm / dd (D)" // today
 *                    yearTitleFormat: "yyyy", // year title
 *                    monthTitleFormat: "m", // month title
 *                    monthTitles: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
 *                    dayTitles: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] // 요일들
 *             });
 **/
var Calendar = util.defineClass( /** @lends Calendar.prototype */ {
    init: function(option) {
        /**
         * Set options
         * option: {
         *     classPrefix: string,
         *     year: number
         *     month: number
         *     titleFormat: string,
         *     todayFormat: string,
         *     yearTitleFormat: string,
         *     monthTitleFormat: string,
         *     monthTitles: Array,
         *     dayTitles: Array,
         * }
         * @private
         */
        this._option = {};

        /**
         * A day that is shown
         * @type {{year: number, month: number}}
         */
        this._shownDate = {year: 0, month: 1, date: 1};

        /**======================================
         * jQuery - HTMLElement
         *======================================*/
        /**
         * =========Root Element=========
         * If options do not include element, this component jedge initialize element without options
         * @type {jQuery}
         * @private
         */
        this.$element = $(option.element || arguments[0]);

        /**
         * =========Header=========
         * @type {jQuery}
         */
        this.$header = null;

        /**
         * A tilte
         * @type {jQuery}
         */
        this.$title = null;

        /**
         * A year title
         * @type {jQuery}
         */
        this.$titleYear = null;

        /**
         * A month title
         * @type {jQuery}
         */
        this.$titleMonth = null;

        /**
         * =========Body=========
         * @type {jQuery}
         */
        this.$body = null;

        /**
         * A template of week
         * @type {jQuery}
         */
        this.$weekTemplate = null;

        /**
         * A week parent element
         * @type {jQuery}
         */
        this.$weekAppendTarget = null;

        /**-------- footer --------*/
        this.$footer = null;

        /** Today */
        this.$today = null;

        /**
         * A date element
         * @type {jQuery}
         * @private
         */
        this._$dateElement = null;

        /**
         * A date wrapper element
         * @type {jQuery}
         * @private
         */
        this._$dateContainerElement = null;

        /**
         * =========Footer=========
         * @type {jQuery}
         */
        this.$footer = null;

        /**
         * Today element
         * @type {jQuery}
         */
        this.$today = null;

        /** Set default options */
        this._setDefault(option);
    },

    /**
     * Set defulat opitons
     * @param {Object} [option] A options to initialzie component
     * @private
     */
    _setDefault: function(option) {
        this._setOption(option);
        this._assignHTMLElements();
        this.draw(this._option.year, this._option.month, false);
    },

    /**
     * Save options
     * @param {Object} [option] A options to initialize component
     * @private
     */
    _setOption: function(option) {
        var instanceOption = this._option,
            today = utils.getDateHashTable();

        var defaultOption = {
            classPrefix: 'calendar-',
            year: today.year,
            month: today.month,
            titleFormat: 'yyyy-mm',
            todayFormat: 'yyyy/mm/dd (D)',
            yearTitleFormat: 'yyyy',
            monthTitleFormat: 'm',
            monthTitles: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
        util.extend(instanceOption, defaultOption, option);
    },

    /**
     * Set element to filed
     * @private
     */
    _assignHTMLElements: function() {
        var classPrefix = this._option.classPrefix,
            $element = this.$element,
            classSelector = '.' + classPrefix;

        this._assignHeader($element, classSelector, classPrefix);
        this._assignBody($element, classSelector, classPrefix);
        this._assignFooter($element, classSelector, classPrefix);
    },

    /**
     * Register header element.
     * @param {jQuery} $element The root element of component
     * @param {string} classSelector A class selector
     * @param {string} classPrefix A prefix for class
     * @private
     */
    _assignHeader: function($element, classSelector, classPrefix) {
        var $header = $element.find(classSelector + 'header'),
            headerTemplate,
            defaultClassPrefixRegExp,
            key = CONSTANTS.relativeMonthValueKey,
            btnClassName = 'btn-';

        if (!$header.length) {
            headerTemplate = CONSTANTS.calendarHeader;
            defaultClassPrefixRegExp = CONSTANTS.defaultClassPrefixRegExp;

            $header = $(headerTemplate.replace(defaultClassPrefixRegExp, classPrefix));
            $element.append($header);
        }
        // button
        $header.find(classSelector + btnClassName + CONSTANTS.prevYear).data(key, -12);
        $header.find(classSelector + btnClassName + CONSTANTS.prevMonth).data(key, -1);
        $header.find(classSelector + btnClassName + CONSTANTS.nextYear).data(key, 12);
        $header.find(classSelector + btnClassName + CONSTANTS.nextMonth).data(key, 1);

        // title text
        this.$title = $header.find(classSelector + 'title');
        this.$titleYear = $header.find(classSelector + 'title-year');
        this.$titleMonth = $header.find(classSelector + 'title-month');
        this.$header = $header;
        this._attachEventToRolloverBtn();
    },

    /**
     * Register body element
     * @param {jQuery} $element The root elment of component
     * @param {string} classSelector A selector
     * @param {string} classPrefix A prefix for class
     * @private
     */
    _assignBody: function($element, classSelector, classPrefix) {
        var $body = $element.find(classSelector + 'body'),
            $weekTemplate,
            bodyTemplate,
            defaultClassPrefixRegExp;

        if (!$body.length) {
            bodyTemplate = CONSTANTS.calendarBody;
            defaultClassPrefixRegExp = CONSTANTS.defaultClassPrefixRegExp;

            $body = $(bodyTemplate.replace(defaultClassPrefixRegExp, classPrefix));
            $element.append($body);
        }
        $weekTemplate = $body.find(classSelector + 'week');
        this.$weekTemplate = $weekTemplate.clone(true);
        this.$weekAppendTarget = $weekTemplate.parent();
        this.$body = $body;
    },

    /**
     * Register footer element
     * @param {jQuery} $element The root element of component
     * @param {string} classSelector A selector
     * @param {string} classPrefix A prefix for class
     * @private
     */
    _assignFooter: function($element, classSelector, classPrefix) {
        var $footer = $element.find(classSelector + 'footer'),
            footerTemplate,
            defaultClassPrefixRegExp;

        if (!$footer.length) {
            footerTemplate = CONSTANTS.calendarFooter;
            defaultClassPrefixRegExp = CONSTANTS.defaultClassPrefixRegExp;

            $footer = $(footerTemplate.replace(defaultClassPrefixRegExp, classPrefix));
            $element.append($footer);
        }
        this.$today = $footer.find(classSelector + 'today');
        this.$footer = $footer;
    },

    /**
     * Set navigation event
     * @private
     */
    _attachEventToRolloverBtn: function() {
        var btns = this.$header.find('.rollover');

        btns.on('click', util.bind(function() {
            var relativeMonthValue = $(event.target).data(CONSTANTS.relativeMonthValueKey);
            this.draw(0, relativeMonthValue, true);
            event.preventDefault();
        }, this));
    },

    /**
     * Get Hash data to drow calendar
     * @param {number} year A year
     * @param {number} month A month
     * @param {boolean} [isRelative]  Whether is related other value or not
     * @returns {{year: number, month: number}} A date hash
     * @private
     */
    _getDateForDrawing: function(year, month, isRelative) {
        var nDate = this.getDate(),
            relativeDate;

        nDate.date = 1;
        if (!util.isNumber(year) && !util.isNumber(month)) {
            return nDate;
        }

        if (isRelative) {
            relativeDate = utils.getRelativeDate(year, month, 0, nDate);
            nDate.year = relativeDate.year;
            nDate.month = relativeDate.month;
        } else {
            nDate.year = year || nDate.year;
            nDate.month = month || nDate.month;
        }

        return nDate;
    },

    /**
     * Judge to redraw calendar
     * @param {number} year A year
     * @param {number} month A month
     * @returns {boolean} reflow
     * @private
     */
    _isNecessaryForDrawing: function(year, month) {
        var shownDate = this._shownDate;

        return (shownDate.year !== year || shownDate.month !== month);
    },

    /**
     * Draw calendar text
     * @param {{year: number, month: number}} dateForDrawing Tha hash that show up on calendar
     * @private
     */
    _setCalendarText: function(dateForDrawing) {
        var year = dateForDrawing.year,
            month = dateForDrawing.month;

        this._setCalendarToday();
        this._setCalendarTitle(year, month);
    },

    /**
     * Draw dates by month.
     * @param {{year: number, month: number}} dateForDrawing A date to draw
     * @param {string} classPrefix A class prefix
     * @private
     */
    _drawDates: function(dateForDrawing, classPrefix) {
        var year = dateForDrawing.year,
            month = dateForDrawing.month,
            dayInWeek = 0,
            datePrevMonth = utils.getRelativeDate(0, -1, 0, dateForDrawing),
            dateNextMonth = utils.getRelativeDate(0, 1, 0, dateForDrawing),
            dates = [],
            firstDay = utils.getFirstDay(year, month),
            indexOfLastDate = this._fillDates(year, month, dates);

        util.forEach(dates, function(date, i) {
            var isPrevMonth = false,
                isNextMonth = false,
                $dateContainer = $(this._$dateContainerElement[i]),
                tempYear = year,
                tempMonth = month,
                eventData;

            if (i < firstDay) {
                isPrevMonth = true;
                $dateContainer.addClass(classPrefix + CONSTANTS.prevMonth);
                tempYear = datePrevMonth.year;
                tempMonth = datePrevMonth.month;
            } else if (i > indexOfLastDate) {
                isNextMonth = true;
                $dateContainer.addClass(classPrefix + CONSTANTS.nextMonth);
                tempYear = dateNextMonth.year;
                tempMonth = dateNextMonth.month;
            }

            // Weekend
            this._setWeekend(dayInWeek, $dateContainer, classPrefix);

            // Today
            if (this._isToday(tempYear, tempMonth, date)) {
                $dateContainer.addClass(classPrefix + 'today');
            }

            eventData = {
                $date: $(this._$dateElement.get(i)),
                $dateContainer: $dateContainer,
                year: tempYear,
                month: tempMonth,
                date: date,
                isPrevMonth: isPrevMonth,
                isNextMonth: isNextMonth,
                html: date
            };
            $(eventData.$date).html(eventData.html.toString());
            dayInWeek = (dayInWeek + 1) % 7;

            /**
             * Fire draw event when calendar draw each date.
             * @api
             * @event Calendar#draw
             * @param {string} type A name of custom event
             * @param {boolean} isPrevMonth Whether the draw day is last month or not
             * @param {boolean} isNextMonth Wehter the draw day is next month or not
             * @param {jQuery} $date The element have date html
             * @param {jQuery} $dateContainer Child element that has className [prefix]week. It is possible this element equel elDate.
             * @param {number} date A draw date
             * @param {number} month A draw month
             * @param {number} year A draw year
             * @param {string} html A html string
             * @example
             * // draw custom even handler
             * calendar.on('draw', function(drawEvent){ ... });
             **/
            this.fire('draw', eventData);
        }, this);
    },


    /**
     * Jedge the input date is today.
     * @param {number} year A year
     * @param {number} month A month
     * @param {number} date A date
     * @returns {boolean}
     * @private
     */
    _isToday: function(year, month, date) {
        var today = utils.getDateHashTable();

        return (
            today.year === year &&
            today.month === month &&
            today.date === date
        );
    },

    /**
     * Make one week tempate.
     * @param {number} year  A year
     * @param {number} month A month
     * @private
     */
    _setWeeks: function(year, month) {
        var $elWeek,
            weeks = utils.getWeeks(year, month),
            i;
        for (i = 0; i < weeks; i += 1) {
            $elWeek = this.$weekTemplate.clone(true);
            $elWeek.appendTo(this.$weekAppendTarget);
            this._weekElements.push($elWeek);
        }
    },

    /**
     * Save draw dates to array
     * @param {string} year A draw year
     * @param {string} month A draw month
     * @param {Array} dates A draw date
     * @return {number} index of last date
     * @private
     */
    _fillDates: function(year, month, dates) {
        var firstDay = utils.getFirstDay(year, month),
            lastDay = utils.getLastDay(year, month),
            lastDate = utils.getLastDate(year, month),
            datePrevMonth = utils.getRelativeDate(0, -1, 0, {year: year, month: month, date: 1}),
            prevMonthLastDate = utils.getLastDate(datePrevMonth.year, datePrevMonth.month),
            indexOfLastDate,
            i;

        if (firstDay > 0) {
            for (i = prevMonthLastDate - firstDay; i < prevMonthLastDate; i += 1) {
                dates.push(i + 1);
            }
        }
        for (i = 1; i < lastDate + 1; i += 1) {
            dates.push(i);
        }
        indexOfLastDate = dates.length - 1;
        for (i = 1; i < 7 - lastDay; i += 1) {
            dates.push(i);
        }

        return indexOfLastDate;
    },

    /**
     * Set weekend
     * @param {number} day A date
     * @param {jQuery} $dateContainer A container element for date
     * @param {string} classPrefix A prefix of class
     * @private
     */
    _setWeekend: function(day, $dateContainer, classPrefix) {
        if (day === 0) {
            $dateContainer.addClass(classPrefix + 'sun');
        } else if (day === 6) {
            $dateContainer.addClass(classPrefix + 'sat');
        }
    },

    /**
     * Clear calendar
     * @private
     */
    _clear: function() {
        this._weekElements = [];
        this.$weekAppendTarget.empty();
    },

    /**
     * Draw title with format option.
     * @param {number} year A value of year (ex. 2008)
     * @param {(number|string)} month A month (1 ~ 12)
     * @private
     **/
    _setCalendarTitle: function(year, month) {
        var option = this._option,
            titleFormat = option.titleFormat,
            replaceMap,
            reg;

        month = this._prependLeadingZero(month);
        replaceMap = this._getReplaceMap(year, month);

        reg = CONSTANTS.titleRegExp;
        this._setDateTextInCalendar(this.$title, titleFormat, replaceMap, reg);

        reg = CONSTANTS.titleYearRegExp;
        this._setDateTextInCalendar(this.$titleYear, option.yearTitleFormat, replaceMap, reg);

        reg = CONSTANTS.titleMonthRegExp;
        this._setDateTextInCalendar(this.$titleMonth, option.monthTitleFormat, replaceMap, reg);
    },

    /**
     * Update title
     * @param {jQuery|HTMLElement} element A update element
     * @param {string} form A update form
     * @param {Object} map A object that has value matched regExp
     * @param {RegExp} reg A regExp to chagne form
     * @private
     */
    _setDateTextInCalendar: function(element, form, map, reg) {
        var title,
            $el = $(element);

        if (!$el.length) {
            return;
        }
        title = this._getConvertedTitle(form, map, reg);
        $el.text(title);
    },

    /**
     * Get map data for form
     * @param {string|number} year A year
     * @param {string|number} month A month
     * @param {string|number} [date] A day
     * @returns {Object} ReplaceMap
     * @private
     */
    _getReplaceMap: function(year, month, date) {
        var option = this._option,
            yearSub = (year.toString()).substr(2, 2),
            monthLabel = option.monthTitles[month - 1],
            labelKey = new Date(year, month - 1, date || 1).getDay(),
            dayLabel = option.dayTitles[labelKey];

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
     * Chage text and return.
     * @param {string} str A text to chagne
     * @param {Object} map A chagne key, value set
     * @param {RegExp} reg A regExp to chagne
     * @returns {string}
     * @private
     */
    _getConvertedTitle: function(str, map, reg) {
        str = str.replace(reg, function(matchedString) {
            return map[matchedString] || '';
        });
        return str;
    },

    /**
     * Set today
     * @private
     */
    _setCalendarToday: function() {
        var $today = this.$today,
            todayFormat,
            today,
            year,
            month,
            date,
            replaceMap,
            reg;

        if (!$today.length) {
            return;
        }

        today = utils.getDateHashTable();
        year = today.year;
        month = this._prependLeadingZero(today.month);
        date = this._prependLeadingZero(today.date);
        todayFormat = this._option.todayFormat;
        replaceMap = this._getReplaceMap(year, month, date);
        reg = CONSTANTS.todayRegExp;
        this._setDateTextInCalendar($today, todayFormat, replaceMap, reg);
    },

    /**
     * Chagne number 0~9 to '00~09'
     * @param {number} number number
     * @returns {string}
     * @private
     * @example
     *  this._prependLeadingZero(0); //  '00'
     *  this._prependLeadingZero(9); //  '09'
     *  this._prependLeadingZero(12); //  '12'
     */
    _prependLeadingZero: function(number) {
        var prefix = '';

        if (number < 10) {
            prefix = '0';
        }
        return prefix + number;
    },

    /**
     * Draw calendar
     * @api
     * @param {number} [year] A year (ex. 2008)
     * @param {number} [month] A month (1 ~ 12)
     * @param {Boolean} [isRelative]  A year and month is related
     * @example
     * calendar.draw(); // Draw with now date.
     * calendar.draw(2008, 12); // Draw 2008/12
     * calendar.draw(null, 12); // Draw current year/12
     * calendar.draw(2010, null); // Draw 2010/current month
     * calendar.draw(0, 1, true); // Draw next month
     * calendar.draw(-1, null, true); // Draw prev year
     **/
    draw: function(year, month, isRelative) {
        var dateForDrawing = this._getDateForDrawing(year, month, isRelative),
            isReadyForDrawing = this.invoke('beforeDraw', dateForDrawing),
            classPrefix;

        /**===============
         * beforeDraw
         =================*/
        if (!isReadyForDrawing) {
            return;
        }

        /**===============
         * draw
         =================*/
        year = dateForDrawing.year;
        month = dateForDrawing.month;

        classPrefix = this._option.classPrefix;
        this._clear();
        this._setCalendarText(dateForDrawing);

        // weeks
        this._setWeeks(year, month);
        this._$dateElement = $('.' + classPrefix + 'date', this.$weekAppendTarget);
        this._$dateContainerElement = $('.' + classPrefix + 'week > *', this.$weekAppendTarget);

        // dates
        this.setDate(year, month);
        this._drawDates(dateForDrawing, classPrefix);
        this.$element.show();

        /**===============
         * afterDraw
         ================*/
        this.fire('afterDraw', dateForDrawing);
    },

    /**
     * Return current year and month(just shown).
     * @api
     * @returns {{year: number, month: number}}
     * @example
     *  getDate(); => { year: xxxx, month: xx };
     */
    getDate: function() {
        return {
            year: this._shownDate.year,
            month: this._shownDate.month
        };
    },

    /**
     * Set date
     * @api
     * @param {number} [year] A year (ex. 2008)
     * @param {number} [month] A month (1 ~ 12)
     * @example
     *  setDate(1984, 04);
     **/
    setDate: function(year, month) {
        var date = this._shownDate;
        date.year = util.isNumber(year) ? year : date.year;
        date.month = util.isNumber(month) ? month : date.month;
    }
});

util.CustomEvents.mixin(Calendar);
module.exports = Calendar;

},{"./utils":3}],3:[function(require,module,exports){
/**
 * @fileoverview Utils for calendar component
 * @author NHN Net. FE dev team. <dl_javascript@nhnent.com>
 * @dependency ne-code-snippet ~1.0.2
 */

'use strict';

/**
 * Utils of calendar
 * @namespace utils
 */
var utils = {
    /**
     * Return date hash by parameter.
     *  if there are 3 parameter, the parameter is corgnized Date object
     *  if there are no parameter, return today's hash date
     * @function getDateHashTable
     * @memberof utils
     * @param {Date|number} [year] A date instance or year
     * @param {number} [month] A month
     * @param {number} [date] A date
     * @returns {{year: *, month: *, date: *}} 
     */
    getDateHashTable: function(year, month, date) {
        var nDate;

        if (arguments.length < 3) {
            nDate = arguments[0] || new Date();

            year = nDate.getFullYear();
            month = nDate.getMonth() + 1;
            date = nDate.getDate();
        }

        return {
            year: year,
            month: month,
            date: date
        };
    },

    /**
     * Return today that saved on component or create new date.
     * @function getToday
     * @returns {{year: *, month: *, date: *}}
     * @memberof utils
     */
    getToday: function() {
       return utils.getDateHashTable();
    },

    /**
     * Get weeks count by paramenter
     * @function getWeeks
     * @param {number} year A year
     * @param {number} month A month
     * @return {number} 주 (4~6)
     * @memberof utils
     **/
    getWeeks: function(year, month) {
        var firstDay = this.getFirstDay(year, month),
            lastDate = this.getLastDate(year, month);

        return Math.ceil((firstDay + lastDate) / 7);
    },

    /**
     * Get unix time from date hash
     * @function getTime
     * @param {Object} date A date hash
     * @param {number} date.year A year
     * @param {number} date.month A month
     * @param {number} date.date A date
     * @return {number} 
     * @memberof utils
     * @example
     * utils.getTime({year:2010, month:5, date:12}); // 1273590000000
     **/
    getTime: function(date) {
        return this.getDateObject(date).getTime();
    },

    /**
     * Get which day is first by parameters that include year and month information.
     * @function getFirstDay
     * @param {number} year A year
     * @param {number} month A month
     * @return {number} (0~6)
     * @memberof utils
     **/
    getFirstDay: function(year, month) {
        return new Date(year, month - 1, 1).getDay();
    },

    /**
     * Get which day is last by parameters that include year and month information.
     * @function getLastDay
     * @param {number} year A year
     * @param {number} month A month
     * @return {number} (0~6)
     * @memberof utils
     **/
    getLastDay: function(year, month) {
        return new Date(year, month, 0).getDay();
    },

    /**
     * Get last date by parameters that include year and month information.
     * @function
     * @param {number} year A year
     * @param {number} month A month
     * @return {number} (1~31)
     * @memberof utils
     **/
    getLastDate: function(year, month) {
        return new Date(year, month, 0).getDate();
    },

    /**
     * Get date instance.
     * @function getDateObject
     * @param {Object} date A date hash
     * @return {Date} Date  
     * @memberof utils
     * @example
     *  utils.getDateObject({year:2010, month:5, date:12});
     *  utils.getDateObject(2010, 5, 12); //year,month,date
     **/
    getDateObject: function(date) {
        if (arguments.length === 3) {
            return new Date(arguments[0], arguments[1] - 1, arguments[2]);
        }
        return new Date(date.year, date.month - 1, date.date);
    },

    /**
     * Get related date hash with parameters that include date information.
     * @function getRelativeDate
     * @param {number} year A related value for year(you can use +/-)
     * @param {number} month A related value for month (you can use +/-)
     * @param {number} date A related value for day (you can use +/-)
     * @param {Object} dateObj standard date hash
     * @return {Object} dateObj 
     * @memberof utils
     * @example
     *  utils.getRelativeDate(1, 0, 0, {year:2000, month:1, date:1}); // {year:2001, month:1, date:1}
     *  utils.getRelativeDate(0, 0, -1, {year:2010, month:1, date:1}); // {year:2009, month:12, date:31}
     **/
    getRelativeDate: function(year, month, date, dateObj) {
        var nYear = (dateObj.year + year),
            nMonth = (dateObj.month + month - 1),
            nDate = (dateObj.date + date),
            nDateObj = new Date(nYear, nMonth, nDate);

        return utils.getDateHashTable(nDateObj);
    }
};

module.exports = utils;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9jYWxlbmRhci5qcyIsInNyYy9qcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6eEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidHVpLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCd0dWkuY29tcG9uZW50LkNhbGVuZGFyJywgcmVxdWlyZSgnLi9zcmMvanMvY2FsZW5kYXInKSk7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2FsZW5kYXIgY29tcG9uZW50KGZyb20gUHVnIGNvbXBvbmVudClcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBqcXVlcnkgfjEuOC4zLCBuZS1jb2RlLXNuaXBwZXQgfjEuMC4yXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbCA9IHR1aS51dGlsLFxuICAgIENPTlNUQU5UUyA9IHtcbiAgICAgICAgcmVsYXRpdmVNb250aFZhbHVlS2V5OiAncmVsYXRpdmVNb250aFZhbHVlJyxcbiAgICAgICAgcHJldlllYXI6ICdwcmV2LXllYXInLFxuICAgICAgICBwcmV2TW9udGg6ICdwcmV2LW1vbnRoJyxcbiAgICAgICAgbmV4dFllYXI6ICduZXh0LXllYXInLFxuICAgICAgICBuZXh0TW9udGg6ICduZXh0LW1vbnRoJyxcbiAgICAgICAgY2FsZW5kYXJIZWFkZXI6IG51bGwsXG4gICAgICAgIGNhbGVuZGFyQm9keTogbnVsbCxcbiAgICAgICAgY2FsZW5kYXJGb290ZXI6IG51bGwsXG4gICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDogL2NhbGVuZGFyLS9nLFxuICAgICAgICB0aXRsZVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNL2csXG4gICAgICAgIHRpdGxlWWVhclJlZ0V4cDogL3l5eXl8eXkvZyxcbiAgICAgICAgdGl0bGVNb250aFJlZ0V4cDogL21tfG18TS9nLFxuICAgICAgICB0b2RheVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNfGRkfGR8RC9nXG4gICAgfTtcblxuQ09OU1RBTlRTLmNhbGVuZGFySGVhZGVyID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItaGVhZGVyXCI+JyxcbiAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJvbGxvdmVyIGNhbGVuZGFyLWJ0bi0nICsgQ09OU1RBTlRTLnByZXZZZWFyICsgJ1wiPuydtOyghO2VtDwvYT4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMucHJldk1vbnRoICsgJ1wiPuydtOyghOuLrDwvYT4nLFxuICAgICc8c3Ryb25nIGNsYXNzPVwiY2FsZW5kYXItdGl0bGVcIj48L3N0cm9uZz4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMubmV4dE1vbnRoICsgJ1wiPuuLpOydjOuLrDwvYT4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMubmV4dFllYXIgKyAnXCI+64uk7J2M7ZW0PC9hPicsXG4gICAgJzwvZGl2PiddLmpvaW4oJycpO1xuXG5DT05TVEFOVFMuY2FsZW5kYXJCb2R5ID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItYm9keVwiPicsXG4gICAgICAgICc8dGFibGU+JyxcbiAgICAgICAgICAgICc8dGhlYWQ+JyxcbiAgICAgICAgICAgICAgICAnPHRyPicsXG4gICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImNhbGVuZGFyLXN1blwiPlN1PC90aD48dGg+TW88L3RoPjx0aD5UdTwvdGg+PHRoPldlPC90aD48dGg+VGg8L3RoPjx0aD5GYTwvdGg+PHRoIGNsYXNzPVwiY2FsZW5kYXItc2F0XCI+U2E8L3RoPicsXG4gICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICc8L3RoZWFkPicsXG4gICAgICAgICAgICAnPHRib2R5PicsXG4gICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImNhbGVuZGFyLXdlZWtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgJzwvdGFibGU+JyxcbiAgICAnPC9kaXY+J10uam9pbignJyk7XG5cbkNPTlNUQU5UUy5jYWxlbmRhckZvb3RlciA9IFtcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWZvb3RlclwiPicsXG4gICAgICAgICc8cD7smKTripggPGVtIGNsYXNzPVwiY2FsZW5kYXItdG9kYXlcIj48L2VtPjwvcD4nLFxuICAgICc8L2Rpdj4nXS5qb2luKCcnKTtcblxuXG4vKipcbiAqIENhbGVuZGFyIGNvbXBvbmVudCBjbGFzc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtIVE1MRWxlbWVudH0gb3B0aW9uLmVsZW1lbnQgQSByb290IGVsZW1lbnRcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi5jbGFzc1ByZWZpeD1cImNhbGVuZGFyLVwiXSBBIHByZWZpeCBjbGFzcyBmb3IgbWFya3VwIHN0cnVjdHVyZVxuICogICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLnllYXI9dGhpcyB5ZWFyXSBBIHllYXIgZm9yIGluaXRpYWxpemVcbiAqICAgICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5tb250aD10aGlzIG1vbnRoXSBBIG1vbnRoIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb24udGl0bGVGb3JtYXQ9XCJ5eXl5LW1tXCJdIEEgdGl0bGUgZm9ybWF0LiBUaGlzIGNvbXBvbmVudCBmaW5kIHRpdGxlIGVsZW1lbnQgYnkgY2xhc3NOYW1lICdbcHJlZml4XXRpdGxlJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLnRvZGF5Rm9ybWF0ID0gXCJ5eXl5IFllYXIgbW0gTW9udGggZGQgRGF5IChEKVwiXSBBIHRvZGF5IGZvcm1hdC4gVGhpcyBjb21wb25lbnQgZmluZCB0b2RheSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF10b2RheSdcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi55ZWFyVGl0bGVGb3JtYXQgPSBcInl5eXlcIl0gQSB5ZWFyIHRpdGxlIGZvcm1hbnQuIFRoaXMgY29tcG9uZW50IGZpbmQgeWVhciB0aXRsZSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF15ZWFyJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLm1vbnRoVGl0bGVGb3JtYXQgPSBcIm1cIl0gQSBtb250aCB0aXRsZSBmb3JtYXQuIFRoaXMgY29tcG9uZW50IGZpbmQgbW9udGggdGl0bGUgZWxlbWVudCBieSBjbGFzc05hbWXsnbQgJ1twcmVmaXhdbW9udGgnXG4gKiAgICAgQHBhcmFtIHtBcnJheX0gW29wdGlvbi5tb250aFRpdGxlcyA9IFtcIkpBTlwiLFwiRkVCXCIsXCJNQVJcIixcIkFQUlwiLFwiTUFZXCIsXCJKVU5cIixcIkpVTFwiLFwiQVVHXCIsXCJTRVBcIixcIk9DVFwiLFwiTk9WXCIsXCJERUNcIl1dIEEgbGFiZWwgb2YgZWFjaCBtb250aC5cbiAqICAgICBAcGFyYW0ge0FycmF5fSBbb3B0aW9uLmRheVRpdGxlcyA9IFtcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXV0gQSBsYWJlbCBmb3IgZGF5LiBJZiB5b3Ugc2V0IHRoZSBvdGhlciBvcHRpb24gdG9kYXlGb3JtYXQgJ0QnLCB5b3UgY2FuIHVzZSB0aGlzIG5hbWUuXG4gKiBAZXhhbXBsZVxuICogdmFyIGNhbGVuZGFyID0gbmV3IHR1aS5jb21wb25lbnQuQ2FsZW5kYXIoe1xuICogICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICcjbGF5ZXInLFxuICogICAgICAgICAgICAgICAgICAgIGNsYXNzUHJlZml4OiBcImNhbGVuZGFyLVwiLFxuICogICAgICAgICAgICAgICAgICAgIHllYXI6IDE5ODMsXG4gKiAgICAgICAgICAgICAgICAgICAgbW9udGg6IDUsXG4gKiAgICAgICAgICAgICAgICAgICAgdGl0bGVGb3JtYXQ6IFwieXl5eS1tbVwiLCAvLyB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIHRvZGF5Rm9ybWF0OiBcInl5eXkgLyBtbSAvIGRkIChEKVwiIC8vIHRvZGF5XG4gKiAgICAgICAgICAgICAgICAgICAgeWVhclRpdGxlRm9ybWF0OiBcInl5eXlcIiwgLy8geWVhciB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIG1vbnRoVGl0bGVGb3JtYXQ6IFwibVwiLCAvLyBtb250aCB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIG1vbnRoVGl0bGVzOiBbXCJKQU5cIiwgXCJGRUJcIiwgXCJNQVJcIiwgXCJBUFJcIiwgXCJNQVlcIiwgXCJKVU5cIiwgXCJKVUxcIiwgXCJBVUdcIiwgXCJTRVBcIiwgXCJPQ1RcIiwgXCJOT1ZcIiwgXCJERUNcIl0sXG4gKiAgICAgICAgICAgICAgICAgICAgZGF5VGl0bGVzOiBbJ3N1bicsICdtb24nLCAndHVlJywgJ3dlZCcsICd0aHUnLCAnZnJpJywgJ3NhdCddIC8vIOyalOydvOuTpFxuICogICAgICAgICAgICAgfSk7XG4gKiovXG52YXIgQ2FsZW5kYXIgPSB1dGlsLmRlZmluZUNsYXNzKCAvKiogQGxlbmRzIENhbGVuZGFyLnByb3RvdHlwZSAqLyB7XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgb3B0aW9uc1xuICAgICAgICAgKiBvcHRpb246IHtcbiAgICAgICAgICogICAgIGNsYXNzUHJlZml4OiBzdHJpbmcsXG4gICAgICAgICAqICAgICB5ZWFyOiBudW1iZXJcbiAgICAgICAgICogICAgIG1vbnRoOiBudW1iZXJcbiAgICAgICAgICogICAgIHRpdGxlRm9ybWF0OiBzdHJpbmcsXG4gICAgICAgICAqICAgICB0b2RheUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgeWVhclRpdGxlRm9ybWF0OiBzdHJpbmcsXG4gICAgICAgICAqICAgICBtb250aFRpdGxlRm9ybWF0OiBzdHJpbmcsXG4gICAgICAgICAqICAgICBtb250aFRpdGxlczogQXJyYXksXG4gICAgICAgICAqICAgICBkYXlUaXRsZXM6IEFycmF5LFxuICAgICAgICAgKiB9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXkgdGhhdCBpcyBzaG93blxuICAgICAgICAgKiBAdHlwZSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9zaG93bkRhdGUgPSB7eWVhcjogMCwgbW9udGg6IDEsIGRhdGU6IDF9O1xuXG4gICAgICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAqIGpRdWVyeSAtIEhUTUxFbGVtZW50XG4gICAgICAgICAqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgICAgICAvKipcbiAgICAgICAgICogPT09PT09PT09Um9vdCBFbGVtZW50PT09PT09PT09XG4gICAgICAgICAqIElmIG9wdGlvbnMgZG8gbm90IGluY2x1ZGUgZWxlbWVudCwgdGhpcyBjb21wb25lbnQgamVkZ2UgaW5pdGlhbGl6ZSBlbGVtZW50IHdpdGhvdXQgb3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQob3B0aW9uLmVsZW1lbnQgfHwgYXJndW1lbnRzWzBdKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogPT09PT09PT09SGVhZGVyPT09PT09PT09XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRoZWFkZXIgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHRpbHRlXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR0aXRsZSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgeWVhciB0aXRsZVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kdGl0bGVZZWFyID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBtb250aCB0aXRsZVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kdGl0bGVNb250aCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PUJvZHk9PT09PT09PT1cbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGJvZHkgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHRlbXBsYXRlIG9mIHdlZWtcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHdlZWtUZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgd2VlayBwYXJlbnQgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kd2Vla0FwcGVuZFRhcmdldCA9IG51bGw7XG5cbiAgICAgICAgLyoqLS0tLS0tLS0gZm9vdGVyIC0tLS0tLS0tKi9cbiAgICAgICAgdGhpcy4kZm9vdGVyID0gbnVsbDtcblxuICAgICAgICAvKiogVG9kYXkgKi9cbiAgICAgICAgdGhpcy4kdG9kYXkgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGUgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fJGRhdGVFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRlIHdyYXBwZXIgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fJGRhdGVDb250YWluZXJFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogPT09PT09PT09Rm9vdGVyPT09PT09PT09XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRmb290ZXIgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2RheSBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR0b2RheSA9IG51bGw7XG5cbiAgICAgICAgLyoqIFNldCBkZWZhdWx0IG9wdGlvbnMgKi9cbiAgICAgICAgdGhpcy5fc2V0RGVmYXVsdChvcHRpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGVmdWxhdCBvcGl0b25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25dIEEgb3B0aW9ucyB0byBpbml0aWFsemllIGNvbXBvbmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldERlZmF1bHQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLl9zZXRPcHRpb24ob3B0aW9uKTtcbiAgICAgICAgdGhpcy5fYXNzaWduSFRNTEVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMuZHJhdyh0aGlzLl9vcHRpb24ueWVhciwgdGhpcy5fb3B0aW9uLm1vbnRoLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhdmUgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uXSBBIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBjb21wb25lbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRPcHRpb246IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgaW5zdGFuY2VPcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0b2RheSA9IHV0aWxzLmdldERhdGVIYXNoVGFibGUoKTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbiA9IHtcbiAgICAgICAgICAgIGNsYXNzUHJlZml4OiAnY2FsZW5kYXItJyxcbiAgICAgICAgICAgIHllYXI6IHRvZGF5LnllYXIsXG4gICAgICAgICAgICBtb250aDogdG9kYXkubW9udGgsXG4gICAgICAgICAgICB0aXRsZUZvcm1hdDogJ3l5eXktbW0nLFxuICAgICAgICAgICAgdG9kYXlGb3JtYXQ6ICd5eXl5L21tL2RkIChEKScsXG4gICAgICAgICAgICB5ZWFyVGl0bGVGb3JtYXQ6ICd5eXl5JyxcbiAgICAgICAgICAgIG1vbnRoVGl0bGVGb3JtYXQ6ICdtJyxcbiAgICAgICAgICAgIG1vbnRoVGl0bGVzOiBbJ0pBTicsICdGRUInLCAnTUFSJywgJ0FQUicsICdNQVknLCAnSlVOJywgJ0pVTCcsICdBVUcnLCAnU0VQJywgJ09DVCcsICdOT1YnLCAnREVDJ10sXG4gICAgICAgICAgICBkYXlUaXRsZXM6IFsnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J11cbiAgICAgICAgfTtcbiAgICAgICAgdXRpbC5leHRlbmQoaW5zdGFuY2VPcHRpb24sIGRlZmF1bHRPcHRpb24sIG9wdGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBlbGVtZW50IHRvIGZpbGVkXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduSFRNTEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNsYXNzUHJlZml4ID0gdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4LFxuICAgICAgICAgICAgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICAgY2xhc3NTZWxlY3RvciA9ICcuJyArIGNsYXNzUHJlZml4O1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkhlYWRlcigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpO1xuICAgICAgICB0aGlzLl9hc3NpZ25Cb2R5KCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkZvb3RlcigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBoZWFkZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1lbnQgVGhlIHJvb3QgZWxlbWVudCBvZiBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NTZWxlY3RvciBBIGNsYXNzIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IEEgcHJlZml4IGZvciBjbGFzc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2Fzc2lnbkhlYWRlcjogZnVuY3Rpb24oJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciAkaGVhZGVyID0gJGVsZW1lbnQuZmluZChjbGFzc1NlbGVjdG9yICsgJ2hlYWRlcicpLFxuICAgICAgICAgICAgaGVhZGVyVGVtcGxhdGUsXG4gICAgICAgICAgICBkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsXG4gICAgICAgICAgICBrZXkgPSBDT05TVEFOVFMucmVsYXRpdmVNb250aFZhbHVlS2V5LFxuICAgICAgICAgICAgYnRuQ2xhc3NOYW1lID0gJ2J0bi0nO1xuXG4gICAgICAgIGlmICghJGhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhlYWRlclRlbXBsYXRlID0gQ09OU1RBTlRTLmNhbGVuZGFySGVhZGVyO1xuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwID0gQ09OU1RBTlRTLmRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICAgICAgJGhlYWRlciA9ICQoaGVhZGVyVGVtcGxhdGUucmVwbGFjZShkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsIGNsYXNzUHJlZml4KSk7XG4gICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJGhlYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnV0dG9uXG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLnByZXZZZWFyKS5kYXRhKGtleSwgLTEyKTtcbiAgICAgICAgJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBidG5DbGFzc05hbWUgKyBDT05TVEFOVFMucHJldk1vbnRoKS5kYXRhKGtleSwgLTEpO1xuICAgICAgICAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIGJ0bkNsYXNzTmFtZSArIENPTlNUQU5UUy5uZXh0WWVhcikuZGF0YShrZXksIDEyKTtcbiAgICAgICAgJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBidG5DbGFzc05hbWUgKyBDT05TVEFOVFMubmV4dE1vbnRoKS5kYXRhKGtleSwgMSk7XG5cbiAgICAgICAgLy8gdGl0bGUgdGV4dFxuICAgICAgICB0aGlzLiR0aXRsZSA9ICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgJ3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRpdGxlWWVhciA9ICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgJ3RpdGxlLXllYXInKTtcbiAgICAgICAgdGhpcy4kdGl0bGVNb250aCA9ICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgJ3RpdGxlLW1vbnRoJyk7XG4gICAgICAgIHRoaXMuJGhlYWRlciA9ICRoZWFkZXI7XG4gICAgICAgIHRoaXMuX2F0dGFjaEV2ZW50VG9Sb2xsb3ZlckJ0bigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib2R5IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1lbnQgVGhlIHJvb3QgZWxtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduQm9keTogZnVuY3Rpb24oJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciAkYm9keSA9ICRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdib2R5JyksXG4gICAgICAgICAgICAkd2Vla1RlbXBsYXRlLFxuICAgICAgICAgICAgYm9keVRlbXBsYXRlLFxuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgIGlmICghJGJvZHkubGVuZ3RoKSB7XG4gICAgICAgICAgICBib2R5VGVtcGxhdGUgPSBDT05TVEFOVFMuY2FsZW5kYXJCb2R5O1xuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwID0gQ09OU1RBTlRTLmRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICAgICAgJGJvZHkgPSAkKGJvZHlUZW1wbGF0ZS5yZXBsYWNlKGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCwgY2xhc3NQcmVmaXgpKTtcbiAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgkYm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgJHdlZWtUZW1wbGF0ZSA9ICRib2R5LmZpbmQoY2xhc3NTZWxlY3RvciArICd3ZWVrJyk7XG4gICAgICAgIHRoaXMuJHdlZWtUZW1wbGF0ZSA9ICR3ZWVrVGVtcGxhdGUuY2xvbmUodHJ1ZSk7XG4gICAgICAgIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQgPSAkd2Vla1RlbXBsYXRlLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiRib2R5ID0gJGJvZHk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGZvb3RlciBlbGVtZW50XG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRlbGVtZW50IFRoZSByb290IGVsZW1lbnQgb2YgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzU2VsZWN0b3IgQSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIHByZWZpeCBmb3IgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Gb290ZXI6IGZ1bmN0aW9uKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICB2YXIgJGZvb3RlciA9ICRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdmb290ZXInKSxcbiAgICAgICAgICAgIGZvb3RlclRlbXBsYXRlLFxuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgIGlmICghJGZvb3Rlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvb3RlclRlbXBsYXRlID0gQ09OU1RBTlRTLmNhbGVuZGFyRm9vdGVyO1xuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwID0gQ09OU1RBTlRTLmRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICAgICAgJGZvb3RlciA9ICQoZm9vdGVyVGVtcGxhdGUucmVwbGFjZShkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsIGNsYXNzUHJlZml4KSk7XG4gICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJGZvb3Rlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kdG9kYXkgPSAkZm9vdGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0b2RheScpO1xuICAgICAgICB0aGlzLiRmb290ZXIgPSAkZm9vdGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmF2aWdhdGlvbiBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2F0dGFjaEV2ZW50VG9Sb2xsb3ZlckJ0bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBidG5zID0gdGhpcy4kaGVhZGVyLmZpbmQoJy5yb2xsb3ZlcicpO1xuXG4gICAgICAgIGJ0bnMub24oJ2NsaWNrJywgdXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlTW9udGhWYWx1ZSA9ICQoZXZlbnQudGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KDAsIHJlbGF0aXZlTW9udGhWYWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9LCB0aGlzKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBIYXNoIGRhdGEgdG8gZHJvdyBjYWxlbmRhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNSZWxhdGl2ZV0gIFdoZXRoZXIgaXMgcmVsYXRlZCBvdGhlciB2YWx1ZSBvciBub3RcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IEEgZGF0ZSBoYXNoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0RGF0ZUZvckRyYXdpbmc6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBpc1JlbGF0aXZlKSB7XG4gICAgICAgIHZhciBuRGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgcmVsYXRpdmVEYXRlO1xuXG4gICAgICAgIG5EYXRlLmRhdGUgPSAxO1xuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoeWVhcikgJiYgIXV0aWwuaXNOdW1iZXIobW9udGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbkRhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgICAgICAgcmVsYXRpdmVEYXRlID0gdXRpbHMuZ2V0UmVsYXRpdmVEYXRlKHllYXIsIG1vbnRoLCAwLCBuRGF0ZSk7XG4gICAgICAgICAgICBuRGF0ZS55ZWFyID0gcmVsYXRpdmVEYXRlLnllYXI7XG4gICAgICAgICAgICBuRGF0ZS5tb250aCA9IHJlbGF0aXZlRGF0ZS5tb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5EYXRlLnllYXIgPSB5ZWFyIHx8IG5EYXRlLnllYXI7XG4gICAgICAgICAgICBuRGF0ZS5tb250aCA9IG1vbnRoIHx8IG5EYXRlLm1vbnRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5EYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBKdWRnZSB0byByZWRyYXcgY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSByZWZsb3dcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc05lY2Vzc2FyeUZvckRyYXdpbmc6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBzaG93bkRhdGUgPSB0aGlzLl9zaG93bkRhdGU7XG5cbiAgICAgICAgcmV0dXJuIChzaG93bkRhdGUueWVhciAhPT0geWVhciB8fCBzaG93bkRhdGUubW9udGggIT09IG1vbnRoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBjYWxlbmRhciB0ZXh0XG4gICAgICogQHBhcmFtIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gZGF0ZUZvckRyYXdpbmcgVGhhIGhhc2ggdGhhdCBzaG93IHVwIG9uIGNhbGVuZGFyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q2FsZW5kYXJUZXh0OiBmdW5jdGlvbihkYXRlRm9yRHJhd2luZykge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGVGb3JEcmF3aW5nLnllYXIsXG4gICAgICAgICAgICBtb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoO1xuXG4gICAgICAgIHRoaXMuX3NldENhbGVuZGFyVG9kYXkoKTtcbiAgICAgICAgdGhpcy5fc2V0Q2FsZW5kYXJUaXRsZSh5ZWFyLCBtb250aCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgZGF0ZXMgYnkgbW9udGguXG4gICAgICogQHBhcmFtIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gZGF0ZUZvckRyYXdpbmcgQSBkYXRlIHRvIGRyYXdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBjbGFzcyBwcmVmaXhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kcmF3RGF0ZXM6IGZ1bmN0aW9uKGRhdGVGb3JEcmF3aW5nLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGVGb3JEcmF3aW5nLnllYXIsXG4gICAgICAgICAgICBtb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoLFxuICAgICAgICAgICAgZGF5SW5XZWVrID0gMCxcbiAgICAgICAgICAgIGRhdGVQcmV2TW9udGggPSB1dGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIGRhdGVGb3JEcmF3aW5nKSxcbiAgICAgICAgICAgIGRhdGVOZXh0TW9udGggPSB1dGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgMSwgMCwgZGF0ZUZvckRyYXdpbmcpLFxuICAgICAgICAgICAgZGF0ZXMgPSBbXSxcbiAgICAgICAgICAgIGZpcnN0RGF5ID0gdXRpbHMuZ2V0Rmlyc3REYXkoeWVhciwgbW9udGgpLFxuICAgICAgICAgICAgaW5kZXhPZkxhc3REYXRlID0gdGhpcy5fZmlsbERhdGVzKHllYXIsIG1vbnRoLCBkYXRlcyk7XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoKGRhdGVzLCBmdW5jdGlvbihkYXRlLCBpKSB7XG4gICAgICAgICAgICB2YXIgaXNQcmV2TW9udGggPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc05leHRNb250aCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyID0gJCh0aGlzLl8kZGF0ZUNvbnRhaW5lckVsZW1lbnRbaV0pLFxuICAgICAgICAgICAgICAgIHRlbXBZZWFyID0geWVhcixcbiAgICAgICAgICAgICAgICB0ZW1wTW9udGggPSBtb250aCxcbiAgICAgICAgICAgICAgICBldmVudERhdGE7XG5cbiAgICAgICAgICAgIGlmIChpIDwgZmlyc3REYXkpIHtcbiAgICAgICAgICAgICAgICBpc1ByZXZNb250aCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXIuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyBDT05TVEFOVFMucHJldk1vbnRoKTtcbiAgICAgICAgICAgICAgICB0ZW1wWWVhciA9IGRhdGVQcmV2TW9udGgueWVhcjtcbiAgICAgICAgICAgICAgICB0ZW1wTW9udGggPSBkYXRlUHJldk1vbnRoLm1vbnRoO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpID4gaW5kZXhPZkxhc3REYXRlKSB7XG4gICAgICAgICAgICAgICAgaXNOZXh0TW9udGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLm5leHRNb250aCk7XG4gICAgICAgICAgICAgICAgdGVtcFllYXIgPSBkYXRlTmV4dE1vbnRoLnllYXI7XG4gICAgICAgICAgICAgICAgdGVtcE1vbnRoID0gZGF0ZU5leHRNb250aC5tb250aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2Vla2VuZFxuICAgICAgICAgICAgdGhpcy5fc2V0V2Vla2VuZChkYXlJbldlZWssICRkYXRlQ29udGFpbmVyLCBjbGFzc1ByZWZpeCk7XG5cbiAgICAgICAgICAgIC8vIFRvZGF5XG4gICAgICAgICAgICBpZiAodGhpcy5faXNUb2RheSh0ZW1wWWVhciwgdGVtcE1vbnRoLCBkYXRlKSkge1xuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgJ3RvZGF5Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAkZGF0ZTogJCh0aGlzLl8kZGF0ZUVsZW1lbnQuZ2V0KGkpKSxcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lcjogJGRhdGVDb250YWluZXIsXG4gICAgICAgICAgICAgICAgeWVhcjogdGVtcFllYXIsXG4gICAgICAgICAgICAgICAgbW9udGg6IHRlbXBNb250aCxcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLFxuICAgICAgICAgICAgICAgIGlzUHJldk1vbnRoOiBpc1ByZXZNb250aCxcbiAgICAgICAgICAgICAgICBpc05leHRNb250aDogaXNOZXh0TW9udGgsXG4gICAgICAgICAgICAgICAgaHRtbDogZGF0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICQoZXZlbnREYXRhLiRkYXRlKS5odG1sKGV2ZW50RGF0YS5odG1sLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgZGF5SW5XZWVrID0gKGRheUluV2VlayArIDEpICUgNztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaXJlIGRyYXcgZXZlbnQgd2hlbiBjYWxlbmRhciBkcmF3IGVhY2ggZGF0ZS5cbiAgICAgICAgICAgICAqIEBhcGlcbiAgICAgICAgICAgICAqIEBldmVudCBDYWxlbmRhciNkcmF3XG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBBIG5hbWUgb2YgY3VzdG9tIGV2ZW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzUHJldk1vbnRoIFdoZXRoZXIgdGhlIGRyYXcgZGF5IGlzIGxhc3QgbW9udGggb3Igbm90XG4gICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTmV4dE1vbnRoIFdlaHRlciB0aGUgZHJhdyBkYXkgaXMgbmV4dCBtb250aCBvciBub3RcbiAgICAgICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZGF0ZSBUaGUgZWxlbWVudCBoYXZlIGRhdGUgaHRtbFxuICAgICAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRkYXRlQ29udGFpbmVyIENoaWxkIGVsZW1lbnQgdGhhdCBoYXMgY2xhc3NOYW1lIFtwcmVmaXhdd2Vlay4gSXQgaXMgcG9zc2libGUgdGhpcyBlbGVtZW50IGVxdWVsIGVsRGF0ZS5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIEEgZHJhdyBkYXRlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBkcmF3IG1vbnRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIGRyYXcgeWVhclxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgQSBodG1sIHN0cmluZ1xuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIC8vIGRyYXcgY3VzdG9tIGV2ZW4gaGFuZGxlclxuICAgICAgICAgICAgICogY2FsZW5kYXIub24oJ2RyYXcnLCBmdW5jdGlvbihkcmF3RXZlbnQpeyAuLi4gfSk7XG4gICAgICAgICAgICAgKiovXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ2RyYXcnLCBldmVudERhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBKZWRnZSB0aGUgaW5wdXQgZGF0ZSBpcyB0b2RheS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIEEgZGF0ZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzVG9kYXk6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgICAgIHZhciB0b2RheSA9IHV0aWxzLmdldERhdGVIYXNoVGFibGUoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdG9kYXkueWVhciA9PT0geWVhciAmJlxuICAgICAgICAgICAgdG9kYXkubW9udGggPT09IG1vbnRoICYmXG4gICAgICAgICAgICB0b2RheS5kYXRlID09PSBkYXRlXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1ha2Ugb25lIHdlZWsgdGVtcGF0ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRXZWVrczogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyICRlbFdlZWssXG4gICAgICAgICAgICB3ZWVrcyA9IHV0aWxzLmdldFdlZWtzKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3ZWVrczsgaSArPSAxKSB7XG4gICAgICAgICAgICAkZWxXZWVrID0gdGhpcy4kd2Vla1RlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgJGVsV2Vlay5hcHBlbmRUbyh0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtFbGVtZW50cy5wdXNoKCRlbFdlZWspO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhdmUgZHJhdyBkYXRlcyB0byBhcnJheVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB5ZWFyIEEgZHJhdyB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vbnRoIEEgZHJhdyBtb250aFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGVzIEEgZHJhdyBkYXRlXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBpbmRleCBvZiBsYXN0IGRhdGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9maWxsRGF0ZXM6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlcykge1xuICAgICAgICB2YXIgZmlyc3REYXkgPSB1dGlscy5nZXRGaXJzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBsYXN0RGF5ID0gdXRpbHMuZ2V0TGFzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBsYXN0RGF0ZSA9IHV0aWxzLmdldExhc3REYXRlKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGRhdGVQcmV2TW9udGggPSB1dGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIHt5ZWFyOiB5ZWFyLCBtb250aDogbW9udGgsIGRhdGU6IDF9KSxcbiAgICAgICAgICAgIHByZXZNb250aExhc3REYXRlID0gdXRpbHMuZ2V0TGFzdERhdGUoZGF0ZVByZXZNb250aC55ZWFyLCBkYXRlUHJldk1vbnRoLm1vbnRoKSxcbiAgICAgICAgICAgIGluZGV4T2ZMYXN0RGF0ZSxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgaWYgKGZpcnN0RGF5ID4gMCkge1xuICAgICAgICAgICAgZm9yIChpID0gcHJldk1vbnRoTGFzdERhdGUgLSBmaXJzdERheTsgaSA8IHByZXZNb250aExhc3REYXRlOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBkYXRlcy5wdXNoKGkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGFzdERhdGUgKyAxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGRhdGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXhPZkxhc3REYXRlID0gZGF0ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IDcgLSBsYXN0RGF5OyBpICs9IDEpIHtcbiAgICAgICAgICAgIGRhdGVzLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXhPZkxhc3REYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgd2Vla2VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXkgQSBkYXRlXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRkYXRlQ29udGFpbmVyIEEgY29udGFpbmVyIGVsZW1lbnQgZm9yIGRhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggb2YgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRXZWVrZW5kOiBmdW5jdGlvbihkYXksICRkYXRlQ29udGFpbmVyLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICBpZiAoZGF5ID09PSAwKSB7XG4gICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArICdzdW4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXkgPT09IDYpIHtcbiAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgJ3NhdCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIGNhbGVuZGFyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl93ZWVrRWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy4kd2Vla0FwcGVuZFRhcmdldC5lbXB0eSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRpdGxlIHdpdGggZm9ybWF0IG9wdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHZhbHVlIG9mIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBtb250aCBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQHByaXZhdGVcbiAgICAgKiovXG4gICAgX3NldENhbGVuZGFyVGl0bGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0aXRsZUZvcm1hdCA9IG9wdGlvbi50aXRsZUZvcm1hdCxcbiAgICAgICAgICAgIHJlcGxhY2VNYXAsXG4gICAgICAgICAgICByZWc7XG5cbiAgICAgICAgbW9udGggPSB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8obW9udGgpO1xuICAgICAgICByZXBsYWNlTWFwID0gdGhpcy5fZ2V0UmVwbGFjZU1hcCh5ZWFyLCBtb250aCk7XG5cbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlUmVnRXhwO1xuICAgICAgICB0aGlzLl9zZXREYXRlVGV4dEluQ2FsZW5kYXIodGhpcy4kdGl0bGUsIHRpdGxlRm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuXG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50aXRsZVllYXJSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcih0aGlzLiR0aXRsZVllYXIsIG9wdGlvbi55ZWFyVGl0bGVGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG5cbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlTW9udGhSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcih0aGlzLiR0aXRsZU1vbnRoLCBvcHRpb24ubW9udGhUaXRsZUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRpdGxlXG4gICAgICogQHBhcmFtIHtqUXVlcnl8SFRNTEVsZW1lbnR9IGVsZW1lbnQgQSB1cGRhdGUgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtIEEgdXBkYXRlIGZvcm1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwIEEgb2JqZWN0IHRoYXQgaGFzIHZhbHVlIG1hdGNoZWQgcmVnRXhwXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IHJlZyBBIHJlZ0V4cCB0byBjaGFnbmUgZm9ybVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldERhdGVUZXh0SW5DYWxlbmRhcjogZnVuY3Rpb24oZWxlbWVudCwgZm9ybSwgbWFwLCByZWcpIHtcbiAgICAgICAgdmFyIHRpdGxlLFxuICAgICAgICAgICAgJGVsID0gJChlbGVtZW50KTtcblxuICAgICAgICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZSA9IHRoaXMuX2dldENvbnZlcnRlZFRpdGxlKGZvcm0sIG1hcCwgcmVnKTtcbiAgICAgICAgJGVsLnRleHQodGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbWFwIGRhdGEgZm9yIGZvcm1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbZGF0ZV0gQSBkYXlcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXBsYWNlTWFwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0UmVwbGFjZU1hcDogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHllYXJTdWIgPSAoeWVhci50b1N0cmluZygpKS5zdWJzdHIoMiwgMiksXG4gICAgICAgICAgICBtb250aExhYmVsID0gb3B0aW9uLm1vbnRoVGl0bGVzW21vbnRoIC0gMV0sXG4gICAgICAgICAgICBsYWJlbEtleSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF0ZSB8fCAxKS5nZXREYXkoKSxcbiAgICAgICAgICAgIGRheUxhYmVsID0gb3B0aW9uLmRheVRpdGxlc1tsYWJlbEtleV07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHl5eXk6IHllYXIsXG4gICAgICAgICAgICB5eTogeWVhclN1YixcbiAgICAgICAgICAgIG1tOiBtb250aCxcbiAgICAgICAgICAgIG06IE51bWJlcihtb250aCksXG4gICAgICAgICAgICBNOiBtb250aExhYmVsLFxuICAgICAgICAgICAgZGQ6IGRhdGUsXG4gICAgICAgICAgICBkOiBOdW1iZXIoZGF0ZSksXG4gICAgICAgICAgICBEOiBkYXlMYWJlbFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFnZSB0ZXh0IGFuZCByZXR1cm4uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHRleHQgdG8gY2hhZ25lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hcCBBIGNoYWduZSBrZXksIHZhbHVlIHNldFxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWcgQSByZWdFeHAgdG8gY2hhZ25lXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRDb252ZXJ0ZWRUaXRsZTogZnVuY3Rpb24oc3RyLCBtYXAsIHJlZykge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG1hdGNoZWRTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBbbWF0Y2hlZFN0cmluZ10gfHwgJyc7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdG9kYXlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDYWxlbmRhclRvZGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0b2RheSA9IHRoaXMuJHRvZGF5LFxuICAgICAgICAgICAgdG9kYXlGb3JtYXQsXG4gICAgICAgICAgICB0b2RheSxcbiAgICAgICAgICAgIHllYXIsXG4gICAgICAgICAgICBtb250aCxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICByZXBsYWNlTWFwLFxuICAgICAgICAgICAgcmVnO1xuXG4gICAgICAgIGlmICghJHRvZGF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9kYXkgPSB1dGlscy5nZXREYXRlSGFzaFRhYmxlKCk7XG4gICAgICAgIHllYXIgPSB0b2RheS55ZWFyO1xuICAgICAgICBtb250aCA9IHRoaXMuX3ByZXBlbmRMZWFkaW5nWmVybyh0b2RheS5tb250aCk7XG4gICAgICAgIGRhdGUgPSB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8odG9kYXkuZGF0ZSk7XG4gICAgICAgIHRvZGF5Rm9ybWF0ID0gdGhpcy5fb3B0aW9uLnRvZGF5Rm9ybWF0O1xuICAgICAgICByZXBsYWNlTWFwID0gdGhpcy5fZ2V0UmVwbGFjZU1hcCh5ZWFyLCBtb250aCwgZGF0ZSk7XG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50b2RheVJlZ0V4cDtcbiAgICAgICAgdGhpcy5fc2V0RGF0ZVRleHRJbkNhbGVuZGFyKCR0b2RheSwgdG9kYXlGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoYWduZSBudW1iZXIgMH45IHRvICcwMH4wOSdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIG51bWJlclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8oMCk7IC8vICAnMDAnXG4gICAgICogIHRoaXMuX3ByZXBlbmRMZWFkaW5nWmVybyg5KTsgLy8gICcwOSdcbiAgICAgKiAgdGhpcy5fcHJlcGVuZExlYWRpbmdaZXJvKDEyKTsgLy8gICcxMidcbiAgICAgKi9cbiAgICBfcHJlcGVuZExlYWRpbmdaZXJvOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9ICcnO1xuXG4gICAgICAgIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgICAgcHJlZml4ID0gJzAnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBudW1iZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgY2FsZW5kYXJcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5ZWFyXSBBIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbW9udGhdIEEgbW9udGggKDEgfiAxMilcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1JlbGF0aXZlXSAgQSB5ZWFyIGFuZCBtb250aCBpcyByZWxhdGVkXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYWxlbmRhci5kcmF3KCk7IC8vIERyYXcgd2l0aCBub3cgZGF0ZS5cbiAgICAgKiBjYWxlbmRhci5kcmF3KDIwMDgsIDEyKTsgLy8gRHJhdyAyMDA4LzEyXG4gICAgICogY2FsZW5kYXIuZHJhdyhudWxsLCAxMik7IC8vIERyYXcgY3VycmVudCB5ZWFyLzEyXG4gICAgICogY2FsZW5kYXIuZHJhdygyMDEwLCBudWxsKTsgLy8gRHJhdyAyMDEwL2N1cnJlbnQgbW9udGhcbiAgICAgKiBjYWxlbmRhci5kcmF3KDAsIDEsIHRydWUpOyAvLyBEcmF3IG5leHQgbW9udGhcbiAgICAgKiBjYWxlbmRhci5kcmF3KC0xLCBudWxsLCB0cnVlKTsgLy8gRHJhdyBwcmV2IHllYXJcbiAgICAgKiovXG4gICAgZHJhdzogZnVuY3Rpb24oeWVhciwgbW9udGgsIGlzUmVsYXRpdmUpIHtcbiAgICAgICAgdmFyIGRhdGVGb3JEcmF3aW5nID0gdGhpcy5fZ2V0RGF0ZUZvckRyYXdpbmcoeWVhciwgbW9udGgsIGlzUmVsYXRpdmUpLFxuICAgICAgICAgICAgaXNSZWFkeUZvckRyYXdpbmcgPSB0aGlzLmludm9rZSgnYmVmb3JlRHJhdycsIGRhdGVGb3JEcmF3aW5nKSxcbiAgICAgICAgICAgIGNsYXNzUHJlZml4O1xuXG4gICAgICAgIC8qKj09PT09PT09PT09PT09PVxuICAgICAgICAgKiBiZWZvcmVEcmF3XG4gICAgICAgICA9PT09PT09PT09PT09PT09PSovXG4gICAgICAgIGlmICghaXNSZWFkeUZvckRyYXdpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKj09PT09PT09PT09PT09PVxuICAgICAgICAgKiBkcmF3XG4gICAgICAgICA9PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyO1xuICAgICAgICBtb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoO1xuXG4gICAgICAgIGNsYXNzUHJlZml4ID0gdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4O1xuICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgICB0aGlzLl9zZXRDYWxlbmRhclRleHQoZGF0ZUZvckRyYXdpbmcpO1xuXG4gICAgICAgIC8vIHdlZWtzXG4gICAgICAgIHRoaXMuX3NldFdlZWtzKHllYXIsIG1vbnRoKTtcbiAgICAgICAgdGhpcy5fJGRhdGVFbGVtZW50ID0gJCgnLicgKyBjbGFzc1ByZWZpeCArICdkYXRlJywgdGhpcy4kd2Vla0FwcGVuZFRhcmdldCk7XG4gICAgICAgIHRoaXMuXyRkYXRlQ29udGFpbmVyRWxlbWVudCA9ICQoJy4nICsgY2xhc3NQcmVmaXggKyAnd2VlayA+IConLCB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcblxuICAgICAgICAvLyBkYXRlc1xuICAgICAgICB0aGlzLnNldERhdGUoeWVhciwgbW9udGgpO1xuICAgICAgICB0aGlzLl9kcmF3RGF0ZXMoZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5zaG93KCk7XG5cbiAgICAgICAgLyoqPT09PT09PT09PT09PT09XG4gICAgICAgICAqIGFmdGVyRHJhd1xuICAgICAgICAgPT09PT09PT09PT09PT09PSovXG4gICAgICAgIHRoaXMuZmlyZSgnYWZ0ZXJEcmF3JywgZGF0ZUZvckRyYXdpbmcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB5ZWFyIGFuZCBtb250aChqdXN0IHNob3duKS5cbiAgICAgKiBAYXBpXG4gICAgICogQHJldHVybnMge3t5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGdldERhdGUoKTsgPT4geyB5ZWFyOiB4eHh4LCBtb250aDogeHggfTtcbiAgICAgKi9cbiAgICBnZXREYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IHRoaXMuX3Nob3duRGF0ZS55ZWFyLFxuICAgICAgICAgICAgbW9udGg6IHRoaXMuX3Nob3duRGF0ZS5tb250aFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGF0ZVxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3llYXJdIEEgeWVhciAoZXguIDIwMDgpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb250aF0gQSBtb250aCAoMSB+IDEyKVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHNldERhdGUoMTk4NCwgMDQpO1xuICAgICAqKi9cbiAgICBzZXREYXRlOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuX3Nob3duRGF0ZTtcbiAgICAgICAgZGF0ZS55ZWFyID0gdXRpbC5pc051bWJlcih5ZWFyKSA/IHllYXIgOiBkYXRlLnllYXI7XG4gICAgICAgIGRhdGUubW9udGggPSB1dGlsLmlzTnVtYmVyKG1vbnRoKSA/IG1vbnRoIDogZGF0ZS5tb250aDtcbiAgICB9XG59KTtcblxudXRpbC5DdXN0b21FdmVudHMubWl4aW4oQ2FsZW5kYXIpO1xubW9kdWxlLmV4cG9ydHMgPSBDYWxlbmRhcjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBVdGlscyBmb3IgY2FsZW5kYXIgY29tcG9uZW50XG4gKiBAYXV0aG9yIE5ITiBOZXQuIEZFIGRldiB0ZWFtLiA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0IH4xLjAuMlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVdGlscyBvZiBjYWxlbmRhclxuICogQG5hbWVzcGFjZSB1dGlsc1xuICovXG52YXIgdXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGRhdGUgaGFzaCBieSBwYXJhbWV0ZXIuXG4gICAgICogIGlmIHRoZXJlIGFyZSAzIHBhcmFtZXRlciwgdGhlIHBhcmFtZXRlciBpcyBjb3Jnbml6ZWQgRGF0ZSBvYmplY3RcbiAgICAgKiAgaWYgdGhlcmUgYXJlIG5vIHBhcmFtZXRlciwgcmV0dXJuIHRvZGF5J3MgaGFzaCBkYXRlXG4gICAgICogQGZ1bmN0aW9uIGdldERhdGVIYXNoVGFibGVcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiBAcGFyYW0ge0RhdGV8bnVtYmVyfSBbeWVhcl0gQSBkYXRlIGluc3RhbmNlIG9yIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoXSBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkYXRlXSBBIGRhdGVcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6ICosIG1vbnRoOiAqLCBkYXRlOiAqfX0gXG4gICAgICovXG4gICAgZ2V0RGF0ZUhhc2hUYWJsZTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIG5EYXRlO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgbkRhdGUgPSBhcmd1bWVudHNbMF0gfHwgbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgeWVhciA9IG5EYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICBtb250aCA9IG5EYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgZGF0ZSA9IG5EYXRlLmdldERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgZGF0ZTogZGF0ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdG9kYXkgdGhhdCBzYXZlZCBvbiBjb21wb25lbnQgb3IgY3JlYXRlIG5ldyBkYXRlLlxuICAgICAqIEBmdW5jdGlvbiBnZXRUb2RheVxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogKiwgbW9udGg6ICosIGRhdGU6ICp9fVxuICAgICAqIEBtZW1iZXJvZiB1dGlsc1xuICAgICAqL1xuICAgIGdldFRvZGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICByZXR1cm4gdXRpbHMuZ2V0RGF0ZUhhc2hUYWJsZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2Vla3MgY291bnQgYnkgcGFyYW1lbnRlclxuICAgICAqIEBmdW5jdGlvbiBnZXRXZWVrc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDso7wgKDR+NilcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiovXG4gICAgZ2V0V2Vla3M6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBmaXJzdERheSA9IHRoaXMuZ2V0Rmlyc3REYXkoeWVhciwgbW9udGgpLFxuICAgICAgICAgICAgbGFzdERhdGUgPSB0aGlzLmdldExhc3REYXRlKHllYXIsIG1vbnRoKTtcblxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChmaXJzdERheSArIGxhc3REYXRlKSAvIDcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdW5peCB0aW1lIGZyb20gZGF0ZSBoYXNoXG4gICAgICogQGZ1bmN0aW9uIGdldFRpbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0ZSBBIGRhdGUgaGFzaFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlLnllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUubW9udGggQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlLmRhdGUgQSBkYXRlXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHV0aWxzLmdldFRpbWUoe3llYXI6MjAxMCwgbW9udGg6NSwgZGF0ZToxMn0pOyAvLyAxMjczNTkwMDAwMDAwXG4gICAgICoqL1xuICAgIGdldFRpbWU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZU9iamVjdChkYXRlKS5nZXRUaW1lKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB3aGljaCBkYXkgaXMgZmlyc3QgYnkgcGFyYW1ldGVycyB0aGF0IGluY2x1ZGUgeWVhciBhbmQgbW9udGggaW5mb3JtYXRpb24uXG4gICAgICogQGZ1bmN0aW9uIGdldEZpcnN0RGF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9ICgwfjYpXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICoqL1xuICAgIGdldEZpcnN0RGF5OiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKS5nZXREYXkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHdoaWNoIGRheSBpcyBsYXN0IGJ5IHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIHllYXIgYW5kIG1vbnRoIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvbiBnZXRMYXN0RGF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9ICgwfjYpXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICoqL1xuICAgIGdldExhc3REYXk6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBsYXN0IGRhdGUgYnkgcGFyYW1ldGVycyB0aGF0IGluY2x1ZGUgeWVhciBhbmQgbW9udGggaW5mb3JtYXRpb24uXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9ICgxfjMxKVxuICAgICAqIEBtZW1iZXJvZiB1dGlsc1xuICAgICAqKi9cbiAgICBnZXRMYXN0RGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkYXRlIGluc3RhbmNlLlxuICAgICAqIEBmdW5jdGlvbiBnZXREYXRlT2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGUgQSBkYXRlIGhhc2hcbiAgICAgKiBAcmV0dXJuIHtEYXRlfSBEYXRlICBcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB1dGlscy5nZXREYXRlT2JqZWN0KHt5ZWFyOjIwMTAsIG1vbnRoOjUsIGRhdGU6MTJ9KTtcbiAgICAgKiAgdXRpbHMuZ2V0RGF0ZU9iamVjdCgyMDEwLCA1LCAxMik7IC8veWVhcixtb250aCxkYXRlXG4gICAgICoqL1xuICAgIGdldERhdGVPYmplY3Q6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSAtIDEsIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF0ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCByZWxhdGVkIGRhdGUgaGFzaCB3aXRoIHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIGRhdGUgaW5mb3JtYXRpb24uXG4gICAgICogQGZ1bmN0aW9uIGdldFJlbGF0aXZlRGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgcmVsYXRlZCB2YWx1ZSBmb3IgeWVhcih5b3UgY2FuIHVzZSArLy0pXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgcmVsYXRlZCB2YWx1ZSBmb3IgbW9udGggKHlvdSBjYW4gdXNlICsvLSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF0ZSBBIHJlbGF0ZWQgdmFsdWUgZm9yIGRheSAoeW91IGNhbiB1c2UgKy8tKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRlT2JqIHN0YW5kYXJkIGRhdGUgaGFzaFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZU9iaiBcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB1dGlscy5nZXRSZWxhdGl2ZURhdGUoMSwgMCwgMCwge3llYXI6MjAwMCwgbW9udGg6MSwgZGF0ZToxfSk7IC8vIHt5ZWFyOjIwMDEsIG1vbnRoOjEsIGRhdGU6MX1cbiAgICAgKiAgdXRpbHMuZ2V0UmVsYXRpdmVEYXRlKDAsIDAsIC0xLCB7eWVhcjoyMDEwLCBtb250aDoxLCBkYXRlOjF9KTsgLy8ge3llYXI6MjAwOSwgbW9udGg6MTIsIGRhdGU6MzF9XG4gICAgICoqL1xuICAgIGdldFJlbGF0aXZlRGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUsIGRhdGVPYmopIHtcbiAgICAgICAgdmFyIG5ZZWFyID0gKGRhdGVPYmoueWVhciArIHllYXIpLFxuICAgICAgICAgICAgbk1vbnRoID0gKGRhdGVPYmoubW9udGggKyBtb250aCAtIDEpLFxuICAgICAgICAgICAgbkRhdGUgPSAoZGF0ZU9iai5kYXRlICsgZGF0ZSksXG4gICAgICAgICAgICBuRGF0ZU9iaiA9IG5ldyBEYXRlKG5ZZWFyLCBuTW9udGgsIG5EYXRlKTtcblxuICAgICAgICByZXR1cm4gdXRpbHMuZ2V0RGF0ZUhhc2hUYWJsZShuRGF0ZU9iaik7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcbiJdfQ==
