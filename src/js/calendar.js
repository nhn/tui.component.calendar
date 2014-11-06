window.ne = window.ne || {};
ne.component = ne.component || {};

/**
 * @fileoverview 캘린더 컴포넌트
 * (pug.Calendar 에서 분리)
 * @author 이제인(jein.yi@nhnent.com)
 */


/**
 * 캘린더 컴포넌트 클래스
 *
 * @param {Object} option
 * @constructor
 */

ne.component.Calendar = function(option, element) {
    /**
     * 옵션을 저장한다
     * @member
     */
    this._option;
    /**
     * 루트 엘리먼트를 저장한다
     * @member
     */
    this._element;

    /**
     * 커스텀이벤트를 저장한다.
     * @member
     */
    this._eventHandler = {};

    // 기본값 세팅
    var defaultOption = {
        classPrefix: 'calendar-',
        titleFormat: 'yyyy-mm',
        todayFormat: 'yyyy년 mm월 dd일 (D)',
        yearTitleFormat: 'yyyy',
        monthTitleFormat: 'm',
        monthTitles: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        dayTitles: ['일', '월', '화', '수', '목', '금', '토'],
        isDrawOnload: true
    };

    var hasOption = arguments.length > 1;
    if (hasOption) {
        this._option = ne.object.extend(defaultOption, option);
        this._element = element;
    } else {
        this._option = defaultOption;
        this._element = option;
    }

    var option = this._option,
        year = option['year'],
        month = option['month'],
        date = option['date'],
        key;

    // 기본 데이터가 없으면 오늘 날짜를 세팅한다.
    if (year && month && date) {
        this.setDate(year, month, date);
    } else {
        var today = ne.component.CalendarUtil.getToday();
        this.setDate(today.year, today.month, today.date);
    }

    // 오늘 날짜의 년, 월, 일이 옵션에 존재하지 않으면 복사해 넣는다.
    for (key in today) {
        if (!option[key]) {
            option[key] = today[key];
        }
    }

    this._assignHTMLElements();
    this._attachEvent();
    this.setDate(option['year'], option['month'], option['date']);

    if (option['isDrawOnload']) {
        this.draw();
    }
};





/**
 * 엘리먼트를 필드에 할당한다.
 *
 * @private
 */
ne.component.Calendar.prototype._assignHTMLElements = function() {

    var classPrefix = this._option['classPrefix'],
        $element = this._element,
        $weekTemplate;

    this.$btnPrevYear = $('.' + classPrefix +  'btn-prev-year', $element);
    this.$btnPrevMonth = $('.' + classPrefix + 'btn-prev-mon', $element);
    this.$btnNextMonth = $('.' + classPrefix + 'btn-next-mon', $element);
    this.$btnNextYear = $('.' + classPrefix + 'btn-next-year', $element);
    this.$bottom = $('.' + classPrefix + 'bottom', $element);
    this.$today = $('.' + classPrefix + 'today', $element);

    this.$title = $('.' + classPrefix + 'title', $element);
    this.$titleYear = $('.' + classPrefix + 'title-year', $element);
    this.$titleMonth = $('.' + classPrefix + 'title-month', $element);

    $weekTemplate = $('.' + classPrefix + 'week', $element);
    this.$weekTemplate = $weekTemplate.clone(true);
    this.$weekAppendTarget = $weekTemplate.parent();

};

ne.component.Calendar.prototype._attachEvent = function(){
    if (this.$btnPrevYear.length > 0) {
        this.$btnPrevYear.click($.proxy(function(clickEvent) {
            clickEvent.preventDefault();
            this.draw(-1, 0, true);
        }, this));
    }

    if (this.$btnPrevMonth.length > 0) {
        this.$btnPrevMonth.click($.proxy(function(clickEvent) {
            clickEvent.preventDefault();
            this.draw(0, -1, true);
        }, this));
    }

    if (this.$btnNextMonth.length > 0) {
        this.$btnNextMonth.click($.proxy(function(clickEvent) {
            clickEvent.preventDefault();
            this.draw(0, 1, true);
        }, this));
    }

    if (this.$btnNextYear.length > 0) {
        this.$btnNextYear.click($.proxy(function(clickEvent) {
            clickEvent.preventDefault();
            this.draw(1, 0, true);
        }, this));
    }

};

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
ne.component.Calendar.prototype.draw = function(year, month, isRelative) {

    var classPrefix = this._option['classPrefix'],
        date = this.getDate(),
        shownDate = this._getShownDate();
    if (shownDate && ne.type.isDefined(isRelative) && isRelative) {
        var relativeDate = ne.component.CalendarUtil.getRelativeDate(year, month, 0, shownDate);
        year = relativeDate.year;
        month = relativeDate.month;
    } else if (!ne.type.isDefined(year) && !ne.type.isDefined(month) && !ne.type.isDefined(isRelative)) {
        year = date.year;
        month = date.month;
    } else {
        year = year || shownDate.year;
        month = month || shownDate.month;
    }

    /**
     달력을 그리기 전에 발생

     @event beforeDraw
     @param {String} type 커스텀 이벤트명
     @param {Number} year 그려질 달력의 연도
     @param {Number} month 그려질 달력의 월
     @param {Function} stop 레이어 보여주는 것을 중단하는 메서드
     @example
     // beforeDraw 커스텀 이벤트 핸들링
     calendar.attach('beforeDraw', function(drawEvent){ ... });

     // 달력이 보여지지 않도록 처리
     calendar.attach('beforeShow', function(drawEvent){
					drawEvent.stop();
				});
     **/

    var isFired = this.fireEvent('beforeDraw', { year: year, month: month }),
        hasTodayElement = this.$today.length > 0;
    if (!isFired) {
        return;
    }

    this._setCalendarToday(hasTodayElement);
    this._setCalendarTitle(year, month);

    this._clear(ne.component.CalendarUtil.getWeeks(year, month));
    this._setShownDate(year, month);

    var today = this.getDate(),
        firstDay = ne.component.CalendarUtil.getFirstDay(year, month),
        lastDay = ne.component.CalendarUtil.getLastDay(year, month),
        lastDate = ne.component.CalendarUtil.getLastDate(year, month),
        day = 0,
        datePrevMonth = ne.component.CalendarUtil.getRelativeDate(0, -1, 0, {year: year, month: month, date: 1}),
        dateNextMonth = ne.component.CalendarUtil.getRelativeDate(0, 1, 0, {year: year, month: month, date: 1}),
        prevMonthLastDate = ne.component.CalendarUtil.getLastDate(datePrevMonth.year, datePrevMonth.month),
        dates = [],
        isPrevMonth,
        isNextMonth,
        $dateContainer,
        tempYear,
        tempMonth,
        param,
        indexOfLastDate,
        $elWeek,
        i,
        weeks = ne.component.CalendarUtil.getWeeks(year, month);

    for (i = 0; i < weeks; i++) {
        $elWeek = this.$weekTemplate.clone(true);
        $elWeek.appendTo(this.$weekAppendTarget);
        this._weekElements.push($elWeek);
    }

    this._$dateElement = $('.' + classPrefix + 'date', this.$weekAppendTarget);
    this._$dateContainerElement = $('.' + classPrefix + 'week > *', this.$weekAppendTarget);

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

    for (i = 0; i < dates.length; i++) {
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

        if (day === 0) {
            $dateContainer.addClass(classPrefix + 'sun');
        }
        if (day == 6) {
            $dateContainer.addClass(classPrefix + 'sat');
        }
        if (tempYear == today.year && (tempMonth * 1) == today.month && dates[i] == today.date) {
            $dateContainer.addClass(classPrefix + 'today');
        }

        param = {
            $date: $(this._$dateElement.get(i)),
            $dateContainer: $dateContainer,
            year: tempYear,
            month: tempMonth,
            date: dates[i],
            isPrevMonth: isPrevMonth,
            isNextMonth: isNextMonth,
            html: dates[i]
        };
        $(param.$date).html(param.html.toString());

        this._metaDatas.push({
            year: tempYear,
            month: tempMonth,
            date: dates[i]
        });

        day = (day + 1) % 7;

        /**
         달력을 그리면서 일이 표시될 때마다 발생

         @event draw
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
         calendar.attach('draw', function(drawEvent){ ... });

         // 10일에만 진하게 표시하기 예제
         calendar.attach('draw', function(darwEvent){
                        if(darwEvent.date == 10){
                            darwEvent.$date.html('<b>' + oCustomEvent.sHTML + '</b>');
                        }
                    });
         **/
        this.fireEvent('draw', param);
    }
    /**
     달력을 모두 그린 후에 발생

     @event afterDraw
     @param {String} sType 커스텀 이벤트명
     @param {Number} nYear 그려진 달력의 연도
     @param {Number} nMonth 그려진 달력의 월
     @example
     // afterDraw 커스텀 이벤트 핸들링
     calendar.attach('afterDraw', function(oCustomEvent){ ... });
     **/
    this.fireEvent('afterDraw', { year: year, month: month });
};

/**
 * 날짜데이터를 돌려준다
 *
 * @returns {Object}
 */
ne.component.Calendar.prototype.getDate = function() {
    return this._date;
};
/**
 * 현재 달력의 날짜를 설정한다.
 *
 * @param {Number} year 연도 값 (ex. 2008)
 * @param {Number} month 월 값 (1 ~ 12)
 * @param {Number} date 일 값 (1 ~ 31)
 **/
ne.component.Calendar.prototype.setDate = function(year, month, date) {
    this._date = {
        year : year,
        month : (month * 1),
        date : (date * 1)
    };
};
/**
 * 현재 달력에 표시된 날짜를 설정한다.
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} date
 */
ne.component.Calendar.prototype._setShownDate = function(year, month) {
    this._shownDate = {
        year : year,
        month : (month * 1),
        date : 1
    };
},
/**
 * 현재 달력에 표시된 날짜를 가져온다.
 *
 * @private
 * @returns {{year: Number, month: Number, date: Number}|*}
 */
ne.component.Calendar.prototype._getShownDate = function() {
    return this._shownDate || this.getDate();
};

/**
 * 커스텀 이벤트를 등록시킨다
 * @param {String|Object} eventType
 * @param {Function} handlerToAttach
 * @returns {ne.component.Pagination}
 */
ne.component.Calendar.prototype.attach = function(eventType, handlerToAttach) {
    if (arguments.length === 1) {
        var eventType,
            handler;
        for (eventType in arguments[0]) {
            handler = arguments[0][eventType];
            this.attach(eventType, handler);
        }
        return this;
    }

    var handlerList = this._eventHandler[eventType];
    if (!ne.type.isDefined(handlerList)) {
        handlerList = this._eventHandler[eventType] = [];
    }
    handlerList.push(handlerToAttach);

    return this;
};


/**
 * 이벤트를 발생시킨다.
 *
 * @param {String} eventType 커스텀 이벤트명
 * @param {Object} eventObject 커스텀 이벤트 핸들러에 전달되는 객체.
 * @return {Boolean} 핸들러의 커스텀 이벤트객체에서 stop메서드가 수행되면 false를 리턴
 */
ne.component.Calendar.prototype.fireEvent = function(eventType, eventObject) {
    eventObject = eventObject || {};

    var inlineHandler = this['on' + eventType],
        handlerList = this._eventHandler[eventType] || [],
        hasInlineHandler = $.isFunction(inlineHandler),
        hasHandlerList = handlerList.length > 0;

    if (!hasInlineHandler && !hasHandlerList) {
        return true;
    }

    handlerList = handlerList.concat(); //fireEvent수행시 핸들러 내부에서 detach되어도 최초수행시의 핸들러리스트는 모두 수행하게 하기위한 복사
    eventObject.eventType = eventType;

    if (!eventObject._extends) {
        eventObject._extends = [];

        eventObject.stop = function(){
            if (eventObject._extends.length > 0) {
                eventObject._extends[eventObject._extends.length - 1].canceled = true;
            }
        };
    }

    eventObject._extends.push({
        type: eventType,
        canceled: false
    });

    var argument = [eventObject],
        i,
        length;

    for (i = 2, length = arguments.length; i < length; i++){
        argument.push(arguments[i]);
    }

    if (hasInlineHandler) {
        inlineHandler.apply(this, argument);
    }

    if (hasHandlerList) {
        var handler;
        for (i = 0; (handler = handlerList[i]); i++) {
            handler.apply(this, argument);
        }
    }

    return !eventObject._extends.pop().canceled;
};

/**
 * 달력을 지운다
 *
 * @private
 */
ne.component.Calendar.prototype._clear = function() {
    this._metaDatas = [];
    this._weekElements = [];
    this.$weekAppendTarget.empty();
};


/**
 * 현재 달력의 타이틀 영역을 옵션의 타이틀 포멧에 맞게 그린다.
 *
 * @private
 * @param {Number} year 연도 값 (ex. 2008)
 * @param {Number} month 월 값 (1 ~ 12)
 **/
ne.component.Calendar.prototype._setCalendarTitle = function(year, month) {

    if (month < 10) {
        month = ('0' + (month * 1)).toString();
    }

    var $title = this.$title,
        titleFormat = this._option['titleFormat'],
        title,
        replaceMap = {
            yyyy: year,
            y: (year).toString().substr(2, 2),
            mm: month,
            m: (month * 1),
            M: this._option['monthTitles'][month - 1]
        };

    if (this.$title.length > 0) {
        title = titleFormat.replace(/yyyy|y|mm|m|M/g, function callback(matchedString) {
            return replaceMap[matchedString] || '';
        });
        $title.text(title);
    }

    if (this.$titleYear.length > 0) {
        $title = this.$titleYear;
        titleFormat = this._option['yearTitleFormat'];
        title = titleFormat.replace(/yyyy|y/g, function callback(matchedString) {
            return replaceMap[matchedString] || '';
        });
        $title.text(title);
    }

    if (this.$titleMonth.length > 0) {
        $title = this.$titleMonth;
        titleFormat = this._option['monthTitleFormat'];
        title = titleFormat.replace(/mm|m|M/g, function callback(matchedString) {
            return replaceMap[matchedString] || '';
        });
        $title.text(title);
    }


};

/**
 * 오늘날짜 앨리먼트 여부에 따라 오늘날짜를 그리는 데이터를 만들어 그린다.
 *
 * @param {Boolean} hasTodayElement 오늘날짜 표시 엘레먼트 존재여부
 * @private
 */
ne.component.Calendar.prototype._setCalendarToday = function(isExistTodayElement){
    if (!isExistTodayElement) {
        return;
    }

    var $today = this.$today,
        option = this._option,
        todayFormat = option['todayFormat'],
        title,
        today = this.getDate(),
        year = today.year,
        month = today.month,
        date = today.date,
        replaceMap = {
            yyyy: year,
            y: (year).toString().substr(2, 2),
            mm: month,
            m: (month * 1),
            M: option['monthTitles'][month - 1],
            dd: date,
            d: (date * 1),
            D: option['dayTitles'][new Date(year, month - 1, date).getDay()]
        };
    title = todayFormat.replace(/yyyy|y|mm|m|M|dd|d|D/g, function callback(matchedString) {
        return replaceMap[matchedString];
    });
    $today.text(title);
};
