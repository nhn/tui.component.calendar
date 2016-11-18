'use strict';

var Calendar = require('../src/calendar');
var utils = require('../src/utils');

function getReplacedString(str) {
    return str.replace(/(")|(\s*)/g, '').toLowerCase();
}

describe('캘린더를 생성하고 기능을 테스트.', function() {
    var calendar1,
        calendar2,
        calendar3;

    jasmine.getFixtures().fixturesPath = 'base';

    beforeEach(function() {
        loadFixtures('test/fixture/calendar.html');
        calendar1 = new Calendar({
            element: $('#layer')[0]
        });
        calendar2 = new Calendar({
            element: $('#layer2')[0],
            year: 1983,
            month: 5,
            date: 12,
            todayFormat: 'yyyy\/ mm\/ dd (D)',
            titleFormat: 'yyyy\/mm',
            yearTitleFormat: 'yyyy',
            monthTitleFormat: 'mm',
            monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayTitles: ['일', '월', '화', '수', '목', '금', '토']
        });

        calendar3 = new Calendar($('#layer3')[0]);
    });
    // 생성 확인
    it('캘린더가 생성 되었는지 확인', function() {
        expect(calendar1).toBeDefined();
        expect(calendar2).toBeDefined();
        expect(calendar3).toBeDefined();
    });

    it('calendar-header, calendar-body, calendar-footer 확인', function() {
        var $header = calendar1.$header,
            $body = calendar1.$body,
            $footer = calendar1.$footer;

        expect($header).toBeDefined();
        expect($body).toBeDefined();
        expect($footer).toBeDefined();

        $header = calendar2.$header;
        $body = calendar2.$body;
        $footer = calendar2.$footer;

        expect($header).toBeDefined();
        expect($body).toBeDefined();
        expect($footer).toBeDefined();

        $header = calendar3.$header;
        $body = calendar3.$body;
        $footer = calendar3.$footer;

        expect($header).toBeDefined();
        expect($body).toBeDefined();
        expect($footer).toBeDefined();
    });

    it('옵션 확인 - calendar1', function() {
        var classPrefix = calendar1._option.classPrefix,
            titleFormat = calendar1._option.titleFormat,
            yearTitleFormat = calendar1._option.yearTitleFormat,
            monthTitleFormat = calendar1._option.monthTitleFormat,
            dayTitles = calendar1._option.dayTitles;

        expect(classPrefix).toBe('calendar-');
        expect(titleFormat).toBe('yyyy-mm');
        expect(yearTitleFormat).toBe('yyyy');
        expect(monthTitleFormat).toBe('m');
        expect(dayTitles[0]).toBe('Sun');
    });

    it('옵션 확인 - calendar2', function() {
        var titleFormat = calendar2._option.titleFormat,
            yearTitleFormat = calendar2._option.yearTitleFormat,
            monthTitleFormat = calendar2._option.monthTitleFormat,
            dayTitles = calendar2._option.dayTitles;

        expect(titleFormat).toBe('yyyy\/mm');
        expect(yearTitleFormat).toBe('yyyy');
        expect(monthTitleFormat).toBe('mm');
        expect(dayTitles[0]).toBe('일');
    });

    it('_setCalendarTitle 달력 타이틀 포맷', function() {
        calendar2._setCalendarTitle(2014, 5);
        expect(calendar2.$titleYear.html()).toBe('2014');
        expect(calendar2.$titleMonth.html()).toBe('05');
    });

    it('custom Event 이벤트를 붙이고, draw를 통해 호출되는지 확인', function() {
        var date = {
            year: 1993,
            month: 5
        };
        calendar2.on('beforeDraw', function(d) {
            if (d.year > 2000) {
                return false;
            }
            //console.log(d);
            date.year = d.year;
            date.month = d.month;
        });
        calendar2.fire('beforeDraw', {year: 2014, month: 4});
        // 2000 보다 크기 때문에 변하지 않는다. date값 그대로
        expect(date.year).toBe(1993);
        expect(date.month).toBe(5);

        //현재 캘린더 설정 날자는 1983, 5
        calendar2.draw(0, 4, true);
        expect(date.year).toBe(1983);
        expect(date.month).toBe(9);

        calendar2.draw(-1, null, true);
        expect(date.year).toBe(1982);

        calendar2.draw(null, 12);
        expect(date.month).toBe(12);
    });

    it('현재 표현되는 달력의 날짜를 확인한다.', function() {
        var beforeShownDate,
            afterShownDate;

        calendar1.draw(2015, 1);

        beforeShownDate = calendar1.getDate();
        // 다음 달로 이동
        calendar1.draw(0, 1, true);
        afterShownDate = calendar1.getDate();
        expect(afterShownDate.year).toEqual(beforeShownDate.year);
        expect(afterShownDate.month).toEqual(beforeShownDate.month + 1);

        beforeShownDate = calendar1.getDate();
        // 다음 년도로 이동
        calendar1.draw(1, 0, true);
        afterShownDate = calendar1.getDate();
        expect(afterShownDate.year).toEqual(beforeShownDate.year + 1);
        expect(afterShownDate.month).toEqual(beforeShownDate.month);
    });
});

describe('v1.1.3 (Selectable calendar)', function() {
    var calendar1, calendar2;
    var $element1, $element2;
    var bodySelector = '.calendar-body';

    beforeEach(function() {
        loadFixtures('test/fixture/calendar.html');

        $element1 = $('#layer3');
        $element2 = $('#layer4');

        calendar1 = new Calendar({ // no markup & default options
            element: $element1
        });

        calendar2 = new Calendar({ // has markup & options for customizing
            element: $element2,
            year: 2018,
            month: 10,
            rangeOfYear: 15,
            yearTitleFormat: 'yyyy년'
        });
    });

    describe('Assigned view -', function() {
        it('When calendar is created, 3-body elements are generated by default.', function() {
            var $bodyElement;

            $bodyElement = $element1.find(bodySelector);
            expect($bodyElement.length).toBe(3);

            $bodyElement = $element2.find(bodySelector);
            expect($bodyElement.length).toBe(3);
        });

        it('When calendar is created with no markup,' +
            'rows template of each 3-body element is assigned by default markup.', function() {
            var monthsTemplate, yearsTemplate;
            var defaultMonthsTemplate = getReplacedString('<tr class="calendar-month-group">' +
                    '<td class="calendar-month"></td>' +
                    '<td class="calendar-month"></td>' +
                    '<td class="calendar-month"></td>' +
                '</tr>');
            var defaultYearsTemplate = getReplacedString('<tr class="calendar-year-group">' +
                    '<td class="calendar-year"></td>' +
                    '<td class="calendar-year"></td>' +
                    '<td class="calendar-year"></td>' +
                '</tr>');

            monthsTemplate = getReplacedString(calendar1.dataOfMonthLayer.template[0].outerHTML);
            yearsTemplate = getReplacedString(calendar1.dataOfYearLayer.template[0].outerHTML);

            expect(monthsTemplate).toBe(defaultMonthsTemplate);
            expect(yearsTemplate).toBe(defaultYearsTemplate);
        });
    });

    describe('Draw view - ', function() {
        var $monthsBody1, $monthsBody2;
        var $yearsBody1, $yearsBody2;
        var monthSelector = '.calendar-month';
        var yearSelector = '.calendar-year';
        var $calendarBodys;

        beforeEach(function() {
            $calendarBodys = $element2.find(bodySelector);

            $monthsBody1 = $element1.find(bodySelector).eq(1);
            $monthsBody2 = $element2.find(bodySelector).eq(1);

            $yearsBody1 = $element1.find(bodySelector).eq(2);
            $yearsBody2 = $element2.find(bodySelector).eq(2);
        });

        it('When calendar is created, "month" elements are attched to second "-body" element.', function() {
            var $monthEls;

            $monthEls = $monthsBody1.find(monthSelector);
            expect($monthEls.length).toBe(12);

            $monthEls = $monthsBody2.find(monthSelector);
            expect($monthEls.length).toBe(12);
        });

        it('When calendar is created, "year" elements are attched to third "-body" element.', function() {
            var $yearEls;

            $yearEls = $yearsBody1.find(yearSelector);
            expect($yearEls.length).toBe(12); // default value of "yearRanges"

            $yearEls = $yearsBody2.find(yearSelector);
            expect($yearEls.length).toBe(15); // with "yearRanges" options
        });

        it('When calendar is created,' +
            'default date is displayed on each "month" and "year" element.', function() {
            var $yearEl = $yearsBody2.find(yearSelector).eq(7); // default year is "2018"
            var $monthEl = $monthsBody2.find(monthSelector).eq(9); // default month is "10"
            var shownDateClassName = 'calendar-selected';

            expect($yearEl.hasClass(shownDateClassName)).toBe(true);
            expect($monthEl.hasClass(shownDateClassName)).toBe(true);
        });

        it('When setting date and redrawing calendar,' +
            'shown date infos are displayed on each "month" and "year" element.', function() {
            var $monthEl, $yearEl;
            var shownDateClassName = 'calendar-selected';

            calendar2.draw(2016, 1);

            $monthEl = $monthsBody2.find(monthSelector).eq(0); // "1" element
            $yearEl = $yearsBody2.find(yearSelector).eq(7); // "2016" element

            expect($monthEl.hasClass(shownDateClassName)).toBe(true);
            expect($yearEl.hasClass(shownDateClassName)).toBe(true);
        });

        it('If rendering date infos are same as today,' +
            'each date element(month & year) has "-today" class name.', function() {
            var today = utils.getToday();
            var yearIdx = 7; // index of drawing "year" element
            var monthIdx = today.month - 1; // index of drawing "month" element
            var todayClassName = 'calendar-today';
            var $yearEl, $monthEl;

            calendar1.draw(today.year, today.month); // set today

            $yearEl = $yearsBody1.find(yearSelector).eq(yearIdx);
            $monthEl = $monthsBody1.find(monthSelector).eq(monthIdx);

            expect($yearEl.hasClass(todayClassName)).toBe(true);
            expect($monthEl.hasClass(todayClassName)).toBe(true);
        });

        it('When  calendar is created, body view is changed to next "-body" element.', function() {
            var eventMock = {
                preventDefault: function() {}
            };

            calendar2._onClickTitle(eventMock); // show month layer

            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).not.toBe('none');
            expect($calendarBodys.eq(2).css('display')).toBe('none');

            calendar2._onClickTitle(eventMock); // show year layer

            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).not.toBe('none');

            calendar2._onClickTitle(eventMock); // show year layer (title isn't clickable)

            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).not.toBe('none');
        });
    });

    describe('Options -', function() {
        it('If "yearTitleFormat" option set, title of year or month layer is replaced by option.', function() {
            calendar2.draw(2016, 0, false, 'month');
            expect(calendar2.$title.text()).toBe('2016년');

            calendar2.draw(2015, 0, false, 'year');
            expect(calendar2.$title.text()).toBe('2008년 - 2022년');
        });
    });

    describe('Public APIs -', function() {
        var $calendarBodys;

        beforeEach(function() {
            $calendarBodys = $element1.find(bodySelector);
        });

        it('When "draw" is called, shown calendar layer is changed by string "shownType" parameter.', function() {
            calendar1.draw(2016, 10, false, 'month');

            expect(calendar1.$title.text()).toBe('2016');
            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).not.toBe('none');
            expect($calendarBodys.eq(2).css('display')).toBe('none');

            calendar1.draw(2016, 10, false, 'date');

            expect(calendar1.$title.text()).toBe('2016-10');
            expect($calendarBodys.eq(0).css('display')).not.toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).toBe('none');

            calendar1.draw(2016, 10, false, 'year');

            expect(calendar1.$title.text()).toBe('2009 - 2020');
            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).not.toBe('none');
        });

        it('When "draw" is called, shown calendar layer is changed by number "shownType" parameter.', function() {
            calendar1.draw(2016, 10, false, 1);

            expect(calendar1.$title.text()).toBe('2016');
            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).not.toBe('none');
            expect($calendarBodys.eq(2).css('display')).toBe('none');

            calendar1.draw(2016, 10, false, 0);

            expect(calendar1.$title.text()).toBe('2016-10');
            expect($calendarBodys.eq(0).css('display')).not.toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).toBe('none');

            calendar1.draw(2016, 10, false, 2);

            expect(calendar1.$title.text()).toBe('2009 - 2020');
            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).not.toBe('none');

            calendar1.draw(2016, 10);

            expect(calendar1.$title.text()).toBe('2009 - 2020');
            expect($calendarBodys.eq(0).css('display')).toBe('none');
            expect($calendarBodys.eq(1).css('display')).toBe('none');
            expect($calendarBodys.eq(2).css('display')).not.toBe('none');
        });
    });

    describe('Private method -', function() {
        it('"_getInfoOfYearRange" returns object of having start year and end year in range.', function() {
            var yearsInfo;

            yearsInfo = calendar1._getInfoOfYearRange(2016); // range: 12, group cnt: 3
            expect(yearsInfo).toEqual({startYear: 2009, endYear: 2020});

            yearsInfo = calendar2._getInfoOfYearRange(2016); // range: 15, group cnt: 5
            expect(yearsInfo).toEqual({startYear: 2009, endYear: 2023});
        });

        it('"_getConvertedYearTitle" returns replaced year text by "yearTitleFormat" option.', function() {
            var yearText = calendar2._getConvertedYearTitle(2011);

            expect(yearText).toBe('2011년');
        });
    });
});
