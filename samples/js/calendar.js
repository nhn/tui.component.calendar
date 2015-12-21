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
 * var calendar = new ne.component.Calendar({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9jYWxlbmRhci5qcyIsInNyYy9qcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6eEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidHVpLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCd0dWkuY29tcG9uZW50LkNhbGVuZGFyJywgcmVxdWlyZSgnLi9zcmMvanMvY2FsZW5kYXInKSk7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2FsZW5kYXIgY29tcG9uZW50KGZyb20gUHVnIGNvbXBvbmVudClcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBqcXVlcnkgfjEuOC4zLCBuZS1jb2RlLXNuaXBwZXQgfjEuMC4yXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgdXRpbCA9IHR1aS51dGlsLFxuICAgIENPTlNUQU5UUyA9IHtcbiAgICAgICAgcmVsYXRpdmVNb250aFZhbHVlS2V5OiAncmVsYXRpdmVNb250aFZhbHVlJyxcbiAgICAgICAgcHJldlllYXI6ICdwcmV2LXllYXInLFxuICAgICAgICBwcmV2TW9udGg6ICdwcmV2LW1vbnRoJyxcbiAgICAgICAgbmV4dFllYXI6ICduZXh0LXllYXInLFxuICAgICAgICBuZXh0TW9udGg6ICduZXh0LW1vbnRoJyxcbiAgICAgICAgY2FsZW5kYXJIZWFkZXI6IG51bGwsXG4gICAgICAgIGNhbGVuZGFyQm9keTogbnVsbCxcbiAgICAgICAgY2FsZW5kYXJGb290ZXI6IG51bGwsXG4gICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDogL2NhbGVuZGFyLS9nLFxuICAgICAgICB0aXRsZVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNL2csXG4gICAgICAgIHRpdGxlWWVhclJlZ0V4cDogL3l5eXl8eXkvZyxcbiAgICAgICAgdGl0bGVNb250aFJlZ0V4cDogL21tfG18TS9nLFxuICAgICAgICB0b2RheVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNfGRkfGR8RC9nXG4gICAgfTtcblxuQ09OU1RBTlRTLmNhbGVuZGFySGVhZGVyID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItaGVhZGVyXCI+JyxcbiAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJvbGxvdmVyIGNhbGVuZGFyLWJ0bi0nICsgQ09OU1RBTlRTLnByZXZZZWFyICsgJ1wiPuydtOyghO2VtDwvYT4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMucHJldk1vbnRoICsgJ1wiPuydtOyghOuLrDwvYT4nLFxuICAgICc8c3Ryb25nIGNsYXNzPVwiY2FsZW5kYXItdGl0bGVcIj48L3N0cm9uZz4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMubmV4dE1vbnRoICsgJ1wiPuuLpOydjOuLrDwvYT4nLFxuICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwicm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMubmV4dFllYXIgKyAnXCI+64uk7J2M7ZW0PC9hPicsXG4gICAgJzwvZGl2PiddLmpvaW4oJycpO1xuXG5DT05TVEFOVFMuY2FsZW5kYXJCb2R5ID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItYm9keVwiPicsXG4gICAgICAgICc8dGFibGU+JyxcbiAgICAgICAgICAgICc8dGhlYWQ+JyxcbiAgICAgICAgICAgICAgICAnPHRyPicsXG4gICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImNhbGVuZGFyLXN1blwiPlN1PC90aD48dGg+TW88L3RoPjx0aD5UdTwvdGg+PHRoPldlPC90aD48dGg+VGg8L3RoPjx0aD5GYTwvdGg+PHRoIGNsYXNzPVwiY2FsZW5kYXItc2F0XCI+U2E8L3RoPicsXG4gICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICc8L3RoZWFkPicsXG4gICAgICAgICAgICAnPHRib2R5PicsXG4gICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImNhbGVuZGFyLXdlZWtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgJzwvdGFibGU+JyxcbiAgICAnPC9kaXY+J10uam9pbignJyk7XG5cbkNPTlNUQU5UUy5jYWxlbmRhckZvb3RlciA9IFtcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWZvb3RlclwiPicsXG4gICAgICAgICc8cD7smKTripggPGVtIGNsYXNzPVwiY2FsZW5kYXItdG9kYXlcIj48L2VtPjwvcD4nLFxuICAgICc8L2Rpdj4nXS5qb2luKCcnKTtcblxuXG4vKipcbiAqIENhbGVuZGFyIGNvbXBvbmVudCBjbGFzc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtIVE1MRWxlbWVudH0gb3B0aW9uLmVsZW1lbnQgQSByb290IGVsZW1lbnRcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi5jbGFzc1ByZWZpeD1cImNhbGVuZGFyLVwiXSBBIHByZWZpeCBjbGFzcyBmb3IgbWFya3VwIHN0cnVjdHVyZVxuICogICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLnllYXI9dGhpcyB5ZWFyXSBBIHllYXIgZm9yIGluaXRpYWxpemVcbiAqICAgICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5tb250aD10aGlzIG1vbnRoXSBBIG1vbnRoIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb24udGl0bGVGb3JtYXQ9XCJ5eXl5LW1tXCJdIEEgdGl0bGUgZm9ybWF0LiBUaGlzIGNvbXBvbmVudCBmaW5kIHRpdGxlIGVsZW1lbnQgYnkgY2xhc3NOYW1lICdbcHJlZml4XXRpdGxlJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLnRvZGF5Rm9ybWF0ID0gXCJ5eXl5IFllYXIgbW0gTW9udGggZGQgRGF5IChEKVwiXSBBIHRvZGF5IGZvcm1hdC4gVGhpcyBjb21wb25lbnQgZmluZCB0b2RheSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF10b2RheSdcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi55ZWFyVGl0bGVGb3JtYXQgPSBcInl5eXlcIl0gQSB5ZWFyIHRpdGxlIGZvcm1hbnQuIFRoaXMgY29tcG9uZW50IGZpbmQgeWVhciB0aXRsZSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF15ZWFyJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLm1vbnRoVGl0bGVGb3JtYXQgPSBcIm1cIl0gQSBtb250aCB0aXRsZSBmb3JtYXQuIFRoaXMgY29tcG9uZW50IGZpbmQgbW9udGggdGl0bGUgZWxlbWVudCBieSBjbGFzc05hbWXsnbQgJ1twcmVmaXhdbW9udGgnXG4gKiAgICAgQHBhcmFtIHtBcnJheX0gW29wdGlvbi5tb250aFRpdGxlcyA9IFtcIkpBTlwiLFwiRkVCXCIsXCJNQVJcIixcIkFQUlwiLFwiTUFZXCIsXCJKVU5cIixcIkpVTFwiLFwiQVVHXCIsXCJTRVBcIixcIk9DVFwiLFwiTk9WXCIsXCJERUNcIl1dIEEgbGFiZWwgb2YgZWFjaCBtb250aC5cbiAqICAgICBAcGFyYW0ge0FycmF5fSBbb3B0aW9uLmRheVRpdGxlcyA9IFtcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXV0gQSBsYWJlbCBmb3IgZGF5LiBJZiB5b3Ugc2V0IHRoZSBvdGhlciBvcHRpb24gdG9kYXlGb3JtYXQgJ0QnLCB5b3UgY2FuIHVzZSB0aGlzIG5hbWUuIFxuICogQGV4YW1wbGVcbiAqIHZhciBjYWxlbmRhciA9IG5ldyBuZS5jb21wb25lbnQuQ2FsZW5kYXIoe1xuICogICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICcjbGF5ZXInLFxuICogICAgICAgICAgICAgICAgICAgIGNsYXNzUHJlZml4OiBcImNhbGVuZGFyLVwiLFxuICogICAgICAgICAgICAgICAgICAgIHllYXI6IDE5ODMsXG4gKiAgICAgICAgICAgICAgICAgICAgbW9udGg6IDUsXG4gKiAgICAgICAgICAgICAgICAgICAgdGl0bGVGb3JtYXQ6IFwieXl5eS1tbVwiLCAvLyB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIHRvZGF5Rm9ybWF0OiBcInl5eXkgLyBtbSAvIGRkIChEKVwiIC8vIHRvZGF5XG4gKiAgICAgICAgICAgICAgICAgICAgeWVhclRpdGxlRm9ybWF0OiBcInl5eXlcIiwgLy8geWVhciB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIG1vbnRoVGl0bGVGb3JtYXQ6IFwibVwiLCAvLyBtb250aCB0aXRsZVxuICogICAgICAgICAgICAgICAgICAgIG1vbnRoVGl0bGVzOiBbXCJKQU5cIiwgXCJGRUJcIiwgXCJNQVJcIiwgXCJBUFJcIiwgXCJNQVlcIiwgXCJKVU5cIiwgXCJKVUxcIiwgXCJBVUdcIiwgXCJTRVBcIiwgXCJPQ1RcIiwgXCJOT1ZcIiwgXCJERUNcIl0sIFxuICogICAgICAgICAgICAgICAgICAgIGRheVRpdGxlczogWydzdW4nLCAnbW9uJywgJ3R1ZScsICd3ZWQnLCAndGh1JywgJ2ZyaScsICdzYXQnXSAvLyDsmpTsnbzrk6RcbiAqICAgICAgICAgICAgIH0pO1xuICoqL1xudmFyIENhbGVuZGFyID0gdXRpbC5kZWZpbmVDbGFzcyggLyoqIEBsZW5kcyBDYWxlbmRhci5wcm90b3R5cGUgKi8ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IG9wdGlvbnNcbiAgICAgICAgICogb3B0aW9uOiB7XG4gICAgICAgICAqICAgICBjbGFzc1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgeWVhcjogbnVtYmVyXG4gICAgICAgICAqICAgICBtb250aDogbnVtYmVyXG4gICAgICAgICAqICAgICB0aXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgdG9kYXlGb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICogICAgIHllYXJUaXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgbW9udGhUaXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgbW9udGhUaXRsZXM6IEFycmF5LFxuICAgICAgICAgKiAgICAgZGF5VGl0bGVzOiBBcnJheSxcbiAgICAgICAgICogfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb3B0aW9uID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGF5IHRoYXQgaXMgc2hvd25cbiAgICAgICAgICogQHR5cGUge3t5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fc2hvd25EYXRlID0ge3llYXI6IDAsIG1vbnRoOiAxLCBkYXRlOiAxfTtcblxuICAgICAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgKiBqUXVlcnkgLSBIVE1MRWxlbWVudFxuICAgICAgICAgKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PVJvb3QgRWxlbWVudD09PT09PT09PVxuICAgICAgICAgKiBJZiBvcHRpb25zIGRvIG5vdCBpbmNsdWRlIGVsZW1lbnQsIHRoaXMgY29tcG9uZW50IGplZGdlIGluaXRpYWxpemUgZWxlbWVudCB3aXRob3V0IG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKG9wdGlvbi5lbGVtZW50IHx8IGFyZ3VtZW50c1swXSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PUhlYWRlcj09PT09PT09PVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kaGVhZGVyID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB0aWx0ZVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kdGl0bGUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHllYXIgdGl0bGVcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRpdGxlWWVhciA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW9udGggdGl0bGVcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRpdGxlTW9udGggPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiA9PT09PT09PT1Cb2R5PT09PT09PT09XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRib2R5ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB0ZW1wbGF0ZSBvZiB3ZWVrXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR3ZWVrVGVtcGxhdGUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHdlZWsgcGFyZW50IGVsZW1lbnQgXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0ID0gbnVsbDtcblxuICAgICAgICAvKiotLS0tLS0tLSBmb290ZXIgLS0tLS0tLS0qL1xuICAgICAgICB0aGlzLiRmb290ZXIgPSBudWxsO1xuXG4gICAgICAgIC8qKiBUb2RheSAqL1xuICAgICAgICB0aGlzLiR0b2RheSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGF0ZSBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl8kZGF0ZUVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGUgd3JhcHBlciBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl8kZGF0ZUNvbnRhaW5lckVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiA9PT09PT09PT1Gb290ZXI9PT09PT09PT1cbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGZvb3RlciA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRvZGF5IGVsZW1lbnRcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRvZGF5ID0gbnVsbDtcblxuICAgICAgICAvKiogU2V0IGRlZmF1bHQgb3B0aW9ucyAqL1xuICAgICAgICB0aGlzLl9zZXREZWZhdWx0KG9wdGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZ1bGF0IG9waXRvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIHRvIGluaXRpYWx6aWUgY29tcG9uZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0RGVmYXVsdDogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX3NldE9wdGlvbihvcHRpb24pO1xuICAgICAgICB0aGlzLl9hc3NpZ25IVE1MRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuX29wdGlvbi55ZWFyLCB0aGlzLl9vcHRpb24ubW9udGgsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2F2ZSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25dIEEgb3B0aW9ucyB0byBpbml0aWFsaXplIGNvbXBvbmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldE9wdGlvbjogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZU9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHRvZGF5ID0gdXRpbHMuZ2V0RGF0ZUhhc2hUYWJsZSgpO1xuXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9uID0ge1xuICAgICAgICAgICAgY2xhc3NQcmVmaXg6ICdjYWxlbmRhci0nLFxuICAgICAgICAgICAgeWVhcjogdG9kYXkueWVhcixcbiAgICAgICAgICAgIG1vbnRoOiB0b2RheS5tb250aCxcbiAgICAgICAgICAgIHRpdGxlRm9ybWF0OiAneXl5eS1tbScsXG4gICAgICAgICAgICB0b2RheUZvcm1hdDogJ3l5eXkvbW0vZGQgKEQpJyxcbiAgICAgICAgICAgIHllYXJUaXRsZUZvcm1hdDogJ3l5eXknLFxuICAgICAgICAgICAgbW9udGhUaXRsZUZvcm1hdDogJ20nLFxuICAgICAgICAgICAgbW9udGhUaXRsZXM6IFsnSkFOJywgJ0ZFQicsICdNQVInLCAnQVBSJywgJ01BWScsICdKVU4nLCAnSlVMJywgJ0FVRycsICdTRVAnLCAnT0NUJywgJ05PVicsICdERUMnXSxcbiAgICAgICAgICAgIGRheVRpdGxlczogWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXVxuICAgICAgICB9O1xuICAgICAgICB1dGlsLmV4dGVuZChpbnN0YW5jZU9wdGlvbiwgZGVmYXVsdE9wdGlvbiwgb3B0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGVsZW1lbnQgdG8gZmlsZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25IVE1MRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXgsXG4gICAgICAgICAgICAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgICBjbGFzc1NlbGVjdG9yID0gJy4nICsgY2xhc3NQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduSGVhZGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkJvZHkoJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KTtcbiAgICAgICAgdGhpcy5fYXNzaWduRm9vdGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGhlYWRlciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduSGVhZGVyOiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRoZWFkZXIgPSAkZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnaGVhZGVyJyksXG4gICAgICAgICAgICBoZWFkZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCxcbiAgICAgICAgICAgIGtleSA9IENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXksXG4gICAgICAgICAgICBidG5DbGFzc05hbWUgPSAnYnRuLSc7XG5cbiAgICAgICAgaWYgKCEkaGVhZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgaGVhZGVyVGVtcGxhdGUgPSBDT05TVEFOVFMuY2FsZW5kYXJIZWFkZXI7XG4gICAgICAgICAgICBkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAgPSBDT05TVEFOVFMuZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgICAgICAkaGVhZGVyID0gJChoZWFkZXJUZW1wbGF0ZS5yZXBsYWNlKGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCwgY2xhc3NQcmVmaXgpKTtcbiAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgkaGVhZGVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBidXR0b25cbiAgICAgICAgJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBidG5DbGFzc05hbWUgKyBDT05TVEFOVFMucHJldlllYXIpLmRhdGEoa2V5LCAtMTIpO1xuICAgICAgICAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIGJ0bkNsYXNzTmFtZSArIENPTlNUQU5UUy5wcmV2TW9udGgpLmRhdGEoa2V5LCAtMSk7XG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLm5leHRZZWFyKS5kYXRhKGtleSwgMTIpO1xuICAgICAgICAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIGJ0bkNsYXNzTmFtZSArIENPTlNUQU5UUy5uZXh0TW9udGgpLmRhdGEoa2V5LCAxKTtcblxuICAgICAgICAvLyB0aXRsZSB0ZXh0XG4gICAgICAgIHRoaXMuJHRpdGxlID0gJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyAndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdGl0bGVZZWFyID0gJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyAndGl0bGUteWVhcicpO1xuICAgICAgICB0aGlzLiR0aXRsZU1vbnRoID0gJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyAndGl0bGUtbW9udGgnKTtcbiAgICAgICAgdGhpcy4kaGVhZGVyID0gJGhlYWRlcjtcbiAgICAgICAgdGhpcy5fYXR0YWNoRXZlbnRUb1JvbGxvdmVyQnRuKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvZHkgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbG1lbnQgb2YgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzU2VsZWN0b3IgQSBzZWxlY3RvciBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduQm9keTogZnVuY3Rpb24oJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciAkYm9keSA9ICRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdib2R5JyksXG4gICAgICAgICAgICAkd2Vla1RlbXBsYXRlLFxuICAgICAgICAgICAgYm9keVRlbXBsYXRlLFxuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgIGlmICghJGJvZHkubGVuZ3RoKSB7XG4gICAgICAgICAgICBib2R5VGVtcGxhdGUgPSBDT05TVEFOVFMuY2FsZW5kYXJCb2R5O1xuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwID0gQ09OU1RBTlRTLmRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICAgICAgJGJvZHkgPSAkKGJvZHlUZW1wbGF0ZS5yZXBsYWNlKGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCwgY2xhc3NQcmVmaXgpKTtcbiAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgkYm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgJHdlZWtUZW1wbGF0ZSA9ICRib2R5LmZpbmQoY2xhc3NTZWxlY3RvciArICd3ZWVrJyk7XG4gICAgICAgIHRoaXMuJHdlZWtUZW1wbGF0ZSA9ICR3ZWVrVGVtcGxhdGUuY2xvbmUodHJ1ZSk7XG4gICAgICAgIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQgPSAkd2Vla1RlbXBsYXRlLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiRib2R5ID0gJGJvZHk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGZvb3RlciBlbGVtZW50XG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRlbGVtZW50IFRoZSByb290IGVsZW1lbnQgb2YgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzU2VsZWN0b3IgQSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIHByZWZpeCBmb3IgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Gb290ZXI6IGZ1bmN0aW9uKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICB2YXIgJGZvb3RlciA9ICRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdmb290ZXInKSxcbiAgICAgICAgICAgIGZvb3RlclRlbXBsYXRlLFxuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgIGlmICghJGZvb3Rlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvb3RlclRlbXBsYXRlID0gQ09OU1RBTlRTLmNhbGVuZGFyRm9vdGVyO1xuICAgICAgICAgICAgZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwID0gQ09OU1RBTlRTLmRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICAgICAgJGZvb3RlciA9ICQoZm9vdGVyVGVtcGxhdGUucmVwbGFjZShkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsIGNsYXNzUHJlZml4KSk7XG4gICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJGZvb3Rlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kdG9kYXkgPSAkZm9vdGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0b2RheScpO1xuICAgICAgICB0aGlzLiRmb290ZXIgPSAkZm9vdGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmF2aWdhdGlvbiBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2F0dGFjaEV2ZW50VG9Sb2xsb3ZlckJ0bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBidG5zID0gdGhpcy4kaGVhZGVyLmZpbmQoJy5yb2xsb3ZlcicpO1xuXG4gICAgICAgIGJ0bnMub24oJ2NsaWNrJywgdXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlTW9udGhWYWx1ZSA9ICQoZXZlbnQudGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KDAsIHJlbGF0aXZlTW9udGhWYWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9LCB0aGlzKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBIYXNoIGRhdGEgdG8gZHJvdyBjYWxlbmRhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNSZWxhdGl2ZV0gIFdoZXRoZXIgaXMgcmVsYXRlZCBvdGhlciB2YWx1ZSBvciBub3RcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IEEgZGF0ZSBoYXNoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0RGF0ZUZvckRyYXdpbmc6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBpc1JlbGF0aXZlKSB7XG4gICAgICAgIHZhciBuRGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgcmVsYXRpdmVEYXRlO1xuXG4gICAgICAgIG5EYXRlLmRhdGUgPSAxO1xuICAgICAgICBpZiAoIXV0aWwuaXNOdW1iZXIoeWVhcikgJiYgIXV0aWwuaXNOdW1iZXIobW9udGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbkRhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgICAgICAgcmVsYXRpdmVEYXRlID0gdXRpbHMuZ2V0UmVsYXRpdmVEYXRlKHllYXIsIG1vbnRoLCAwLCBuRGF0ZSk7XG4gICAgICAgICAgICBuRGF0ZS55ZWFyID0gcmVsYXRpdmVEYXRlLnllYXI7XG4gICAgICAgICAgICBuRGF0ZS5tb250aCA9IHJlbGF0aXZlRGF0ZS5tb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5EYXRlLnllYXIgPSB5ZWFyIHx8IG5EYXRlLnllYXI7XG4gICAgICAgICAgICBuRGF0ZS5tb250aCA9IG1vbnRoIHx8IG5EYXRlLm1vbnRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5EYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBKdWRnZSB0byByZWRyYXcgY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSByZWZsb3cgXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNOZWNlc3NhcnlGb3JEcmF3aW5nOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgc2hvd25EYXRlID0gdGhpcy5fc2hvd25EYXRlO1xuXG4gICAgICAgIHJldHVybiAoc2hvd25EYXRlLnllYXIgIT09IHllYXIgfHwgc2hvd25EYXRlLm1vbnRoICE9PSBtb250aCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgY2FsZW5kYXIgdGV4dFxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIFRoYSBoYXNoIHRoYXQgc2hvdyB1cCBvbiBjYWxlbmRhciBcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDYWxlbmRhclRleHQ6IGZ1bmN0aW9uKGRhdGVGb3JEcmF3aW5nKSB7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZUZvckRyYXdpbmcueWVhcixcbiAgICAgICAgICAgIG1vbnRoID0gZGF0ZUZvckRyYXdpbmcubW9udGg7XG5cbiAgICAgICAgdGhpcy5fc2V0Q2FsZW5kYXJUb2RheSgpO1xuICAgICAgICB0aGlzLl9zZXRDYWxlbmRhclRpdGxlKHllYXIsIG1vbnRoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBkYXRlcyBieSBtb250aC5cbiAgICAgKiBAcGFyYW0ge3t5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9fSBkYXRlRm9yRHJhd2luZyBBIGRhdGUgdG8gZHJhd1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIGNsYXNzIHByZWZpeFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdEYXRlczogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZUZvckRyYXdpbmcueWVhcixcbiAgICAgICAgICAgIG1vbnRoID0gZGF0ZUZvckRyYXdpbmcubW9udGgsXG4gICAgICAgICAgICBkYXlJbldlZWsgPSAwLFxuICAgICAgICAgICAgZGF0ZVByZXZNb250aCA9IHV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAtMSwgMCwgZGF0ZUZvckRyYXdpbmcpLFxuICAgICAgICAgICAgZGF0ZU5leHRNb250aCA9IHV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAxLCAwLCBkYXRlRm9yRHJhd2luZyksXG4gICAgICAgICAgICBkYXRlcyA9IFtdLFxuICAgICAgICAgICAgZmlyc3REYXkgPSB1dGlscy5nZXRGaXJzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBpbmRleE9mTGFzdERhdGUgPSB0aGlzLl9maWxsRGF0ZXMoeWVhciwgbW9udGgsIGRhdGVzKTtcblxuICAgICAgICB1dGlsLmZvckVhY2goZGF0ZXMsIGZ1bmN0aW9uKGRhdGUsIGkpIHtcbiAgICAgICAgICAgIHZhciBpc1ByZXZNb250aCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzTmV4dE1vbnRoID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXIgPSAkKHRoaXMuXyRkYXRlQ29udGFpbmVyRWxlbWVudFtpXSksXG4gICAgICAgICAgICAgICAgdGVtcFllYXIgPSB5ZWFyLFxuICAgICAgICAgICAgICAgIHRlbXBNb250aCA9IG1vbnRoLFxuICAgICAgICAgICAgICAgIGV2ZW50RGF0YTtcblxuICAgICAgICAgICAgaWYgKGkgPCBmaXJzdERheSkge1xuICAgICAgICAgICAgICAgIGlzUHJldk1vbnRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy5wcmV2TW9udGgpO1xuICAgICAgICAgICAgICAgIHRlbXBZZWFyID0gZGF0ZVByZXZNb250aC55ZWFyO1xuICAgICAgICAgICAgICAgIHRlbXBNb250aCA9IGRhdGVQcmV2TW9udGgubW9udGg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiBpbmRleE9mTGFzdERhdGUpIHtcbiAgICAgICAgICAgICAgICBpc05leHRNb250aCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXIuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyBDT05TVEFOVFMubmV4dE1vbnRoKTtcbiAgICAgICAgICAgICAgICB0ZW1wWWVhciA9IGRhdGVOZXh0TW9udGgueWVhcjtcbiAgICAgICAgICAgICAgICB0ZW1wTW9udGggPSBkYXRlTmV4dE1vbnRoLm1vbnRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZWVrZW5kXG4gICAgICAgICAgICB0aGlzLl9zZXRXZWVrZW5kKGRheUluV2VlaywgJGRhdGVDb250YWluZXIsIGNsYXNzUHJlZml4KTtcblxuICAgICAgICAgICAgLy8gVG9kYXlcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1RvZGF5KHRlbXBZZWFyLCB0ZW1wTW9udGgsIGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXIuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyAndG9kYXknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICRkYXRlOiAkKHRoaXMuXyRkYXRlRWxlbWVudC5nZXQoaSkpLFxuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyOiAkZGF0ZUNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICB5ZWFyOiB0ZW1wWWVhcixcbiAgICAgICAgICAgICAgICBtb250aDogdGVtcE1vbnRoLFxuICAgICAgICAgICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgICAgICAgICAgaXNQcmV2TW9udGg6IGlzUHJldk1vbnRoLFxuICAgICAgICAgICAgICAgIGlzTmV4dE1vbnRoOiBpc05leHRNb250aCxcbiAgICAgICAgICAgICAgICBodG1sOiBkYXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJChldmVudERhdGEuJGRhdGUpLmh0bWwoZXZlbnREYXRhLmh0bWwudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBkYXlJbldlZWsgPSAoZGF5SW5XZWVrICsgMSkgJSA3O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpcmUgZHJhdyBldmVudCB3aGVuIGNhbGVuZGFyIGRyYXcgZWFjaCBkYXRlLlxuICAgICAgICAgICAgICogQGFwaVxuICAgICAgICAgICAgICogQGV2ZW50IENhbGVuZGFyI2RyYXdcbiAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIEEgbmFtZSBvZiBjdXN0b20gZXZlbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNQcmV2TW9udGggV2hldGhlciB0aGUgZHJhdyBkYXkgaXMgbGFzdCBtb250aCBvciBub3RcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNOZXh0TW9udGggV2VodGVyIHRoZSBkcmF3IGRheSBpcyBuZXh0IG1vbnRoIG9yIG5vdFxuICAgICAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRkYXRlIFRoZSBlbGVtZW50IGhhdmUgZGF0ZSBodG1sXG4gICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRhdGVDb250YWluZXIgQ2hpbGQgZWxlbWVudCB0aGF0IGhhcyBjbGFzc05hbWUgW3ByZWZpeF13ZWVrLiBJdCBpcyBwb3NzaWJsZSB0aGlzIGVsZW1lbnQgZXF1ZWwgZWxEYXRlLlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSBkcmF3IGRhdGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIGRyYXcgbW9udGhcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgZHJhdyB5ZWFyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBBIGh0bWwgc3RyaW5nXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogLy8gZHJhdyBjdXN0b20gZXZlbiBoYW5kbGVyXG4gICAgICAgICAgICAgKiBjYWxlbmRhci5vbignZHJhdycsIGZ1bmN0aW9uKGRyYXdFdmVudCl7IC4uLiB9KTtcbiAgICAgICAgICAgICAqKi9cbiAgICAgICAgICAgIHRoaXMuZmlyZSgnZHJhdycsIGV2ZW50RGF0YSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEplZGdlIHRoZSBpbnB1dCBkYXRlIGlzIHRvZGF5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSBkYXRlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzVG9kYXk6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgICAgIHZhciB0b2RheSA9IHV0aWxzLmdldERhdGVIYXNoVGFibGUoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdG9kYXkueWVhciA9PT0geWVhciAmJlxuICAgICAgICAgICAgdG9kYXkubW9udGggPT09IG1vbnRoICYmXG4gICAgICAgICAgICB0b2RheS5kYXRlID09PSBkYXRlXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1ha2Ugb25lIHdlZWsgdGVtcGF0ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRXZWVrczogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyICRlbFdlZWssXG4gICAgICAgICAgICB3ZWVrcyA9IHV0aWxzLmdldFdlZWtzKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3ZWVrczsgaSArPSAxKSB7XG4gICAgICAgICAgICAkZWxXZWVrID0gdGhpcy4kd2Vla1RlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgJGVsV2Vlay5hcHBlbmRUbyh0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtFbGVtZW50cy5wdXNoKCRlbFdlZWspO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhdmUgZHJhdyBkYXRlcyB0byBhcnJheVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB5ZWFyIEEgZHJhdyB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vbnRoIEEgZHJhdyBtb250aFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGVzIEEgZHJhdyBkYXRlXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBpbmRleCBvZiBsYXN0IGRhdGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9maWxsRGF0ZXM6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlcykge1xuICAgICAgICB2YXIgZmlyc3REYXkgPSB1dGlscy5nZXRGaXJzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBsYXN0RGF5ID0gdXRpbHMuZ2V0TGFzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBsYXN0RGF0ZSA9IHV0aWxzLmdldExhc3REYXRlKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGRhdGVQcmV2TW9udGggPSB1dGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIHt5ZWFyOiB5ZWFyLCBtb250aDogbW9udGgsIGRhdGU6IDF9KSxcbiAgICAgICAgICAgIHByZXZNb250aExhc3REYXRlID0gdXRpbHMuZ2V0TGFzdERhdGUoZGF0ZVByZXZNb250aC55ZWFyLCBkYXRlUHJldk1vbnRoLm1vbnRoKSxcbiAgICAgICAgICAgIGluZGV4T2ZMYXN0RGF0ZSxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgaWYgKGZpcnN0RGF5ID4gMCkge1xuICAgICAgICAgICAgZm9yIChpID0gcHJldk1vbnRoTGFzdERhdGUgLSBmaXJzdERheTsgaSA8IHByZXZNb250aExhc3REYXRlOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBkYXRlcy5wdXNoKGkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGFzdERhdGUgKyAxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGRhdGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXhPZkxhc3REYXRlID0gZGF0ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IDcgLSBsYXN0RGF5OyBpICs9IDEpIHtcbiAgICAgICAgICAgIGRhdGVzLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXhPZkxhc3REYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgd2Vla2VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXkgQSBkYXRlXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICRkYXRlQ29udGFpbmVyIEEgY29udGFpbmVyIGVsZW1lbnQgZm9yIGRhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggb2YgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRXZWVrZW5kOiBmdW5jdGlvbihkYXksICRkYXRlQ29udGFpbmVyLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICBpZiAoZGF5ID09PSAwKSB7XG4gICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArICdzdW4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXkgPT09IDYpIHtcbiAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgJ3NhdCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIGNhbGVuZGFyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl93ZWVrRWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy4kd2Vla0FwcGVuZFRhcmdldC5lbXB0eSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRpdGxlIHdpdGggZm9ybWF0IG9wdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHZhbHVlIG9mIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBtb250aCBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQHByaXZhdGVcbiAgICAgKiovXG4gICAgX3NldENhbGVuZGFyVGl0bGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0aXRsZUZvcm1hdCA9IG9wdGlvbi50aXRsZUZvcm1hdCxcbiAgICAgICAgICAgIHJlcGxhY2VNYXAsXG4gICAgICAgICAgICByZWc7XG5cbiAgICAgICAgbW9udGggPSB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8obW9udGgpO1xuICAgICAgICByZXBsYWNlTWFwID0gdGhpcy5fZ2V0UmVwbGFjZU1hcCh5ZWFyLCBtb250aCk7XG5cbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlUmVnRXhwO1xuICAgICAgICB0aGlzLl9zZXREYXRlVGV4dEluQ2FsZW5kYXIodGhpcy4kdGl0bGUsIHRpdGxlRm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuXG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50aXRsZVllYXJSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcih0aGlzLiR0aXRsZVllYXIsIG9wdGlvbi55ZWFyVGl0bGVGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG5cbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlTW9udGhSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcih0aGlzLiR0aXRsZU1vbnRoLCBvcHRpb24ubW9udGhUaXRsZUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRpdGxlXG4gICAgICogQHBhcmFtIHtqUXVlcnl8SFRNTEVsZW1lbnR9IGVsZW1lbnQgQSB1cGRhdGUgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtIEEgdXBkYXRlIGZvcm1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwIEEgb2JqZWN0IHRoYXQgaGFzIHZhbHVlIG1hdGNoZWQgcmVnRXhwXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IHJlZyBBIHJlZ0V4cCB0byBjaGFnbmUgZm9ybVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldERhdGVUZXh0SW5DYWxlbmRhcjogZnVuY3Rpb24oZWxlbWVudCwgZm9ybSwgbWFwLCByZWcpIHtcbiAgICAgICAgdmFyIHRpdGxlLFxuICAgICAgICAgICAgJGVsID0gJChlbGVtZW50KTtcblxuICAgICAgICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZSA9IHRoaXMuX2dldENvbnZlcnRlZFRpdGxlKGZvcm0sIG1hcCwgcmVnKTtcbiAgICAgICAgJGVsLnRleHQodGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbWFwIGRhdGEgZm9yIGZvcm1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbZGF0ZV0gQSBkYXlcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXBsYWNlTWFwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0UmVwbGFjZU1hcDogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHllYXJTdWIgPSAoeWVhci50b1N0cmluZygpKS5zdWJzdHIoMiwgMiksXG4gICAgICAgICAgICBtb250aExhYmVsID0gb3B0aW9uLm1vbnRoVGl0bGVzW21vbnRoIC0gMV0sXG4gICAgICAgICAgICBsYWJlbEtleSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF0ZSB8fCAxKS5nZXREYXkoKSxcbiAgICAgICAgICAgIGRheUxhYmVsID0gb3B0aW9uLmRheVRpdGxlc1tsYWJlbEtleV07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHl5eXk6IHllYXIsXG4gICAgICAgICAgICB5eTogeWVhclN1YixcbiAgICAgICAgICAgIG1tOiBtb250aCxcbiAgICAgICAgICAgIG06IE51bWJlcihtb250aCksXG4gICAgICAgICAgICBNOiBtb250aExhYmVsLFxuICAgICAgICAgICAgZGQ6IGRhdGUsXG4gICAgICAgICAgICBkOiBOdW1iZXIoZGF0ZSksXG4gICAgICAgICAgICBEOiBkYXlMYWJlbFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFnZSB0ZXh0IGFuZCByZXR1cm4uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHRleHQgdG8gY2hhZ25lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hcCBBIGNoYWduZSBrZXksIHZhbHVlIHNldFxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWcgQSByZWdFeHAgdG8gY2hhZ25lIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0Q29udmVydGVkVGl0bGU6IGZ1bmN0aW9uKHN0ciwgbWFwLCByZWcpIHtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtYXRjaGVkU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwW21hdGNoZWRTdHJpbmddIHx8ICcnO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRvZGF5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q2FsZW5kYXJUb2RheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdG9kYXkgPSB0aGlzLiR0b2RheSxcbiAgICAgICAgICAgIHRvZGF5Rm9ybWF0LFxuICAgICAgICAgICAgdG9kYXksXG4gICAgICAgICAgICB5ZWFyLFxuICAgICAgICAgICAgbW9udGgsXG4gICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgcmVwbGFjZU1hcCxcbiAgICAgICAgICAgIHJlZztcblxuICAgICAgICBpZiAoISR0b2RheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZGF5ID0gdXRpbHMuZ2V0RGF0ZUhhc2hUYWJsZSgpO1xuICAgICAgICB5ZWFyID0gdG9kYXkueWVhcjtcbiAgICAgICAgbW9udGggPSB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8odG9kYXkubW9udGgpO1xuICAgICAgICBkYXRlID0gdGhpcy5fcHJlcGVuZExlYWRpbmdaZXJvKHRvZGF5LmRhdGUpO1xuICAgICAgICB0b2RheUZvcm1hdCA9IHRoaXMuX29wdGlvbi50b2RheUZvcm1hdDtcbiAgICAgICAgcmVwbGFjZU1hcCA9IHRoaXMuX2dldFJlcGxhY2VNYXAoeWVhciwgbW9udGgsIGRhdGUpO1xuICAgICAgICByZWcgPSBDT05TVEFOVFMudG9kYXlSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcigkdG9kYXksIHRvZGF5Rm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFnbmUgbnVtYmVyIDB+OSB0byAnMDB+MDknXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdGhpcy5fcHJlcGVuZExlYWRpbmdaZXJvKDApOyAvLyAgJzAwJ1xuICAgICAqICB0aGlzLl9wcmVwZW5kTGVhZGluZ1plcm8oOSk7IC8vICAnMDknXG4gICAgICogIHRoaXMuX3ByZXBlbmRMZWFkaW5nWmVybygxMik7IC8vICAnMTInXG4gICAgICovXG4gICAgX3ByZXBlbmRMZWFkaW5nWmVybzogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJztcblxuICAgICAgICBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgICAgIHByZWZpeCA9ICcwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJlZml4ICsgbnVtYmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGNhbGVuZGFyXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeWVhcl0gQSB5ZWFyIChleC4gMjAwOClcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoXSBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbaXNSZWxhdGl2ZV0gIEEgeWVhciBhbmQgbW9udGggaXMgcmVsYXRlZFxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2FsZW5kYXIuZHJhdygpOyAvLyBEcmF3IHdpdGggbm93IGRhdGUuXG4gICAgICogY2FsZW5kYXIuZHJhdygyMDA4LCAxMik7IC8vIERyYXcgMjAwOC8xMlxuICAgICAqIGNhbGVuZGFyLmRyYXcobnVsbCwgMTIpOyAvLyBEcmF3IGN1cnJlbnQgeWVhci8xMlxuICAgICAqIGNhbGVuZGFyLmRyYXcoMjAxMCwgbnVsbCk7IC8vIERyYXcgMjAxMC9jdXJyZW50IG1vbnRoXG4gICAgICogY2FsZW5kYXIuZHJhdygwLCAxLCB0cnVlKTsgLy8gRHJhdyBuZXh0IG1vbnRoXG4gICAgICogY2FsZW5kYXIuZHJhdygtMSwgbnVsbCwgdHJ1ZSk7IC8vIERyYXcgcHJldiB5ZWFyXG4gICAgICoqL1xuICAgIGRyYXc6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBpc1JlbGF0aXZlKSB7XG4gICAgICAgIHZhciBkYXRlRm9yRHJhd2luZyA9IHRoaXMuX2dldERhdGVGb3JEcmF3aW5nKHllYXIsIG1vbnRoLCBpc1JlbGF0aXZlKSxcbiAgICAgICAgICAgIGlzUmVhZHlGb3JEcmF3aW5nID0gdGhpcy5pbnZva2UoJ2JlZm9yZURyYXcnLCBkYXRlRm9yRHJhd2luZyksXG4gICAgICAgICAgICBjbGFzc1ByZWZpeDtcblxuICAgICAgICAvKio9PT09PT09PT09PT09PT1cbiAgICAgICAgICogYmVmb3JlRHJhd1xuICAgICAgICAgPT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBpZiAoIWlzUmVhZHlGb3JEcmF3aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKio9PT09PT09PT09PT09PT1cbiAgICAgICAgICogZHJhd1xuICAgICAgICAgPT09PT09PT09PT09PT09PT0qL1xuICAgICAgICB5ZWFyID0gZGF0ZUZvckRyYXdpbmcueWVhcjtcbiAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcblxuICAgICAgICBjbGFzc1ByZWZpeCA9IHRoaXMuX29wdGlvbi5jbGFzc1ByZWZpeDtcbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fc2V0Q2FsZW5kYXJUZXh0KGRhdGVGb3JEcmF3aW5nKTtcblxuICAgICAgICAvLyB3ZWVrc1xuICAgICAgICB0aGlzLl9zZXRXZWVrcyh5ZWFyLCBtb250aCk7XG4gICAgICAgIHRoaXMuXyRkYXRlRWxlbWVudCA9ICQoJy4nICsgY2xhc3NQcmVmaXggKyAnZGF0ZScsIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQpO1xuICAgICAgICB0aGlzLl8kZGF0ZUNvbnRhaW5lckVsZW1lbnQgPSAkKCcuJyArIGNsYXNzUHJlZml4ICsgJ3dlZWsgPiAqJywgdGhpcy4kd2Vla0FwcGVuZFRhcmdldCk7XG5cbiAgICAgICAgLy8gZGF0ZXNcbiAgICAgICAgdGhpcy5zZXREYXRlKHllYXIsIG1vbnRoKTtcbiAgICAgICAgdGhpcy5fZHJhd0RhdGVzKGRhdGVGb3JEcmF3aW5nLCBjbGFzc1ByZWZpeCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuc2hvdygpO1xuXG4gICAgICAgIC8qKj09PT09PT09PT09PT09PVxuICAgICAgICAgKiBhZnRlckRyYXdcbiAgICAgICAgID09PT09PT09PT09PT09PT0qL1xuICAgICAgICB0aGlzLmZpcmUoJ2FmdGVyRHJhdycsIGRhdGVGb3JEcmF3aW5nKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGN1cnJlbnQgeWVhciBhbmQgbW9udGgoanVzdCBzaG93bikuXG4gICAgICogQGFwaVxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBnZXREYXRlKCk7ID0+IHsgeWVhcjogeHh4eCwgbW9udGg6IHh4IH07XG4gICAgICovXG4gICAgZ2V0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiB0aGlzLl9zaG93bkRhdGUueWVhcixcbiAgICAgICAgICAgIG1vbnRoOiB0aGlzLl9zaG93bkRhdGUubW9udGhcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRhdGVcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5ZWFyXSBBIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbW9udGhdIEEgbW9udGggKDEgfiAxMilcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBzZXREYXRlKDE5ODQsIDA0KTtcbiAgICAgKiovXG4gICAgc2V0RGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyIGRhdGUgPSB0aGlzLl9zaG93bkRhdGU7XG4gICAgICAgIGRhdGUueWVhciA9IHV0aWwuaXNOdW1iZXIoeWVhcikgPyB5ZWFyIDogZGF0ZS55ZWFyO1xuICAgICAgICBkYXRlLm1vbnRoID0gdXRpbC5pc051bWJlcihtb250aCkgPyBtb250aCA6IGRhdGUubW9udGg7XG4gICAgfVxufSk7XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKENhbGVuZGFyKTtcbm1vZHVsZS5leHBvcnRzID0gQ2FsZW5kYXI7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbHMgZm9yIGNhbGVuZGFyIGNvbXBvbmVudFxuICogQGF1dGhvciBOSE4gTmV0LiBGRSBkZXYgdGVhbS4gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IG5lLWNvZGUtc25pcHBldCB+MS4wLjJcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXRpbHMgb2YgY2FsZW5kYXJcbiAqIEBuYW1lc3BhY2UgdXRpbHNcbiAqL1xudmFyIHV0aWxzID0ge1xuICAgIC8qKlxuICAgICAqIFJldHVybiBkYXRlIGhhc2ggYnkgcGFyYW1ldGVyLlxuICAgICAqICBpZiB0aGVyZSBhcmUgMyBwYXJhbWV0ZXIsIHRoZSBwYXJhbWV0ZXIgaXMgY29yZ25pemVkIERhdGUgb2JqZWN0XG4gICAgICogIGlmIHRoZXJlIGFyZSBubyBwYXJhbWV0ZXIsIHJldHVybiB0b2RheSdzIGhhc2ggZGF0ZVxuICAgICAqIEBmdW5jdGlvbiBnZXREYXRlSGFzaFRhYmxlXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICogQHBhcmFtIHtEYXRlfG51bWJlcn0gW3llYXJdIEEgZGF0ZSBpbnN0YW5jZSBvciB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb250aF0gQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZGF0ZV0gQSBkYXRlXG4gICAgICogQHJldHVybnMge3t5ZWFyOiAqLCBtb250aDogKiwgZGF0ZTogKn19IFxuICAgICAqL1xuICAgIGdldERhdGVIYXNoVGFibGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgICAgIHZhciBuRGF0ZTtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIG5EYXRlID0gYXJndW1lbnRzWzBdIHx8IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgIHllYXIgPSBuRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgbW9udGggPSBuRGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIGRhdGUgPSBuRGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgIGRhdGU6IGRhdGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRvZGF5IHRoYXQgc2F2ZWQgb24gY29tcG9uZW50IG9yIGNyZWF0ZSBuZXcgZGF0ZS5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0VG9kYXlcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6ICosIG1vbnRoOiAqLCBkYXRlOiAqfX1cbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKi9cbiAgICBnZXRUb2RheTogZnVuY3Rpb24oKSB7XG4gICAgICAgcmV0dXJuIHV0aWxzLmdldERhdGVIYXNoVGFibGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHdlZWtzIGNvdW50IGJ5IHBhcmFtZW50ZXJcbiAgICAgKiBAZnVuY3Rpb24gZ2V0V2Vla3NcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEByZXR1cm4ge251bWJlcn0g7KO8ICg0fjYpXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICoqL1xuICAgIGdldFdlZWtzOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgZmlyc3REYXkgPSB0aGlzLmdldEZpcnN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGxhc3REYXRlID0gdGhpcy5nZXRMYXN0RGF0ZSh5ZWFyLCBtb250aCk7XG5cbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoZmlyc3REYXkgKyBsYXN0RGF0ZSkgLyA3KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHVuaXggdGltZSBmcm9tIGRhdGUgaGFzaFxuICAgICAqIEBmdW5jdGlvbiBnZXRUaW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGUgQSBkYXRlIGhhc2hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF0ZS55ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlLm1vbnRoIEEgbW9udGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF0ZS5kYXRlIEEgZGF0ZVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB1dGlscy5nZXRUaW1lKHt5ZWFyOjIwMTAsIG1vbnRoOjUsIGRhdGU6MTJ9KTsgLy8gMTI3MzU5MDAwMDAwMFxuICAgICAqKi9cbiAgICBnZXRUaW1lOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGVPYmplY3QoZGF0ZSkuZ2V0VGltZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2hpY2ggZGF5IGlzIGZpcnN0IGJ5IHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIHllYXIgYW5kIG1vbnRoIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvbiBnZXRGaXJzdERheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAoMH42KVxuICAgICAqIEBtZW1iZXJvZiB1dGlsc1xuICAgICAqKi9cbiAgICBnZXRGaXJzdERheTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgMSkuZ2V0RGF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB3aGljaCBkYXkgaXMgbGFzdCBieSBwYXJhbWV0ZXJzIHRoYXQgaW5jbHVkZSB5ZWFyIGFuZCBtb250aCBpbmZvcm1hdGlvbi5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0TGFzdERheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAoMH42KVxuICAgICAqIEBtZW1iZXJvZiB1dGlsc1xuICAgICAqKi9cbiAgICBnZXRMYXN0RGF5OiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERheSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbGFzdCBkYXRlIGJ5IHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIHllYXIgYW5kIG1vbnRoIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAoMX4zMSlcbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiovXG4gICAgZ2V0TGFzdERhdGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGF0ZSBpbnN0YW5jZS5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0RGF0ZU9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRlIEEgZGF0ZSBoYXNoXG4gICAgICogQHJldHVybiB7RGF0ZX0gRGF0ZSAgXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdXRpbHMuZ2V0RGF0ZU9iamVjdCh7eWVhcjoyMDEwLCBtb250aDo1LCBkYXRlOjEyfSk7XG4gICAgICogIHV0aWxzLmdldERhdGVPYmplY3QoMjAxMCwgNSwgMTIpOyAvL3llYXIsbW9udGgsZGF0ZVxuICAgICAqKi9cbiAgICBnZXREYXRlT2JqZWN0OiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0gLSAxLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRhdGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVsYXRlZCBkYXRlIGhhc2ggd2l0aCBwYXJhbWV0ZXJzIHRoYXQgaW5jbHVkZSBkYXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvbiBnZXRSZWxhdGl2ZURhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHJlbGF0ZWQgdmFsdWUgZm9yIHllYXIoeW91IGNhbiB1c2UgKy8tKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIHJlbGF0ZWQgdmFsdWUgZm9yIG1vbnRoICh5b3UgY2FuIHVzZSArLy0pXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSByZWxhdGVkIHZhbHVlIGZvciBkYXkgKHlvdSBjYW4gdXNlICsvLSlcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0ZU9iaiBzdGFuZGFyZCBkYXRlIGhhc2hcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGVPYmogXG4gICAgICogQG1lbWJlcm9mIHV0aWxzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdXRpbHMuZ2V0UmVsYXRpdmVEYXRlKDEsIDAsIDAsIHt5ZWFyOjIwMDAsIG1vbnRoOjEsIGRhdGU6MX0pOyAvLyB7eWVhcjoyMDAxLCBtb250aDoxLCBkYXRlOjF9XG4gICAgICogIHV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAwLCAtMSwge3llYXI6MjAxMCwgbW9udGg6MSwgZGF0ZToxfSk7IC8vIHt5ZWFyOjIwMDksIG1vbnRoOjEyLCBkYXRlOjMxfVxuICAgICAqKi9cbiAgICBnZXRSZWxhdGl2ZURhdGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlLCBkYXRlT2JqKSB7XG4gICAgICAgIHZhciBuWWVhciA9IChkYXRlT2JqLnllYXIgKyB5ZWFyKSxcbiAgICAgICAgICAgIG5Nb250aCA9IChkYXRlT2JqLm1vbnRoICsgbW9udGggLSAxKSxcbiAgICAgICAgICAgIG5EYXRlID0gKGRhdGVPYmouZGF0ZSArIGRhdGUpLFxuICAgICAgICAgICAgbkRhdGVPYmogPSBuZXcgRGF0ZShuWWVhciwgbk1vbnRoLCBuRGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxzLmdldERhdGVIYXNoVGFibGUobkRhdGVPYmopO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG4iXX0=
