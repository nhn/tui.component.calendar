/**
 * @fileoverview 캘린더 컴포넌트
 * (pug.Calendar 에서 분리)
 * @author NHN ENTERTAINMENT FE 개발팀(e0242@nhnent.com)
 * @author 이제인(jein.yi@nhnent.com)
 * @author FE개발팀 이민규 (minkyu.yi@nhnent.com) - 2015, 6, 3
 * @dependency jquery ~1.8.3, ne-code-snippet ~1.0.2
 */

'use strict';
var util = ne.util;
util.defineNamespace('ne.component');

/**
 * 캘린더 컴포넌트 클래스
 *
 *   @constructor
 *   @param {Object} [option] 초기화 옵션 설정을 위한 객체.
 *       @param {HTMLElement} option.el 캘린더 엘리먼트
 *       @param {string} [option.classPrefix="calendar-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
 *       @param {number} [option.year=현재년] 초기에 표시될 달력의 연도
 *       @param {number} [option.month=현재월] 초기에 표시될 달력의 달
 *       @param {number} [option.date=현재일] 초기에 표시될 달력의 일
 *       @param {string} [option.titleFormat="yyyy-mm"] className이 '[prefix]title' 인 엘리먼트를 찾아서 해당 형식대로 날짜를 출력한다. 다음의 형식을 사용할 수 있다.<table><tr><th>표시형식</th><th>설명</th><th>결과</th></tr><tr><td>yyyy</td><td>4자리 연도</td><td>2010</td></tr><tr><td>yy</td><td>2자리 연도</td><td>10</td></tr><tr><td>mm</td><td>2자리 월</td><td>09</td></tr><tr><td>m</td><td>1자리 월</td><td>9</td></tr><tr><td>M</td><td>monthTitles 옵션 값으로 표시</td><td>SEP</td></tr></table>
 *       @param {string} [option.todayFormat = "yyyy년 mm월 dd일 (D)"] className이 '[prefix]today' 인 엘리먼트를 찾아서 해당 형식대로 날짜를 출력한다.
 *       @param {string} [option.yearTitleFormat = "yyyy"] className이 '[prefix]year' 인 엘리먼트를 찾아서 해당 형식대로 연도를 출력한다. option의 titleFormat에서 사용할 수 있는 형식에서 연도 표시 형식을 사용할 수 있다.
 *       @param {string} [option.monthTitleFormat = "m"] className이 '[prefix]month' 인 엘리먼트를 찾아서 해당 형식대로 월을 출력한다. option의 titleFormat에서 사용할 수 있는 형식에서 월 표시 형식을 사용할 수 있다.
 *       @param {Array} [option.monthTitles = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]] 각 월의 이름을 설정할 수 있다. 1월부터 순서대로 배열로 정의한다. option의 titleFormat 표시형식에서 M을 사용하면 여기서 설정된 이름으로 표시할 수 있다.
 *       @param {Array} [option.dayTitles = ["일","월","화","수","목","금","토"]] <br>각 요일의 이름을 설정할 수 있다. 일요일부터 순서대로 배열로 정의한다. option의 todayFormat 표시형식에서 D을 사용하면 여기서 설정된 이름으로 표시할 수 있다.
 *       @param {Boolean} [option.drawOnload = true] 달력을 로딩과 동시에 바로 표시할 것인지 여부
 *   @example
 *   var calendar = new ne.component.Calendar({
 *                      el: document.getElementById('layer'),
 *                      classPrefix : "calendar-",
 *                      year : 1983,
 *                      month : 5,
 *                      date : 12,
 *                      titleFormat : "yyyy-mm", //설정될 title의 형식
 *                      todayFormat : "yyyy년 mm월 dd일 (D)" // 설정된 오늘의 날짜 형식
 *                      yearTitleFormat : "yyyy", //설정될 연 title의 형식
 *                      monthTitleFormat : "m", //설정될 월 title의 형식
 *                      monthTitles : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], //월의 이름을 설정 "title" 세팅시 적용
 *                      dayTitles: ['일', '월', '화', '수', '목', '금', '토'] // 요일들
 *                      drawOnload : true //로딩과 동시에 바로 그릴것인지 여부
 *               });
 **/
ne.component.Calendar = util.defineClass( /** @lends ne.component.Calendar.prototype */ {
    init: function(option) {
        /**
         * 옵션을 저장한다
         * @private
         * @see {
         *  {
         *     classPrefix: string,
         *     year: number
         *     month: number
         *     date: number
         *     titleFormat: string,
         *     todayFormat: string,
         *     yearTitleFormat: string,
         *     monthTitleFormat: string,
         *     monthTitles: Array,
         *     dayTitles: Array,
         *     drawOnload: boolean
         *  }
         * }
         */
        this._option = {};

        /**
         * 루트 엘리먼트를 저장한다
         * @private
         */
        this._$element = $(option.el || option);

        /**
         * 캘린더의 기준 날짜
         * 옵션 값에 지정되어 있지 않으면 오늘 날짜로 지정함
         * @type {{year: number, month: number, date: number}}
         * @private
         */
        this._date = {};

        /**
         * 오늘 날짜
         * @type {{year: number, month: number, date: number}}
         * @private
         */
        this._today = {};

        /**
         * 보여지고 있는 날짜
         * @type {{year: number, month: number}}
         */
        this._shownDate = {date: 1};

        /**======================================
         * jQuery - HTMLElement
         *======================================*/

        /** Button-prev year */
        this.$btnPrevYear = null;

        /** Button-prev month */
        this.$btnPrevMonth = null;

        /** Button-next year */
        this.$btnNextYear = null;

        /** Button-next month */
        this.$btnNextMonth = null;

        /** Title */
        this.$title = null;

        /** Title-year */
        this.$titleYear = null;

        /** Title-month */
        this.$titleMonth = null;

        /** Today */
        this.$today = null;

        /** Week-template */
        this.$weekTemplate = null;

        /** Parent of Week-template */
        this.$weekAppendTarget = null;

        /**
         * 기본 셋팅
         */
        this._setDefault(option);
    },

    _setDefault: function(option) {
        this._setToday();
        this._setOption(option);
        this.setDate();
        this._assignHTMLElements();
        this._attachEvent();
        if (this._option.drawOnload) {
            this.draw();
        }
    },

    _setOption: function(option) {
        var _op = this._option,
            _date = this._date;

        // 기본값 세팅
        var defaultOption = {
            classPrefix: 'calendar-',
            titleFormat: 'yyyy-mm',
            todayFormat: 'yyyy년 mm월 dd일 (D)',
            yearTitleFormat: 'yyyy',
            monthTitleFormat: 'm',
            monthTitles: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            dayTitles: ['일', '월', '화', '수', '목', '금', '토'],
            drawOnload: true
        };

        // 갱신
        util.extend(_op, defaultOption, option);
        _date.year = _op.year || this._today.year;
        _date.month = _op.month || this._today.month;
        _date.month = _op.month || this._today.date;
    },

    /**
     * 오늘날짜를 세팅한다.
     * @private
     */
    _setToday: function() {
        var today = this.constructor.Util.getDateHashTable();
        util.extend(this._today, today);
    },

    /**
     * 엘리먼트를 필드에 할당한다.
     * @private
     *
     * @todo element를 명시한 경우와 element가 없는 경우
     */
    _assignHTMLElements: function() {
        var classPrefix = this._option.classPrefix,
            $element = this._$element,
            $weekTemplate;

        this.$btnPrevYear = $('.' + classPrefix + 'btn-prev-year', $element);
        this.$btnPrevMonth = $('.' + classPrefix + 'btn-prev-mon', $element);
        this.$btnNextMonth = $('.' + classPrefix + 'btn-next-mon', $element);
        this.$btnNextYear = $('.' + classPrefix + 'btn-next-year', $element);

        this.$title = $('.' + classPrefix + 'title', $element);
        this.$titleYear = $('.' + classPrefix + 'title-year', $element);
        this.$titleMonth = $('.' + classPrefix + 'title-month', $element);

        this.$today = $('.' + classPrefix + 'today', $element);

        $weekTemplate = $('.' + classPrefix + 'week', $element);
        this.$weekTemplate = $weekTemplate.clone(true);
        this.$weekAppendTarget = $weekTemplate.parent();
    },

    /**
     * 달력, 전년 전달 다음달 다음년도로 이동하는 이벤트를 건다.
     * @private
     */
    _attachEvent: function() {
        if (util.isNotEmpty(this.$btnPrevYear)) {
            this.$btnPrevYear.click($.proxy(this._onButtonHandle, this, -1, 0));
        }
        if (util.isNotEmpty(this.$btnNextYear)) {
            this.$btnNextYear.click($.proxy(this._onButtonHandle, this, 1, 0));
        }

        if (util.isNotEmpty(this.$btnPrevMonth)) {
            this.$btnPrevMonth.click($.proxy(this._onButtonHandle, this, 0, -1));
        }
        if (util.isNotEmpty(this.$btnNextMonth)) {
            this.$btnNextMonth.click($.proxy(this._onButtonHandle, this, 0, 1));
        }
    },

    /**
     * 달력 버튼을 누를때의 핸들러
     *
     * @param {number} yearDist 연도 이동 값
     * @param {number} monthDist 월 이동 값
     * @param {Event} event 클릭 이벤트 객체
     * @private
     */
    _onButtonHandle: function(yearDist, monthDist, event) {
        event.preventDefault();
        this.draw(yearDist, monthDist, true);
    },

    /**
     * 캘린더를 그리기 위한 년/월 날짜 해시를 얻는다
     * @param {number} year 년
     * @param {number} month 월
     * @param {boolean} [isRelative] 상대 값 여부
     * @returns {{year: number, month: number, date: number}} 날짜 해시
     * @private
     */
    _getDateForDrawing: function(year, month, isRelative) {
        var date = this.getDate(),
            relativeDate;

        if (!util.isNumber(year) && !util.isNumber(month)) {
            return date;
        }

        if (isRelative) {
            relativeDate = this.constructor.Util.getRelativeDate(year, month, 0, this._shownDate);
            date.year = relativeDate.year;
            date.month = relativeDate.month;
        } else {
            date.year = year || date.year;
            date.month = month || date.month;
        }

        return date;
    },

    /**
     * Calendar를 그린다.
     *
     * @param {number} [year] 연도 값 (ex. 2008)
     * @param {number} [month] 월 값 (1 ~ 12)
     * @param {Boolean} [isRelative] 연도와 월 값이 상대 값인지 여부
     * @example
     *  calendar.draw(); //현재 설정된 날짜의 달력을 그린다.
     *  calendar.draw(2008, 12); //2008년 12월 달력을 그린다.
     *  calendar.draw(null, 12); //현재 표시된 달력의 12월을 그린다.
     *  calendar.draw(2010, null); //2010년 현재 표시된 달력의 월을 그린다.
     *  calendar.draw(0, 1, true); //현재 표시된 달력의 다음 달을 그린다.
     *  calendar.draw(-1, null, true); //현재 표시된 달력의 이전 연도를 그린다.
     **/
    draw: function(year, month, isRelative) {
        var dateForDrawing = this._getDateForDrawing(year, month, isRelative),
            isCompleteBeforeDraw = this.invoke('beforeDraw', dateForDrawing),
            classPrefix;

        // init
        if (!isCompleteBeforeDraw) {
            return;
        }
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
        this._drawDates(dateForDrawing, classPrefix);
        this._setShownDate(year, month);

        /**
         * 달력을 모두 그린 후에 발생
         * @param {string} sType 커스텀 이벤트명
         * @param {number} nYear 그려진 달력의 연도
         * @param {number} nMonth 그려진 달력의 월
         * @example
         *    calendar.on('afterDraw', function(oCustomEvent){ ... });
         **/
        this.fire('afterDraw', dateForDrawing);
    },

    /**
     * calendar text를 그려준다.
     * @param {{year: number, month: number}} dateForDrawing 화면에 나타낼 날짜 해시
     * @private
     */
    _setCalendarText: function(dateForDrawing) {
        var year = dateForDrawing.year,
            month = dateForDrawing.month;

        this._setCalendarToday();
        this._setCalendarTitle(year, month);
    },

    _drawDates: function(dateForDrawing, classPrefix) {
        var calUtil = this.constructor.Util,
            year = dateForDrawing.year,
            month = dateForDrawing.month,
            dayInWeek = 0,
            datePrevMonth = calUtil.getRelativeDate(0, -1, 0, dateForDrawing),
            dateNextMonth = calUtil.getRelativeDate(0, 1, 0, dateForDrawing),
            dates = [],
            firstDay = calUtil.getFirstDay(year, month),
            indexOfLastDate = this._fillDates(year, month, dates); // 데이터를 채우고 마지막날 데이터의 인덱스를 받아온다.

        // 채워진 데이터를 그린다
        util.forEach(dates, function(date, i) {
            var isPrevMonth = false,
                isNextMonth = false,
                $dateContainer = $(this._$dateContainerElement[i]),
                tempYear = year,
                tempMonth = month,
                eventData;

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
            }

            // 주말 표시
            this._setWeekend(dayInWeek, $dateContainer, classPrefix);

            // 오늘 날짜 표시
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
             * 달력을 그리면서 일이 표시될 때마다 발생
             * @param {string} type 커스텀 이벤트명
             * @param {boolean} isPrevMonth 그려질 날이 이전달의 날인지 여부
             * @param {boolean} isNextMonth 그려질 날이 다음달의 날인지 여부
             * @param {jQuery} $date 날이 쓰여질 대상 엘리먼트
             * @param {jQuery} $dateContainer className이 [prefix]week로 설정된 엘리먼트의 자식 엘리먼트, elDate와 같을 수 있음
             * @param {number} date 그려질 날의 일
             * @param {number} month 그려질 날의 월
             * @param {number} year 그려질 날의 연
             * @param {string} html 대상 엘리먼트에 쓰여질 HTML
             * @example
             *  // draw 커스텀 이벤트 핸들링
             *  calendar.on('draw', function(drawEvent){ ... });
             **/
            this.fire('draw', eventData);
        }, this);
    },


    _isToday: function(dateHash) {
        var today = this._today;

        return (
            today.year === dateHash.year &&
            today.month === dateHash.month &&
            today.date === dateHash.date
        );
    },

    /**
     * 한주 템플릿을 만든다.
     * @param {number} year 해당 연도
     * @param {number} month 해당 월
     * @private
     */
    _setWeeks: function(year, month) {
        var $elWeek,
            weeks = this.constructor.Util.getWeeks(year, month),
            i;
        for (i = 0; i < weeks; i += 1) {
            $elWeek = this.$weekTemplate.clone(true);
            $elWeek.appendTo(this.$weekAppendTarget);
            this._weekElements.push($elWeek);
        }
    },

    /**
     * 그려질 데이터들을 dates 배열에 저장
     * @param {string} year 그려질 연도
     * @param {string} month 그려질 달
     * @param {Array} dates 그려질 날짜 데이터
     * @return {number} index of last date
     * @private
     */
    _fillDates: function(year, month, dates) {
        var calUtil = this.constructor.Util,
            firstDay = calUtil.getFirstDay(year, month),
            lastDay = calUtil.getLastDay(year, month),
            lastDate = calUtil.getLastDate(year, month),
            datePrevMonth = calUtil.getRelativeDate(0, -1, 0, {year: year, month: month, date: 1}),
            prevMonthLastDate = calUtil.getLastDate(datePrevMonth.year, datePrevMonth.month),
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
     * 주말설정
     * @param {number} day 날짜
     * @param {jQuery} $dateContainer 날짜컨테이너 제이쿼리 엘리먼트 오브젝트
     * @param {string} classPrefix 클래스 프리픽스
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
     * 날짜 해시 반환
     * @returns {{year: number, month: number, date: number}} 날짜 해시
     */
    getDate: function() {
        return util.extend({}, this._date);
    },

    /**
     * 현재 달력의 날짜를 설정한다.
     * @param {number} [year] 연도 값 (ex. 2008)
     * @param {number} [month] 월 값 (1 ~ 12)
     * @param {number} [date] 일 값 (1 ~ 31)
     **/
    setDate: function(year, month, date) {
        var _date = this._date;
        _date.year = util.isNumber(year) ? year : _date.year;
        _date.month = util.isNumber(month) ? month : _date.month;
        _date.date = util.isNumber(date) ? date : _date.date;
    },

    /**
     * 현재 달력에 표시된 날짜를 설정한다.
     * @param {number} year 연도
     * @param {number} month 원
     * @private
     */
    _setShownDate: function(year, month) {
        this._shownDate.year = year || this._date.year;
        this._shownDate.month = month || this._date.month;
    },

    /**
     * 현재 달력이 그려진 년도와 월을 반환한다.
     * @returns {{year: number, month: month}} 현재 달력이 그려진 년도와 월
     */
    getShownDate: function() {
        return {
            year: this._shownDate.year,
            month: this._shownDate.month
        };
    },

    /**
     * 달력을 지운다
     * @private
     */
    _clear: function() {
        this._weekElements = [];
        this.$weekAppendTarget.empty();
    },

    /**
     * 현재 달력의 타이틀 영역을 옵션의 타이틀 포멧에 맞게 그린다.
     * @param {number} year 연도 값 (ex. 2008)
     * @param {(number|string)} month 월 값 (1 ~ 12)
     * @private
     **/
    _setCalendarTitle: function(year, month) {
        var option = this._option,
            $title = this.$title,
            titleFormat = option.titleFormat,
            replaceMap,
            reg;

        if (month < 10) {
            month = '0' + Number(month);
        }

        replaceMap = this._getReplaceMap(year, month);
        if (util.isNotEmpty($title)) {
            reg = /yyyy|yy|mm|m|M/g;
            this._setTitleText($title, titleFormat, replaceMap, reg);
        }

        $title = this.$titleYear;
        if (util.isNotEmpty($title)) {
            reg = /yyyy|yy/g;
            this._setTitleText($title, option.yearTitleFormat, replaceMap, reg);
        }

        $title = this.$titleMonth;
        if (util.isNotEmpty($title)) {
            reg = /mm|m|M/g;
            this._setTitleText($title, option.monthTitleFormat, replaceMap, reg);
        }
    },

    /**
     * 캘린더의 타이틀을 갱신한다.
     * @param {jQuery} $element 갱신될 엘리먼트
     * @param {string} form 변경될 날짜 형식
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
     * @param {string|number} year 연도
     * @param {string|number} month 월
     * @param {string|number} [date] 일
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
     * 텍스트를 변환하여 돌려준다.
     * @param {string} str 변환할 텍스트
     * @param {Object} map 변환키와 벨류 셋
     * @param {RegExp} reg 변환할 정규식
     * @returns {string} 변환된 문자열
     * @private
     */
    _getConvertedTitle: function(str, map, reg) {
        str = str.replace(reg, function(matchedString) {
            return map[matchedString] || '';
        });
        return str;
    },

    /**
     * 오늘날짜 앨리먼트 여부에 따라 오늘날짜를 그리는 데이터를 만들어 그린다.
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
            title;

        if ($today.length < 1) {
            return;
        }

        today = this._today;
        year = today.year;
        month = (today.month < 10) ? '0' + today.month : today.month;
        date = (today.date < 10) ? '0' + today.date : today.date;

        todayFormat = this._option.todayFormat;
        replaceMap = this._getReplaceMap(year, month, date);
        title = this._getConvertedTitle(todayFormat, replaceMap, /yyyy|yy|mm|m|M|dd|d|D/g);
        $today.text(title);
    },

    /**
     * 루트 엘리먼트를 돌려준다.
     * @returns {HTMLElement} container element
     */
    getElement: function() {
        return this._$element[0];
    }
});

ne.util.CustomEvents.mixin(ne.component.Calendar);
