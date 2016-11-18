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
	        var isReadyForDrawing = this.invoke('beforeDraw', dateForDrawing);
	        var shownLayerIdx;
	
	        /* ===============
	         * beforeDraw
	         * =================*/
	        if (!isReadyForDrawing) {
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
	 * @dependency tui-code-snippet ~1.0.2
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
	     * @function getDateHash
	     * @memberof calendarUtils
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
	     * @memberof calendarUtils
	     */
	    getToday: function() {
	        return utils.getDateHash();
	    },
	
	    /**
	     * Get weeks count by paramenter
	     * @function getWeeks
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} 주 (4~6)
	     * @memberof calendarUtils
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
	     * @returns {number}
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
	     * @returns {number} (0~6)
	     * @memberof calendarUtils
	     **/
	    getFirstDay: function(year, month) {
	        return new Date(year, month - 1, 1).getDay();
	    },
	
	    /**
	     * Get which day is last by parameters that include year and month information.
	     * @function getLastDay
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} (0~6)
	     * @memberof calendarUtils
	     **/
	    getLastDay: function(year, month) {
	        return new Date(year, month, 0).getDay();
	    },
	
	    /**
	     * Get last date by parameters that include year and month information.
	     * @function
	     * @param {number} year A year
	     * @param {number} month A month
	     * @returns {number} (1~31)
	     * @memberof calendarUtils
	     **/
	    getLastDate: function(year, month) {
	        return new Date(year, month, 0).getDate();
	    },
	
	    /**
	     * Get date instance.
	     * @function getDateObject
	     * @param {Object} date A date hash
	     * @returns {Date} Date
	     * @memberof calendarUtils
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
	     * @function getRelativeDate
	     * @param {number} year A related value for year(you can use +/-)
	     * @param {number} month A related value for month (you can use +/-)
	     * @param {number} date A related value for day (you can use +/-)
	     * @param {Object} dateObj standard date hash
	     * @returns {Object} dateObj
	     * @memberof calendarUtils
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
	     * @private
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
	     * @private
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGYzNmY1NDZmNGJiNWEzODI1NWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jYWxlbmRhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ05EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLGdCQUFlLFlBQVk7QUFDM0IsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFlLE9BQU87QUFDdEI7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFlLE1BQU07QUFDckI7QUFDQSxnQkFBZSxNQUFNO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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Z0JBQWUsT0FBTztBQUN0QixrQkFBaUI7QUFDakI7QUFDQTtBQUNBLDZDQUE0QztBQUM1Qyw2Q0FBNEM7QUFDNUMsOENBQTZDO0FBQzdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsT0FBTztBQUN0QixrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDck1BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidHVpLWNvbXBvbmVudC1jYWxlbmRhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3RcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZjM2ZjU0NmY0YmI1YTM4MjU1YiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbGVuZGFyID0gcmVxdWlyZSgnLi9jYWxlbmRhcicpO1xuXG50dWkudXRpbC5kZWZpbmVOYW1lc3BhY2UoJ3R1aS5jb21wb25lbnQnLCB7XG4gICAgQ2FsZW5kYXI6IENhbGVuZGFyXG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQGZpbGVvdmVydmlldyBDYWxlbmRhciBjb21wb25lbnQoZnJvbSBQdWcgY29tcG9uZW50KVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgTGFiIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGNhbGVuZGFyVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIHV0aWwgPSB0dWkudXRpbDtcbnZhciBiaW5kID0gdXRpbC5iaW5kO1xudmFyIGV4dGVuZCA9IHV0aWwuZXh0ZW5kO1xuXG4vKipcbiAqIENhbGVuZGFyIGNvbXBvbmVudCBjbGFzc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtIVE1MRWxlbWVudH0gb3B0aW9uLmVsZW1lbnQgQSByb290IGVsZW1lbnRcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi5jbGFzc1ByZWZpeD1cImNhbGVuZGFyLVwiXSBBIHByZWZpeCBjbGFzcyBmb3IgbWFya3VwIHN0cnVjdHVyZVxuICogICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLnllYXI9dGhpcyB5ZWFyXSBBIHllYXIgZm9yIGluaXRpYWxpemVcbiAqICAgICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5tb250aD10aGlzIG1vbnRoXSBBIG1vbnRoIGZvciBpbml0aWFsaXplXG4gKiAgICAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb24udGl0bGVGb3JtYXQ9XCJ5eXl5LW1tXCJdIEEgdGl0bGUgZm9ybWF0LlxuICogICAgICAgICAgICAgICAgICAgICBUaGlzIGNvbXBvbmVudCBmaW5kIHRpdGxlIGVsZW1lbnQgYnkgY2xhc3NOYW1lICdbcHJlZml4XXRpdGxlJ1xuICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9uLnRvZGF5Rm9ybWF0ID0gXCJ5eXl5IFllYXIgbW0gTW9udGggZGQgRGF5IChEKVwiXSBBIHRvZGF5IGZvcm1hdC5cbiAqICAgICAgICAgICAgICAgICAgICAgVGhpcyBjb21wb25lbnQgZmluZCB0b2RheSBlbGVtZW50IGJ5IGNsYXNzTmFtZSAnW3ByZWZpeF10b2RheSdcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi55ZWFyVGl0bGVGb3JtYXQgPSBcInl5eXlcIl0gQSB5ZWFyIHRpdGxlIGZvcm1hbnQuXG4gKiAgICAgICAgICAgICAgICAgICAgICBUaGlzIGNvbXBvbmVudCBmaW5kIHllYXIgdGl0bGUgZWxlbWVudCBieSBjbGFzc05hbWUgJ1twcmVmaXhdeWVhcidcbiAqICAgICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbi5tb250aFRpdGxlRm9ybWF0ID0gXCJtXCJdIEEgbW9udGggdGl0bGUgZm9ybWF0LlxuICogICAgICAgICAgICAgICAgICAgICBUaGlzIGNvbXBvbmVudCBmaW5kIG1vbnRoIHRpdGxlIGVsZW1lbnQgYnkgY2xhc3NOYW1l7J20ICdbcHJlZml4XW1vbnRoJ1xuICogICAgIEBwYXJhbSB7QXJyYXl9IFtvcHRpb24ubW9udGhUaXRsZXMgPSBbXCJKQU5cIixcIkZFQlwiLFwiTUFSXCIsXCJBUFJcIixcIk1BWVwiLFwiSlVOXCIsXCJKVUxcIixcIkFVR1wiLFwiU0VQXCIsXCJPQ1RcIixcIk5PVlwiLFwiREVDXCJdXVxuICogICAgICAgICAgICAgICAgICAgIEEgbGFiZWwgb2YgZWFjaCBtb250aC5cbiAqICAgICBAcGFyYW0ge0FycmF5fSBbb3B0aW9uLmRheVRpdGxlcyA9IFtcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXV0gQSBsYWJlbCBmb3IgZGF5LlxuICogICAgICAgICAgICAgICAgICAgIElmIHlvdSBzZXQgdGhlIG90aGVyIG9wdGlvbiB0b2RheUZvcm1hdCAnRCcsIHlvdSBjYW4gdXNlIHRoaXMgbmFtZS5cbiAqIEB0dXRvcmlhbCBzYW1wbGUxXG4gKiBAdHV0b3JpYWwgc2FtcGxlMlxuICogQHR1dG9yaWFsIHNhbXBsZTNcbiAqIEBleGFtcGxlXG4gKiB2YXIgY2FsZW5kYXIgPSBuZXcgdHVpLmNvbXBvbmVudC5DYWxlbmRhcih7XG4gKiAgICAgZWxlbWVudDogJyNsYXllcicsXG4gKiAgICAgY2xhc3NQcmVmaXg6IFwiY2FsZW5kYXItXCIsXG4gKiAgICAgeWVhcjogMTk4MyxcbiAqICAgICBtb250aDogNSxcbiAqICAgICB0aXRsZUZvcm1hdDogXCJ5eXl5LW1tXCIsIC8vIHRpdGxlXG4gKiAgICAgdG9kYXlGb3JtYXQ6IFwieXl5eSAvIG1tIC8gZGQgKEQpXCIgLy8gdG9kYXlcbiAqICAgICB5ZWFyVGl0bGVGb3JtYXQ6IFwieXl5eVwiLCAvLyB5ZWFyIHRpdGxlXG4gKiAgICAgbW9udGhUaXRsZUZvcm1hdDogXCJtXCIsIC8vIG1vbnRoIHRpdGxlXG4gKiAgICAgbW9udGhUaXRsZXM6IFtcIkpBTlwiLCBcIkZFQlwiLCBcIk1BUlwiLCBcIkFQUlwiLCBcIk1BWVwiLCBcIkpVTlwiLCBcIkpVTFwiLCBcIkFVR1wiLCBcIlNFUFwiLCBcIk9DVFwiLCBcIk5PVlwiLCBcIkRFQ1wiXSxcbiAqICAgICBkYXlUaXRsZXM6IFsnc3VuJywgJ21vbicsICd0dWUnLCAnd2VkJywgJ3RodScsICdmcmknLCAnc2F0J10gLy8gZGF5c1xuICogICAgIGl0ZW1Db3VudE9mWWVhcjogMTJcbiAqIH0pO1xuICovXG52YXIgQ2FsZW5kYXIgPSB1dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgQ2FsZW5kYXIucHJvdG90eXBlICovIHtcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCBvcHRpb25zXG4gICAgICAgICAqIG9wdGlvbjoge1xuICAgICAgICAgKiAgICAgY2xhc3NQcmVmaXg6IHN0cmluZyxcbiAgICAgICAgICogICAgIHllYXI6IG51bWJlclxuICAgICAgICAgKiAgICAgbW9udGg6IG51bWJlclxuICAgICAgICAgKiAgICAgdGl0bGVGb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICogICAgIHRvZGF5Rm9ybWF0OiBzdHJpbmcsXG4gICAgICAgICAqICAgICB5ZWFyVGl0bGVGb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICogICAgIG1vbnRoVGl0bGVGb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICogICAgIG1vbnRoVGl0bGVzOiBBcnJheSxcbiAgICAgICAgICogICAgIGRheVRpdGxlczogQXJyYXksXG4gICAgICAgICAqICAgICBpdGVtQ291bnRPZlllYXI6IG51bWJlclxuICAgICAgICAgKiB9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXkgdGhhdCBpcyBzaG93blxuICAgICAgICAgKiBAdHlwZSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9zaG93bkRhdGUgPSB7XG4gICAgICAgICAgICB5ZWFyOiAwLFxuICAgICAgICAgICAgbW9udGg6IDEsXG4gICAgICAgICAgICBkYXRlOiAxXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICogalF1ZXJ5IC0gSFRNTEVsZW1lbnRcbiAgICAgICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiA9PT09PT09PT1Sb290IEVsZW1lbnQ9PT09PT09PT1cbiAgICAgICAgICogSWYgb3B0aW9ucyBkbyBub3QgaW5jbHVkZSBlbGVtZW50LCB0aGlzIGNvbXBvbmVudCBqZWRnZSBpbml0aWFsaXplIGVsZW1lbnQgd2l0aG91dCBvcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChvcHRpb24uZWxlbWVudCB8fCBhcmd1bWVudHNbMF0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiA9PT09PT09PT1IZWFkZXI9PT09PT09PT1cbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGhlYWRlciA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgdGlsdGVcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJHRpdGxlID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB5ZWFyIHRpdGxlXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR0aXRsZVllYXIgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG1vbnRoIHRpdGxlXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR0aXRsZU1vbnRoID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogPT09PT09PT09Qm9keT09PT09PT09PVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kYm9keSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgdGVtcGxhdGUgb2Ygd2Vla1xuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kd2Vla1RlbXBsYXRlID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB3ZWVrIHBhcmVudCBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRlIGVsZW1lbnRcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuXyRkYXRlRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGF0ZSB3cmFwcGVyIGVsZW1lbnRcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuXyRkYXRlQ29udGFpbmVyRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqID09PT09PT09PUZvb3Rlcj09PT09PT09PVxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kZm9vdGVyID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9kYXkgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4kdG9kYXkgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRleCBvZiBzaG93biBsYXllclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zaG93bkxheWVySWR4ID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGF0YSBvZiBtb250aCdzIGxheWVyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGF0YSBvZiB5ZWFyJ3MgbGF5ZXJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGF0YU9mWWVhckxheWVyID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgdGl0bGUgaXMgY2xpY2thYmxlIG9yIG5vdFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNDbGlja2FibGVUaXRsZSA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVycyBiaW5kaW5nIGNvbnRleHRcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcblxuICAgICAgICAvKiogU2V0IGRlZmF1bHQgb3B0aW9ucyAqL1xuICAgICAgICB0aGlzLl9zZXREZWZhdWx0KG9wdGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZ1bGF0IG9waXRvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbl0gQSBvcHRpb25zIHRvIGluaXRpYWx6aWUgY29tcG9uZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0RGVmYXVsdDogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX3NldE9wdGlvbihvcHRpb24pO1xuICAgICAgICB0aGlzLl9hc3NpZ25IVE1MRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5fYXR0YWNoRXZlbnQoKTtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuX29wdGlvbi55ZWFyLCB0aGlzLl9vcHRpb24ubW9udGgsIGZhbHNlLCAwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2F2ZSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25dIEEgb3B0aW9ucyB0byBpbml0aWFsaXplIGNvbXBvbmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldE9wdGlvbjogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZU9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHRvZGF5ID0gY2FsZW5kYXJVdGlscy5nZXREYXRlSGFzaFRhYmxlKCk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb24gPSB7XG4gICAgICAgICAgICBjbGFzc1ByZWZpeDogJ2NhbGVuZGFyLScsXG4gICAgICAgICAgICB5ZWFyOiB0b2RheS55ZWFyLFxuICAgICAgICAgICAgbW9udGg6IHRvZGF5Lm1vbnRoLFxuICAgICAgICAgICAgdGl0bGVGb3JtYXQ6ICd5eXl5LW1tJyxcbiAgICAgICAgICAgIHRvZGF5Rm9ybWF0OiAneXl5eS9tbS9kZCAoRCknLFxuICAgICAgICAgICAgeWVhclRpdGxlRm9ybWF0OiAneXl5eScsXG4gICAgICAgICAgICBtb250aFRpdGxlRm9ybWF0OiAnbScsXG4gICAgICAgICAgICBtb250aFRpdGxlczogWydKQU4nLCAnRkVCJywgJ01BUicsICdBUFInLCAnTUFZJywgJ0pVTicsICdKVUwnLCAnQVVHJywgJ1NFUCcsICdPQ1QnLCAnTk9WJywgJ0RFQyddLFxuICAgICAgICAgICAgZGF5VGl0bGVzOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxuICAgICAgICAgICAgaXRlbUNvdW50T2ZZZWFyOiBDT05TVEFOVFMuaXRlbUNvdW50T2ZZZWFyXG4gICAgICAgIH07XG4gICAgICAgIGV4dGVuZChpbnN0YW5jZU9wdGlvbiwgZGVmYXVsdE9wdGlvbiwgb3B0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGVsZW1lbnQgdG8gZmlsZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25IVE1MRWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXgsXG4gICAgICAgICAgICAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgICBjbGFzc1NlbGVjdG9yID0gJy4nICsgY2xhc3NQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduSGVhZGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgICAgIHRoaXMuX2Fzc2lnbkJvZHkoJGVsZW1lbnQsIGNsYXNzU2VsZWN0b3IsIGNsYXNzUHJlZml4KTtcbiAgICAgICAgdGhpcy5fYXNzaWduRm9vdGVyKCRlbGVtZW50LCBjbGFzc1NlbGVjdG9yLCBjbGFzc1ByZWZpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGhlYWRlciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduSGVhZGVyOiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRoZWFkZXIgPSAkZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnaGVhZGVyJyksXG4gICAgICAgICAgICBoZWFkZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCxcbiAgICAgICAgICAgIGtleSA9IENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXksXG4gICAgICAgICAgICBidG5DbGFzc05hbWUgPSAnYnRuLSc7XG5cbiAgICAgICAgaWYgKCEkaGVhZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgaGVhZGVyVGVtcGxhdGUgPSBDT05TVEFOVFMuY2FsZW5kYXJIZWFkZXI7XG4gICAgICAgICAgICBkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAgPSBDT05TVEFOVFMuZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwO1xuXG4gICAgICAgICAgICAkaGVhZGVyID0gJChoZWFkZXJUZW1wbGF0ZS5yZXBsYWNlKGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCwgY2xhc3NQcmVmaXgpKTtcbiAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZCgkaGVhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1dHRvblxuICAgICAgICAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIGJ0bkNsYXNzTmFtZSArIENPTlNUQU5UUy5wcmV2WWVhcikuZGF0YShrZXksIC0xMik7XG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLnByZXZNb250aCkuZGF0YShrZXksIC0xKTtcbiAgICAgICAgJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBidG5DbGFzc05hbWUgKyBDT05TVEFOVFMubmV4dFllYXIpLmRhdGEoa2V5LCAxMik7XG4gICAgICAgICRoZWFkZXIuZmluZChjbGFzc1NlbGVjdG9yICsgYnRuQ2xhc3NOYW1lICsgQ09OU1RBTlRTLm5leHRNb250aCkuZGF0YShrZXksIDEpO1xuXG4gICAgICAgIC8vIHRpdGxlIHRleHRcbiAgICAgICAgdGhpcy4kdGl0bGUgPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZScpO1xuICAgICAgICB0aGlzLiR0aXRsZVllYXIgPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZS15ZWFyJyk7XG4gICAgICAgIHRoaXMuJHRpdGxlTW9udGggPSAkaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArICd0aXRsZS1tb250aCcpO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlciA9ICRoZWFkZXI7XG5cbiAgICAgICAgaWYgKHRoaXMuJHRpdGxlLmhhc0NsYXNzKHRoaXMuX29wdGlvbi5jbGFzc1ByZWZpeCArIENPTlNUQU5UUy5jbGlja2FibGUpKSB7XG4gICAgICAgICAgICB0aGlzLmlzQ2xpY2thYmxlVGl0bGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvZHkgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbG1lbnQgb2YgY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzU2VsZWN0b3IgQSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ByZWZpeCBBIHByZWZpeCBmb3IgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Cb2R5OiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRib2R5ID0gJGVsZW1lbnQuZmluZChjbGFzc1NlbGVjdG9yICsgJ2JvZHknKSxcbiAgICAgICAgICAgIGJvZHlUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICBpZiAoISRib2R5Lmxlbmd0aCkge1xuICAgICAgICAgICAgYm9keVRlbXBsYXRlID0gQ09OU1RBTlRTLmNhbGVuZGFyQm9keTtcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCA9IENPTlNUQU5UUy5kZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHA7XG5cbiAgICAgICAgICAgICRib2R5ID0gJChib2R5VGVtcGxhdGUucmVwbGFjZShkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHAsIGNsYXNzUHJlZml4KSk7XG4gICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoJGJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYXNzaWduV2VlayhjbGFzc1NlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5fYXNzaWduTW9udGhMYXllcihjbGFzc1NlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5fYXNzaWduWWVhckxheWVyKGNsYXNzU2VsZWN0b3IpO1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkYm9keS5oaWRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIHdlZWsgZWxlbW50IG9uIGJvZHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NTZWxlY3RvciBBIHNlbGVjdG9yXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduV2VlazogZnVuY3Rpb24oY2xhc3NTZWxlY3Rvcikge1xuICAgICAgICB2YXIgJGJvZHkgPSB0aGlzLiRlbGVtZW50LmZpbmQoY2xhc3NTZWxlY3RvciArICdib2R5Jyk7XG4gICAgICAgIHZhciAkd2Vla1RlbXBsYXRlID0gJGJvZHkuZmluZChjbGFzc1NlbGVjdG9yICsgJ3dlZWsnKTtcblxuICAgICAgICB0aGlzLiR3ZWVrVGVtcGxhdGUgPSAkd2Vla1RlbXBsYXRlLmNsb25lKHRydWUpO1xuICAgICAgICB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0ID0gJHdlZWtUZW1wbGF0ZS5wYXJlbnQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZWxlbWVudCBvZiBtb250aCdzIGxheWVyIGFuZCBzYXZlIGRyYXdpbmcgaW5mb1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25Nb250aExheWVyOiBmdW5jdGlvbihjbGFzc1NlbGVjdG9yKSB7XG4gICAgICAgIHZhciAkYm9keSA9IHRoaXMuJGVsZW1lbnQuZmluZChjbGFzc1NlbGVjdG9yICsgJ2JvZHknKTtcbiAgICAgICAgdmFyICRtb250aHNUZW1wbGF0ZSA9ICRib2R5LmZpbmQoY2xhc3NTZWxlY3RvciArICdtb250aC1ncm91cCcpO1xuICAgICAgICB2YXIgY29scyA9ICRtb250aHNUZW1wbGF0ZS5maW5kKGNsYXNzU2VsZWN0b3IgKyAnbW9udGgnKS5sZW5ndGg7XG4gICAgICAgIHZhciByb3dzID0gTWF0aC5jZWlsKHRoaXMuX29wdGlvbi5tb250aFRpdGxlcy5sZW5ndGggLyBjb2xzKTtcblxuICAgICAgICB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJG1vbnRoc1RlbXBsYXRlLmNsb25lKHRydWUpLFxuICAgICAgICAgICAgYXBwZW5kZWRUYXJnZXQ6ICRtb250aHNUZW1wbGF0ZS5wYXJlbnQoKSxcbiAgICAgICAgICAgIGZyYW1lOiB7XG4gICAgICAgICAgICAgICAgY29sczogY29scyxcbiAgICAgICAgICAgICAgICByb3dzOiByb3dzXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGVsZW1lbnQgb2YgeWVhcidzIGxheWVyIGFuZCBzYXZlIGRyYXdpbmcgaW5mb1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hc3NpZ25ZZWFyTGF5ZXI6IGZ1bmN0aW9uKGNsYXNzU2VsZWN0b3IpIHtcbiAgICAgICAgdmFyICRib2R5ID0gdGhpcy4kZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnYm9keScpO1xuICAgICAgICB2YXIgJHllYXJzVGVtcGxhdGUgPSAkYm9keS5maW5kKGNsYXNzU2VsZWN0b3IgKyAneWVhci1ncm91cCcpO1xuICAgICAgICB2YXIgY29scyA9ICR5ZWFyc1RlbXBsYXRlLmZpbmQoY2xhc3NTZWxlY3RvciArICd5ZWFyJykubGVuZ3RoO1xuICAgICAgICB2YXIgcm93cyA9IE1hdGguY2VpbCh0aGlzLl9vcHRpb24uaXRlbUNvdW50T2ZZZWFyIC8gY29scyk7XG5cbiAgICAgICAgdGhpcy5kYXRhT2ZZZWFyTGF5ZXIgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJHllYXJzVGVtcGxhdGUuY2xvbmUodHJ1ZSksXG4gICAgICAgICAgICBhcHBlbmRlZFRhcmdldDogJHllYXJzVGVtcGxhdGUucGFyZW50KCksXG4gICAgICAgICAgICBmcmFtZToge1xuICAgICAgICAgICAgICAgIGNvbHM6IGNvbHMsXG4gICAgICAgICAgICAgICAgcm93czogcm93c1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBmb290ZXIgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudCBUaGUgcm9vdCBlbGVtZW50IG9mIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1NlbGVjdG9yIEEgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NQcmVmaXggQSBwcmVmaXggZm9yIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXNzaWduRm9vdGVyOiBmdW5jdGlvbigkZWxlbWVudCwgY2xhc3NTZWxlY3RvciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyICRmb290ZXIgPSAkZWxlbWVudC5maW5kKGNsYXNzU2VsZWN0b3IgKyAnZm9vdGVyJyksXG4gICAgICAgICAgICBmb290ZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cDtcblxuICAgICAgICBpZiAoISRmb290ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb290ZXJUZW1wbGF0ZSA9IENPTlNUQU5UUy5jYWxlbmRhckZvb3RlcjtcbiAgICAgICAgICAgIGRlZmF1bHRDbGFzc1ByZWZpeFJlZ0V4cCA9IENPTlNUQU5UUy5kZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHA7XG5cbiAgICAgICAgICAgICRmb290ZXIgPSAkKGZvb3RlclRlbXBsYXRlLnJlcGxhY2UoZGVmYXVsdENsYXNzUHJlZml4UmVnRXhwLCBjbGFzc1ByZWZpeCkpO1xuICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKCRmb290ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHRvZGF5ID0gJGZvb3Rlci5maW5kKGNsYXNzU2VsZWN0b3IgKyAndG9kYXknKTtcbiAgICAgICAgdGhpcy4kZm9vdGVyID0gJGZvb3RlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGV2ZW50IGhhbmRsZXJzIGFuZCBhdHRhY2ggZXZlbnQgb24gZWxlbWVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2F0dGFjaEV2ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5jbGlja1JvbGxvdmVyQnRuID0gYmluZCh0aGlzLl9vbkNsaWNrUm9sbG92ZXJCdXR0b24sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRUb1JvbGxvdmVyQnRuKCk7XG5cbiAgICAgICAgZXh0ZW5kKHRoaXMuaGFuZGxlcnMsIHtcbiAgICAgICAgICAgIGNsaWNrVGl0bGU6IGJpbmQodGhpcy5fb25DbGlja1RpdGxlLCB0aGlzKSxcbiAgICAgICAgICAgIGNsaWNrWWVhckxheWVyOiBiaW5kKHRoaXMuX29uQ2xpY2tZZWFyTGF5ZXIsIHRoaXMpLFxuICAgICAgICAgICAgY2xpY2tNb250aExheWVyOiBiaW5kKHRoaXMuX29uQ2xpY2tNb250aExheWVyLCB0aGlzKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pc0NsaWNrYWJsZVRpdGxlKSB7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaEV2ZW50VG9UaXRsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRUb0JvZHkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGV2ZW50IG9uIHJvbGxvdmVyIGJ1dHRvbnMgaW4gXCJoZWFkZXJcIiBlbGVtZW50XG4gICAgICovXG4gICAgYXR0YWNoRXZlbnRUb1JvbGxvdmVyQnRuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gJy4nICsgdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4ICsgJ3JvbGxvdmVyJztcbiAgICAgICAgdmFyIGJ0bnMgPSB0aGlzLiRoZWFkZXIuZmluZChzZWxlY3Rvcik7XG5cbiAgICAgICAgYnRucy5vbignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrUm9sbG92ZXJCdG4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXRhY2ggZXZlbnQgb24gcm9sbG92ZXIgYnV0dG9ucyBpbiBcImhlYWRlclwiIGVsZW1lbnRcbiAgICAgKi9cbiAgICBkZXRhY2hFdmVudFRvUm9sbG92ZXJCdG46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZWN0b3IgPSAnLicgKyB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXggKyAncm9sbG92ZXInO1xuICAgICAgICB2YXIgYnRucyA9IHRoaXMuJGhlYWRlci5maW5kKHNlbGVjdG9yKTtcblxuICAgICAgICBidG5zLm9mZignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrUm9sbG92ZXJCdG4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggZXZlbnQgb24gdGl0bGUgaW4gXCJoZWFkZXJcIiBlbGVtZW50XG4gICAgICovXG4gICAgYXR0YWNoRXZlbnRUb1RpdGxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kdGl0bGUub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVycy5jbGlja1RpdGxlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0YWNoIGV2ZW50IG9uIHRpdGxlIGluIFwiaGVhZGVyXCIgZWxlbWVudFxuICAgICAqL1xuICAgIGRldGFjaEV2ZW50VG9UaXRsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHRpdGxlLm9mZignY2xpY2snLCB0aGlzLmhhbmRsZXJzLmNsaWNrVGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggZXZlbnQgb24gdGl0bGUgaW4gXCJib2R5XCIgZWxlbWVudCAobW9udGggJiB5ZWFyIGxheWVyKVxuICAgICAqL1xuICAgIGF0dGFjaEV2ZW50VG9Cb2R5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNsYXNzUHJlZml4ID0gJy4nICsgdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4O1xuICAgICAgICB2YXIgeWVhckxheWVyID0gdGhpcy5kYXRhT2ZZZWFyTGF5ZXIuYXBwZW5kZWRUYXJnZXQ7XG4gICAgICAgIHZhciBtb250aExheWVyID0gdGhpcy5kYXRhT2ZNb250aExheWVyLmFwcGVuZGVkVGFyZ2V0O1xuXG4gICAgICAgIHllYXJMYXllci5vbignY2xpY2snLCBjbGFzc1ByZWZpeCArICd5ZWFyJywgdGhpcy5oYW5kbGVycy5jbGlja1llYXJMYXllcik7XG4gICAgICAgIG1vbnRoTGF5ZXIub24oJ2NsaWNrJywgY2xhc3NQcmVmaXggKyAnbW9udGgnLCB0aGlzLmhhbmRsZXJzLmNsaWNrTW9udGhMYXllcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGFjaCBldmVudCBvbiB0aXRsZSBpbiBcImJvZHlcIiBlbGVtZW50IChtb250aCAmIHllYXIgbGF5ZXIpXG4gICAgICovXG4gICAgZGV0YWNoRXZlbnRUb0JvZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSAnLicgKyB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXg7XG4gICAgICAgIHZhciB5ZWFyTGF5ZXIgPSB0aGlzLmRhdGFPZlllYXJMYXllci5hcHBlbmRlZFRhcmdldDtcbiAgICAgICAgdmFyIG1vbnRoTGF5ZXIgPSB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIuYXBwZW5kZWRUYXJnZXQ7XG5cbiAgICAgICAgeWVhckxheWVyLm9mZignY2xpY2snLCBjbGFzc1ByZWZpeCArICd5ZWFyJywgdGhpcy5oYW5kbGVycy5jbGlja1llYXJMYXllcik7XG4gICAgICAgIG1vbnRoTGF5ZXIub2ZmKCdjbGljaycsIGNsYXNzUHJlZml4ICsgJ21vbnRoJywgdGhpcy5oYW5kbGVycy5jbGlja01vbnRoTGF5ZXIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIC0gY2xpY2sgb24gcm9sbG92ZXIgYnV0dG9uc1xuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tSb2xsb3ZlckJ1dHRvbjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHJlbGF0aXZlTW9udGhWYWx1ZSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShDT05TVEFOVFMucmVsYXRpdmVNb250aFZhbHVlS2V5KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5kcmF3KDAsIHJlbGF0aXZlTW9udGhWYWx1ZSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgLSBjbGljayBvbiB0aXRsZVxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tUaXRsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHNob3duTGF5ZXJJZHggPSB0aGlzLnNob3duTGF5ZXJJZHg7XG4gICAgICAgIHZhciBkYXRlO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHNob3duTGF5ZXJJZHggPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3duTGF5ZXJJZHggPSAoc2hvd25MYXllcklkeCAhPT0gMikgPyAoc2hvd25MYXllcklkeCArIDEpIDogMDtcbiAgICAgICAgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhdyhkYXRlLnllYXIsIGRhdGUubW9udGgsIGZhbHNlLCBzaG93bkxheWVySWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciAtIGNsaWNrIG9uIG1vbnRoJ3MgbGF5ZXJcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gTW91c2UgZXZlbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbkNsaWNrWWVhckxheWVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcmVsYXRpdmVNb250aFZhbHVlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRyYXcoMCwgcmVsYXRpdmVNb250aFZhbHVlLCB0cnVlLCAxKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciAtIGNsaWNrIG9uIHllYXIncyBsYXllclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uQ2xpY2tNb250aExheWVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcmVsYXRpdmVNb250aFZhbHVlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXkpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRyYXcoMCwgcmVsYXRpdmVNb250aFZhbHVlLCB0cnVlLCAwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IEhhc2ggZGF0YSB0byBkcm93IGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1JlbGF0aXZlXSAgV2hldGhlciBpcyByZWxhdGVkIG90aGVyIHZhbHVlIG9yIG5vdFxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX0gQSBkYXRlIGhhc2hcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXREYXRlRm9yRHJhd2luZzogZnVuY3Rpb24oeWVhciwgbW9udGgsIGlzUmVsYXRpdmUpIHtcbiAgICAgICAgdmFyIG5EYXRlID0gdGhpcy5nZXREYXRlKCksXG4gICAgICAgICAgICByZWxhdGl2ZURhdGU7XG5cbiAgICAgICAgbkRhdGUuZGF0ZSA9IDE7XG4gICAgICAgIGlmICghdXRpbC5pc051bWJlcih5ZWFyKSAmJiAhdXRpbC5pc051bWJlcihtb250aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuRGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7XG4gICAgICAgICAgICByZWxhdGl2ZURhdGUgPSBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSh5ZWFyLCBtb250aCwgMCwgbkRhdGUpO1xuICAgICAgICAgICAgbkRhdGUueWVhciA9IHJlbGF0aXZlRGF0ZS55ZWFyO1xuICAgICAgICAgICAgbkRhdGUubW9udGggPSByZWxhdGl2ZURhdGUubW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuRGF0ZS55ZWFyID0geWVhciB8fCBuRGF0ZS55ZWFyO1xuICAgICAgICAgICAgbkRhdGUubW9udGggPSBtb250aCB8fCBuRGF0ZS5tb250aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuRGF0ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSnVkZ2UgdG8gcmVkcmF3IGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmVmbG93XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNOZWNlc3NhcnlGb3JEcmF3aW5nOiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICB2YXIgc2hvd25EYXRlID0gdGhpcy5fc2hvd25EYXRlO1xuXG4gICAgICAgIHJldHVybiAoc2hvd25EYXRlLnllYXIgIT09IHllYXIgfHwgc2hvd25EYXRlLm1vbnRoICE9PSBtb250aCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgY2FsZW5kYXIgdGV4dFxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIFRoYSBoYXNoIHRoYXQgc2hvdyB1cCBvbiBjYWxlbmRhclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldENhbGVuZGFyVGV4dDogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyLFxuICAgICAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcblxuICAgICAgICB0aGlzLl9zZXRDYWxlbmRhclRvZGF5KCk7XG4gICAgICAgIHRoaXMuX3NldENhbGVuZGFyVGl0bGUoeWVhciwgbW9udGgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGRhdGVzIGJ5IG1vbnRoLlxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIEEgZGF0ZSB0byBkcmF3XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IEEgY2xhc3MgcHJlZml4XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZHJhd0RhdGVzOiBmdW5jdGlvbihkYXRlRm9yRHJhd2luZywgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyLFxuICAgICAgICAgICAgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aCxcbiAgICAgICAgICAgIGRheUluV2VlayA9IDAsXG4gICAgICAgICAgICBkYXRlUHJldk1vbnRoID0gY2FsZW5kYXJVdGlscy5nZXRSZWxhdGl2ZURhdGUoMCwgLTEsIDAsIGRhdGVGb3JEcmF3aW5nKSxcbiAgICAgICAgICAgIGRhdGVOZXh0TW9udGggPSBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAxLCAwLCBkYXRlRm9yRHJhd2luZyksXG4gICAgICAgICAgICBkYXRlcyA9IFtdLFxuICAgICAgICAgICAgZmlyc3REYXkgPSBjYWxlbmRhclV0aWxzLmdldEZpcnN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGluZGV4T2ZMYXN0RGF0ZSA9IHRoaXMuX2ZpbGxEYXRlcyh5ZWFyLCBtb250aCwgZGF0ZXMpO1xuXG4gICAgICAgIHV0aWwuZm9yRWFjaChkYXRlcywgZnVuY3Rpb24oZGF0ZSwgaSkge1xuICAgICAgICAgICAgdmFyIGlzUHJldk1vbnRoID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0TW9udGggPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lciA9ICQodGhpcy5fJGRhdGVDb250YWluZXJFbGVtZW50W2ldKSxcbiAgICAgICAgICAgICAgICB0ZW1wWWVhciA9IHllYXIsXG4gICAgICAgICAgICAgICAgdGVtcE1vbnRoID0gbW9udGgsXG4gICAgICAgICAgICAgICAgZXZlbnREYXRhO1xuXG4gICAgICAgICAgICBpZiAoaSA8IGZpcnN0RGF5KSB7XG4gICAgICAgICAgICAgICAgaXNQcmV2TW9udGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLnByZXZNb250aCk7XG4gICAgICAgICAgICAgICAgdGVtcFllYXIgPSBkYXRlUHJldk1vbnRoLnllYXI7XG4gICAgICAgICAgICAgICAgdGVtcE1vbnRoID0gZGF0ZVByZXZNb250aC5tb250aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IGluZGV4T2ZMYXN0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGlzTmV4dE1vbnRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy5uZXh0TW9udGgpO1xuICAgICAgICAgICAgICAgIHRlbXBZZWFyID0gZGF0ZU5leHRNb250aC55ZWFyO1xuICAgICAgICAgICAgICAgIHRlbXBNb250aCA9IGRhdGVOZXh0TW9udGgubW9udGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlZWtlbmRcbiAgICAgICAgICAgIHRoaXMuX3NldFdlZWtlbmQoZGF5SW5XZWVrLCAkZGF0ZUNvbnRhaW5lciwgY2xhc3NQcmVmaXgpO1xuXG4gICAgICAgICAgICAvLyBUb2RheVxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzVG9kYXkodGVtcFllYXIsIHRlbXBNb250aCwgZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArICd0b2RheScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgJGRhdGU6ICQodGhpcy5fJGRhdGVFbGVtZW50LmdldChpKSksXG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXI6ICRkYXRlQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHllYXI6IHRlbXBZZWFyLFxuICAgICAgICAgICAgICAgIG1vbnRoOiB0ZW1wTW9udGgsXG4gICAgICAgICAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgICAgICAgICBpc1ByZXZNb250aDogaXNQcmV2TW9udGgsXG4gICAgICAgICAgICAgICAgaXNOZXh0TW9udGg6IGlzTmV4dE1vbnRoLFxuICAgICAgICAgICAgICAgIGh0bWw6IGRhdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkKGV2ZW50RGF0YS4kZGF0ZSkuaHRtbChldmVudERhdGEuaHRtbC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGRheUluV2VlayA9IChkYXlJbldlZWsgKyAxKSAlIDc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmlyZSBkcmF3IGV2ZW50IHdoZW4gY2FsZW5kYXIgZHJhdyBlYWNoIGRhdGUuXG4gICAgICAgICAgICAgKiBAYXBpXG4gICAgICAgICAgICAgKiBAZXZlbnQgQ2FsZW5kYXIjZHJhd1xuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQSBuYW1lIG9mIGN1c3RvbSBldmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc1ByZXZNb250aCBXaGV0aGVyIHRoZSBkcmF3IGRheSBpcyBsYXN0IG1vbnRoIG9yIG5vdFxuICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc05leHRNb250aCBXZWh0ZXIgdGhlIGRyYXcgZGF5IGlzIG5leHQgbW9udGggb3Igbm90XG4gICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRhdGUgVGhlIGVsZW1lbnQgaGF2ZSBkYXRlIGh0bWxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZGF0ZUNvbnRhaW5lciBDaGlsZCBlbGVtZW50IHRoYXQgaGFzIGNsYXNzTmFtZSBbcHJlZml4XXdlZWsuXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXQgaXMgcG9zc2libGUgdGhpcyBlbGVtZW50IGVxdWVsIGVsRGF0ZS5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIEEgZHJhdyBkYXRlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggQSBkcmF3IG1vbnRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIGRyYXcgeWVhclxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgQSBodG1sIHN0cmluZ1xuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIC8vIGRyYXcgY3VzdG9tIGV2ZW4gaGFuZGxlcnNcbiAgICAgICAgICAgICAqIGNhbGVuZGFyLm9uKCdkcmF3JywgZnVuY3Rpb24oZHJhd0V2ZW50KXsgLi4uIH0pO1xuICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgdGhpcy5maXJlKCdkcmF3JywgZXZlbnREYXRhKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEplZGdlIHRoZSBpbnB1dCBkYXRlIGlzIHRvZGF5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSBkYXRlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNUb2RheTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIHRvZGF5ID0gY2FsZW5kYXJVdGlscy5nZXREYXRlSGFzaFRhYmxlKCk7XG4gICAgICAgIHZhciBpc1llYXIgPSB5ZWFyID8gKHRvZGF5LnllYXIgPT09IHllYXIpIDogdHJ1ZTtcbiAgICAgICAgdmFyIGlzTW9udGggPSBtb250aCA/ICh0b2RheS5tb250aCA9PT0gbW9udGgpIDogdHJ1ZTtcbiAgICAgICAgdmFyIGlzRGF0ZSA9IGRhdGUgPyAodG9kYXkuZGF0ZSA9PT0gZGF0ZSkgOiB0cnVlO1xuXG4gICAgICAgIHJldHVybiBpc1llYXIgJiYgaXNNb250aCAmJiBpc0RhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1ha2Ugb25lIHdlZWsgdGVtcGF0ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRXZWVrczogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyICRlbFdlZWssXG4gICAgICAgICAgICB3ZWVrcyA9IGNhbGVuZGFyVXRpbHMuZ2V0V2Vla3MoeWVhciwgbW9udGgpLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHdlZWtzOyBpICs9IDEpIHtcbiAgICAgICAgICAgICRlbFdlZWsgPSB0aGlzLiR3ZWVrVGVtcGxhdGUuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICAkZWxXZWVrLmFwcGVuZFRvKHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQpO1xuICAgICAgICAgICAgdGhpcy5fd2Vla0VsZW1lbnRzLnB1c2goJGVsV2Vlayk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2F2ZSBkcmF3IGRhdGVzIHRvIGFycmF5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHllYXIgQSBkcmF3IHllYXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9udGggQSBkcmF3IG1vbnRoXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGF0ZXMgQSBkcmF3IGRhdGVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiBsYXN0IGRhdGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9maWxsRGF0ZXM6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlcykge1xuICAgICAgICB2YXIgZmlyc3REYXkgPSBjYWxlbmRhclV0aWxzLmdldEZpcnN0RGF5KHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGxhc3REYXkgPSBjYWxlbmRhclV0aWxzLmdldExhc3REYXkoeWVhciwgbW9udGgpLFxuICAgICAgICAgICAgbGFzdERhdGUgPSBjYWxlbmRhclV0aWxzLmdldExhc3REYXRlKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgIGRhdGVQcmV2TW9udGggPSBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAtMSwgMCwge1xuICAgICAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgICAgIGRhdGU6IDFcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcHJldk1vbnRoTGFzdERhdGUgPSBjYWxlbmRhclV0aWxzLmdldExhc3REYXRlKGRhdGVQcmV2TW9udGgueWVhciwgZGF0ZVByZXZNb250aC5tb250aCksXG4gICAgICAgICAgICBpbmRleE9mTGFzdERhdGUsXG4gICAgICAgICAgICBpO1xuXG4gICAgICAgIGlmIChmaXJzdERheSA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IHByZXZNb250aExhc3REYXRlIC0gZmlyc3REYXk7IGkgPCBwcmV2TW9udGhMYXN0RGF0ZTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0ZXMucHVzaChpICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxhc3REYXRlICsgMTsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRlcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIGluZGV4T2ZMYXN0RGF0ZSA9IGRhdGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCA3IC0gbGFzdERheTsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRlcy5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4T2ZMYXN0RGF0ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHdlZWtlbmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF5IEEgZGF0ZVxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZGF0ZUNvbnRhaW5lciBBIGNvbnRhaW5lciBlbGVtZW50IGZvciBkYXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IEEgcHJlZml4IG9mIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0V2Vla2VuZDogZnVuY3Rpb24oZGF5LCAkZGF0ZUNvbnRhaW5lciwgY2xhc3NQcmVmaXgpIHtcbiAgICAgICAgaWYgKGRheSA9PT0gMCkge1xuICAgICAgICAgICAgJGRhdGVDb250YWluZXIuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyAnc3VuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF5ID09PSA2KSB7XG4gICAgICAgICAgICAkZGF0ZUNvbnRhaW5lci5hZGRDbGFzcyhjbGFzc1ByZWZpeCArICdzYXQnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBjYWxlbmRhclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fd2Vla0VsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuJHdlZWtBcHBlbmRUYXJnZXQuZW1wdHkoKTtcbiAgICAgICAgdGhpcy5kYXRhT2ZNb250aExheWVyLmFwcGVuZGVkVGFyZ2V0LmVtcHR5KCk7XG4gICAgICAgIHRoaXMuZGF0YU9mWWVhckxheWVyLmFwcGVuZGVkVGFyZ2V0LmVtcHR5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgdGl0bGUgd2l0aCBmb3JtYXQgb3B0aW9uLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgdmFsdWUgb2YgeWVhciAoZXguIDIwMDgpXG4gICAgICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IG1vbnRoIEEgbW9udGggKDEgfiAxMilcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqKi9cbiAgICBfc2V0Q2FsZW5kYXJUaXRsZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHRpdGxlRm9ybWF0ID0gb3B0aW9uLnRpdGxlRm9ybWF0LFxuICAgICAgICAgICAgcmVwbGFjZU1hcCxcbiAgICAgICAgICAgIHJlZztcblxuICAgICAgICBtb250aCA9IGNhbGVuZGFyVXRpbHMucHJlcGVuZExlYWRpbmdaZXJvKG1vbnRoKTtcbiAgICAgICAgcmVwbGFjZU1hcCA9IHRoaXMuX2dldFJlcGxhY2VNYXAoeWVhciwgbW9udGgpO1xuXG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50aXRsZVJlZ0V4cDtcbiAgICAgICAgdGhpcy5fc2V0RGF0ZVRleHRJbkNhbGVuZGFyKHRoaXMuJHRpdGxlLCB0aXRsZUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcblxuICAgICAgICByZWcgPSBDT05TVEFOVFMudGl0bGVZZWFyUmVnRXhwO1xuICAgICAgICB0aGlzLl9zZXREYXRlVGV4dEluQ2FsZW5kYXIodGhpcy4kdGl0bGVZZWFyLCBvcHRpb24ueWVhclRpdGxlRm9ybWF0LCByZXBsYWNlTWFwLCByZWcpO1xuXG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50aXRsZU1vbnRoUmVnRXhwO1xuICAgICAgICB0aGlzLl9zZXREYXRlVGV4dEluQ2FsZW5kYXIodGhpcy4kdGl0bGVNb250aCwgb3B0aW9uLm1vbnRoVGl0bGVGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aXRsZVxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fEhUTUxFbGVtZW50fSBlbGVtZW50IEEgdXBkYXRlIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybSBBIHVwZGF0ZSBmb3JtXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hcCBBIG9iamVjdCB0aGF0IGhhcyB2YWx1ZSBtYXRjaGVkIHJlZ0V4cFxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWcgQSByZWdFeHAgdG8gY2hhZ25lIGZvcm1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXREYXRlVGV4dEluQ2FsZW5kYXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGZvcm0sIG1hcCwgcmVnKSB7XG4gICAgICAgIHZhciB0aXRsZSxcbiAgICAgICAgICAgICRlbCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGl0bGUgPSBjYWxlbmRhclV0aWxzLmdldENvbnZlcnRlZFRpdGxlKGZvcm0sIG1hcCwgcmVnKTtcbiAgICAgICAgJGVsLnRleHQodGl0bGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbWFwIGRhdGEgZm9yIGZvcm1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbZGF0ZV0gQSBkYXlcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXBsYWNlTWFwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0UmVwbGFjZU1hcDogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHllYXJTdWIgPSAoeWVhci50b1N0cmluZygpKS5zdWJzdHIoMiwgMiksXG4gICAgICAgICAgICBtb250aExhYmVsID0gb3B0aW9uLm1vbnRoVGl0bGVzW21vbnRoIC0gMV0sXG4gICAgICAgICAgICBsYWJlbEtleSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF0ZSB8fCAxKS5nZXREYXkoKSxcbiAgICAgICAgICAgIGRheUxhYmVsID0gb3B0aW9uLmRheVRpdGxlc1tsYWJlbEtleV07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHl5eXk6IHllYXIsXG4gICAgICAgICAgICB5eTogeWVhclN1YixcbiAgICAgICAgICAgIG1tOiBtb250aCxcbiAgICAgICAgICAgIG06IE51bWJlcihtb250aCksXG4gICAgICAgICAgICBNOiBtb250aExhYmVsLFxuICAgICAgICAgICAgZGQ6IGRhdGUsXG4gICAgICAgICAgICBkOiBOdW1iZXIoZGF0ZSksXG4gICAgICAgICAgICBEOiBkYXlMYWJlbFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdG9kYXlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDYWxlbmRhclRvZGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0b2RheSA9IHRoaXMuJHRvZGF5LFxuICAgICAgICAgICAgdG9kYXlGb3JtYXQsXG4gICAgICAgICAgICB0b2RheSxcbiAgICAgICAgICAgIHllYXIsXG4gICAgICAgICAgICBtb250aCxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICByZXBsYWNlTWFwLFxuICAgICAgICAgICAgcmVnO1xuXG4gICAgICAgIGlmICghJHRvZGF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9kYXkgPSBjYWxlbmRhclV0aWxzLmdldERhdGVIYXNoVGFibGUoKTtcbiAgICAgICAgeWVhciA9IHRvZGF5LnllYXI7XG4gICAgICAgIG1vbnRoID0gY2FsZW5kYXJVdGlscy5wcmVwZW5kTGVhZGluZ1plcm8odG9kYXkubW9udGgpO1xuICAgICAgICBkYXRlID0gY2FsZW5kYXJVdGlscy5wcmVwZW5kTGVhZGluZ1plcm8odG9kYXkuZGF0ZSk7XG4gICAgICAgIHRvZGF5Rm9ybWF0ID0gdGhpcy5fb3B0aW9uLnRvZGF5Rm9ybWF0O1xuICAgICAgICByZXBsYWNlTWFwID0gdGhpcy5fZ2V0UmVwbGFjZU1hcCh5ZWFyLCBtb250aCwgZGF0ZSk7XG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50b2RheVJlZ0V4cDtcbiAgICAgICAgdGhpcy5fc2V0RGF0ZVRleHRJbkNhbGVuZGFyKCR0b2RheSwgdG9kYXlGb3JtYXQsIHJlcGxhY2VNYXAsIHJlZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aXRsZSBvbiB5ZWFyJ3MgbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAtIFllYXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRUaXRsZU9uWWVhckxheWVyOiBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgIHZhciBpdGVtQ291bnRPZlllYXIgPSB0aGlzLl9nZXRJbmZvT2ZZZWFyUmFuZ2UoeWVhcik7XG4gICAgICAgIHZhciBzdGFydFllYXJUZXh0ID0gdGhpcy5fZ2V0Q29udmVydGVkWWVhclRpdGxlKGl0ZW1Db3VudE9mWWVhci5zdGFydFllYXIpO1xuICAgICAgICB2YXIgZW5kWWVhclRleHQgPSB0aGlzLl9nZXRDb252ZXJ0ZWRZZWFyVGl0bGUoaXRlbUNvdW50T2ZZZWFyLmVuZFllYXIpO1xuICAgICAgICB2YXIgdGl0bGUgPSBzdGFydFllYXJUZXh0ICsgJyAtICcgKyBlbmRZZWFyVGV4dDtcblxuICAgICAgICB0aGlzLiR0aXRsZS50ZXh0KHRpdGxlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGNsYXNzIG5hbWUgb24gdGl0bGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hvd25MYXllcklkeCAtIFllYXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDbGFzc05hbWVPblRpdGxlOiBmdW5jdGlvbihzaG93bkxheWVySWR4KSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXggKyBDT05TVEFOVFMuY2xpY2thYmxlO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0NsaWNrYWJsZVRpdGxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvd25MYXllcklkeCAhPT0gMikge1xuICAgICAgICAgICAgdGhpcy4kdGl0bGUuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHRpdGxlLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGNvbnZlcnRlZCB5ZWFyIHRleHQgb24geWVhciBhbmQgbW9udGggbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAtIFllYXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBDb252ZXJ0ZWQgeWVhciB0ZXh0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0Q29udmVydGVkWWVhclRpdGxlOiBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb247XG4gICAgICAgIHZhciByZXBsYWNlTWFwLCByZWc7XG5cbiAgICAgICAgcmVwbGFjZU1hcCA9IHRoaXMuX2dldFJlcGxhY2VNYXAoeWVhcik7XG4gICAgICAgIHJlZyA9IENPTlNUQU5UUy50aXRsZVllYXJSZWdFeHA7XG5cbiAgICAgICAgcmV0dXJuIGNhbGVuZGFyVXRpbHMuZ2V0Q29udmVydGVkVGl0bGUob3B0aW9uLnllYXJUaXRsZUZvcm1hdCwgcmVwbGFjZU1hcCwgcmVnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHllYXJzIGluZm8gYnkgXCJpdGVtQ291bnRPZlllYXJcIiBvcHRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAtIFllYXJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBJbmZvIG9mIHllYXIncyByYW5nZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEluZm9PZlllYXJSYW5nZTogZnVuY3Rpb24oeWVhcikge1xuICAgICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5kYXRhT2ZZZWFyTGF5ZXIuZnJhbWU7XG4gICAgICAgIHZhciBjb2xzID0gZnJhbWVJbmZvLmNvbHM7XG4gICAgICAgIHZhciByb3dzID0gZnJhbWVJbmZvLnJvd3M7XG4gICAgICAgIHZhciBiYXNlSWR4ID0gKGNvbHMgKiBNYXRoLmZsb29yKHJvd3MgLyAyKSkgKyBNYXRoLmZsb29yKGNvbHMgLyAyKTtcbiAgICAgICAgdmFyIHN0YXJ0WWVhciA9IHllYXIgLSBiYXNlSWR4O1xuICAgICAgICB2YXIgZW5kWWVhciA9IHN0YXJ0WWVhciArIChjb2xzICogcm93cykgLSAxO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFllYXI6IHN0YXJ0WWVhcixcbiAgICAgICAgICAgIGVuZFllYXI6IGVuZFllYXJcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGluZGV4IG9mIGN1cnJlbnQgc2hvd24gbGF5ZXIgYnkgbGF5ZXIncyB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB0eXBlIC0gVHlwZSBvZiBsYXllclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IEluZGV4IG9mIHNob3duIGxheWVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0SW5kZXhPZlNob3duTGF5ZXI6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlID8gdXRpbC5pbkFycmF5KHR5cGUsIENPTlNUQU5UUy5sYXllcktleXMpIDogdGhpcy5zaG93bkxheWVySWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBoZWFkZXIgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIC0gVGhlIGhhc2ggdGhhdCBzaG93IHVwIG9uIGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNob3duTGF5ZXJJZHggLSBJbmRleCBvZiBzaG93biBsYXllclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdIZWFkZXI6IGZ1bmN0aW9uKGRhdGVGb3JEcmF3aW5nLCBzaG93bkxheWVySWR4KSB7XG4gICAgICAgIHZhciBjbGFzc1NlbGVjdG9yID0gJy4nICsgdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4ICsgJ2J0bi0nO1xuICAgICAgICB2YXIgcHJldkJ0biA9IHRoaXMuJGhlYWRlci5maW5kKGNsYXNzU2VsZWN0b3IgKyBDT05TVEFOVFMucHJldik7XG4gICAgICAgIHZhciBuZXh0QnRuID0gdGhpcy4kaGVhZGVyLmZpbmQoY2xhc3NTZWxlY3RvciArIENPTlNUQU5UUy5uZXh0KTtcbiAgICAgICAgdmFyIGtleSA9IENPTlNUQU5UUy5yZWxhdGl2ZU1vbnRoVmFsdWVLZXk7XG4gICAgICAgIHZhciBpdGVtQ291bnRPZlllYXIgPSB0aGlzLl9vcHRpb24uaXRlbUNvdW50T2ZZZWFyO1xuICAgICAgICB2YXIgcHJldlZhbHVlLCBuZXh0VmFsdWU7XG5cbiAgICAgICAgdGhpcy5fc2V0Q2xhc3NOYW1lT25UaXRsZShzaG93bkxheWVySWR4KTtcblxuICAgICAgICBzd2l0Y2ggKHNob3duTGF5ZXJJZHgpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRDYWxlbmRhclRleHQoZGF0ZUZvckRyYXdpbmcpO1xuICAgICAgICAgICAgICAgIHByZXZWYWx1ZSA9IC0xO1xuICAgICAgICAgICAgICAgIG5leHRWYWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdGhpcy4kdGl0bGUudGV4dCh0aGlzLl9nZXRDb252ZXJ0ZWRZZWFyVGl0bGUoZGF0ZUZvckRyYXdpbmcueWVhcikpO1xuICAgICAgICAgICAgICAgIHByZXZWYWx1ZSA9IC0xMjtcbiAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSAxMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRUaXRsZU9uWWVhckxheWVyKGRhdGVGb3JEcmF3aW5nLnllYXIpO1xuICAgICAgICAgICAgICAgIHByZXZWYWx1ZSA9IC0xMiAqIGl0ZW1Db3VudE9mWWVhcjtcbiAgICAgICAgICAgICAgICBuZXh0VmFsdWUgPSAxMiAqIGl0ZW1Db3VudE9mWWVhcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IC8vIEB0b2RvIFdoeSBkb2VzIG5vdCB1c2UgJ3JldHVybicgYnV0ICdicmVhayc/XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2QnRuLmRhdGEoa2V5LCBwcmV2VmFsdWUpO1xuICAgICAgICBuZXh0QnRuLmRhdGEoa2V5LCBuZXh0VmFsdWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGJvZHkgZWxlbWVudHNcbiAgICAgKiBAcGFyYW0ge3t5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9fSBkYXRlRm9yRHJhd2luZyAtIFRoZSBoYXNoIHRoYXQgc2hvdyB1cCBvbiBjYWxlbmRhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaG93bkxheWVySWR4IC0gSW5kZXggb2Ygc2hvd24gbGF5ZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kcmF3Qm9keTogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcsIHNob3duTGF5ZXJJZHgpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyO1xuICAgICAgICB2YXIgbW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcbiAgICAgICAgdmFyIGNsYXNzUHJlZml4ID0gdGhpcy5fb3B0aW9uLmNsYXNzUHJlZml4O1xuXG4gICAgICAgIC8vIHdlZWtzXG4gICAgICAgIHRoaXMuX3NldFdlZWtzKHllYXIsIG1vbnRoKTtcbiAgICAgICAgdGhpcy5fJGRhdGVFbGVtZW50ID0gJCgnLicgKyBjbGFzc1ByZWZpeCArICdkYXRlJywgdGhpcy4kd2Vla0FwcGVuZFRhcmdldCk7XG4gICAgICAgIHRoaXMuXyRkYXRlQ29udGFpbmVyRWxlbWVudCA9ICQoJy4nICsgY2xhc3NQcmVmaXggKyAnd2VlayA+IConLCB0aGlzLiR3ZWVrQXBwZW5kVGFyZ2V0KTtcblxuICAgICAgICAvLyBkYXRlc1xuICAgICAgICB0aGlzLl9kcmF3RGF0ZXMoZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KTtcblxuICAgICAgICAvLyBtb250aCBsYXllclxuICAgICAgICB0aGlzLl9kcmF3RnJhbWVPbk1vbnRoTGF5ZXIoKTtcbiAgICAgICAgdGhpcy5fZHJhd0J1dHRvbnNPZk1vbnRoKGRhdGVGb3JEcmF3aW5nLCBjbGFzc1ByZWZpeCk7XG5cbiAgICAgICAgLy8geWVhciBsYXllclxuICAgICAgICB0aGlzLl9kcmF3RnJhbWVPblllYXJMYXllcigpO1xuICAgICAgICB0aGlzLl9kcmF3QnV0dG9uc09mWWVhcihkYXRlRm9yRHJhd2luZywgY2xhc3NQcmVmaXgpO1xuXG4gICAgICAgIC8vIHNob3cgbGF5ZXJcbiAgICAgICAgdGhpcy5fY2hhbmdlU2hvd25MYXllcihzaG93bkxheWVySWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBmcmFtZSBjb250YWluaW5nIGJ1dHRvbnMgb24gbW9udGgncyBsYXllclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdGcmFtZU9uTW9udGhMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmRhdGFPZk1vbnRoTGF5ZXIuZnJhbWUucm93cztcbiAgICAgICAgdmFyIGRhdGFPZk1vbnRoTGF5ZXIgPSB0aGlzLmRhdGFPZk1vbnRoTGF5ZXI7XG4gICAgICAgIHZhciAkbW9udGhHcm91cEVsO1xuXG4gICAgICAgIGZvciAoOyBpIDwgcm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICAkbW9udGhHcm91cEVsID0gZGF0YU9mTW9udGhMYXllci50ZW1wbGF0ZS5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgICRtb250aEdyb3VwRWwuYXBwZW5kVG8oZGF0YU9mTW9udGhMYXllci5hcHBlbmRlZFRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBzZWxlY3RhYmxlIGJ1dHRvbnMgb24gbW9udGgncyBsYXllclxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIC0gVGhlIGhhc2ggdGhhdCBzaG93IHVwIG9uIGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IC0gQSBjbGFzcyBwcmVmaXhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kcmF3QnV0dG9uc09mTW9udGg6IGZ1bmN0aW9uKGRhdGVGb3JEcmF3aW5nLCBjbGFzc1ByZWZpeCkge1xuICAgICAgICB2YXIga2V5ID0gQ09OU1RBTlRTLnJlbGF0aXZlTW9udGhWYWx1ZUtleTtcbiAgICAgICAgdmFyIHNlbGVjdGVkTW9udGggPSBkYXRlRm9yRHJhd2luZy5tb250aDtcbiAgICAgICAgdmFyIG1vbnRoVGl0bGVzID0gdGhpcy5fb3B0aW9uLm1vbnRoVGl0bGVzO1xuICAgICAgICB2YXIgJG1vbnRoRWxzID0gdGhpcy5kYXRhT2ZNb250aExheWVyLmFwcGVuZGVkVGFyZ2V0LmZpbmQoJy4nICsgY2xhc3NQcmVmaXggKyAnbW9udGgnKTtcbiAgICAgICAgdmFyICRidXR0b25FbCwgbW9udGgsIHJlbGF0aXZlTW9udGg7XG4gICAgICAgIHZhciBldmVudERhdGE7XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoKG1vbnRoVGl0bGVzLCBmdW5jdGlvbih0aXRsZSwgaWR4KSB7XG4gICAgICAgICAgICAkYnV0dG9uRWwgPSAkbW9udGhFbHMuZXEoaWR4KTtcbiAgICAgICAgICAgIG1vbnRoID0gaWR4ICsgMTtcblxuICAgICAgICAgICAgaWYgKG1vbnRoID09PSBzZWxlY3RlZE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbkVsLmFkZENsYXNzKGNsYXNzUHJlZml4ICsgQ09OU1RBTlRTLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzVG9kYXkodGhpcy5fc2hvd25EYXRlLnllYXIsIG1vbnRoKSkge1xuICAgICAgICAgICAgICAgICRidXR0b25FbC5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy50b2RheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbGF0aXZlTW9udGggPSBtb250aCAtIHNlbGVjdGVkTW9udGg7XG5cbiAgICAgICAgICAgICRidXR0b25FbC5kYXRhKGtleSwgcmVsYXRpdmVNb250aCkuaHRtbCh0aXRsZSk7XG5cbiAgICAgICAgICAgIGV2ZW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAkZGF0ZTogJGJ1dHRvbkVsLFxuICAgICAgICAgICAgICAgICRkYXRlQ29udGFpbmVyOiAkYnV0dG9uRWwsXG4gICAgICAgICAgICAgICAgeWVhcjogZGF0ZUZvckRyYXdpbmcueWVhcixcbiAgICAgICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICAgICAgZGF0ZTogMCxcbiAgICAgICAgICAgICAgICBodG1sOiB0aXRsZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5maXJlKCdkcmF3JywgZXZlbnREYXRhKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgZnJhbWUgY29udGFpbmluZyBidXR0b25zIG9uIHllYXIncyBsYXllclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2RyYXdGcmFtZU9uWWVhckxheWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgcm93cyA9IHRoaXMuZGF0YU9mTW9udGhMYXllci5mcmFtZS5yb3dzO1xuICAgICAgICB2YXIgZGF0YU9mWWVhckxheWVyID0gdGhpcy5kYXRhT2ZZZWFyTGF5ZXI7XG4gICAgICAgIHZhciAkeWVhckdyb3VwRWw7XG5cbiAgICAgICAgZm9yICg7IGkgPCByb3dzOyBpICs9IDEpIHtcbiAgICAgICAgICAgICR5ZWFyR3JvdXBFbCA9IGRhdGFPZlllYXJMYXllci50ZW1wbGF0ZS5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgICR5ZWFyR3JvdXBFbC5hcHBlbmRUbyhkYXRhT2ZZZWFyTGF5ZXIuYXBwZW5kZWRUYXJnZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERyYXcgc2VsZWN0YWJsZSBidXR0b25zIG9uIHllYXIncyBsYXllclxuICAgICAqIEBwYXJhbSB7e3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn19IGRhdGVGb3JEcmF3aW5nIC0gVGhlIGhhc2ggdGhhdCBzaG93IHVwIG9uIGNhbGVuZGFyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzUHJlZml4IC0gQSBjbGFzcyBwcmVmaXhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kcmF3QnV0dG9uc09mWWVhcjogZnVuY3Rpb24oZGF0ZUZvckRyYXdpbmcsIGNsYXNzUHJlZml4KSB7XG4gICAgICAgIHZhciBrZXkgPSBDT05TVEFOVFMucmVsYXRpdmVNb250aFZhbHVlS2V5O1xuICAgICAgICB2YXIgeWVhciA9IGRhdGVGb3JEcmF3aW5nLnllYXI7XG4gICAgICAgIHZhciBpdGVtQ291bnRPZlllYXIgPSB0aGlzLl9nZXRJbmZvT2ZZZWFyUmFuZ2UoeWVhcik7XG4gICAgICAgIHZhciBzdGFydFllYXIgPSBpdGVtQ291bnRPZlllYXIuc3RhcnRZZWFyO1xuICAgICAgICB2YXIgZW5kWWVhciA9IGl0ZW1Db3VudE9mWWVhci5lbmRZZWFyO1xuICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgdmFyICR5ZWFyRWxzID0gdGhpcy5kYXRhT2ZZZWFyTGF5ZXIuYXBwZW5kZWRUYXJnZXQuZmluZCgnLicgKyBjbGFzc1ByZWZpeCArICd5ZWFyJyk7XG4gICAgICAgIHZhciAkYnV0dG9uRWwsIHJlbGF0aXZlTW9udGg7XG4gICAgICAgIHZhciBldmVudERhdGE7XG5cbiAgICAgICAgZm9yICg7IHN0YXJ0WWVhciA8PSBlbmRZZWFyOyBzdGFydFllYXIgKz0gMSkge1xuICAgICAgICAgICAgJGJ1dHRvbkVsID0gJHllYXJFbHMuZXEoY250KTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0WWVhciA9PT0geWVhcikge1xuICAgICAgICAgICAgICAgICRidXR0b25FbC5hZGRDbGFzcyhjbGFzc1ByZWZpeCArIENPTlNUQU5UUy5zZWxlY3RlZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1RvZGF5KHN0YXJ0WWVhcikpIHtcbiAgICAgICAgICAgICAgICAkYnV0dG9uRWwuYWRkQ2xhc3MoY2xhc3NQcmVmaXggKyBDT05TVEFOVFMudG9kYXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZWxhdGl2ZU1vbnRoID0gKHN0YXJ0WWVhciAtIHllYXIpICogMTI7XG5cbiAgICAgICAgICAgICRidXR0b25FbC5kYXRhKGtleSwgcmVsYXRpdmVNb250aCkuaHRtbChzdGFydFllYXIpO1xuXG4gICAgICAgICAgICBjbnQgKz0gMTtcblxuICAgICAgICAgICAgZXZlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICRkYXRlOiAkYnV0dG9uRWwsXG4gICAgICAgICAgICAgICAgJGRhdGVDb250YWluZXI6ICRidXR0b25FbCxcbiAgICAgICAgICAgICAgICB5ZWFyOiBzdGFydFllYXIsXG4gICAgICAgICAgICAgICAgbW9udGg6IDAsXG4gICAgICAgICAgICAgICAgZGF0ZTogMCxcbiAgICAgICAgICAgICAgICBodG1sOiBzdGFydFllYXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZmlyZSgnZHJhdycsIGV2ZW50RGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIGN1cnJlbnQgc2hvd24gbGF5ZXIgb24gY2FsZW5kYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hvd25MYXllcklkeCAtIEluZGV4IG9mIHNob3duIGxheWVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2hhbmdlU2hvd25MYXllcjogZnVuY3Rpb24oc2hvd25MYXllcklkeCkge1xuICAgICAgICB2YXIgY2xhc3NQcmVmaXggPSB0aGlzLl9vcHRpb24uY2xhc3NQcmVmaXg7XG4gICAgICAgIHZhciBwcmV2c2hvd25MYXllcklkeCA9IHRoaXMuc2hvd25MYXllcklkeDtcbiAgICAgICAgdmFyICRib2R5cyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLicgKyBjbGFzc1ByZWZpeCArICdib2R5Jyk7XG5cbiAgICAgICAgdGhpcy5zaG93bkxheWVySWR4ID0gc2hvd25MYXllcklkeDtcblxuICAgICAgICAkYm9keXMuZXEocHJldnNob3duTGF5ZXJJZHgpLmhpZGUoKTtcbiAgICAgICAgJGJvZHlzLmVxKHNob3duTGF5ZXJJZHgpLnNob3coKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRHJhdyBjYWxlbmRhclxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3llYXJdIEEgeWVhciAoZXguIDIwMDgpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb250aF0gQSBtb250aCAoMSB+IDEyKVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzUmVsYXRpdmVdIEEgeWVhciBhbmQgbW9udGggaXMgcmVsYXRlZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbc2hvd25UeXBlXSBTaG93biB0eXBlIG9mIGxheWVyIChleC4gW2RheSwgbW9udGgsIHllYXJdIHwgWzBdIH4gMl0pXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYWxlbmRhci5kcmF3KCk7IC8vIERyYXcgd2l0aCBub3cgZGF0ZS5cbiAgICAgKiBjYWxlbmRhci5kcmF3KDIwMDgsIDEyKTsgLy8gRHJhdyAyMDA4LzEyXG4gICAgICogY2FsZW5kYXIuZHJhdyhudWxsLCAxMik7IC8vIERyYXcgY3VycmVudCB5ZWFyLzEyXG4gICAgICogY2FsZW5kYXIuZHJhdygyMDEwLCBudWxsKTsgLy8gRHJhdyAyMDEwL2N1cnJlbnQgbW9udGhcbiAgICAgKiBjYWxlbmRhci5kcmF3KDAsIDEsIHRydWUpOyAvLyBEcmF3IG5leHQgbW9udGhcbiAgICAgKiBjYWxlbmRhci5kcmF3KC0xLCBudWxsLCB0cnVlKTsgLy8gRHJhdyBwcmV2IHllYXJcbiAgICAgKiBjYWxlbmRhci5kcmF3KDAsIDAsIGZhbHNlLCAnZGF0ZScpOyAvLyBEcmF3IHRvZGF5IHdpdGggZGF0ZSdzIGxheWVyXG4gICAgICogY2FsZW5kYXIuZHJhdygyMDEwLCAxMCwgZmFsc2UsICdtb250aCcpOyAvLyBEcmF3IDIwMTAvMTAgd2l0aCBtb250aCdzIGxheWVyXG4gICAgICogY2FsZW5kYXIuZHJhdygyMDE2LCBudWxsLCBmYWxzZSwgJ3llYXInKTsgLy8gRHJhdyAyMDE2L21vbnRoIHdpdGggeWVhcidzIGxheWVyXG4gICAgICoqL1xuICAgIGRyYXc6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBpc1JlbGF0aXZlLCBzaG93blR5cGUpIHtcbiAgICAgICAgdmFyIGRhdGVGb3JEcmF3aW5nID0gdGhpcy5fZ2V0RGF0ZUZvckRyYXdpbmcoeWVhciwgbW9udGgsIGlzUmVsYXRpdmUpO1xuICAgICAgICB2YXIgaXNSZWFkeUZvckRyYXdpbmcgPSB0aGlzLmludm9rZSgnYmVmb3JlRHJhdycsIGRhdGVGb3JEcmF3aW5nKTtcbiAgICAgICAgdmFyIHNob3duTGF5ZXJJZHg7XG5cbiAgICAgICAgLyogPT09PT09PT09PT09PT09XG4gICAgICAgICAqIGJlZm9yZURyYXdcbiAgICAgICAgICogPT09PT09PT09PT09PT09PT0qL1xuICAgICAgICBpZiAoIWlzUmVhZHlGb3JEcmF3aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKiA9PT09PT09PT09PT09PT1cbiAgICAgICAgICogZHJhd1xuICAgICAgICAgKiA9PT09PT09PT09PT09PT09PSovXG4gICAgICAgIHNob3duTGF5ZXJJZHggPSB1dGlsLmlzTnVtYmVyKHNob3duVHlwZSkgPyBzaG93blR5cGUgOiB0aGlzLl9nZXRJbmRleE9mU2hvd25MYXllcihzaG93blR5cGUpO1xuXG4gICAgICAgIHllYXIgPSBkYXRlRm9yRHJhd2luZy55ZWFyO1xuICAgICAgICBtb250aCA9IGRhdGVGb3JEcmF3aW5nLm1vbnRoO1xuXG4gICAgICAgIHRoaXMuc2V0RGF0ZSh5ZWFyLCBtb250aCk7XG5cbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fZHJhd0hlYWRlcihkYXRlRm9yRHJhd2luZywgc2hvd25MYXllcklkeCk7XG4gICAgICAgIHRoaXMuX2RyYXdCb2R5KGRhdGVGb3JEcmF3aW5nLCBzaG93bkxheWVySWR4KTtcblxuICAgICAgICAvKiA9PT09PT09PT09PT09PT1cbiAgICAgICAgICogYWZ0ZXJEcmF3XG4gICAgICAgICAqID09PT09PT09PT09PT09PT0qL1xuICAgICAgICB0aGlzLmZpcmUoJ2FmdGVyRHJhdycsIGRhdGVGb3JEcmF3aW5nKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGN1cnJlbnQgeWVhciBhbmQgbW9udGgoanVzdCBzaG93bikuXG4gICAgICogQGFwaVxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBnZXREYXRlKCk7ID0+IHsgeWVhcjogeHh4eCwgbW9udGg6IHh4IH07XG4gICAgICovXG4gICAgZ2V0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiB0aGlzLl9zaG93bkRhdGUueWVhcixcbiAgICAgICAgICAgIG1vbnRoOiB0aGlzLl9zaG93bkRhdGUubW9udGhcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRhdGVcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5ZWFyXSBBIHllYXIgKGV4LiAyMDA4KVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbW9udGhdIEEgbW9udGggKDEgfiAxMilcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBzZXREYXRlKDE5ODQsIDA0KTtcbiAgICAgKiovXG4gICAgc2V0RGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgdmFyIGRhdGUgPSB0aGlzLl9zaG93bkRhdGU7XG4gICAgICAgIGRhdGUueWVhciA9IHV0aWwuaXNOdW1iZXIoeWVhcikgPyB5ZWFyIDogZGF0ZS55ZWFyO1xuICAgICAgICBkYXRlLm1vbnRoID0gdXRpbC5pc051bWJlcihtb250aCkgPyBtb250aCA6IGRhdGUubW9udGg7XG4gICAgfVxufSk7XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKENhbGVuZGFyKTtcbm1vZHVsZS5leHBvcnRzID0gQ2FsZW5kYXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jYWxlbmRhci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbHMgZm9yIGNhbGVuZGFyIGNvbXBvbmVudFxuICogQGF1dGhvciBOSE4gTmV0LiBGRSBkZXYgTGFiIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSB0dWktY29kZS1zbmlwcGV0IH4xLjAuMlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVdGlscyBvZiBjYWxlbmRhclxuICogQG5hbWVzcGFjZSBjYWxlbmRhclV0aWxzXG4gKiBAaWdub3JlXG4gKi9cbnZhciB1dGlscyA9IHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gZGF0ZSBoYXNoIGJ5IHBhcmFtZXRlci5cbiAgICAgKiAgaWYgdGhlcmUgYXJlIDMgcGFyYW1ldGVyLCB0aGUgcGFyYW1ldGVyIGlzIGNvcmduaXplZCBEYXRlIG9iamVjdFxuICAgICAqICBpZiB0aGVyZSBhcmUgbm8gcGFyYW1ldGVyLCByZXR1cm4gdG9kYXkncyBoYXNoIGRhdGVcbiAgICAgKiBAZnVuY3Rpb24gZ2V0RGF0ZUhhc2hUYWJsZVxuICAgICAqIEBtZW1iZXJvZiBjYWxlbmRhclV0aWxzXG4gICAgICogQHBhcmFtIHtEYXRlfG51bWJlcn0gW3llYXJdIEEgZGF0ZSBpbnN0YW5jZSBvciB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttb250aF0gQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZGF0ZV0gQSBkYXRlXG4gICAgICogQHJldHVybnMge3t5ZWFyOiAqLCBtb250aDogKiwgZGF0ZTogKn19XG4gICAgICovXG4gICAgZ2V0RGF0ZUhhc2hUYWJsZTogZnVuY3Rpb24oeWVhciwgbW9udGgsIGRhdGUpIHtcbiAgICAgICAgdmFyIG5EYXRlO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgbkRhdGUgPSBhcmd1bWVudHNbMF0gfHwgbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgeWVhciA9IG5EYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICBtb250aCA9IG5EYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgZGF0ZSA9IG5EYXRlLmdldERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgZGF0ZTogZGF0ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdG9kYXkgdGhhdCBzYXZlZCBvbiBjb21wb25lbnQgb3IgY3JlYXRlIG5ldyBkYXRlLlxuICAgICAqIEBmdW5jdGlvbiBnZXRUb2RheVxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogKiwgbW9udGg6ICosIGRhdGU6ICp9fVxuICAgICAqIEBtZW1iZXJvZiBjYWxlbmRhclV0aWxzXG4gICAgICovXG4gICAgZ2V0VG9kYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdXRpbHMuZ2V0RGF0ZUhhc2hUYWJsZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgd2Vla3MgY291bnQgYnkgcGFyYW1lbnRlclxuICAgICAqIEBmdW5jdGlvbiBnZXRXZWVrc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIEEgeWVhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIG1vbnRoXG4gICAgICogQHJldHVybnMge251bWJlcn0g7KO8ICg0fjYpXG4gICAgICogQG1lbWJlcm9mIGNhbGVuZGFyVXRpbHNcbiAgICAgKiovXG4gICAgZ2V0V2Vla3M6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHZhciBmaXJzdERheSA9IHRoaXMuZ2V0Rmlyc3REYXkoeWVhciwgbW9udGgpLFxuICAgICAgICAgICAgbGFzdERhdGUgPSB0aGlzLmdldExhc3REYXRlKHllYXIsIG1vbnRoKTtcblxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChmaXJzdERheSArIGxhc3REYXRlKSAvIDcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdW5peCB0aW1lIGZyb20gZGF0ZSBoYXNoXG4gICAgICogQGZ1bmN0aW9uIGdldFRpbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0ZSBBIGRhdGUgaGFzaFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlLnllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUubW9udGggQSBtb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlLmRhdGUgQSBkYXRlXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAbWVtYmVyb2YgdXRpbHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHV0aWxzLmdldFRpbWUoe3llYXI6MjAxMCwgbW9udGg6NSwgZGF0ZToxMn0pOyAvLyAxMjczNTkwMDAwMDAwXG4gICAgICoqL1xuICAgIGdldFRpbWU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZU9iamVjdChkYXRlKS5nZXRUaW1lKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB3aGljaCBkYXkgaXMgZmlyc3QgYnkgcGFyYW1ldGVycyB0aGF0IGluY2x1ZGUgeWVhciBhbmQgbW9udGggaW5mb3JtYXRpb24uXG4gICAgICogQGZ1bmN0aW9uIGdldEZpcnN0RGF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAoMH42KVxuICAgICAqIEBtZW1iZXJvZiBjYWxlbmRhclV0aWxzXG4gICAgICoqL1xuICAgIGdldEZpcnN0RGF5OiBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKS5nZXREYXkoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHdoaWNoIGRheSBpcyBsYXN0IGJ5IHBhcmFtZXRlcnMgdGhhdCBpbmNsdWRlIHllYXIgYW5kIG1vbnRoIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvbiBnZXRMYXN0RGF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAoMH42KVxuICAgICAqIEBtZW1iZXJvZiBjYWxlbmRhclV0aWxzXG4gICAgICoqL1xuICAgIGdldExhc3REYXk6IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBsYXN0IGRhdGUgYnkgcGFyYW1ldGVycyB0aGF0IGluY2x1ZGUgeWVhciBhbmQgbW9udGggaW5mb3JtYXRpb24uXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHllYXIgQSB5ZWFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIEEgbW9udGhcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAoMX4zMSlcbiAgICAgKiBAbWVtYmVyb2YgY2FsZW5kYXJVdGlsc1xuICAgICAqKi9cbiAgICBnZXRMYXN0RGF0ZTogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkYXRlIGluc3RhbmNlLlxuICAgICAqIEBmdW5jdGlvbiBnZXREYXRlT2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGUgQSBkYXRlIGhhc2hcbiAgICAgKiBAcmV0dXJucyB7RGF0ZX0gRGF0ZVxuICAgICAqIEBtZW1iZXJvZiBjYWxlbmRhclV0aWxzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgY2FsZW5kYXJVdGlscy5nZXREYXRlT2JqZWN0KHt5ZWFyOjIwMTAsIG1vbnRoOjUsIGRhdGU6MTJ9KTtcbiAgICAgKiAgY2FsZW5kYXJVdGlscy5nZXREYXRlT2JqZWN0KDIwMTAsIDUsIDEyKTsgLy95ZWFyLG1vbnRoLGRhdGVcbiAgICAgKiovXG4gICAgZ2V0RGF0ZU9iamVjdDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdIC0gMSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRhdGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVsYXRlZCBkYXRlIGhhc2ggd2l0aCBwYXJhbWV0ZXJzIHRoYXQgaW5jbHVkZSBkYXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBmdW5jdGlvbiBnZXRSZWxhdGl2ZURhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciBBIHJlbGF0ZWQgdmFsdWUgZm9yIHllYXIoeW91IGNhbiB1c2UgKy8tKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCBBIHJlbGF0ZWQgdmFsdWUgZm9yIG1vbnRoICh5b3UgY2FuIHVzZSArLy0pXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgQSByZWxhdGVkIHZhbHVlIGZvciBkYXkgKHlvdSBjYW4gdXNlICsvLSlcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0ZU9iaiBzdGFuZGFyZCBkYXRlIGhhc2hcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBkYXRlT2JqXG4gICAgICogQG1lbWJlcm9mIGNhbGVuZGFyVXRpbHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSgxLCAwLCAwLCB7eWVhcjoyMDAwLCBtb250aDoxLCBkYXRlOjF9KTsgLy8ge3llYXI6MjAwMSwgbW9udGg6MSwgZGF0ZToxfVxuICAgICAqICBjYWxlbmRhclV0aWxzLmdldFJlbGF0aXZlRGF0ZSgwLCAwLCAtMSwge3llYXI6MjAxMCwgbW9udGg6MSwgZGF0ZToxfSk7IC8vIHt5ZWFyOjIwMDksIG1vbnRoOjEyLCBkYXRlOjMxfVxuICAgICAqKi9cbiAgICBnZXRSZWxhdGl2ZURhdGU6IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXRlLCBkYXRlT2JqKSB7XG4gICAgICAgIHZhciBuWWVhciA9IChkYXRlT2JqLnllYXIgKyB5ZWFyKSxcbiAgICAgICAgICAgIG5Nb250aCA9IChkYXRlT2JqLm1vbnRoICsgbW9udGggLSAxKSxcbiAgICAgICAgICAgIG5EYXRlID0gKGRhdGVPYmouZGF0ZSArIGRhdGUpLFxuICAgICAgICAgICAgbkRhdGVPYmogPSBuZXcgRGF0ZShuWWVhciwgbk1vbnRoLCBuRGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxzLmdldERhdGVIYXNoVGFibGUobkRhdGVPYmopO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFnbmUgbnVtYmVyIDB+OSB0byAnMDB+MDknXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgY2FsZW5kYXJVdGlscy5wcmVwZW5kTGVhZGluZ1plcm8oMCk7IC8vICAnMDAnXG4gICAgICogIGNhbGVuZGFyVXRpbHMucHJlcGVuZExlYWRpbmdaZXJvKDkpOyAvLyAgJzA5J1xuICAgICAqICBjYWxlbmRhclV0aWxzLnByZXBlbmRMZWFkaW5nWmVybygxMik7IC8vICAnMTInXG4gICAgICovXG4gICAgcHJlcGVuZExlYWRpbmdaZXJvOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9ICcnO1xuXG4gICAgICAgIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgICAgcHJlZml4ID0gJzAnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByZWZpeCArIG51bWJlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhZ2UgdGV4dCBhbmQgcmV0dXJuLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgQSB0ZXh0IHRvIGNoYWduZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgQSBjaGFnbmUga2V5LCB2YWx1ZSBzZXRcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnIEEgcmVnRXhwIHRvIGNoYWduZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRDb252ZXJ0ZWRUaXRsZTogZnVuY3Rpb24oc3RyLCBtYXAsIHJlZykge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG1hdGNoZWRTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBbbWF0Y2hlZFN0cmluZ10gfHwgJyc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENPTlNUQU5UUyA9IHtcbiAgICByZWxhdGl2ZU1vbnRoVmFsdWVLZXk6ICdyZWxhdGl2ZU1vbnRoVmFsdWUnLFxuICAgIHByZXY6ICdwcmV2JyxcbiAgICBwcmV2WWVhcjogJ3ByZXYteWVhcicsXG4gICAgcHJldk1vbnRoOiAncHJldi1tb250aCcsXG4gICAgbmV4dDogJ25leHQnLFxuICAgIG5leHRZZWFyOiAnbmV4dC15ZWFyJyxcbiAgICBuZXh0TW9udGg6ICduZXh0LW1vbnRoJyxcbiAgICBzZWxlY3RlZDogJ3NlbGVjdGVkJyxcbiAgICB0b2RheTogJ3RvZGF5JyxcbiAgICBjbGlja2FibGU6ICdjbGlja2FibGUtdGl0bGUnLFxuICAgIGNhbGVuZGFySGVhZGVyOiBudWxsLFxuICAgIGNhbGVuZGFyQm9keTogbnVsbCxcbiAgICBjYWxlbmRhckZvb3RlcjogbnVsbCxcbiAgICBkZWZhdWx0Q2xhc3NQcmVmaXhSZWdFeHA6IC9jYWxlbmRhci0vZyxcbiAgICB0aXRsZVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNL2csXG4gICAgdGl0bGVZZWFyUmVnRXhwOiAveXl5eXx5eS9nLFxuICAgIHRpdGxlTW9udGhSZWdFeHA6IC9tbXxtfE0vZyxcbiAgICB0b2RheVJlZ0V4cDogL3l5eXl8eXl8bW18bXxNfGRkfGR8RC9nLFxuICAgIGl0ZW1Db3VudE9mWWVhcjogMTIsXG4gICAgbGF5ZXJLZXlzOiBbJ2RhdGUnLCAnbW9udGgnLCAneWVhciddXG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuQ09OU1RBTlRTLmNhbGVuZGFySGVhZGVyID0gW1xuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItaGVhZGVyXCI+JyxcbiAgICAgICAgJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjYWxlbmRhci1yb2xsb3ZlciBjYWxlbmRhci1idG4tJyArIENPTlNUQU5UUy5wcmV2ICsgJ1wiPlByZXY8L2E+JyxcbiAgICAgICAgJzxzdHJvbmcgY2xhc3M9XCJjYWxlbmRhci10aXRsZSBjYWxlbmRhci1jbGlja2FibGUtdGl0bGVcIj48L3N0cm9uZz4nLFxuICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNhbGVuZGFyLXJvbGxvdmVyIGNhbGVuZGFyLWJ0bi0nICsgQ09OU1RBTlRTLm5leHQgKyAnXCI+TmV4dDwvYT4nLFxuICAgICc8L2Rpdj4nXS5qb2luKCcnKTtcblxuQ09OU1RBTlRTLmNhbGVuZGFyQm9keSA9IFtcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWJvZHlcIj4nLFxuICAgICAgICAnPHRhYmxlPicsXG4gICAgICAgICAgICAnPHRoZWFkPicsXG4gICAgICAgICAgICAgICAgJzx0cj4nLFxuICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJjYWxlbmRhci1zdW5cIj5TdTwvdGg+PHRoPk1vPC90aD48dGg+VHU8L3RoPjx0aD5XZTwvdGg+PHRoPlRoPC90aD48dGg+RmE8L3RoPjx0aCBjbGFzcz1cImNhbGVuZGFyLXNhdFwiPlNhPC90aD4nLFxuICAgICAgICAgICAgICAgICc8L3RyPicsXG4gICAgICAgICAgICAnPC90aGVhZD4nLFxuICAgICAgICAgICAgJzx0Ym9keT4nLFxuICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJjYWxlbmRhci13ZWVrXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLWRhdGVcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICc8L3Rib2R5PicsXG4gICAgICAgICc8L3RhYmxlPicsXG4gICAgJzwvZGl2PicsXG4gICAgJzxkaXYgY2xhc3M9XCJjYWxlbmRhci1ib2R5XCI+JyxcbiAgICAgICAgJzx0YWJsZT4nLFxuICAgICAgICAgICAgJzx0Ym9keT4nLFxuICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJjYWxlbmRhci1tb250aC1ncm91cFwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci1tb250aFwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLW1vbnRoXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXItbW9udGhcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICc8L3Rib2R5PicsXG4gICAgICAgICc8L3RhYmxlPicsXG4gICAgJzwvZGl2PicsXG4gICAgJzxkaXYgY2xhc3M9XCJjYWxlbmRhci1ib2R5XCI+JyxcbiAgICAgICAgJzx0YWJsZT4nLFxuICAgICAgICAgICAgJzx0Ym9keT4nLFxuICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJjYWxlbmRhci15ZWFyLWdyb3VwXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImNhbGVuZGFyLXllYXJcIj48L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJjYWxlbmRhci15ZWFyXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiY2FsZW5kYXIteWVhclwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgJzwvdGFibGU+JyxcbiAgICAnPC9kaXY+J10uam9pbignJyk7XG5cbkNPTlNUQU5UUy5jYWxlbmRhckZvb3RlciA9IFtcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWZvb3RlclwiPicsXG4gICAgICAgICc8cD7smKTripggPGVtIGNsYXNzPVwiY2FsZW5kYXItdG9kYXlcIj48L2VtPjwvcD4nLFxuICAgICc8L2Rpdj4nXS5qb2luKCcnKTtcbi8qIGVzbGludC1lbmFibGUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBDT05TVEFOVFM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb25zdGFudHMuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
