'use strict';

describe('캘린더를 생성하고 기능을 테스트.', function() {
    var calendar1,
        calendar2,
        calendar3;

    jasmine.getFixtures().fixturesPath = "base";

    beforeEach(function() {
        loadFixtures("test/fixture/calendar.html");
        calendar1 = new ne.component.Calendar({
            el: $('#layer')
        });
        calendar2 = new ne.component.Calendar({
            el: $('#layer2'),
            year: 1983,
            month: 5,
            date: 12,
            todayFormat: 'yyyy\/ mm\/ dd (D)',
            titleFormat: 'yyyy\/mm',
            yearTitleFormat: 'yyyy',
            monthTitleFormat: 'mm',
            monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        });

        calendar3 = new ne.component.Calendar($('#layer3'));
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
        expect(dayTitles[0]).toBe('일');
    });

    it('옵션 확인 - calendar2', function() {
        var titleFormat = calendar2._option.titleFormat,
            yearTitleFormat = calendar2._option.yearTitleFormat,
            monthTitleFormat = calendar2._option.monthTitleFormat,
            dayTitles = calendar2._option.dayTitles;

        expect(titleFormat).toBe('yyyy\/mm');
        expect(yearTitleFormat).toBe('yyyy');
        expect(monthTitleFormat).toBe('mm');
        expect(dayTitles[0]).toBe('Sun');
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
