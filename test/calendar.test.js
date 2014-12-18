describe('캘린더를 생성하고 기능을 테스트.', function() {


    jasmine.getFixtures().fixturesPath = "base";


    var calendar1, calendar2;
    beforeEach(function() {
        loadFixtures("test/fixture/calendar.html");
        calendar1 = new ne.component.Calendar($('#layer'));
        calendar2 = new ne.component.Calendar({
            year: 1983,
            month: 5,
            date: 12,
            todayFormat: 'yyyy\/ mm\/ dd (D)',
            titleFormat: 'yyyy\/mm',
            yearTitleFormat: 'yyyy',
            monthTitleFormat: 'mm',
            monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            isDrawOnload: false
        }, $('#layer2'));
    });
    // 생성 확인
    it('캘린더가 생성 되었는지 확인', function() {
        expect(calendar1).toBeDefined();
        expect(calendar2).toBeDefined();
    });
    it('옵션 확인', function() {
        var classPrefix = calendar1._option['classPrefix'],
            titleFormat = calendar1._option['titleFormat'],
            yearTitleFormat = calendar1._option['yearTitleFormat'],
            monthTitleFormat = calendar1._option['monthTitleFormat'],
            dayTitles = calendar1._option['dayTitles'],
            isDrawOnload = calendar1._option['isDrawOnload'];

        expect(classPrefix).toBe('calendar-');
        expect(titleFormat).toBe('yyyy-mm');
        expect(yearTitleFormat).toBe('yyyy');
        expect(monthTitleFormat).toBe('m');
        expect(dayTitles[0]).toBe('일');
        expect(isDrawOnload).toBe(true);

        var classPrefix = calendar2._option['classPrefix'],
            titleFormat = calendar2._option['titleFormat'],
            yearTitleFormat = calendar2._option['yearTitleFormat'],
            monthTitleFormat = calendar2._option['monthTitleFormat'],
            dayTitles = calendar2._option['dayTitles'],
            isDrawOnload = calendar2._option['isDrawOnload'];

        expect(titleFormat).toBe('yyyy\/mm');
        expect(yearTitleFormat).toBe('yyyy');
        expect(monthTitleFormat).toBe('mm');
        expect(dayTitles[0]).toBe('Sun');
        expect(isDrawOnload).toBe(false);
    });

    it('_setCalendarTitle 달력 타이틀 포맷', function() {
        calendar2._setCalendarTitle(2014,5);
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
        expect(date.month).toBe(9);

        calendar2.draw(null, 12);
        expect(date.year).toBe(1982);
        expect(date.month).toBe(12);
    });
});
