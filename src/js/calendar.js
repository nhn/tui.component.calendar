/**
 * @fileoverview Calendar component(from Pug component)
 * @author NHN Ent. FE dev team. <dl_javascript@nhnent.com>
 */
'use strict';

var utils = require('./utils');
var CONSTANTS = require('./constants');

var util = tui.util;

/**
 * Calendar component class
 * @constructor
 * @param {Object} [option] A options for initialize
 *     @param {HTMLElement} option.element A root element
 *     @param {string} [option.classPrefix="calendar-"] A prefix class for markup structure
 *     @param {number} [option.year=this year] A year for initialize
 *     @param {number} [option.month=this month] A month for initialize
 *     @param {string} [option.titleFormat="yyyy-mm"] A title format.
 *                     This component find title element by className '[prefix]title'
 *     @param {string} [option.todayFormat = "yyyy Year mm Month dd Day (D)"] A today format.
 *                     This component find today element by className '[prefix]today'
 *     @param {string} [option.yearTitleFormat = "yyyy"] A year title formant.
 *                     This component find year title element by className '[prefix]year'
 *     @param {string} [option.monthTitleFormat = "m"] A month title format.
 *                     This component find month title element by className이 '[prefix]month'
 *     @param {Array} [option.monthTitles = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]]
 *                    A label of each month.
 *     @param {Array} [option.dayTitles = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]] A label for day.
 *                    If you set the other option todayFormat 'D', you can use this name.
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
 *                    dayTitles: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] // days
 *                    rangeOfYear: 12,
 *                    isSelectableTitle: false
 *             });
 */
var Calendar = util.defineClass(/** @lends Calendar.prototype */ {
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
         *     rangeOfYear: number,
         *     isSelectableTitle: boolean
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

        /**
         * Index of shown pane
         * @type {number}
         */
        this.shownPaneIdx = 0;

        /**
         * List of pane's key
         * @type {Array}
         */
        this.keysOfPane = ['day', 'month', 'year'];

        /**
         * Data of month's pane
         * @type {Object}
         */
        this.dataOfMonthPane = {};

        /**
         * Data of year's pane
         * @type {Object}
         */
        this.dataOfYearPane = {};

        /**
         * Handlers binding context
         * @type {Object}
         */
        this.handlers = {};

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
        this._attachEvent();
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
            dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            rangeOfYear: CONSTANTS.rangeOfYear,
            isSelectableTitle: false
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
            btnClassName = 'btn-',
            isSelectableTitle = this._option.isSelectableTitle;

        if (!$header.length) {
            headerTemplate = (isSelectableTitle) ?
                            CONSTANTS.selectableCalendarHeader : CONSTANTS.calendarHeader;
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

        if (isSelectableTitle) {
            this.$title.wrap(CONSTANTS.buttonTemplate);
        }

        this.$header = $header;
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
            bodyTemplate,
            defaultClassPrefixRegExp,
            isSelectableTitle = this._option.isSelectableTitle;

        if (!$body.length) {
            bodyTemplate = CONSTANTS.calendarBody + CONSTANTS.calendarExtraBody;
            defaultClassPrefixRegExp = CONSTANTS.defaultClassPrefixRegExp;

            $body = $(bodyTemplate.replace(defaultClassPrefixRegExp, classPrefix));
            $element.append($body);
        }

        this._assignWeek(classSelector);

        if (isSelectableTitle) {
            this._assignMonthPane(classSelector);
            this._assignYearPane(classSelector);
        }

        this.$body = $body.hide();
    },

    /**
     * Register week elemnt on body
     * @param {string} classSelector A selector
     * @private
     */
    _assignWeek: function(classSelector) {
        var $body = this.$element.find(classSelector + 'body');
        var $weekTemplate = $body.find(classSelector + 'week');

        this.$weekTemplate = $weekTemplate.clone(true);
        this.$weekAppendTarget = $weekTemplate.parent();
    },

    /**
     * Register element of month's pane and save drawing info
     * @param {string} classSelector A selector
     * @private
     */
    _assignMonthPane: function(classSelector) {
        var $body = this.$element.find(classSelector + 'body');
        var $monthsTemplate = $body.find(classSelector + 'month-group');
        var cols = $monthsTemplate.find(classSelector + 'month').length;
        var rows = Math.ceil(this._option.monthTitles.length / cols);

        this.dataOfMonthPane = {
            template: $monthsTemplate.clone(true),
            appendedTarget: $monthsTemplate.parent(),
            frame: {
                cols: cols,
                rows: rows
            }
        };
    },

    /**
     * Register element of year's pane and save drawing info
     * @param {string} classSelector A selector
     * @private
     */
    _assignYearPane: function(classSelector) {
        var $body = this.$element.find(classSelector + 'body');
        var $yearsTemplate = $body.find(classSelector + 'year-group');
        var cols = $yearsTemplate.find(classSelector + 'year').length;
        var rows = Math.ceil(this._option.rangeOfYear / cols);

        this.dataOfYearPane = {
            template: $yearsTemplate.clone(true),
            appendedTarget: $yearsTemplate.parent(),
            frame: {
                cols: cols,
                rows: rows
            }
        };
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
     * Set event handlers and attach event on element
     * @private
     */
    _attachEvent: function() {
        var bind = util.bind;
        var isSelectableTitle = this._option.isSelectableTitle;

        this.handlers.clickRolloverBtn = bind(this._onClickRolloverButton, this);

        this.attachEventToRolloverBtn();

        if (!isSelectableTitle) {
            return;
        }

        util.extend(this.handlers, {
            clickTitle: bind(this._onClickTitle, this),
            clickYearPane: bind(this._onClickYearPane, this),
            clickMonthPane: bind(this._onClickMonthPane, this)
        });

        this.attachEventToTitle();
        this.attachEventToBody();
    },

    /**
     * Attach event on rollover buttons in "header" element
     */
    attachEventToRolloverBtn: function() {
        var selector = '.' + this._option.classPrefix + 'rollover';
        var btns = this.$header.find(selector);

        btns.on('click', this.handlers.clickRolloverBtn);
    },

    /**
     * Detach event on rollover buttons in "header" element
     */
    detachEventToRolloverBtn: function() {
        var selector = '.' + this._option.classPrefix + 'rollover';
        var btns = this.$header.find(selector);

        btns.off('click', this.handlers.clickRolloverBtn);
    },

    /**
     * Attach event on title in "header" element
     */
    attachEventToTitle: function() {
        this.$title.on('click', this.handlers.clickTitle);
    },

    /**
     * Detach event on title in "header" element
     */
    detachEventToTitle: function() {
        this.$title.off('click', this.handlers.clickTitle);
    },

    /**
     * Attach event on title in "body" element (month & year pane)
     */
    attachEventToBody: function() {
        this.dataOfYearPane.appendedTarget.on('click', 'a', this.handlers.clickYearPane);
        this.dataOfMonthPane.appendedTarget.on('click', 'a', this.handlers.clickMonthPane);
    },

    /**
     * Detach event on title in "body" element (month & year pane)
     */
    detachEventToBody: function() {
        this.dataOfYearPane.appendedTarget.off('click', 'a', this.handlers.clickYearPane);
        this.dataOfMonthPane.appendedTarget.off('click', 'a', this.handlers.clickMonthPane);
    },

    /**
     * Event handler - click on rollover buttons
     * @param {MouseEvent} event - Mouse event
     */
    _onClickRolloverButton: function(event) {
        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
        event.preventDefault();
        this.draw(0, relativeMonthValue, true);
    },

    /**
     * Event handler - click on title
     * @param {MouseEvent} event - Mouse event
     */
    _onClickTitle: function(event) {
        var shownPaneIdx;
        var date;

        event.preventDefault();

        if (!this._option.isSelectableTitle) {
            return;
        }

        shownPaneIdx = this.shownPaneIdx;
        shownPaneIdx = (shownPaneIdx !== 2) ? (shownPaneIdx + 1) : 0;

        date = this.getDate();

        this.draw(date.year, date.month, false, this.keysOfPane[shownPaneIdx]);
    },

    /**
     * Event handler - click on month's pane
     * @param {MouseEvent} event - Mouse event
     */
    _onClickYearPane: function(event) {
        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
        event.preventDefault();
        this.draw(0, relativeMonthValue, true, this.keysOfPane[1]);
    },

    /**
     * Event handler - click on year's pane
     * @param {MouseEvent} event - Mouse event
     */
    _onClickMonthPane: function(event) {
        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
        event.preventDefault();
        this.draw(0, relativeMonthValue, true, this.keysOfPane[0]);
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
             * @param {jQuery} $dateContainer Child element that has className [prefix]week.
             *                                It is possible this element equel elDate.
             * @param {number} date A draw date
             * @param {number} month A draw month
             * @param {number} year A draw year
             * @param {string} html A html string
             * @example
             * // draw custom even handlers
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
        var isYear = year ? (today.year === year) : true;
        var isMonth = month ? (today.month === month) : true;
        var isDate = date ? (today.date === date) : true;

        return isYear && isMonth && isDate;
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
     * @returns {number} index of last date
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

        if (this._option.isSelectableTitle) {
            this.dataOfMonthPane.appendedTarget.empty();
            this.dataOfYearPane.appendedTarget.empty();
        }
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

        month = utils.prependLeadingZero(month);
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
        title = utils.getConvertedTitle(form, map, reg);
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
        month = utils.prependLeadingZero(today.month);
        date = utils.prependLeadingZero(today.date);
        todayFormat = this._option.todayFormat;
        replaceMap = this._getReplaceMap(year, month, date);
        reg = CONSTANTS.todayRegExp;
        this._setDateTextInCalendar($today, todayFormat, replaceMap, reg);
    },

    /**
     * Set title on year's pane
     * @param {number} year - Year
     */
    _setTitleOnYearPane: function(year) {
        var rangeOfYear = this._getInfoOfYearRange(year);
        var startYearText = this._getConvertedYearTitle(rangeOfYear.startYear);
        var endYearText = this._getConvertedYearTitle(rangeOfYear.endYear);
        var title = startYearText + ' - ' + endYearText;

        this.$title.text(title);
    },

    /**
     * Get converted year text on year and month pane
     * @param {number} year - Year
     * @returns {string} Converted year text
     */
    _getConvertedYearTitle: function(year) {
        var option = this._option;
        var replaceMap, reg;

        replaceMap = this._getReplaceMap(year);
        reg = CONSTANTS.titleYearRegExp;

        return utils.getConvertedTitle(option.yearTitleFormat, replaceMap, reg);
    },

    /**
     * Get years info by "rangeOfYear" option
     * @param {number} year - Year
     * @returns {Object} Info of year's range
     */
    _getInfoOfYearRange: function(year) {
        var frameInfo = this.dataOfYearPane.frame;
        var cols = frameInfo.cols;
        var rows = frameInfo.rows;
        var baseIdx = (cols * Math.floor(rows / 2)) + Math.floor(cols / 2);
        var startYear = year - baseIdx;
        var endYear = startYear + (cols * rows) - 1;

        return {
            startYear: startYear,
            endYear: endYear
        };
    },

    /**
     * Get index of current shown pane by pane's type
     * @param {string} type - Type of pane
     * @returns {number} Index of shown pane
     */
    _getIndexOfShownPane: function(type) {
        return (type ? util.inArray(type, this.keysOfPane) : this.shownPaneIdx);
    },

    /**
     * Draw header element
     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
     * @param {number} shownPaneIdx - Index of shown pane
     * @private
     */
    _drawHeader: function(dateForDrawing, shownPaneIdx) {
        var btnClassName = 'btn-';
        var classSelector = '.' + this._option.classPrefix;
        var prevBtn = this.$header.find(classSelector + btnClassName + CONSTANTS.prev);
        var nextBtn = this.$header.find(classSelector + btnClassName + CONSTANTS.next);
        var key = CONSTANTS.relativeMonthValueKey;
        var rangeOfYear = this._option.rangeOfYear;
        var prevValue, nextValue;

        if (shownPaneIdx === 0) {
            this._setCalendarText(dateForDrawing);
            prevValue = -1;
            nextValue = 1;
        } else if (shownPaneIdx === 1) {
            this.$title.text(this._getConvertedYearTitle(dateForDrawing.year));
            prevValue = -12;
            nextValue = 12;
        } else if (shownPaneIdx === 2) {
            this._setTitleOnYearPane(dateForDrawing.year);
            prevValue = -12 * rangeOfYear;
            nextValue = 12 * rangeOfYear;
        }

        prevBtn.data(key, prevValue);
        nextBtn.data(key, nextValue);
    },

    /**
     * Draw body elements
     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
     * @param {number} shownPaneIdx - Index of shown pane
     * @private
     */
    _drawBody: function(dateForDrawing, shownPaneIdx) {
        var year = dateForDrawing.year;
        var month = dateForDrawing.month;
        var classPrefix = this._option.classPrefix;
        var isSelectableTitle = this._option.isSelectableTitle;

        // weeks
        this._setWeeks(year, month);
        this._$dateElement = $('.' + classPrefix + 'date', this.$weekAppendTarget);
        this._$dateContainerElement = $('.' + classPrefix + 'week > *', this.$weekAppendTarget);

        // dates
        this._drawDates(dateForDrawing, classPrefix);

        if (isSelectableTitle) {
            // month pane
            this._drawFrameOnMonthPane();
            this._drawButtonsOfMonth(month, classPrefix);

            // year pane
            this._drawFrameOnYearPane();
            this._drawButtonsOfYear(year, classPrefix);
        }

        // show pane
        this._changeShownPane(shownPaneIdx);
    },

    /**
     * Draw frame containing buttons on month's pane
     * @private
     */
    _drawFrameOnMonthPane: function() {
        var i = 0;
        var rows = this.dataOfMonthPane.frame.rows;
        var dataOfMonthPane = this.dataOfMonthPane;
        var $monthGroupEl;

        for (i; i < rows; i += 1) {
            $monthGroupEl = dataOfMonthPane.template.clone(true);
            $monthGroupEl.appendTo(dataOfMonthPane.appendedTarget);
        }
    },

    /**
     * Draw selectable buttons on month's pane
     * @param {number} month - Month
     * @param {string} classPrefix - A class prefix
     * @private
     */
    _drawButtonsOfMonth: function(month, classPrefix) {
        var key = CONSTANTS.relativeMonthValueKey;
        var monthTitles = this._option.monthTitles;
        var $monthEls = this.dataOfMonthPane.appendedTarget.find('.' + classPrefix + 'month');
        var $buttonEl, $tempButtonEl, tempMonth, relativeMonth;

        util.forEach(monthTitles, function(title, idx) {
            $buttonEl = $monthEls.eq(idx);
            tempMonth = (idx + 1);

            if (tempMonth === month) {
                $buttonEl.addClass(classPrefix + CONSTANTS.selected);
            }

            if (this._isToday(this._shownDate.year, tempMonth)) {
                $buttonEl.addClass(classPrefix + CONSTANTS.today);
            }

            relativeMonth = (tempMonth - month);

            $tempButtonEl = $(CONSTANTS.buttonTemplate);
            $tempButtonEl.data(key, relativeMonth).html(title);

            $buttonEl.html($tempButtonEl);
        }, this);
    },

    /**
     * Draw frame containing buttons on year's pane
     * @private
     */
    _drawFrameOnYearPane: function() {
        var i = 0;
        var rows = this.dataOfMonthPane.frame.rows;
        var dataOfYearPane = this.dataOfYearPane;
        var $yearGroupEl;

        for (i; i < rows; i += 1) {
            $yearGroupEl = dataOfYearPane.template.clone(true);
            $yearGroupEl.appendTo(dataOfYearPane.appendedTarget);
        }
    },

    /**
     * Draw selectable buttons on year's pane
     * @param {number} year - Year
     * @param {string} classPrefix - A class prefix
     * @private
     */
    _drawButtonsOfYear: function(year, classPrefix) {
        var key = CONSTANTS.relativeMonthValueKey;
        var rangeOfYear = this._getInfoOfYearRange(year);
        var startYear = rangeOfYear.startYear;
        var endYear = rangeOfYear.endYear;
        var cnt = 0;
        var $yearEls = this.dataOfYearPane.appendedTarget.find('.' + classPrefix + 'year');
        var $buttonEl, $tempButtonEl, relativeMonth;

        for (startYear; startYear <= endYear; startYear += 1) {
            $buttonEl = $yearEls.eq(cnt);

            if (startYear === year) {
                $buttonEl.addClass(classPrefix + CONSTANTS.selected);
            }

            if (this._isToday(startYear)) {
                $buttonEl.addClass(classPrefix + CONSTANTS.today);
            }

            relativeMonth = (startYear - year) * 12;

            $tempButtonEl = $(CONSTANTS.buttonTemplate);
            $tempButtonEl.data(key, relativeMonth).html(startYear);

            $buttonEl.html($tempButtonEl);

            cnt += 1;
        }
    },

    /**
     * Change current shown pane on calendar
     * @param {number} shownPaneIdx - Index of shown pane
     */
    _changeShownPane: function(shownPaneIdx) {
        var classPrefix = this._option.classPrefix;
        var prevshownPaneIdx = this.shownPaneIdx;
        var $bodys = this.$element.find('.' + classPrefix + 'body');

        this.shownPaneIdx = shownPaneIdx;

        $bodys.eq(prevshownPaneIdx).hide();
        $bodys.eq(shownPaneIdx).show();
    },

    /**
     * Draw calendar
     * @api
     * @param {number} [year] A year (ex. 2008)
     * @param {number} [month] A month (1 ~ 12)
     * @param {Boolean} [isRelative] A year and month is related
     * @param {Boolean} [shownType] Shown type of pane (ex. day | month | year)
     * @example
     * calendar.draw(); // Draw with now date.
     * calendar.draw(2008, 12); // Draw 2008/12
     * calendar.draw(null, 12); // Draw current year/12
     * calendar.draw(2010, null); // Draw 2010/current month
     * calendar.draw(0, 1, true); // Draw next month
     * calendar.draw(-1, null, true); // Draw prev year
     * calendar.draw(0, 0, false, 'month'); // Draw date with month's pane
     * calendar.draw(0, 0, false, 'year'); // Draw date with year's pane
     **/
    draw: function(year, month, isRelative, shownType) {
        var dateForDrawing = this._getDateForDrawing(year, month, isRelative);
        var isReadyForDrawing = this.invoke('beforeDraw', dateForDrawing);
        var shownPaneIdx;

        /**===============
         * beforeDraw
         =================*/
        if (!isReadyForDrawing) {
            return;
        }

        /**===============
         * draw
         =================*/
        shownPaneIdx = this._getIndexOfShownPane(shownType);

        year = dateForDrawing.year;
        month = dateForDrawing.month;

        this.setDate(year, month);

        this._clear();
        this._drawHeader(dateForDrawing, shownPaneIdx);
        this._drawBody(dateForDrawing, shownPaneIdx);

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
