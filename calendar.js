 git /*!component-calendar v1.0.0 | NHN Entertainment*/
(function() {
 /* istanbul ignore if */

 ne.util.defineNamespace('ne.component');

/**
 * @fileoverview 캘린더 컴포넌트
 * (pug.Calendar 에서 분리)
 * @author NHN ENTERTAINMENT FE 개발팀(e0242@nhnent.com)
 * @author 이제인(jein.yi@nhnent.com)
 * @dependency jquery.1.8.3.js, code-snippet.js
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
})();