/*!
 * tui-component-calendar.js
 * @version 1.2.0
 * @author NHNEnt FE Development Lab <dl_javascript@nhnent.com>
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Calendar = __webpack_require__(1);
	
	tui.util.defineNamespace('tui.component', {
	    Calendar: Calendar
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Calendar component(from Pug component)
	 * @author NHN Ent. FE dev Lab <dl_javascript@nhnent.com>
	 */
	'use strict';
	
	var calendarUtils = __webpack_require__(2);
	var CONSTANTS = __webpack_require__(3);
	
	var util = tui.util;
	var bind = util.bind;
	var extend = util.extend;
	
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
	 *                      This component find year title element by className '[prefix]year'
	 *     @param {string} [option.monthTitleFormat = "m"] A month title format.
	 *                     This component find month title element by className이 '[prefix]month'
	 *     @param {Array} [option.monthTitles = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]]
	 *                    A label of each month.
	 *     @param {Array} [option.dayTitles = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]] A label for day.
	 *                    If you set the other option todayFormat 'D', you can use this name.
	 * @tutorial sample1
	 * @tutorial sample2
	 * @tutorial sample3
	 * @example
	 * var calendar = new tui.component.Calendar({
	 *     element: '#layer',
	 *     classPrefix: "calendar-",
	 *     year: 1983,
	 *     month: 5,
	 *     titleFormat: "yyyy-mm", // title
	 *     todayFormat: "yyyy / mm / dd (D)" // today
	 *     yearTitleFormat: "yyyy", // year title
	 *     monthTitleFormat: "m", // month title
	 *     monthTitles: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
	 *     dayTitles: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] // days
	 *     itemCountOfYear: 12
	 * });
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
	         *     itemCountOfYear: number
	         * }
	         * @private
	         */
	        this._option = {};
	
	        /**
	         * A day that is shown
	         * @type {{year: number, month: number}}
	         * @private
	         */
	        this._shownDate = {
	            year: 0,
	            month: 1,
	            date: 1
	        };
	
	        /* ======================================
	         * jQuery - HTMLElement
	         * ======================================*/
	
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
	         * @private
	         */
	        this.$header = null;
	
	        /**
	         * A tilte
	         * @type {jQuery}
	         * @private
	         */
	        this.$title = null;
	
	        /**
	         * A year title
	         * @type {jQuery}
	         * @private
	         */
	        this.$titleYear = null;
	
	        /**
	         * A month title
	         * @type {jQuery}
	         * @private
	         */
	        this.$titleMonth = null;
	
	        /**
	         * =========Body=========
	         * @type {jQuery}
	         * @private
	         */
	        this.$body = null;
	
	        /**
	         * A template of week
	         * @type {jQuery}
	         * @private
	         */
	        this.$weekTemplate = null;
	
	        /**
	         * A week parent element
	         * @type {jQuery}
	         * @private
	         */
	        this.$weekAppendTarget = null;
	
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
	         * @private
	         */
	        this.$footer = null;
	
	        /**
	         * Today element
	         * @type {jQuery}
	         * @private
	         */
	        this.$today = null;
	
	        /**
	         * Index of shown layer
	         * @type {number}
	         * @private
	         */
	        this.shownLayerIdx = 0;
	
	        /**
	         * Data of month's layer
	         * @type {Object}
	         * @private
	         */
	        this.dataOfMonthLayer = {};
	
	        /**
	         * Data of year's layer
	         * @type {Object}
	         * @private
	         */
	        this.dataOfYearLayer = {};
	
	        /**
	         * Whether title is clickable or not
	         * @type {Boolean}
	         * @private
	         */
	        this.isClickableTitle = false;
	
	        /**
	         * Handlers binding context
	         * @type {Object}
	         * @private
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
	        this.draw(this._option.year, this._option.month, false, 0);
	    },
	
	    /**
	     * Save options
	     * @param {Object} [option] A options to initialize component
	     * @private
	     */
	    _setOption: function(option) {
	        var instanceOption = this._option,
	            today = calendarUtils.getDateHash();
	
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
	            itemCountOfYear: CONSTANTS.itemCountOfYear
	        };
	        extend(instanceOption, defaultOption, option);
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
	
	        if (this.$title.hasClass(this._option.classPrefix + CONSTANTS.clickable)) {
	            this.isClickableTitle = true;
	        }
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
	            defaultClassPrefixRegExp;
	
	        if (!$body.length) {
	            bodyTemplate = CONSTANTS.calendarBody;
	            defaultClassPrefixRegExp = CONSTANTS.defaultClassPrefixRegExp;
	
	            $body = $(bodyTemplate.replace(defaultClassPrefixRegExp, classPrefix));
	            $element.append($body);
	        }
	
	        this._assignWeek(classSelector);
	        this._assignMonthLayer(classSelector);
	        this._assignYearLayer(classSelector);
	
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
	     * Register element of month's layer and save drawing info
	     * @param {string} classSelector A selector
	     * @private
	     */
	    _assignMonthLayer: function(classSelector) {
	        var $body = this.$element.find(classSelector + 'body');
	        var $monthsTemplate = $body.find(classSelector + 'month-group');
	        var cols = $monthsTemplate.find(classSelector + 'month').length;
	        var rows = Math.ceil(this._option.monthTitles.length / cols);
	
	        this.dataOfMonthLayer = {
	            template: $monthsTemplate.clone(true),
	            appendedTarget: $monthsTemplate.parent(),
	            frame: {
	                cols: cols,
	                rows: rows
	            }
	        };
	    },
	
	    /**
	     * Register element of year's layer and save drawing info
	     * @param {string} classSelector A selector
	     * @private
	     */
	    _assignYearLayer: function(classSelector) {
	        var $body = this.$element.find(classSelector + 'body');
	        var $yearsTemplate = $body.find(classSelector + 'year-group');
	        var cols = $yearsTemplate.find(classSelector + 'year').length;
	        var rows = Math.ceil(this._option.itemCountOfYear / cols);
	
	        this.dataOfYearLayer = {
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
	        this.handlers.clickRolloverBtn = bind(this._onClickRolloverButton, this);
	
	        this.attachEventToRolloverBtn();
	
	        extend(this.handlers, {
	            clickTitle: bind(this._onClickTitle, this),
	            clickYearLayer: bind(this._onClickYearLayer, this),
	            clickMonthLayer: bind(this._onClickMonthLayer, this)
	        });
	
	        if (this.isClickableTitle) {
	            this.attachEventToTitle();
	        }
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
	     * Attach event on title in "body" element (month & year layer)
	     */
	    attachEventToBody: function() {
	        var classPrefix = '.' + this._option.classPrefix;
	        var yearLayer = this.dataOfYearLayer.appendedTarget;
	        var monthLayer = this.dataOfMonthLayer.appendedTarget;
	
	        yearLayer.on('click', classPrefix + 'year', this.handlers.clickYearLayer);
	        monthLayer.on('click', classPrefix + 'month', this.handlers.clickMonthLayer);
	    },
	
	    /**
	     * Detach event on title in "body" element (month & year layer)
	     */
	    detachEventToBody: function() {
	        var classPrefix = '.' + this._option.classPrefix;
	        var yearLayer = this.dataOfYearLayer.appendedTarget;
	        var monthLayer = this.dataOfMonthLayer.appendedTarget;
	
	        yearLayer.off('click', classPrefix + 'year', this.handlers.clickYearLayer);
	        monthLayer.off('click', classPrefix + 'month', this.handlers.clickMonthLayer);
	    },
	
	    /**
	     * Event handler - click on rollover buttons
	     * @param {MouseEvent} event - Mouse event
	     * @private
	     */
	    _onClickRolloverButton: function(event) {
	        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
	        event.preventDefault();
	        this.draw(0, relativeMonthValue, true);
	    },
	
	    /**
	     * Event handler - click on title
	     * @param {MouseEvent} event - Mouse event
	     * @private
	     */
	    _onClickTitle: function(event) {
	        var shownLayerIdx = this.shownLayerIdx;
	        var date;
	
	        event.preventDefault();
	
	        if (shownLayerIdx === 2) {
	            return;
	        }
	
	        shownLayerIdx = (shownLayerIdx !== 2) ? (shownLayerIdx + 1) : 0;
	        date = this.getDate();
	
	        this.draw(date.year, date.month, false, shownLayerIdx);
	    },
	
	    /**
	     * Event handler - click on month's layer
	     * @param {MouseEvent} event - Mouse event
	     * @private
	     */
	    _onClickYearLayer: function(event) {
	        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
	        event.preventDefault();
	        this.draw(0, relativeMonthValue, true, 1);
	    },
	
	    /**
	     * Event handler - click on year's layer
	     * @param {MouseEvent} event - Mouse event
	     * @private
	     */
	    _onClickMonthLayer: function(event) {
	        var relativeMonthValue = $(event.currentTarget).data(CONSTANTS.relativeMonthValueKey);
	        event.preventDefault();
	        this.draw(0, relativeMonthValue, true, 0);
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
	            relativeDate = calendarUtils.getRelativeDate(year, month, 0, nDate);
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
	            datePrevMonth = calendarUtils.getRelativeDate(0, -1, 0, dateForDrawing),
	            dateNextMonth = calendarUtils.getRelativeDate(0, 1, 0, dateForDrawing),
	            dates = [],
	            firstDay = calendarUtils.getFirstDay(year, month),
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
	        var today = calendarUtils.getDateHash();
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
	            weeks = calendarUtils.getWeeks(year, month),
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
	        var firstDay = calendarUtils.getFirstDay(year, month),
	            lastDay = calendarUtils.getLastDay(year, month),
	            lastDate = calendarUtils.getLastDate(year, month),
	            datePrevMonth = calendarUtils.getRelativeDate(0, -1, 0, {
	                year: year,
	                month: month,
	                date: 1
	            }),
	            prevMonthLastDate = calendarUtils.getLastDate(datePrevMonth.year, datePrevMonth.month),
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
	        this.dataOfMonthLayer.appendedTarget.empty();
	        this.dataOfYearLayer.appendedTarget.empty();
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
	
	        month = calendarUtils.prependLeadingZero(month);
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
	        title = calendarUtils.getConvertedTitle(form, map, reg);
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
	
	        today = calendarUtils.getDateHash();
	        year = today.year;
	        month = calendarUtils.prependLeadingZero(today.month);
	        date = calendarUtils.prependLeadingZero(today.date);
	        todayFormat = this._option.todayFormat;
	        replaceMap = this._getReplaceMap(year, month, date);
	        reg = CONSTANTS.todayRegExp;
	        this._setDateTextInCalendar($today, todayFormat, replaceMap, reg);
	    },
	
	    /**
	     * Set title on year's layer
	     * @param {number} year - Year
	     * @private
	     */
	    _setTitleOnYearLayer: function(year) {
	        var itemCountOfYear = this._getInfoOfYearRange(year);
	        var startYearText = this._getConvertedYearTitle(itemCountOfYear.startYear);
	        var endYearText = this._getConvertedYearTitle(itemCountOfYear.endYear);
	        var title = startYearText + ' - ' + endYearText;
	
	        this.$title.text(title);
	    },
	
	    /**
	     * Set class name on title
	     * @param {number} shownLayerIdx - Year
	     * @private
	     */
	    _setClassNameOnTitle: function(shownLayerIdx) {
	        var className = this._option.classPrefix + CONSTANTS.clickable;
	
	        if (!this.isClickableTitle) {
	            return;
	        }
	
	        if (shownLayerIdx !== 2) {
	            this.$title.addClass(className);
	        } else {
	            this.$title.removeClass(className);
	        }
	    },
	
	    /**
	     * Get converted year text on year and month layer
	     * @param {number} year - Year
	     * @returns {string} Converted year text
	     * @private
	     */
	    _getConvertedYearTitle: function(year) {
	        var option = this._option;
	        var replaceMap, reg;
	
	        replaceMap = this._getReplaceMap(year);
	        reg = CONSTANTS.titleYearRegExp;
	
	        return calendarUtils.getConvertedTitle(option.yearTitleFormat, replaceMap, reg);
	    },
	
	    /**
	     * Get years info by "itemCountOfYear" option
	     * @param {number} year - Year
	     * @returns {Object} Info of year's range
	     * @private
	     */
	    _getInfoOfYearRange: function(year) {
	        var frameInfo = this.dataOfYearLayer.frame;
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
	     * Get index of current shown layer by layer's type
	     * @param {string|number} type - Type of layer
	     * @returns {number} Index of shown layer
	     * @private
	     */
	    _getIndexOfShownLayer: function(type) {
	        return (type ? util.inArray(type, CONSTANTS.layerKeys) : this.shownLayerIdx);
	    },
	
	    /**
	     * Draw header element
	     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
	     * @param {number} shownLayerIdx - Index of shown layer
	     * @private
	     */
	    _drawHeader: function(dateForDrawing, shownLayerIdx) {
	        var classSelector = '.' + this._option.classPrefix + 'btn-';
	        var prevBtn = this.$header.find(classSelector + CONSTANTS.prev);
	        var nextBtn = this.$header.find(classSelector + CONSTANTS.next);
	        var key = CONSTANTS.relativeMonthValueKey;
	        var itemCountOfYear = this._option.itemCountOfYear;
	        var prevValue, nextValue;
	
	        this._setClassNameOnTitle(shownLayerIdx);
	
	        switch (shownLayerIdx) {
	            case 0:
	                this._setCalendarText(dateForDrawing);
	                prevValue = -1;
	                nextValue = 1;
	                break;
	            case 1:
	                this.$title.text(this._getConvertedYearTitle(dateForDrawing.year));
	                prevValue = -12;
	                nextValue = 12;
	                break;
	            case 2:
	                this._setTitleOnYearLayer(dateForDrawing.year);
	                prevValue = -12 * itemCountOfYear;
	                nextValue = 12 * itemCountOfYear;
	                break;
	            default: // @todo Why does not use 'return' but 'break'?
	                break;
	        }
	
	        prevBtn.data(key, prevValue);
	        nextBtn.data(key, nextValue);
	    },
	
	    /**
	     * Draw body elements
	     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
	     * @param {number} shownLayerIdx - Index of shown layer
	     * @private
	     */
	    _drawBody: function(dateForDrawing, shownLayerIdx) {
	        var year = dateForDrawing.year;
	        var month = dateForDrawing.month;
	        var classPrefix = this._option.classPrefix;
	
	        // weeks
	        this._setWeeks(year, month);
	        this._$dateElement = $('.' + classPrefix + 'date', this.$weekAppendTarget);
	        this._$dateContainerElement = $('.' + classPrefix + 'week > *', this.$weekAppendTarget);
	
	        // dates
	        this._drawDates(dateForDrawing, classPrefix);
	
	        // month layer
	        this._drawFrameOnMonthLayer();
	        this._drawButtonsOfMonth(dateForDrawing, classPrefix);
	
	        // year layer
	        this._drawFrameOnYearLayer();
	        this._drawButtonsOfYear(dateForDrawing, classPrefix);
	
	        // show layer
	        this._changeShownLayer(shownLayerIdx);
	    },
	
	    /**
	     * Draw frame containing buttons on month's layer
	     * @private
	     */
	    _drawFrameOnMonthLayer: function() {
	        var i = 0;
	        var rows = this.dataOfMonthLayer.frame.rows;
	        var dataOfMonthLayer = this.dataOfMonthLayer;
	        var $monthGroupEl;
	
	        for (; i < rows; i += 1) {
	            $monthGroupEl = dataOfMonthLayer.template.clone(true);
	            $monthGroupEl.appendTo(dataOfMonthLayer.appendedTarget);
	        }
	    },
	
	    /**
	     * Draw selectable buttons on month's layer
	     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
	     * @param {string} classPrefix - A class prefix
	     * @private
	     */
	    _drawButtonsOfMonth: function(dateForDrawing, classPrefix) {
	        var key = CONSTANTS.relativeMonthValueKey;
	        var selectedMonth = dateForDrawing.month;
	        var monthTitles = this._option.monthTitles;
	        var $monthEls = this.dataOfMonthLayer.appendedTarget.find('.' + classPrefix + 'month');
	        var $buttonEl, month, relativeMonth;
	        var eventData;
	
	        util.forEach(monthTitles, function(title, idx) {
	            $buttonEl = $monthEls.eq(idx);
	            month = idx + 1;
	
	            if (month === selectedMonth) {
	                $buttonEl.addClass(classPrefix + CONSTANTS.selected);
	            }
	
	            if (this._isToday(this._shownDate.year, month)) {
	                $buttonEl.addClass(classPrefix + CONSTANTS.today);
	            }
	
	            relativeMonth = month - selectedMonth;
	
	            $buttonEl.data(key, relativeMonth).html(title);
	
	            eventData = {
	                $date: $buttonEl,
	                $dateContainer: $buttonEl,
	                year: dateForDrawing.year,
	                month: month,
	                date: 0,
	                html: title
	            };
	
	            this.fire('draw', eventData);
	        }, this);
	    },
	
	    /**
	     * Draw frame containing buttons on year's layer
	     * @private
	     */
	    _drawFrameOnYearLayer: function() {
	        var i = 0;
	        var rows = this.dataOfMonthLayer.frame.rows;
	        var dataOfYearLayer = this.dataOfYearLayer;
	        var $yearGroupEl;
	
	        for (; i < rows; i += 1) {
	            $yearGroupEl = dataOfYearLayer.template.clone(true);
	            $yearGroupEl.appendTo(dataOfYearLayer.appendedTarget);
	        }
	    },
	
	    /**
	     * Draw selectable buttons on year's layer
	     * @param {{year: number, month: number}} dateForDrawing - The hash that show up on calendar
	     * @param {string} classPrefix - A class prefix
	     * @private
	     */
	    _drawButtonsOfYear: function(dateForDrawing, classPrefix) {
	        var key = CONSTANTS.relativeMonthValueKey;
	        var year = dateForDrawing.year;
	        var itemCountOfYear = this._getInfoOfYearRange(year);
	        var startYear = itemCountOfYear.startYear;
	        var endYear = itemCountOfYear.endYear;
	        var cnt = 0;
	        var $yearEls = this.dataOfYearLayer.appendedTarget.find('.' + classPrefix + 'year');
	        var $buttonEl, relativeMonth;
	        var eventData;
	
	        for (; startYear <= endYear; startYear += 1) {
	            $buttonEl = $yearEls.eq(cnt);
	
	            if (startYear === year) {
	                $buttonEl.addClass(classPrefix + CONSTANTS.selected);
	            }
	
	            if (this._isToday(startYear)) {
	                $buttonEl.addClass(classPrefix + CONSTANTS.today);
	            }
	
	            relativeMonth = (startYear - year) * 12;
	
	            $buttonEl.data(key, relativeMonth).html(startYear);
	
	            cnt += 1;
	
	            eventData = {
	                $date: $buttonEl,
	                $dateContainer: $buttonEl,
	                year: startYear,
	                month: 0,
	                date: 0,
	                html: startYear
	            };
	
	            this.fire('draw', eventData);
	        }
	    },
	
	    /**
	     * Change current shown layer on calendar
	     * @param {number} shownLayerIdx - Index of shown layer
	     * @private
	     */
	    _changeShownLayer: function(shownLayerIdx) {
	        var classPrefix = this._option.classPrefix;
	        var prevshownLayerIdx = this.shownLayerIdx;
	        var $bodys = this.$element.find('.' + classPrefix + 'body');
	
	        this.shownLayerIdx = shownLayerIdx;
	
	        $bodys.eq(prevshownLayerIdx).hide();
	        $bodys.eq(shownLayerIdx).show();
	    },
	
	    /**
	     * Draw calendar
	     * @api
	     * @param {number} [year] A year (ex. 2008)
	     * @param {number} [month] A month (1 ~ 12)
	     * @param {Boolean} [isRelative] A year and month is related
	     * @param {string} [shownType] Shown type of layer (ex. [day, month, year] | [0] ~ 2])
	     * @example
	     * calendar.draw(); // Draw with now date.
	     * calendar.draw(2008, 12); // Draw 2008/12
	     * calendar.draw(null, 12); // Draw current year/12
	     * calendar.draw(2010, null); // Draw 2010/current month
	     * calendar.draw(0, 1, true); // Draw next month
	     * calendar.draw(-1, null, true); // Draw prev year
	     * calendar.draw(0, 0, false, 'date'); // Draw today with date's layer
	     * calendar.draw(2010, 10, false, 'month'); // Draw 2010/10 with month's layer
	     * calendar.draw(2016, null, false, 'year'); // Draw 2016/month with year's layer
	     **/
	    draw: function(year, month, isRelative, shownType) {
	        var dateForDrawing = this._getDateForDrawing(year, month, isRelative);
	        var shownLayerIdx;
	
	        /* ===============
	         * beforeDraw
	         * =================*/
	        if (!this.invoke('beforeDraw', dateForDrawing)) {
	            return;
	        }
	
	        /* ===============
	         * draw
	         * =================*/
	        shownLayerIdx = util.isNumber(shownType) ? shownType : this._getIndexOfShownLayer(shownType);
	
	        year = dateForDrawing.year;
	        month = dateForDrawing.month;
	
	        this.setDate(year, month);
	
	        this._clear();
	        this._drawHeader(dateForDrawing, shownLayerIdx);
	        this._drawBody(dateForDrawing, shownLayerIdx);
	
	        /* ===============
	         * afterDraw
	         * ================*/
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Utils for calendar component
	 * @author NHN Net. FE dev Lab <dl_javascript@nhnent.com>
	 * @dependency tui-code-snippet ^1.0.2
	 */
	
	'use strict';
	
	/**
	 * Utils of calendar
	 * @namespace calendarUtils
	 * @ignore
	 */
	var utils = {
	    /**
	     * Return date hash by parameter.
	     *  if there are 3 parameter, the parameter is corgnized Date object
	     *  if there are no parameter, return today's hash date
	     * @param {Date|number} [year] A date instance or year
	     * @param {number} [month] A month
	     * @param {number} [date] A date
	     * @returns {{year: *, month: *, date: *}}
	     */
	    getDateHash: function(year, month, date) {
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
	     */
	    getToday: function() {
	        return utils.getDateHash();
	    },
	
	    /**
	     * Get weeks count by paramenter
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} 주 (4~6)
	     **/
	    getWeeks: function(year, month) {
	        var firstDay = this.getFirstDay(year, month),
	            lastDate = this.getLastDate(year, month);
	
	        return Math.ceil((firstDay + lastDate) / 7);
	    },
	
	    /**
	     * Get unix time from date hash
	     * @param {Object} date A date hash
	     * @param {number} date.year A year
	     * @param {number} date.month A month
	     * @param {number} date.date A date
	     * @returns {number}
	     * @example
	     * utils.getTime({year:2010, month:5, date:12}); // 1273590000000
	     **/
	    getTime: function(date) {
	        return this.getDateObject(date).getTime();
	    },
	
	    /**
	     * Get which day is first by parameters that include year and month information.
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} (0~6)
	     **/
	    getFirstDay: function(year, month) {
	        return new Date(year, month - 1, 1).getDay();
	    },
	
	    /**
	     * Get which day is last by parameters that include year and month information.
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} (0~6)
	     **/
	    getLastDay: function(year, month) {
	        return new Date(year, month, 0).getDay();
	    },
	
	    /**
	     * Get last date by parameters that include year and month information.
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} (1~31)
	     **/
	    getLastDate: function(year, month) {
	        return new Date(year, month, 0).getDate();
	    },
	
	    /**
	     * Get date instance.
	     * @param {Object} date A date hash
	     * @returns {Date} Date
	     * @example
	     *  calendarUtils.getDateObject({year:2010, month:5, date:12});
	     *  calendarUtils.getDateObject(2010, 5, 12); //year,month,date
	     **/
	    getDateObject: function(date) {
	        if (arguments.length === 3) {
	            return new Date(arguments[0], arguments[1] - 1, arguments[2]);
	        }
	
	        return new Date(date.year, date.month - 1, date.date);
	    },
	
	    /**
	     * Get related date hash with parameters that include date information.
	     * @param {number} year A related value for year(you can use +/-)
	     * @param {number} month A related value for month (you can use +/-)
	     * @param {number} date A related value for day (you can use +/-)
	     * @param {Object} dateObj standard date hash
	     * @returns {Object} dateObj
	     * @example
	     *  calendarUtils.getRelativeDate(1, 0, 0, {year:2000, month:1, date:1}); // {year:2001, month:1, date:1}
	     *  calendarUtils.getRelativeDate(0, 0, -1, {year:2010, month:1, date:1}); // {year:2009, month:12, date:31}
	     **/
	    getRelativeDate: function(year, month, date, dateObj) {
	        var nYear = (dateObj.year + year),
	            nMonth = (dateObj.month + month - 1),
	            nDate = (dateObj.date + date),
	            nDateObj = new Date(nYear, nMonth, nDate);
	
	        return utils.getDateHash(nDateObj);
	    },
	
	    /**
	     * Chagne number 0~9 to '00~09'
	     * @param {number} number number
	     * @returns {string}
	     * @example
	     *  calendarUtils.prependLeadingZero(0); //  '00'
	     *  calendarUtils.prependLeadingZero(9); //  '09'
	     *  calendarUtils.prependLeadingZero(12); //  '12'
	     */
	    prependLeadingZero: function(number) {
	        var prefix = '';
	
	        if (number < 10) {
	            prefix = '0';
	        }
	
	        return prefix + number;
	    },
	
	    /**
	     * Chage text and return.
	     * @param {string} str A text to chagne
	     * @param {Object} map A chagne key, value set
	     * @param {RegExp} reg A regExp to chagne
	     * @returns {string}
	     */
	    getConvertedTitle: function(str, map, reg) {
	        str = str.replace(reg, function(matchedString) {
	            return map[matchedString] || '';
	        });
	
	        return str;
	    }
	};
	
	module.exports = utils;


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var CONSTANTS = {
	    relativeMonthValueKey: 'relativeMonthValue',
	    prev: 'prev',
	    prevYear: 'prev-year',
	    prevMonth: 'prev-month',
	    next: 'next',
	    nextYear: 'next-year',
	    nextMonth: 'next-month',
	    selected: 'selected',
	    today: 'today',
	    clickable: 'clickable-title',
	    calendarHeader: null,
	    calendarBody: null,
	    calendarFooter: null,
	    defaultClassPrefixRegExp: /calendar-/g,
	    titleRegExp: /yyyy|yy|mm|m|M/g,
	    titleYearRegExp: /yyyy|yy/g,
	    titleMonthRegExp: /mm|m|M/g,
	    todayRegExp: /yyyy|yy|mm|m|M|dd|d|D/g,
	    itemCountOfYear: 12,
	    layerKeys: ['date', 'month', 'year']
	};
	
	/* eslint-disable */
	CONSTANTS.calendarHeader = [
	    '<div class="calendar-header">',
	        '<a href="#" class="calendar-rollover calendar-btn-' + CONSTANTS.prev + '">Prev</a>',
	        '<strong class="calendar-title calendar-clickable-title"></strong>',
	        '<a href="#" class="calendar-rollover calendar-btn-' + CONSTANTS.next + '">Next</a>',
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
	    '</div>',
	    '<div class="calendar-body">',
	        '<table>',
	            '<tbody>',
	                '<tr class="calendar-month-group">',
	                    '<td class="calendar-month"></td>',
	                    '<td class="calendar-month"></td>',
	                    '<td class="calendar-month"></td>',
	                '</tr>',
	            '</tbody>',
	        '</table>',
	    '</div>',
	    '<div class="calendar-body">',
	        '<table>',
	            '<tbody>',
	                '<tr class="calendar-year-group">',
	                    '<td class="calendar-year"></td>',
	                    '<td class="calendar-year"></td>',
	                    '<td class="calendar-year"></td>',
	                '</tr>',
	            '</tbody>',
	        '</table>',
	    '</div>'].join('');
	
	CONSTANTS.calendarFooter = [
	    '<div class="calendar-footer">',
	        '<p>오늘 <em class="calendar-today"></em></p>',
	    '</div>'].join('');
	/* eslint-enable */
	
	module.exports = CONSTANTS;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTdmNDM2OWQ5MzgzOTM4NzIwNjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jYWxlbmRhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ05EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGdCQUFlLFlBQVk7QUFDM0IsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFlLE9BQU87QUFDdEI7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFlLE1BQU07QUFDckI7QUFDQSxnQkFBZSxNQUFNO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEIsa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNsTEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJ0dWktY29tcG9uZW50LWNhbGVuZGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiZGlzdFwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDU3ZjQzNjlkOTM4MzkzODcyMDY4IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FsZW5kYXIgPSByZXF1aXJlKCcuL2NhbGVuZGFyJyk7XG5cbnR1aS51dGlsLmRlZmluZU5hbWVzcGFjZSgndHVpLmNvbXBvbmVudCcsIHtcbiAgICBDYWxlbmRhcjogQ2FsZW5kYXJcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENhbGVuZGFyIGNvbXBvbmVudChmcm9tIFB1ZyBjb21wb25lbnQpXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIGRldiBMYWIgPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FsZW5kYXJVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBDT05TVEFOVFMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG52YXIgdXRpbCA9IHR1aS51dGlsO1xudmFyIGJpbmQgPSB1dGlsLmJpbmQ7XG52YXIgZXh0ZW5kID0gdXRpbC5leHRlbmQ7XG5cbi8qKlxuICogQ2FsZW5kYXIgY29tcG9uZW50IGNsYXNzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uXSBBIG9wdGlvbnMgZm9yIGluaXRpYWxpemVcbiAqICAgICBAcGFyYW0ge0hUTUxFbGVtZW50fSBvcHRpb24uZWxlbWVudCBBIHJvb3QgZWxlbWVudFxuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLmNsYXNzUHJlZml4PVwiY2FsZW5kYXItXCJdIEEgcHJlZml4IGNsYXNzIGZvciBtYXJrdXAgc3RydWN0dXJlXG4gKiAgICAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ueWVhcj10aGlzIHllYXJdIEEgeWVhciBmb3IgaW5pdGlhbGl6ZVxuICogICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1vbnRoPXRoaXMgbW9udGhdIEEgbW9udGggZm9yIGluaXRpYWxpemVcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi50aXRsZUZvcm1hdD1cInl5eXktbW1cIl0gQSB0aXRsZSBmb3JtYXQuXG4gKiAgICAgICAgICAgICAgICAgICAgIFRoaXMgY29tcG9uZW50IGZpbmQgdGl0bGUgZWxlbWVudCBieSBjbGFzc05hbWUgJ1twcmVmaXhddGl0bGUnXG4gKiAgICAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb24udG9kYXlGb3JtYXQgPSBcInl5eXkgWWVhciBtbSBNb250aCBkZCBEYXkgKEQpXCJdIEEgdG9kYXkgZm9ybWF0LlxuICogICAgICAgICAgICAgICAgICAgICBUaGlzIGNvbXBvbmVudCBmaW5kIHRvZGF5IGVsZW1lbnQgYnkgY2xhc3NOYW1lICdbcHJlZml4XXRvZGF5J1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLnllYXJUaXRsZUZvcm1hdCA9IFwieXl5eVwiXSBBIHllYXIgdGl0bGUgZm9ybWFudC5cbiAqICAgICAgICAgICAgICAgICAgICAgIFRoaXMgY29tcG9uZW50IGZpbmQgeWVhciB0aXRsZSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF15ZWFyJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLm1vbnRoVGl0bGVGb3JtYXQgPSBcIm1cIl0gQSBtb250aCB0aXRsZSBmb3JtYXQuXG4gKiAgICAgICAgICAgICAgICAgICAgIFRoaXMgY29tcG9uZW50IGZpbmQgbW9udGggdGl0bGUgZWxlbWVudCBieSBjbGFzc05hbWXsnbQgJ1twcmVmaXhdbW9udGgnXG4gKiAgICAgQHBhcmFtIHtBcnJheX0gW29wdGlvbi5tb250aFRpdGxlcyA9IFtcIkpBTlwiLFwiRkVCXCIsXCJNQVJcIixcIkFQUlwiLFwiTUFZXCIsXCJKVU5cIixcIkpVTFwiLFwiQVVHXCIsXCJTRVBcIixcIk9DVFwiLFwiTk9WXCIsXCJERUNcIl1dXG4gKiAgICAgICAgICAgICAgICAgICAgQSBsYWJlbCBvZiBlYWNoIG1vbnRoLlxuICogICAgIEBwYXJhbSB7QXJyYXl9IFtvcHRpb24uZGF5VGl0bGVzID0gW1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdXSBBIGxhYmVsIGZvciBkYXkuXG4gKiAgICAgICAgICAgICAgICAgICAgSWYgeW91IHNldCB0aGUgb3RoZXIgb3B0aW9uIHRvZGF5Rm9ybWF0ICdEJywgeW91IGNhbiB1c2UgdGhpcyBuYW1lLlxuICogQHR1dG9yaWFsIHNhbXBsZTFcbiAqIEB0dXRvcmlhbCBzYW1wbGUyXG4gKiBAdHV0b3JpYWwgc2FtcGxlM1xuICogQGV4YW1wbGVcbiAqIHZhciBjYWxlbmRhciA9IG5ldyB0dWkuY29tcG9uZW50LkNhbGVuZGFyKHtcbiAqICAgICBlbGVtZW50OiAnI2xheWVyJyxcbiAqICAgICBjbGFzc1ByZWZpeDogXCJjYWxlbmRhci1cIixcbiAqICAgICB5ZWFyOiAxOTgzLFxuICogICAgIG1vbnRoOiA1LFxuICogICAgIHRpdGxlRm9ybWF0OiBcInl5eXktbW1cIiwgLy8gdGl0bGVcbiAqICAgICB0b2RheUZvcm1hdDogXCJ5eXl5IC8gbW0gLyBkZCAoRClcIiAvLyB0b2RheVxuICogICAgIHllYXJUaXRsZUZvcm1hdDogXCJ5eXl5XCIsIC8vIHllYXIgdGl0bGVcbiAqICAgICBtb250aFRpdGxlRm9ybWF0OiBcIm1cIiwgLy8gbW9udGggdGl0bGVcbiAqICAgICBtb250aFRpdGxlczogW1wiSkFOXCIsIFwiRkVCXCIsIFwiTUFSXCIsIFwiQVBSXCIsIFwiTUFZXCIsIFwiSlVOXCIsIFwiSlVMXCIsIFwiQVVHXCIsIFwiU0VQXCIsIFwiT0NUXCIsIFwiTk9WXCIsIFwiREVDXCJdLFxuICogICAgIGRheVRpdGxlczogWydzdW4nLCAnbW9uJywgJ3R1ZScsICd3ZWQnLCAndGh1JywgJ2ZyaScsICdzYXQnXSAvLyBkYXlzXG4gKiAgICAgaXRlbUNvdW50T2ZZZWFyOiAxMlxuICogfSk7XG4gKi9cbnZhciBDYWxlbmRhciA9IHV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBDYWxlbmRhci5wcm90b3R5cGUgKi8ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IG9wdGlvbnNcbiAgICAgICAgICogb3B0aW9uOiB7XG4gICAgICAgICAqICAgICBjbGFzc1ByZWZpeDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgeWVhcjogbnVtYmVyXG4gICAgICAgICAqICAgICBtb250aDogbnVtYmVyXG4gICAgICAgICAqICAgICB0aXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgdG9kYXlGb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICogICAgIHllYXJUaXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgbW9udGhUaXRsZUZvcm1hdDogc3RyaW5nLFxuICAgICAgICAgKiAgICAgbW9udGhUaXRsZXM6IEFycmF5LFxuICAgICAgICAgKiAgICAgZGF5VGl0bGVzOiBBcnJheSxcbiAgICAgICAgICogICAgIGl0ZW1Db3VudE9mWWVhcjogbnVtYmVyXG4gICAgICAgICAqIH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbiA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRheSB0aGF0IGlzIHNob3duXG4gICAgICAgICAqIEB0eXBlIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3Nob3duRGF0ZSA9IHtcbiAgICAgICAgICAgIHllYXI6IDAsXG4gICAgICAgICAgICBtb250aDogMSxcbiAgICAgICAgICAgIGRhdGU6IDFcbiAgICAgICAgfTtcblxuICAgICAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgKiBqUXVlcnkgLSBIVE1MRWxlbWVudFxuICAgICAgICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PVJvb3QgRWxlbWVudD09PT09PT09PVxuICAgICAgICAgKiBJZiBvcHRpb25zIGRvIG5vdCBpbmNsdWRlIGVsZW1lbnQsIHRoaXMgY29tcG9uZW50IGplZGdlIGluaXRpYWxpemUgZWxlbWVudCB3aXRob3V0IG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKG9wdGlvbi5lbGVtZW50IHx8IGFyZ3VtZW50c1swXSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PUhlYWRlcj09PT09PT09PVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kaGVhZGVyID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB0aWx0ZVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kdGl0bGUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHllYXIgdGl0bGVcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRpdGxlWWVhciA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW9udGggdGl0bGVcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRpdGxlTW9udGggPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiA9PT09PT09PT1Cb2R5PT09PT09PT09XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRib2R5ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB0ZW1wbGF0ZSBvZiB3ZWVrXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR3ZWVrVGVtcGxhdGUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHdlZWsgcGFyZW50IGVsZW1lbnRcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGUgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fJGRhdGVFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRlIHdyYXBwZXIgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fJGRhdGVDb250YWluZXJFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogPT09PT09PT09Rm9vdGVyPT09PT09PT09XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRmb290ZXIgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2RheSBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR0b2RheSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGV4IG9mIHNob3duIGxheWVyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNob3duTGF5ZXJJZHggPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRhIG9mIG1vbnRoJ3MgbGF5ZXJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGF0YU9mTW9udGhMYXllciA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRhIG9mIHllYXIncyBsYXllclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kYXRhT2ZZZWFyTGF5ZXIgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciB0aXRsZSBpcyBjbGlja2FibGUgb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pc0NsaWNrYWJsZVRpdGxlID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXJzIGJpbmRpbmcgY29udGV4dFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuXG4gICAgICAgIC8qKiBTZXQgZGVmYXVsdCBvcHRpb25zICovXG4gICAgICAgIHRoaXMuX3NldERlZmF1bHQob3B0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRlZnVsYXQgb3BpdG9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uXSBBIG9wdGlvbnMgdG8gaW5pdGlhbHppZSBjb21wb25lbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXREZWZhdWx0OiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdGhpcy5fc2V0T3B0aW9uKG9wdGlvbik7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkhUTUxFbGVtZW50cygpO1xuICAgICAgICB0aGlzLl9hdHRhY2hFdmVudCgpO1xuICAgICAgICB0aGlzLmRyYXcodGhpcy5fb3B0aW9uLnllYXIsIHRoaXMuX29wdGlvbi5tb250aCwgZmFsc2UsIDApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTYXZlIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIHRvIGluaXRpYWxpemUgY29tcG9uZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0T3B0aW9uOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdmFyIGluc3RhbmNlT3B0aW9uID0gdGhpcy5fb3B0aW9uLFxuICAgICAgICAgICAgdG9kYXkgPSBjYWxlbmRhclV0aWxzLmdldERhdGVIYXNoKCk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb24gPSB7XG4gICAgICAgICAgICBjbGFzc1ByZWZpeDogJ2NhbGVuZGFyLScsXG4gICAgICAgICAgICB5ZWFyOiB0b2RheS55ZWFyLFxuICAgICAgICAgICAgbW9udGg6IHRvZGF5Lm1vbnRoLFxuICAgICAgICAgICAgdGl0bGVGb3JtYXQ6ICd5eXl5LW1tJyxcbiAgICAgICAgICAgIHRvZGF5Rm9ybWF0OiAneXl5eS9tbS9kZCAoRCknLFxuICAgICAgICAgICAgeWVhclRpdGxlRm9ybWF0OiAneXl5eScsXG4gICAgICAgICAgICBtb250aFRpdGxlRm9ybWF0OiAnbScsXG4gICAgICAgICAgICBtb250aFRpdGxlczogWydKQU4nLCAnRkVCJywgJ01BUicsICdBUFInLCAnTUFZJywgJ0pVTicsICdKVUwnLCAnQVVHJywgJ1NFUCcsICdPQ1QnLCAnTk9WJywgJ0RFQyddLFxuICAgICAgICAgICAgZGF5VGl0bGVzOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxuICAgICAgICAgICAgaXRlbUNvdW50T2ZZZWFyOiBDT05TVEFOVFMuaXRlbUNvdW50T2ZZZWFyXG4gICAgICAgIH07XG4gICAgICAgIGV4dGVuZChpbnN0YW5jZU9wdGlvbiwgZGVmYXVsdE9wdGlvbiwgb3B0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGVsZW1lbnQgdG8gZmlsZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25IVE1MRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXgsXG4gICAgICAgICAgICAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgICBjbGFzc1NlbGVjdG9yID0gJy4nICsgY2xhc3NQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduSGVhZGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkJvZHkoJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KTtcbiAgICAgICAgdGhpcy5fYXNzaWduRm9vdGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGhlYWRlciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduSGVhZGVyOiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRoZWFkZXIgPSAkZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnaGVhZGVyJyksXG4gICAgICAgICAgICBoZWFkZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCxcbiAgICAgICAgICAgIGtleSA9IENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXksXG4gICAgICAgICAgICBidG5DbGFzc05hbWUgPSAnYnRuLSc7XG5cbiAgICAgICAgaWYgKCEkaGVhZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgaGVhZGVyVGVtcGxhdGUgPSBDT05TVEFOVFMuY2FsZW5kYXJIZWFkZXI7XG4gICAgICAgICAgICBkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAgPSBDT05TVEFOVFMuZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgICAgICAkaGVhZGVyID0gJChoZWFkZXJUZW1wbGF0ZS5yZXBsYWNlKGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCwgY2xhc3NQcmVmaXgpKTtcbiAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgkaGVhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1dHRvblxuICAgICAgICAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIGJ0bkNsYXNzTmFtZSArIENPTlNUQU5UUy5wcmV2WWVhcikuZGF0YShrZXksIC0xMik7XG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLnByZXZNb250aCkuZGF0YShrZXksIC0xKTtcbiAgICAgICAgJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBidG5DbGFzc05hbWUgKyBDT05TVEFOVFMubmV4dFllYXIpLmRhdGEoa2V5LCAxMik7XG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLm5leHRNb250aCkuZGF0YShrZXksIDEpO1xuXG4gICAgICAgIC8vIHRpdGxlIHRleHRcbiAgICAgICAgdGhpcy4kdGl0bGUgPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZScpO1xuICAgICAgICB0aGlzLiR0aXRsZVllYXIgPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZS15ZWFyJyk7XG4gICAgICAgIHRoaXMuJHRpdGxlTW9udGggPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZS1tb250aCcpO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlciA9ICRoZWFkZXI7XG5cbiAgICAgICAgaWYgKHRoaXMuJHRpdGxlLmhhc0NsYXNzKHRoaXMuX29wdGlvbi5jbGFzc1ByZWZpeCArIENPTlNUQU5UUy5jbGlja2FibGUpKSB7XG4gICAgICAgICAgICB0aGlzLmlzQ2xpY2thYmxlVGl0bGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvZHkgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbG1lbnQgb2YgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzU2VsZWN0b3IgQSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIHByZWZpeCBmb3IgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Cb2R5OiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRib2R5ID0gJGVsZW1lbnQuZmluZChjbGFzc1NlbGVjdG9yICsgJ2JvZHknKSxcbiAgICAgICAgICAgIGJvZHlUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICBpZiAoISRib2R5Lmxlbmd0aCkge1xuICAgICAgICAgICAgYm9keVRlbXBsYXRlID0gQ09OU1RBTlRTLmNhbGVuZGFyQm9keTtcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCA9IENPTlNUQU5UUy5kZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHA7XG5cbiAgICAgICAgICAgICRib2R5ID0gJChib2R5VGVtcGxhdGUucmVwbGFjZShkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsIGNsYXNzUHJlZml4KSk7XG4gICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJGJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYXNzaWduV2VlayhjbGFzc1NlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5fYXNzaWduTW9udGhMYXllcihjbGFzc1NlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5fYXNzaWduWWVhckxheWVyKGNsYXNzU2VsZWN0b3IpO1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkYm9keS5oaWRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIHdlZWsgZWxlbW50IG9uIGJvZHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NTZWxlY3RvciBBIHNlbGVjdG9yXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduV2VlazogZnVuY3Rpb24oY2xhc3NTZWxlY3Rvcikge1xuICAgICAgICB2YXIgJGJvZHkgPSB0aGlzLiRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdib2R5Jyk7XG4gICAgICAgIHZhciAkd2Vla1RlbXBsYXRlID0gJGJvZHkuZmluZChjbGFzc1NlbGVjdG9yICsgJ3dlZWsnKTtcblxuICAgICAgICB0aGlzLiR3ZWVrVGVtcGxhdGUgPSAkd2Vla1RlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0ID0gJHdlZWtUZW1wbGF0ZS5wYXJlbnQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZWxlbWVudCBvZiBtb250aCdzIGxheWVyIGFuZCBzYXZlIGRyYXdpbmcgaW5mb1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Nb250aExheWVyOiBmdW5jdGlvbihjbGFzc1NlbGVjdG9yKSB7XG4gICAgICAgIHZhciAkYm9keSA9IHRoaXMuJGVsZW1lbnQuZmluZChjbGFzc1NlbGVjdG9yICsgJ2JvZHknKTtcbiAgICAgICAgdmFyICRtb250aHNUZW1wbGF0ZSA9ICRib2R5LmZpbmQoY2xhc3NTZWxlY3RvciArICdtb250aC1ncm91cCcpO1xuICAgICAgICB2YXIgY29scyA9ICRtb250aHNUZW1wbGF0ZS5maW5kKGNsYXNzU2VsZWN0b3IgKyAnbW9udGgnKS5sZW5ndGg7XG4gICAgICAgIHZhciByb3dzID0gTWF0aC5jZWlsKHRoaXMuX29wdGlvbi5tb250aFRpdGxlcy5sZW5ndGggLyBjb2xzKTtcblxuICAgICAgICB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJG1vbnRoc1RlbXBsYXRlLmNsb25lKHRydWUpLFxuICAgICAgICAgICAgYXBwZW5kZWRUYXJnZXQ6ICRtb250aHNUZW1wbGF0ZS5wYXJlbnQoKSxcbiAgICAgICAgICAgIGZyYW1lOiB7XG4gICAgICAgICAgICAgICAgY29sczogY29scyxcbiAgICAgICAgICAgICAgICByb3dzOiByb3dzXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGVsZW1lbnQgb2YgeWVhcidzIGxheWVyIGFuZCBzYXZlIGRyYXdpbmcgaW5mb1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25ZZWFyTGF5ZXI6IGZ1bmN0aW9uKGNsYXNzU2VsZWN0b3IpIHtcbiAgICAgICAgdmFyICRib2R5ID0gdGhpcy4kZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnYm9keScpO1xuICAgICAgICB2YXIgJHllYXJzVGVtcGxhdGUgPSAkYm9keS5maW5kKGNsYXNzU2VsZWN0b3IgKyAneWVhci1ncm91cCcpO1xuICAgICAgICB2YXIgY29scyA9ICR5ZWFyc1RlbXBsYXRlLmZpbmQoY2xhc3NTZWxlY3RvciArICd5ZWFyJykubGVuZ3RoO1xuICAgICAgICB2YXIgcm93cyA9IE1hdGguY2VpbCh0aGlzLl9vcHRpb24uaXRlbUNvdW50T2ZZZWFyIC8gY29scyk7XG5cbiAgICAgICAgdGhpcy5kYXRhT2ZZZWFyTGF5ZXIgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJHllYXJzVGVtcGxhdGUuY2xvbmUodHJ1ZSksXG4gICAgICAgICAgICBhcHBlbmRlZFRhcmdldDogJHllYXJzVGVtcGxhdGUucGFyZW50KCksXG4gICAgICAgICAgICBmcmFtZToge1xuICAgICAgICAgICAgICAgIGNvbHM6IGNvbHMsXG4gICAgICAgICAgICAgICAgcm93czogcm93c1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBmb290ZXIgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduRm9vdGVyOiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRmb290ZXIgPSAkZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnZm9vdGVyJyksXG4gICAgICAgICAgICBmb290ZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICBpZiAoISRmb290ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb290ZXJUZW1wbGF0ZSA9IENPTlNUQU5UUy5jYWxlbmRhckZvb3RlcjtcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCA9IENPTlNUQU5UUy5kZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHA7XG5cbiAgICAgICAgICAgICRmb290ZXIgPSAkKGZvb3RlclRlbXBsYXRlLnJlcGxhY2UoZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwLCBjbGFzc1ByZWZpeCkpO1xuICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKCRmb290ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHRvZGF5ID0gJGZvb3Rlci5maW5kKGNsYXNzU2VsZWN0b3IgKyAndG9kYXknKTtcbiAgICAgICAgdGhpcy4kZm9vdGVyID0gJGZvb3RlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGV2ZW50IGhhbmRsZXJzIGFuZCBhdHRhY2ggZXZlbnQgb24gZWxlbWVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2F0dGFjaEV2ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5jbGlja1JvbGxvdmVyQnRuID0gYmluZCh0aGlzLl9vbkNsaWNrUm9sbG92ZXJCdXR0b24sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRUb1JvbGxvdmVyQnRuKCk7XG5cbiAgICAgICAgZXh0ZW5kKHRoaXMuaGFuZGxlcnMsIHtcbiAgICAgICAgICAgIGNsaWNrVGl0bGU6IGJpbmQodGhpcy5fb25DbGlja1RpdGxlLCB0aGlzKSxcbiAgICAgICAgICAgIGNsaWNrWWVhckxheWVyOiBiaW5kKHRoaXMuX29uQ2xpY2tZZWFyTGF5ZXIsIHRoaXMpLFxuICAgICAgICAgICAgY2xpY2tNb250aExheWVyOiBiaW5kKHRoaXMuX29uQ2xpY2tNb250aExheWVyLCB0aGlzKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pc0NsaWNrYWJsZVRpdGxlKSB7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaEV2ZW50VG9UaXRsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRUb0JvZHkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGV2ZW50IG9uIHJvbGxvdmVyIGJ1dHRvbnMgaW4gXCJoZWFkZXJcIiBlbGVtZW50XG4gICAgICovXG4gICAgYXR0YWNoRXZlbnRUb1JvbGxvdmVyQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gJy4nICsgdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4ICsgJ3JvbGxvdmVyJztcbiAgICAgICAgdmFyIGJ0bnMgPSB0aGlzLiRoZWFkZXIuZmluZChzZWxlY3Rvcik7XG5cbiAgICAgICAgYnRucy5vbignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrUm9sbG92ZXJCdG4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXRhY2ggZXZlbnQgb24gcm9sbG92ZXIgYnV0dG9ucyBpbiBcImhlYWRlclwiIGVsZW1lbnRcbiAgICAgKi9cbiAgICBkZXRhY2hFdmVudFRvUm9sbG92ZXJCdG46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZWN0b3IgPSAnLicgKyB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXggKyAncm9sbG92ZXInO1xuICAgICAgICB2YXIgYnRucyA9IHRoaXMuJGhlYWRlci5maW5kKHNlbGVjdG9yKTtcblxuICAgICAgICBidG5zLm9mZignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrUm9sbG92ZXJCdG4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggZXZlbnQgb24gdGl0bGUgaW4gXCJoZWFkZXJcIiBlbGVtZW50XG4gICAgICovXG4gICAgYXR0YWNoRXZlbnRUb1RpdGxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kdGl0bGUub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVycy5jbGlja1RpdGxlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0YWNoIGV2ZW50IG9uIHRpdGxlIGluIFwiaGVhZGVyXCIgZWxlbWVudFxuICAgICAqL1xuICAgIGRldGFjaEV2ZW50VG9UaXRsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHRpdGxlLm9mZignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrVGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggZXZlbnQgb24gdGl0bGUgaW4gXCJib2R5XCIgZWxlbWVudCAobW9udGggJiB5ZWFyIGxheWVyKVxuICAgICAqL1xuICAgIGF0dGFjaEV2ZW50VG9Cb2R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNsYXNzUHJlZml4ID0gJy4nICsgdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4O1xuICAgICAgICB2YXIgeWVhckxheWVyID0gdGhpcy5kYXRhT2ZZZWFyTGF5ZXIuYXBwZW5kZWRUYXJnZXQ7XG4gICAgICAgIHZhciBtb250aExheWVyID0gdGhpcy5kYXRhT2ZNb250aExheWVyLmFwcGVuZGVkVGFyZ2V0O1xuXG4gICAgICAgIHllYXJMYXllci5vbignY2xpY2snLCBjbGFzc1ByZWZpeCArICd5ZWFyJywgdGhpcy5oYW5kbGVycy5jbGlja1llYXJMYXllcik7XG4gICAgICAgIG1vbnRoTGF5ZXIub24oJ2NsaWNrJywgY2xhc3NQcmVmaXggKyAnbW9udGgnLCB0aGlzLmhhbmRsZXJzLmNsaWNrTW9udGhMYXllcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGFjaCBldmVudCBvbiB0aXRsZSBpbiBcImJvZHlcIiBlbGVtZW50IChtb250aCAmIHllYXIgbGF5ZXIpXG4gICAgICovXG4gICAgZGV0YWNoRXZlbnRUb0JvZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSAnLicgKyB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXg7XG4gICAgICAgIHZhciB5ZWFyTGF5ZXIgPSB0aGlzLmRhdGFPZlllYXJMYXllci5hcHBlbmRlZFRhcmdldDtcbiAgICAgICAgdmFyIG1vbnRoTGF5ZXIgPSB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIuYXBwZW5kZWRUYXJnZXQ7XG5cbiAgICAgICAgeWVhckxheWVyLm9mZignY2xpY2snLCBjbGFzc1ByZWZpeCArICd5ZWFyJywgdGhpcy5oYW5kbGVycy5jbGlja1llYXJMYXllcik7XG4gICAgICAgIG1vbnRoTGF5ZXIub2ZmKCdjbGljaycsIGNsYXNzUHJlZml4ICsgJ21vbnRoJywgdGhpcy5oYW5kbGVycy5jbGlja01vbnRoTGF5ZXIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIC0gY2xpY2sgb24gcm9sbG92ZXIgYnV0dG9uc1xuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tSb2xsb3ZlckJ1dHRvbjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHJlbGF0aXZlTW9udGhWYWx1ZSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShDT05TVEFOVFMucmVsYXRpdmVNb250aFZhbHVlS2V5KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5kcmF3KDAsIHJlbGF0aXZlTW9udGhWYWx1ZSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgLSBjbGljayBvbiB0aXRsZVxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tUaXRsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHNob3duTGF5ZXJJZHggPSB0aGlzLnNob3duTGF5ZXJJZHg7XG4gICAgICAgIHZhciBkYXRlO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHNob3duTGF5ZXJJZHggPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3duTGF5ZXJJZHggPSAoc2hvd25MYXllcklkeCAhPT0gMikgPyAoc2hvd25MYXllcklkeCArIDEpIDogMDtcbiAgICAgICAgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhdyhkYXRlLnllYXIsIGRhdGUubW9udGgsIGZhbHNlLCBzaG93bkxheWVySWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciAtIGNsaWNrIG9uIG1vbnRoJ3MgbGF5ZXJcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gTW91c2UgZXZlbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkNsaWNrWWVhckxheWVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcmVsYXRpdmVNb250aFZhbHVlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRyYXcoMCwgcmVsYXRpdmVNb250aFZhbHVlLCB0cnVlLCAxKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciAtIGNsaWNrIG9uIHllYXIncyBsYXllclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tNb250aExheWVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcmVsYXRpdmVNb250aFZhbHVlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRyYXcoMCwgcmVsYXRpdmVNb250aFZhbHVlLCB0cnVlLCAwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IEhhc2ggZGF0YSB0byBkcm93IGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1JlbGF0aXZlXSAgV2hldGhlciBpcyByZWxhdGVkIG90aGVyIHZhbHVlIG9yIG5vdFxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gQSBkYXRlIGhhc2hcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXREYXRlRm9yRHJhd2luZzogZnVuY3Rpb24oeWVhciwgbW9udGgsIGlzUmVsYXRpdmUpIHtcbiAgICAgICAgdmFyIG5EYXRlID0gdGhpcy5nZXREYXRlKCksXG4gICAgICAgICAgICByZWxhdGl2ZURhdGU7XG5cbiAgICAgICAgbkRhdGUuZGF0ZSA9IDE7XG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcih5ZWFyKSAmJiAhdXRpbC5pc051bWJlcihtb250aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuRGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7XG4gICAgICAgICAgICByZWxhdGl2ZURhdGUgPSBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSh5ZWFyLCBtb250aCwgMCwgbkRhdGUpO1xuICAgICAgICAgICAgbkRhdGUueWVhciA9IHJlbGF0aXZlRGF0ZS55ZWFyO1xuICAgICAgICAgICAgbkRhdGUubW9udGggPSByZWxhdGl2ZURhdGUubW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuRGF0ZS55ZWFyID0geWVhciB8fCBuRGF0ZS55ZWFyO1xuICAgICAgICAgICAgbkRhdGUubW9udGggPSBtb250aCB8fCBuRGF0ZS5tb250aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuRGF0ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSnVkZ2UgdG8gcmVkcmF3IGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmVmbG93XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNOZWNlc3NhcnlGb3JEcmF3aW5nOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgc2hvd25EYXRlID0gdGhpcy5fc2hvd25EYXRlO1xuXG4gICAgICAgIHJldHVybiAoc2hvd25EYXRlLnllYXIgIT09IHllYXIgfHwgc2hvd25EYXRlLm1vbnRoICE9PSBtb250aCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgY2FsZW5kYXIgdGV4dFxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIFRoYSBoYXNoIHRoYXQgc2hvdyB1cCBvbiBjYWxlbmRhclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldENhbGVuZGFyVGV4dDogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyLFxuICAgICAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcblxuICAgICAgICB0aGlzLl9zZXRDYWxlbmRhclRvZGF5KCk7XG4gICAgICAgIHRoaXMuX3NldENhbGVuZGFyVGl0bGUoeWVhciwgbW9udGgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGRhdGVzIGJ5IG1vbnRoLlxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIEEgZGF0ZSB0byBkcmF3XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IEEgY2xhc3MgcHJlZml4XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZHJhd0RhdGVzOiBmdW5jdGlvbihkYXRlRm9yRHJhd2luZywgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyLFxuICAgICAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aCxcbiAgICAgICAgICAgIGRheUluV2VlayA9IDAsXG4gICAgICAgICAgICBkYXRlUHJldk1vbnRoID0gY2FsZW5kYXJVdGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIGRhdGVGb3JEcmF3aW5nKSxcbiAgICAgICAgICAgIGRhdGVOZXh0TW9udGggPSBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAxLCAwLCBkYXRlRm9yRHJhd2luZyksXG4gICAgICAgICAgICBkYXRlcyA9IFtdLFxuICAgICAgICAgICAgZmlyc3REYXkgPSBjYWxlbmRhclV0aWxzLmdldEZpcnN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGluZGV4T2ZMYXN0RGF0ZSA9IHRoaXMuX2ZpbGxEYXRlcyh5ZWFyLCBtb250aCwgZGF0ZXMpO1xuXG4gICAgICAgIHV0aWwuZm9yRWFjaChkYXRlcywgZnVuY3Rpb24oZGF0ZSwgaSkge1xuICAgICAgICAgICAgdmFyIGlzUHJldk1vbnRoID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0TW9udGggPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lciA9ICQodGhpcy5fJGRhdGVDb250YWluZXJFbGVtZW50W2ldKSxcbiAgICAgICAgICAgICAgICB0ZW1wWWVhciA9IHllYXIsXG4gICAgICAgICAgICAgICAgdGVtcE1vbnRoID0gbW9udGgsXG4gICAgICAgICAgICAgICAgZXZlbnREYXRhO1xuXG4gICAgICAgICAgICBpZiAoaSA8IGZpcnN0RGF5KSB7XG4gICAgICAgICAgICAgICAgaXNQcmV2TW9udGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLnByZXZNb250aCk7XG4gICAgICAgICAgICAgICAgdGVtcFllYXIgPSBkYXRlUHJldk1vbnRoLnllYXI7XG4gICAgICAgICAgICAgICAgdGVtcE1vbnRoID0gZGF0ZVByZXZNb250aC5tb250aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IGluZGV4T2ZMYXN0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGlzTmV4dE1vbnRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy5uZXh0TW9udGgpO1xuICAgICAgICAgICAgICAgIHRlbXBZZWFyID0gZGF0ZU5leHRNb250aC55ZWFyO1xuICAgICAgICAgICAgICAgIHRlbXBNb250aCA9IGRhdGVOZXh0TW9udGgubW9udGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlZWtlbmRcbiAgICAgICAgICAgIHRoaXMuX3NldFdlZWtlbmQoZGF5SW5XZWVrLCAkZGF0ZUNvbnRhaW5lciwgY2xhc3NQcmVmaXgpO1xuXG4gICAgICAgICAgICAvLyBUb2RheVxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzVG9kYXkodGVtcFllYXIsIHRlbXBNb250aCwgZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArICd0b2RheScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgJGRhdGU6ICQodGhpcy5fJGRhdGVFbGVtZW50LmdldChpKSksXG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXI6ICRkYXRlQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHllYXI6IHRlbXBZZWFyLFxuICAgICAgICAgICAgICAgIG1vbnRoOiB0ZW1wTW9udGgsXG4gICAgICAgICAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgICAgICAgICBpc1ByZXZNb250aDogaXNQcmV2TW9udGgsXG4gICAgICAgICAgICAgICAgaXNOZXh0TW9udGg6IGlzTmV4dE1vbnRoLFxuICAgICAgICAgICAgICAgIGh0bWw6IGRhdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkKGV2ZW50RGF0YS4kZGF0ZSkuaHRtbChldmVudERhdGEuaHRtbC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGRheUluV2VlayA9IChkYXlJbldlZWsgKyAxKSAlIDc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmlyZSBkcmF3IGV2ZW50IHdoZW4gY2FsZW5kYXIgZHJhdyBlYWNoIGRhdGUuXG4gICAgICAgICAgICAgKiBAYXBpXG4gICAgICAgICAgICAgKiBAZXZlbnQgQ2FsZW5kYXIjZHJhd1xuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQSBuYW1lIG9mIGN1c3RvbSBldmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc1ByZXZNb250aCBXaGV0aGVyIHRoZSBkcmF3IGRheSBpcyBsYXN0IG1vbnRoIG9yIG5vdFxuICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc05leHRNb250aCBXZWh0ZXIgdGhlIGRyYXcgZGF5IGlzIG5leHQgbW9udGggb3Igbm90XG4gICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRhdGUgVGhlIGVsZW1lbnQgaGF2ZSBkYXRlIGh0bWxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZGF0ZUNvbnRhaW5lciBDaGlsZCBlbGVtZW50IHRoYXQgaGFzIGNsYXNzTmFtZSBbcHJlZml4XXdlZWsuXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXQgaXMgcG9zc2libGUgdGhpcyBlbGVtZW50IGVxdWVsIGVsRGF0ZS5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIEEgZHJhdyBkYXRlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBkcmF3IG1vbnRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIGRyYXcgeWVhclxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgQSBodG1sIHN0cmluZ1xuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIC8vIGRyYXcgY3VzdG9tIGV2ZW4gaGFuZGxlcnNcbiAgICAgICAgICAgICAqIGNhbGVuZGFyLm9uKCdkcmF3JywgZnVuY3Rpb24oZHJhd0V2ZW50KXsgLi4uIH0pO1xuICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgdGhpcy5maXJlKCdkcmF3JywgZXZlbnREYXRhKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEplZGdlIHRoZSBpbnB1dCBkYXRlIGlzIHRvZGF5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSBkYXRlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNUb2RheTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIHRvZGF5ID0gY2FsZW5kYXJVdGlscy5nZXREYXRlSGFzaCgpO1xuICAgICAgICB2YXIgaXNZZWFyID0geWVhciA/ICh0b2RheS55ZWFyID09PSB5ZWFyKSA6IHRydWU7XG4gICAgICAgIHZhciBpc01vbnRoID0gbW9udGggPyAodG9kYXkubW9udGggPT09IG1vbnRoKSA6IHRydWU7XG4gICAgICAgIHZhciBpc0RhdGUgPSBkYXRlID8gKHRvZGF5LmRhdGUgPT09IGRhdGUpIDogdHJ1ZTtcblxuICAgICAgICByZXR1cm4gaXNZZWFyICYmIGlzTW9udGggJiYgaXNEYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYWtlIG9uZSB3ZWVrIHRlbXBhdGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0V2Vla3M6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciAkZWxXZWVrLFxuICAgICAgICAgICAgd2Vla3MgPSBjYWxlbmRhclV0aWxzLmdldFdlZWtzKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3ZWVrczsgaSArPSAxKSB7XG4gICAgICAgICAgICAkZWxXZWVrID0gdGhpcy4kd2Vla1RlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgJGVsV2Vlay5hcHBlbmRUbyh0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtFbGVtZW50cy5wdXNoKCRlbFdlZWspO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhdmUgZHJhdyBkYXRlcyB0byBhcnJheVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB5ZWFyIEEgZHJhdyB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vbnRoIEEgZHJhdyBtb250aFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGVzIEEgZHJhdyBkYXRlXG4gICAgICogQHJldHVybnMge251bWJlcn0gaW5kZXggb2YgbGFzdCBkYXRlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmlsbERhdGVzOiBmdW5jdGlvbih5ZWFyLCBtb250aCwgZGF0ZXMpIHtcbiAgICAgICAgdmFyIGZpcnN0RGF5ID0gY2FsZW5kYXJVdGlscy5nZXRGaXJzdERheSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBsYXN0RGF5ID0gY2FsZW5kYXJVdGlscy5nZXRMYXN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGxhc3REYXRlID0gY2FsZW5kYXJVdGlscy5nZXRMYXN0RGF0ZSh5ZWFyLCBtb250aCksXG4gICAgICAgICAgICBkYXRlUHJldk1vbnRoID0gY2FsZW5kYXJVdGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIHtcbiAgICAgICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgICAgICBkYXRlOiAxXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHByZXZNb250aExhc3REYXRlID0gY2FsZW5kYXJVdGlscy5nZXRMYXN0RGF0ZShkYXRlUHJldk1vbnRoLnllYXIsIGRhdGVQcmV2TW9udGgubW9udGgpLFxuICAgICAgICAgICAgaW5kZXhPZkxhc3REYXRlLFxuICAgICAgICAgICAgaTtcblxuICAgICAgICBpZiAoZmlyc3REYXkgPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBwcmV2TW9udGhMYXN0RGF0ZSAtIGZpcnN0RGF5OyBpIDwgcHJldk1vbnRoTGFzdERhdGU7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGRhdGVzLnB1c2goaSArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsYXN0RGF0ZSArIDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgZGF0ZXMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBpbmRleE9mTGFzdERhdGUgPSBkYXRlcy5sZW5ndGggLSAxO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgNyAtIGxhc3REYXk7IGkgKz0gMSkge1xuICAgICAgICAgICAgZGF0ZXMucHVzaChpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleE9mTGFzdERhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB3ZWVrZW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRheSBBIGRhdGVcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRhdGVDb250YWluZXIgQSBjb250YWluZXIgZWxlbWVudCBmb3IgZGF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIHByZWZpeCBvZiBjbGFzc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFdlZWtlbmQ6IGZ1bmN0aW9uKGRheSwgJGRhdGVDb250YWluZXIsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIGlmIChkYXkgPT09IDApIHtcbiAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgJ3N1bicpO1xuICAgICAgICB9IGVsc2UgaWYgKGRheSA9PT0gNikge1xuICAgICAgICAgICAgJGRhdGVDb250YWluZXIuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyAnc2F0Jyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgY2FsZW5kYXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3dlZWtFbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0LmVtcHR5KCk7XG4gICAgICAgIHRoaXMuZGF0YU9mTW9udGhMYXllci5hcHBlbmRlZFRhcmdldC5lbXB0eSgpO1xuICAgICAgICB0aGlzLmRhdGFPZlllYXJMYXllci5hcHBlbmRlZFRhcmdldC5lbXB0eSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRpdGxlIHdpdGggZm9ybWF0IG9wdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHZhbHVlIG9mIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBtb250aCBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQHByaXZhdGVcbiAgICAgKiovXG4gICAgX3NldENhbGVuZGFyVGl0bGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0aXRsZUZvcm1hdCA9IG9wdGlvbi50aXRsZUZvcm1hdCxcbiAgICAgICAgICAgIHJlcGxhY2VNYXAsXG4gICAgICAgICAgICByZWc7XG5cbiAgICAgICAgbW9udGggPSBjYWxlbmRhclV0aWxzLnByZXBlbmRMZWFkaW5nWmVybyhtb250aCk7XG4gICAgICAgIHJlcGxhY2VNYXAgPSB0aGlzLl9nZXRSZXBsYWNlTWFwKHllYXIsIG1vbnRoKTtcblxuICAgICAgICByZWcgPSBDT05TVEFOVFMudGl0bGVSZWdFeHA7XG4gICAgICAgIHRoaXMuX3NldERhdGVUZXh0SW5DYWxlbmRhcih0aGlzLiR0aXRsZSwgdGl0bGVGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG5cbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlWWVhclJlZ0V4cDtcbiAgICAgICAgdGhpcy5fc2V0RGF0ZVRleHRJbkNhbGVuZGFyKHRoaXMuJHRpdGxlWWVhciwgb3B0aW9uLnllYXJUaXRsZUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcblxuICAgICAgICByZWcgPSBDT05TVEFOVFMudGl0bGVNb250aFJlZ0V4cDtcbiAgICAgICAgdGhpcy5fc2V0RGF0ZVRleHRJbkNhbGVuZGFyKHRoaXMuJHRpdGxlTW9udGgsIG9wdGlvbi5tb250aFRpdGxlRm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGl0bGVcbiAgICAgKiBAcGFyYW0ge2pRdWVyeXxIVE1MRWxlbWVudH0gZWxlbWVudCBBIHVwZGF0ZSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm0gQSB1cGRhdGUgZm9ybVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgQSBvYmplY3QgdGhhdCBoYXMgdmFsdWUgbWF0Y2hlZCByZWdFeHBcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnIEEgcmVnRXhwIHRvIGNoYWduZSBmb3JtXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0RGF0ZVRleHRJbkNhbGVuZGFyOiBmdW5jdGlvbihlbGVtZW50LCBmb3JtLCBtYXAsIHJlZykge1xuICAgICAgICB2YXIgdGl0bGUsXG4gICAgICAgICAgICAkZWwgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICghJGVsLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRpdGxlID0gY2FsZW5kYXJVdGlscy5nZXRDb252ZXJ0ZWRUaXRsZShmb3JtLCBtYXAsIHJlZyk7XG4gICAgICAgICRlbC50ZXh0KHRpdGxlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG1hcCBkYXRhIGZvciBmb3JtXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW2RhdGVdIEEgZGF5XG4gICAgICogQHJldHVybnMge09iamVjdH0gUmVwbGFjZU1hcFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldFJlcGxhY2VNYXA6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB5ZWFyU3ViID0gKHllYXIudG9TdHJpbmcoKSkuc3Vic3RyKDIsIDIpLFxuICAgICAgICAgICAgbW9udGhMYWJlbCA9IG9wdGlvbi5tb250aFRpdGxlc1ttb250aCAtIDFdLFxuICAgICAgICAgICAgbGFiZWxLZXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRhdGUgfHwgMSkuZ2V0RGF5KCksXG4gICAgICAgICAgICBkYXlMYWJlbCA9IG9wdGlvbi5kYXlUaXRsZXNbbGFiZWxLZXldO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5eXl5OiB5ZWFyLFxuICAgICAgICAgICAgeXk6IHllYXJTdWIsXG4gICAgICAgICAgICBtbTogbW9udGgsXG4gICAgICAgICAgICBtOiBOdW1iZXIobW9udGgpLFxuICAgICAgICAgICAgTTogbW9udGhMYWJlbCxcbiAgICAgICAgICAgIGRkOiBkYXRlLFxuICAgICAgICAgICAgZDogTnVtYmVyKGRhdGUpLFxuICAgICAgICAgICAgRDogZGF5TGFiZWxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRvZGF5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q2FsZW5kYXJUb2RheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdG9kYXkgPSB0aGlzLiR0b2RheSxcbiAgICAgICAgICAgIHRvZGF5Rm9ybWF0LFxuICAgICAgICAgICAgdG9kYXksXG4gICAgICAgICAgICB5ZWFyLFxuICAgICAgICAgICAgbW9udGgsXG4gICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgcmVwbGFjZU1hcCxcbiAgICAgICAgICAgIHJlZztcblxuICAgICAgICBpZiAoISR0b2RheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZGF5ID0gY2FsZW5kYXJVdGlscy5nZXREYXRlSGFzaCgpO1xuICAgICAgICB5ZWFyID0gdG9kYXkueWVhcjtcbiAgICAgICAgbW9udGggPSBjYWxlbmRhclV0aWxzLnByZXBlbmRMZWFkaW5nWmVybyh0b2RheS5tb250aCk7XG4gICAgICAgIGRhdGUgPSBjYWxlbmRhclV0aWxzLnByZXBlbmRMZWFkaW5nWmVybyh0b2RheS5kYXRlKTtcbiAgICAgICAgdG9kYXlGb3JtYXQgPSB0aGlzLl9vcHRpb24udG9kYXlGb3JtYXQ7XG4gICAgICAgIHJlcGxhY2VNYXAgPSB0aGlzLl9nZXRSZXBsYWNlTWFwKHllYXIsIG1vbnRoLCBkYXRlKTtcbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRvZGF5UmVnRXhwO1xuICAgICAgICB0aGlzLl9zZXREYXRlVGV4dEluQ2FsZW5kYXIoJHRvZGF5LCB0b2RheUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRpdGxlIG9uIHllYXIncyBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIC0gWWVhclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFRpdGxlT25ZZWFyTGF5ZXI6IGZ1bmN0aW9uKHllYXIpIHtcbiAgICAgICAgdmFyIGl0ZW1Db3VudE9mWWVhciA9IHRoaXMuX2dldEluZm9PZlllYXJSYW5nZSh5ZWFyKTtcbiAgICAgICAgdmFyIHN0YXJ0WWVhclRleHQgPSB0aGlzLl9nZXRDb252ZXJ0ZWRZZWFyVGl0bGUoaXRlbUNvdW50T2ZZZWFyLnN0YXJ0WWVhcik7XG4gICAgICAgIHZhciBlbmRZZWFyVGV4dCA9IHRoaXMuX2dldENvbnZlcnRlZFllYXJUaXRsZShpdGVtQ291bnRPZlllYXIuZW5kWWVhcik7XG4gICAgICAgIHZhciB0aXRsZSA9IHN0YXJ0WWVhclRleHQgKyAnIC0gJyArIGVuZFllYXJUZXh0O1xuXG4gICAgICAgIHRoaXMuJHRpdGxlLnRleHQodGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2xhc3MgbmFtZSBvbiB0aXRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaG93bkxheWVySWR4IC0gWWVhclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldENsYXNzTmFtZU9uVGl0bGU6IGZ1bmN0aW9uKHNob3duTGF5ZXJJZHgpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMuX29wdGlvbi5jbGFzc1ByZWZpeCArIENPTlNUQU5UUy5jbGlja2FibGU7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQ2xpY2thYmxlVGl0bGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93bkxheWVySWR4ICE9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLiR0aXRsZS5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdGl0bGUucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY29udmVydGVkIHllYXIgdGV4dCBvbiB5ZWFyIGFuZCBtb250aCBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIC0gWWVhclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IENvbnZlcnRlZCB5ZWFyIHRleHRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRDb252ZXJ0ZWRZZWFyVGl0bGU6IGZ1bmN0aW9uKHllYXIpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbjtcbiAgICAgICAgdmFyIHJlcGxhY2VNYXAsIHJlZztcblxuICAgICAgICByZXBsYWNlTWFwID0gdGhpcy5fZ2V0UmVwbGFjZU1hcCh5ZWFyKTtcbiAgICAgICAgcmVnID0gQ09OU1RBTlRTLnRpdGxlWWVhclJlZ0V4cDtcblxuICAgICAgICByZXR1cm4gY2FsZW5kYXJVdGlscy5nZXRDb252ZXJ0ZWRUaXRsZShvcHRpb24ueWVhclRpdGxlRm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgeWVhcnMgaW5mbyBieSBcIml0ZW1Db3VudE9mWWVhclwiIG9wdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIC0gWWVhclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEluZm8gb2YgeWVhcidzIHJhbmdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0SW5mb09mWWVhclJhbmdlOiBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmRhdGFPZlllYXJMYXllci5mcmFtZTtcbiAgICAgICAgdmFyIGNvbHMgPSBmcmFtZUluZm8uY29scztcbiAgICAgICAgdmFyIHJvd3MgPSBmcmFtZUluZm8ucm93cztcbiAgICAgICAgdmFyIGJhc2VJZHggPSAoY29scyAqIE1hdGguZmxvb3Iocm93cyAvIDIpKSArIE1hdGguZmxvb3IoY29scyAvIDIpO1xuICAgICAgICB2YXIgc3RhcnRZZWFyID0geWVhciAtIGJhc2VJZHg7XG4gICAgICAgIHZhciBlbmRZZWFyID0gc3RhcnRZZWFyICsgKGNvbHMgKiByb3dzKSAtIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogc3RhcnRZZWFyLFxuICAgICAgICAgICAgZW5kWWVhcjogZW5kWWVhclxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgaW5kZXggb2YgY3VycmVudCBzaG93biBsYXllciBieSBsYXllcidzIHR5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHR5cGUgLSBUeXBlIG9mIGxheWVyXG4gICAgICogQHJldHVybnMge251bWJlcn0gSW5kZXggb2Ygc2hvd24gbGF5ZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRJbmRleE9mU2hvd25MYXllcjogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICByZXR1cm4gKHR5cGUgPyB1dGlsLmluQXJyYXkodHlwZSwgQ09OU1RBTlRTLmxheWVyS2V5cykgOiB0aGlzLnNob3duTGF5ZXJJZHgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGhlYWRlciBlbGVtZW50XG4gICAgICogQHBhcmFtIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gZGF0ZUZvckRyYXdpbmcgLSBUaGUgaGFzaCB0aGF0IHNob3cgdXAgb24gY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hvd25MYXllcklkeCAtIEluZGV4IG9mIHNob3duIGxheWVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZHJhd0hlYWRlcjogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcsIHNob3duTGF5ZXJJZHgpIHtcbiAgICAgICAgdmFyIGNsYXNzU2VsZWN0b3IgPSAnLicgKyB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXggKyAnYnRuLSc7XG4gICAgICAgIHZhciBwcmV2QnRuID0gdGhpcy4kaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIENPTlNUQU5UUy5wcmV2KTtcbiAgICAgICAgdmFyIG5leHRCdG4gPSB0aGlzLiRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgQ09OU1RBTlRTLm5leHQpO1xuICAgICAgICB2YXIga2V5ID0gQ09OU1RBTlRTLnJlbGF0aXZlTW9udGhWYWx1ZUtleTtcbiAgICAgICAgdmFyIGl0ZW1Db3VudE9mWWVhciA9IHRoaXMuX29wdGlvbi5pdGVtQ291bnRPZlllYXI7XG4gICAgICAgIHZhciBwcmV2VmFsdWUsIG5leHRWYWx1ZTtcblxuICAgICAgICB0aGlzLl9zZXRDbGFzc05hbWVPblRpdGxlKHNob3duTGF5ZXJJZHgpO1xuXG4gICAgICAgIHN3aXRjaCAoc2hvd25MYXllcklkeCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHRoaXMuX3NldENhbGVuZGFyVGV4dChkYXRlRm9yRHJhd2luZyk7XG4gICAgICAgICAgICAgICAgcHJldlZhbHVlID0gLTE7XG4gICAgICAgICAgICAgICAgbmV4dFZhbHVlID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLiR0aXRsZS50ZXh0KHRoaXMuX2dldENvbnZlcnRlZFllYXJUaXRsZShkYXRlRm9yRHJhd2luZy55ZWFyKSk7XG4gICAgICAgICAgICAgICAgcHJldlZhbHVlID0gLTEyO1xuICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IDEyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXMuX3NldFRpdGxlT25ZZWFyTGF5ZXIoZGF0ZUZvckRyYXdpbmcueWVhcik7XG4gICAgICAgICAgICAgICAgcHJldlZhbHVlID0gLTEyICogaXRlbUNvdW50T2ZZZWFyO1xuICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IDEyICogaXRlbUNvdW50T2ZZZWFyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogLy8gQHRvZG8gV2h5IGRvZXMgbm90IHVzZSAncmV0dXJuJyBidXQgJ2JyZWFrJz9cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZCdG4uZGF0YShrZXksIHByZXZWYWx1ZSk7XG4gICAgICAgIG5leHRCdG4uZGF0YShrZXksIG5leHRWYWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgYm9keSBlbGVtZW50c1xuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIC0gVGhlIGhhc2ggdGhhdCBzaG93IHVwIG9uIGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNob3duTGF5ZXJJZHggLSBJbmRleCBvZiBzaG93biBsYXllclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdCb2R5OiBmdW5jdGlvbihkYXRlRm9yRHJhd2luZywgc2hvd25MYXllcklkeCkge1xuICAgICAgICB2YXIgeWVhciA9IGRhdGVGb3JEcmF3aW5nLnllYXI7XG4gICAgICAgIHZhciBtb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoO1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXg7XG5cbiAgICAgICAgLy8gd2Vla3NcbiAgICAgICAgdGhpcy5fc2V0V2Vla3MoeWVhciwgbW9udGgpO1xuICAgICAgICB0aGlzLl8kZGF0ZUVsZW1lbnQgPSAkKCcuJyArIGNsYXNzUHJlZml4ICsgJ2RhdGUnLCB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fJGRhdGVDb250YWluZXJFbGVtZW50ID0gJCgnLicgKyBjbGFzc1ByZWZpeCArICd3ZWVrID4gKicsIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQpO1xuXG4gICAgICAgIC8vIGRhdGVzXG4gICAgICAgIHRoaXMuX2RyYXdEYXRlcyhkYXRlRm9yRHJhd2luZywgY2xhc3NQcmVmaXgpO1xuXG4gICAgICAgIC8vIG1vbnRoIGxheWVyXG4gICAgICAgIHRoaXMuX2RyYXdGcmFtZU9uTW9udGhMYXllcigpO1xuICAgICAgICB0aGlzLl9kcmF3QnV0dG9uc09mTW9udGgoZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KTtcblxuICAgICAgICAvLyB5ZWFyIGxheWVyXG4gICAgICAgIHRoaXMuX2RyYXdGcmFtZU9uWWVhckxheWVyKCk7XG4gICAgICAgIHRoaXMuX2RyYXdCdXR0b25zT2ZZZWFyKGRhdGVGb3JEcmF3aW5nLCBjbGFzc1ByZWZpeCk7XG5cbiAgICAgICAgLy8gc2hvdyBsYXllclxuICAgICAgICB0aGlzLl9jaGFuZ2VTaG93bkxheWVyKHNob3duTGF5ZXJJZHgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGZyYW1lIGNvbnRhaW5pbmcgYnV0dG9ucyBvbiBtb250aCdzIGxheWVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZHJhd0ZyYW1lT25Nb250aExheWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgcm93cyA9IHRoaXMuZGF0YU9mTW9udGhMYXllci5mcmFtZS5yb3dzO1xuICAgICAgICB2YXIgZGF0YU9mTW9udGhMYXllciA9IHRoaXMuZGF0YU9mTW9udGhMYXllcjtcbiAgICAgICAgdmFyICRtb250aEdyb3VwRWw7XG5cbiAgICAgICAgZm9yICg7IGkgPCByb3dzOyBpICs9IDEpIHtcbiAgICAgICAgICAgICRtb250aEdyb3VwRWwgPSBkYXRhT2ZNb250aExheWVyLnRlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgJG1vbnRoR3JvdXBFbC5hcHBlbmRUbyhkYXRhT2ZNb250aExheWVyLmFwcGVuZGVkVGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHNlbGVjdGFibGUgYnV0dG9ucyBvbiBtb250aCdzIGxheWVyXG4gICAgICogQHBhcmFtIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gZGF0ZUZvckRyYXdpbmcgLSBUaGUgaGFzaCB0aGF0IHNob3cgdXAgb24gY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggLSBBIGNsYXNzIHByZWZpeFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdCdXR0b25zT2ZNb250aDogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciBrZXkgPSBDT05TVEFOVFMucmVsYXRpdmVNb250aFZhbHVlS2V5O1xuICAgICAgICB2YXIgc2VsZWN0ZWRNb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoO1xuICAgICAgICB2YXIgbW9udGhUaXRsZXMgPSB0aGlzLl9vcHRpb24ubW9udGhUaXRsZXM7XG4gICAgICAgIHZhciAkbW9udGhFbHMgPSB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIuYXBwZW5kZWRUYXJnZXQuZmluZCgnLicgKyBjbGFzc1ByZWZpeCArICdtb250aCcpO1xuICAgICAgICB2YXIgJGJ1dHRvbkVsLCBtb250aCwgcmVsYXRpdmVNb250aDtcbiAgICAgICAgdmFyIGV2ZW50RGF0YTtcblxuICAgICAgICB1dGlsLmZvckVhY2gobW9udGhUaXRsZXMsIGZ1bmN0aW9uKHRpdGxlLCBpZHgpIHtcbiAgICAgICAgICAgICRidXR0b25FbCA9ICRtb250aEVscy5lcShpZHgpO1xuICAgICAgICAgICAgbW9udGggPSBpZHggKyAxO1xuXG4gICAgICAgICAgICBpZiAobW9udGggPT09IHNlbGVjdGVkTW9udGgpIHtcbiAgICAgICAgICAgICAgICAkYnV0dG9uRWwuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyBDT05TVEFOVFMuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5faXNUb2RheSh0aGlzLl9zaG93bkRhdGUueWVhciwgbW9udGgpKSB7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbkVsLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLnRvZGF5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVsYXRpdmVNb250aCA9IG1vbnRoIC0gc2VsZWN0ZWRNb250aDtcblxuICAgICAgICAgICAgJGJ1dHRvbkVsLmRhdGEoa2V5LCByZWxhdGl2ZU1vbnRoKS5odG1sKHRpdGxlKTtcblxuICAgICAgICAgICAgZXZlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICRkYXRlOiAkYnV0dG9uRWwsXG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXI6ICRidXR0b25FbCxcbiAgICAgICAgICAgICAgICB5ZWFyOiBkYXRlRm9yRHJhd2luZy55ZWFyLFxuICAgICAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgICAgICBkYXRlOiAwLFxuICAgICAgICAgICAgICAgIGh0bWw6IHRpdGxlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ2RyYXcnLCBldmVudERhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBmcmFtZSBjb250YWluaW5nIGJ1dHRvbnMgb24geWVhcidzIGxheWVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZHJhd0ZyYW1lT25ZZWFyTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciByb3dzID0gdGhpcy5kYXRhT2ZNb250aExheWVyLmZyYW1lLnJvd3M7XG4gICAgICAgIHZhciBkYXRhT2ZZZWFyTGF5ZXIgPSB0aGlzLmRhdGFPZlllYXJMYXllcjtcbiAgICAgICAgdmFyICR5ZWFyR3JvdXBFbDtcblxuICAgICAgICBmb3IgKDsgaSA8IHJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgJHllYXJHcm91cEVsID0gZGF0YU9mWWVhckxheWVyLnRlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgJHllYXJHcm91cEVsLmFwcGVuZFRvKGRhdGFPZlllYXJMYXllci5hcHBlbmRlZFRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBzZWxlY3RhYmxlIGJ1dHRvbnMgb24geWVhcidzIGxheWVyXG4gICAgICogQHBhcmFtIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gZGF0ZUZvckRyYXdpbmcgLSBUaGUgaGFzaCB0aGF0IHNob3cgdXAgb24gY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggLSBBIGNsYXNzIHByZWZpeFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdCdXR0b25zT2ZZZWFyOiBmdW5jdGlvbihkYXRlRm9yRHJhd2luZywgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyIGtleSA9IENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXk7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZUZvckRyYXdpbmcueWVhcjtcbiAgICAgICAgdmFyIGl0ZW1Db3VudE9mWWVhciA9IHRoaXMuX2dldEluZm9PZlllYXJSYW5nZSh5ZWFyKTtcbiAgICAgICAgdmFyIHN0YXJ0WWVhciA9IGl0ZW1Db3VudE9mWWVhci5zdGFydFllYXI7XG4gICAgICAgIHZhciBlbmRZZWFyID0gaXRlbUNvdW50T2ZZZWFyLmVuZFllYXI7XG4gICAgICAgIHZhciBjbnQgPSAwO1xuICAgICAgICB2YXIgJHllYXJFbHMgPSB0aGlzLmRhdGFPZlllYXJMYXllci5hcHBlbmRlZFRhcmdldC5maW5kKCcuJyArIGNsYXNzUHJlZml4ICsgJ3llYXInKTtcbiAgICAgICAgdmFyICRidXR0b25FbCwgcmVsYXRpdmVNb250aDtcbiAgICAgICAgdmFyIGV2ZW50RGF0YTtcblxuICAgICAgICBmb3IgKDsgc3RhcnRZZWFyIDw9IGVuZFllYXI7IHN0YXJ0WWVhciArPSAxKSB7XG4gICAgICAgICAgICAkYnV0dG9uRWwgPSAkeWVhckVscy5lcShjbnQpO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnRZZWFyID09PSB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbkVsLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzVG9kYXkoc3RhcnRZZWFyKSkge1xuICAgICAgICAgICAgICAgICRidXR0b25FbC5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy50b2RheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbGF0aXZlTW9udGggPSAoc3RhcnRZZWFyIC0geWVhcikgKiAxMjtcblxuICAgICAgICAgICAgJGJ1dHRvbkVsLmRhdGEoa2V5LCByZWxhdGl2ZU1vbnRoKS5odG1sKHN0YXJ0WWVhcik7XG5cbiAgICAgICAgICAgIGNudCArPSAxO1xuXG4gICAgICAgICAgICBldmVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgJGRhdGU6ICRidXR0b25FbCxcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lcjogJGJ1dHRvbkVsLFxuICAgICAgICAgICAgICAgIHllYXI6IHN0YXJ0WWVhcixcbiAgICAgICAgICAgICAgICBtb250aDogMCxcbiAgICAgICAgICAgICAgICBkYXRlOiAwLFxuICAgICAgICAgICAgICAgIGh0bWw6IHN0YXJ0WWVhclxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5maXJlKCdkcmF3JywgZXZlbnREYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgY3VycmVudCBzaG93biBsYXllciBvbiBjYWxlbmRhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaG93bkxheWVySWR4IC0gSW5kZXggb2Ygc2hvd24gbGF5ZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jaGFuZ2VTaG93bkxheWVyOiBmdW5jdGlvbihzaG93bkxheWVySWR4KSB7XG4gICAgICAgIHZhciBjbGFzc1ByZWZpeCA9IHRoaXMuX29wdGlvbi5jbGFzc1ByZWZpeDtcbiAgICAgICAgdmFyIHByZXZzaG93bkxheWVySWR4ID0gdGhpcy5zaG93bkxheWVySWR4O1xuICAgICAgICB2YXIgJGJvZHlzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuJyArIGNsYXNzUHJlZml4ICsgJ2JvZHknKTtcblxuICAgICAgICB0aGlzLnNob3duTGF5ZXJJZHggPSBzaG93bkxheWVySWR4O1xuXG4gICAgICAgICRib2R5cy5lcShwcmV2c2hvd25MYXllcklkeCkuaGlkZSgpO1xuICAgICAgICAkYm9keXMuZXEoc2hvd25MYXllcklkeCkuc2hvdygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGNhbGVuZGFyXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeWVhcl0gQSB5ZWFyIChleC4gMjAwOClcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoXSBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbaXNSZWxhdGl2ZV0gQSB5ZWFyIGFuZCBtb250aCBpcyByZWxhdGVkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzaG93blR5cGVdIFNob3duIHR5cGUgb2YgbGF5ZXIgKGV4LiBbZGF5LCBtb250aCwgeWVhcl0gfCBbMF0gfiAyXSlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNhbGVuZGFyLmRyYXcoKTsgLy8gRHJhdyB3aXRoIG5vdyBkYXRlLlxuICAgICAqIGNhbGVuZGFyLmRyYXcoMjAwOCwgMTIpOyAvLyBEcmF3IDIwMDgvMTJcbiAgICAgKiBjYWxlbmRhci5kcmF3KG51bGwsIDEyKTsgLy8gRHJhdyBjdXJyZW50IHllYXIvMTJcbiAgICAgKiBjYWxlbmRhci5kcmF3KDIwMTAsIG51bGwpOyAvLyBEcmF3IDIwMTAvY3VycmVudCBtb250aFxuICAgICAqIGNhbGVuZGFyLmRyYXcoMCwgMSwgdHJ1ZSk7IC8vIERyYXcgbmV4dCBtb250aFxuICAgICAqIGNhbGVuZGFyLmRyYXcoLTEsIG51bGwsIHRydWUpOyAvLyBEcmF3IHByZXYgeWVhclxuICAgICAqIGNhbGVuZGFyLmRyYXcoMCwgMCwgZmFsc2UsICdkYXRlJyk7IC8vIERyYXcgdG9kYXkgd2l0aCBkYXRlJ3MgbGF5ZXJcbiAgICAgKiBjYWxlbmRhci5kcmF3KDIwMTAsIDEwLCBmYWxzZSwgJ21vbnRoJyk7IC8vIERyYXcgMjAxMC8xMCB3aXRoIG1vbnRoJ3MgbGF5ZXJcbiAgICAgKiBjYWxlbmRhci5kcmF3KDIwMTYsIG51bGwsIGZhbHNlLCAneWVhcicpOyAvLyBEcmF3IDIwMTYvbW9udGggd2l0aCB5ZWFyJ3MgbGF5ZXJcbiAgICAgKiovXG4gICAgZHJhdzogZnVuY3Rpb24oeWVhciwgbW9udGgsIGlzUmVsYXRpdmUsIHNob3duVHlwZSkge1xuICAgICAgICB2YXIgZGF0ZUZvckRyYXdpbmcgPSB0aGlzLl9nZXREYXRlRm9yRHJhd2luZyh5ZWFyLCBtb250aCwgaXNSZWxhdGl2ZSk7XG4gICAgICAgIHZhciBzaG93bkxheWVySWR4O1xuXG4gICAgICAgIC8qID09PT09PT09PT09PT09PVxuICAgICAgICAgKiBiZWZvcmVEcmF3XG4gICAgICAgICAqID09PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgaWYgKCF0aGlzLmludm9rZSgnYmVmb3JlRHJhdycsIGRhdGVGb3JEcmF3aW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogPT09PT09PT09PT09PT09XG4gICAgICAgICAqIGRyYXdcbiAgICAgICAgICogPT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBzaG93bkxheWVySWR4ID0gdXRpbC5pc051bWJlcihzaG93blR5cGUpID8gc2hvd25UeXBlIDogdGhpcy5fZ2V0SW5kZXhPZlNob3duTGF5ZXIoc2hvd25UeXBlKTtcblxuICAgICAgICB5ZWFyID0gZGF0ZUZvckRyYXdpbmcueWVhcjtcbiAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcblxuICAgICAgICB0aGlzLnNldERhdGUoeWVhciwgbW9udGgpO1xuXG4gICAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgICAgIHRoaXMuX2RyYXdIZWFkZXIoZGF0ZUZvckRyYXdpbmcsIHNob3duTGF5ZXJJZHgpO1xuICAgICAgICB0aGlzLl9kcmF3Qm9keShkYXRlRm9yRHJhd2luZywgc2hvd25MYXllcklkeCk7XG5cbiAgICAgICAgLyogPT09PT09PT09PT09PT09XG4gICAgICAgICAqIGFmdGVyRHJhd1xuICAgICAgICAgKiA9PT09PT09PT09PT09PT09Ki9cbiAgICAgICAgdGhpcy5maXJlKCdhZnRlckRyYXcnLCBkYXRlRm9yRHJhd2luZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHllYXIgYW5kIG1vbnRoKGp1c3Qgc2hvd24pLlxuICAgICAqIEBhcGlcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgZ2V0RGF0ZSgpOyA9PiB7IHllYXI6IHh4eHgsIG1vbnRoOiB4eCB9O1xuICAgICAqL1xuICAgIGdldERhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogdGhpcy5fc2hvd25EYXRlLnllYXIsXG4gICAgICAgICAgICBtb250aDogdGhpcy5fc2hvd25EYXRlLm1vbnRoXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkYXRlXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeWVhcl0gQSB5ZWFyIChleC4gMjAwOClcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21vbnRoXSBBIG1vbnRoICgxIH4gMTIpXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgc2V0RGF0ZSgxOTg0LCAwNCk7XG4gICAgICoqL1xuICAgIHNldERhdGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5fc2hvd25EYXRlO1xuICAgICAgICBkYXRlLnllYXIgPSB1dGlsLmlzTnVtYmVyKHllYXIpID8geWVhciA6IGRhdGUueWVhcjtcbiAgICAgICAgZGF0ZS5tb250aCA9IHV0aWwuaXNOdW1iZXIobW9udGgpID8gbW9udGggOiBkYXRlLm1vbnRoO1xuICAgIH1cbn0pO1xuXG51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihDYWxlbmRhcik7XG5tb2R1bGUuZXhwb3J0cyA9IENhbGVuZGFyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY2FsZW5kYXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFV0aWxzIGZvciBjYWxlbmRhciBjb21wb25lbnRcbiAqIEBhdXRob3IgTkhOIE5ldC4gRkUgZGV2IExhYiA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHVpLWNvZGUtc25pcHBldCBeMS4wLjJcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXRpbHMgb2YgY2FsZW5kYXJcbiAqIEBuYW1lc3BhY2UgY2FsZW5kYXJVdGlsc1xuICogQGlnbm9yZVxuICovXG52YXIgdXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGRhdGUgaGFzaCBieSBwYXJhbWV0ZXIuXG4gICAgICogIGlmIHRoZXJlIGFyZSAzIHBhcmFtZXRlciwgdGhlIHBhcmFtZXRlciBpcyBjb3Jnbml6ZWQgRGF0ZSBvYmplY3RcbiAgICAgKiAgaWYgdGhlcmUgYXJlIG5vIHBhcmFtZXRlciwgcmV0dXJuIHRvZGF5J3MgaGFzaCBkYXRlXG4gICAgICogQHBhcmFtIHtEYXRlfG51bWJlcn0gW3llYXJdIEEgZGF0ZSBpbnN0YW5jZSBvciB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb250aF0gQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZGF0ZV0gQSBkYXRlXG4gICAgICogQHJldHVybnMge3t5ZWFyOiAqLCBtb250aDogKiwgZGF0ZTogKn19XG4gICAgICovXG4gICAgZ2V0RGF0ZUhhc2g6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgICAgIHZhciBuRGF0ZTtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIG5EYXRlID0gYXJndW1lbnRzWzBdIHx8IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgIHllYXIgPSBuRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgbW9udGggPSBuRGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIGRhdGUgPSBuRGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgIGRhdGU6IGRhdGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRvZGF5IHRoYXQgc2F2ZWQgb24gY29tcG9uZW50IG9yIGNyZWF0ZSBuZXcgZGF0ZS5cbiAgICAgKiBAZnVuY3Rpb24gZ2V0VG9kYXlcbiAgICAgKiBAcmV0dXJucyB7e3llYXI6ICosIG1vbnRoOiAqLCBkYXRlOiAqfX1cbiAgICAgKi9cbiAgICBnZXRUb2RheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB1dGlscy5nZXREYXRlSGFzaCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2Vla3MgY291bnQgYnkgcGFyYW1lbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybnMge251bWJlcn0g7KO8ICg0fjYpXG4gICAgICoqL1xuICAgIGdldFdlZWtzOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgZmlyc3REYXkgPSB0aGlzLmdldEZpcnN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGxhc3REYXRlID0gdGhpcy5nZXRMYXN0RGF0ZSh5ZWFyLCBtb250aCk7XG5cbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoZmlyc3REYXkgKyBsYXN0RGF0ZSkgLyA3KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHVuaXggdGltZSBmcm9tIGRhdGUgaGFzaFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRlIEEgZGF0ZSBoYXNoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUueWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF0ZS5tb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUuZGF0ZSBBIGRhdGVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdXRpbHMuZ2V0VGltZSh7eWVhcjoyMDEwLCBtb250aDo1LCBkYXRlOjEyfSk7IC8vIDEyNzM1OTAwMDAwMDBcbiAgICAgKiovXG4gICAgZ2V0VGltZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRlT2JqZWN0KGRhdGUpLmdldFRpbWUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHdoaWNoIGRheSBpcyBmaXJzdCBieSBwYXJhbWV0ZXJzIHRoYXQgaW5jbHVkZSB5ZWFyIGFuZCBtb250aCBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9ICgwfjYpXG4gICAgICoqL1xuICAgIGdldEZpcnN0RGF5OiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKS5nZXREYXkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHdoaWNoIGRheSBpcyBsYXN0IGJ5IHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIHllYXIgYW5kIG1vbnRoIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybnMge251bWJlcn0gKDB+NilcbiAgICAgKiovXG4gICAgZ2V0TGFzdERheTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGxhc3QgZGF0ZSBieSBwYXJhbWV0ZXJzIHRoYXQgaW5jbHVkZSB5ZWFyIGFuZCBtb250aCBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBtb250aFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9ICgxfjMxKVxuICAgICAqKi9cbiAgICBnZXRMYXN0RGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkYXRlIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRlIEEgZGF0ZSBoYXNoXG4gICAgICogQHJldHVybnMge0RhdGV9IERhdGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBjYWxlbmRhclV0aWxzLmdldERhdGVPYmplY3Qoe3llYXI6MjAxMCwgbW9udGg6NSwgZGF0ZToxMn0pO1xuICAgICAqICBjYWxlbmRhclV0aWxzLmdldERhdGVPYmplY3QoMjAxMCwgNSwgMTIpOyAvL3llYXIsbW9udGgsZGF0ZVxuICAgICAqKi9cbiAgICBnZXREYXRlT2JqZWN0OiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0gLSAxLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF0ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCByZWxhdGVkIGRhdGUgaGFzaCB3aXRoIHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIGRhdGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSByZWxhdGVkIHZhbHVlIGZvciB5ZWFyKHlvdSBjYW4gdXNlICsvLSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSByZWxhdGVkIHZhbHVlIGZvciBtb250aCAoeW91IGNhbiB1c2UgKy8tKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIEEgcmVsYXRlZCB2YWx1ZSBmb3IgZGF5ICh5b3UgY2FuIHVzZSArLy0pXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGVPYmogc3RhbmRhcmQgZGF0ZSBoYXNoXG4gICAgICogQHJldHVybnMge09iamVjdH0gZGF0ZU9ialxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGNhbGVuZGFyVXRpbHMuZ2V0UmVsYXRpdmVEYXRlKDEsIDAsIDAsIHt5ZWFyOjIwMDAsIG1vbnRoOjEsIGRhdGU6MX0pOyAvLyB7eWVhcjoyMDAxLCBtb250aDoxLCBkYXRlOjF9XG4gICAgICogIGNhbGVuZGFyVXRpbHMuZ2V0UmVsYXRpdmVEYXRlKDAsIDAsIC0xLCB7eWVhcjoyMDEwLCBtb250aDoxLCBkYXRlOjF9KTsgLy8ge3llYXI6MjAwOSwgbW9udGg6MTIsIGRhdGU6MzF9XG4gICAgICoqL1xuICAgIGdldFJlbGF0aXZlRGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUsIGRhdGVPYmopIHtcbiAgICAgICAgdmFyIG5ZZWFyID0gKGRhdGVPYmoueWVhciArIHllYXIpLFxuICAgICAgICAgICAgbk1vbnRoID0gKGRhdGVPYmoubW9udGggKyBtb250aCAtIDEpLFxuICAgICAgICAgICAgbkRhdGUgPSAoZGF0ZU9iai5kYXRlICsgZGF0ZSksXG4gICAgICAgICAgICBuRGF0ZU9iaiA9IG5ldyBEYXRlKG5ZZWFyLCBuTW9udGgsIG5EYXRlKTtcblxuICAgICAgICByZXR1cm4gdXRpbHMuZ2V0RGF0ZUhhc2gobkRhdGVPYmopO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFnbmUgbnVtYmVyIDB+OSB0byAnMDB+MDknXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGNhbGVuZGFyVXRpbHMucHJlcGVuZExlYWRpbmdaZXJvKDApOyAvLyAgJzAwJ1xuICAgICAqICBjYWxlbmRhclV0aWxzLnByZXBlbmRMZWFkaW5nWmVybyg5KTsgLy8gICcwOSdcbiAgICAgKiAgY2FsZW5kYXJVdGlscy5wcmVwZW5kTGVhZGluZ1plcm8oMTIpOyAvLyAgJzEyJ1xuICAgICAqL1xuICAgIHByZXBlbmRMZWFkaW5nWmVybzogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJztcblxuICAgICAgICBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgICAgIHByZWZpeCA9ICcwJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcmVmaXggKyBudW1iZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoYWdlIHRleHQgYW5kIHJldHVybi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIEEgdGV4dCB0byBjaGFnbmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwIEEgY2hhZ25lIGtleSwgdmFsdWUgc2V0XG4gICAgICogQHBhcmFtIHtSZWdFeHB9IHJlZyBBIHJlZ0V4cCB0byBjaGFnbmVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldENvbnZlcnRlZFRpdGxlOiBmdW5jdGlvbihzdHIsIG1hcCwgcmVnKSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlZywgZnVuY3Rpb24obWF0Y2hlZFN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG1hcFttYXRjaGVkU3RyaW5nXSB8fCAnJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ09OU1RBTlRTID0ge1xuICAgIHJlbGF0aXZlTW9udGhWYWx1ZUtleTogJ3JlbGF0aXZlTW9udGhWYWx1ZScsXG4gICAgcHJldjogJ3ByZXYnLFxuICAgIHByZXZZZWFyOiAncHJldi15ZWFyJyxcbiAgICBwcmV2TW9udGg6ICdwcmV2LW1vbnRoJyxcbiAgICBuZXh0OiAnbmV4dCcsXG4gICAgbmV4dFllYXI6ICduZXh0LXllYXInLFxuICAgIG5leHRNb250aDogJ25leHQtbW9udGgnLFxuICAgIHNlbGVjdGVkOiAnc2VsZWN0ZWQnLFxuICAgIHRvZGF5OiAndG9kYXknLFxuICAgIGNsaWNrYWJsZTogJ2NsaWNrYWJsZS10aXRsZScsXG4gICAgY2FsZW5kYXJIZWFkZXI6IG51bGwsXG4gICAgY2FsZW5kYXJCb2R5OiBudWxsLFxuICAgIGNhbGVuZGFyRm9vdGVyOiBudWxsLFxuICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDogL2NhbGVuZGFyLS9nLFxuICAgIHRpdGxlUmVnRXhwOiAveXl5eXx5eXxtbXxtfE0vZyxcbiAgICB0aXRsZVllYXJSZWdFeHA6IC95eXl5fHl5L2csXG4gICAgdGl0bGVNb250aFJlZ0V4cDogL21tfG18TS9nLFxuICAgIHRvZGF5UmVnRXhwOiAveXl5eXx5eXxtbXxtfE18ZGR8ZHxEL2csXG4gICAgaXRlbUNvdW50T2ZZZWFyOiAxMixcbiAgICBsYXllcktleXM6IFsnZGF0ZScsICdtb250aCcsICd5ZWFyJ11cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5DT05TVEFOVFMuY2FsZW5kYXJIZWFkZXIgPSBbXG4gICAgJzxkaXYgY2xhc3M9XCJjYWxlbmRhci1oZWFkZXJcIj4nLFxuICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNhbGVuZGFyLXJvbGxvdmVyIGNhbGVuZGFyLWJ0bi0nICsgQ09OU1RBTlRTLnByZXYgKyAnXCI+UHJldjwvYT4nLFxuICAgICAgICAnPHN0cm9uZyBjbGFzcz1cImNhbGVuZGFyLXRpdGxlIGNhbGVuZGFyLWNsaWNrYWJsZS10aXRsZVwiPjwvc3Ryb25nPicsXG4gICAgICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiY2FsZW5kYXItcm9sbG92ZXIgY2FsZW5kYXItYnRuLScgKyBDT05TVEFOVFMubmV4dCArICdcIj5OZXh0PC9hPicsXG4gICAgJzwvZGl2PiddLmpvaW4oJycpO1xuXG5DT05TVEFOVFMuY2FsZW5kYXJCb2R5ID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItYm9keVwiPicsXG4gICAgICAgICc8dGFibGU+JyxcbiAgICAgICAgICAgICc8dGhlYWQ+JyxcbiAgICAgICAgICAgICAgICAnPHRyPicsXG4gICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImNhbGVuZGFyLXN1blwiPlN1PC90aD48dGg+TW88L3RoPjx0aD5UdTwvdGg+PHRoPldlPC90aD48dGg+VGg8L3RoPjx0aD5GYTwvdGg+PHRoIGNsYXNzPVwiY2FsZW5kYXItc2F0XCI+U2E8L3RoPicsXG4gICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICc8L3RoZWFkPicsXG4gICAgICAgICAgICAnPHRib2R5PicsXG4gICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImNhbGVuZGFyLXdlZWtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgJzwvdGFibGU+JyxcbiAgICAnPC9kaXY+JyxcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWJvZHlcIj4nLFxuICAgICAgICAnPHRhYmxlPicsXG4gICAgICAgICAgICAnPHRib2R5PicsXG4gICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImNhbGVuZGFyLW1vbnRoLWdyb3VwXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLW1vbnRoXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItbW9udGhcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1tb250aFwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgJzwvdGFibGU+JyxcbiAgICAnPC9kaXY+JyxcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWJvZHlcIj4nLFxuICAgICAgICAnPHRhYmxlPicsXG4gICAgICAgICAgICAnPHRib2R5PicsXG4gICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImNhbGVuZGFyLXllYXItZ3JvdXBcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXIteWVhclwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLXllYXJcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci15ZWFyXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICc8L3RyPicsXG4gICAgICAgICAgICAnPC90Ym9keT4nLFxuICAgICAgICAnPC90YWJsZT4nLFxuICAgICc8L2Rpdj4nXS5qb2luKCcnKTtcblxuQ09OU1RBTlRTLmNhbGVuZGFyRm9vdGVyID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItZm9vdGVyXCI+JyxcbiAgICAgICAgJzxwPuyYpOuKmCA8ZW0gY2xhc3M9XCJjYWxlbmRhci10b2RheVwiPjwvZW0+PC9wPicsXG4gICAgJzwvZGl2PiddLmpvaW4oJycpO1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IENPTlNUQU5UUztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbnN0YW50cy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9