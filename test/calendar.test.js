describe('캘린더를 생성하고 기능을 테스트.', function() {
    var calendar1 = new ne.Component.Calendar($('.test1')),
        calendar2 = new ne.Component.Calendar({
            classPrefix: 'cal-',
            year: 1983,
            month: 5,
            date: 12,
            todayFormat: 'yyyy\/ mm\/ dd (D)',
            titleFormat: 'yyyy\/mm',
            yearTitleFormat: 'yy',
            monthTitleFormat: 'mm',
            monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            isDrawOnload: false
        }, $('.test2'));

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

        expect(classPrefix).toBe('cal-');
        expect(titleFormat).toBe('yyyy\/mm');
        expect(yearTitleFormat).toBe('yy');
        expect(monthTitleFormat).toBe('mm');
        expect(dayTitles[0]).toBe('Sun');
        expect(isDrawOnload).toBe(false);
    });

    describe('정적 함수인 getDateHashTable을 테스트한다.', function() {
        var date = new Date();
        var date19840415 = new Date(1984, 3, 15, 00, 00);
        it('날짜해시가 제대로 생성되었는지 확인', function() {
            // 현재시간(로컬)
            hashDate = ne.Component.CalendarUtil.getDateHashTable(date);
            expect(hashDate.year).toBe(date.getFullYear());
            expect(hashDate.month).toBe(date.getMonth() + 1);
            expect(hashDate.date).toBe(date.getDate());
            // 특정 날짜(1984-04-15)
            hashDate = ne.Component.CalendarUtil.getDateHashTable(date19840415);
            expect(hashDate.year).toBe(1984);
            expect(hashDate.month).toBe(4);
            expect(hashDate.date).toBe(15);
        });
    });

    describe('static 함수 getToday와, setToday가 제대로 동작하는가?', function() {
        var today = ne.Component.CalendarUtil.getToday();
        var newDate = new Date();
        it('getToday, 설정된 today값이 없으면 오늘날짜 리턴한다, ', function() {
            expect(today.year).toBe(newDate.getFullYear());
            expect(today.month).toBe(newDate.getMonth() + 1);
            expect(today.date).toBe(newDate.getDate());
        });

        ne.Component.CalendarUtil.setToday(1984, 4, 15);
        var today2 = ne.Component.CalendarUtil.getToday();
        it('setToday로 날짜 설정 후, 제대로 동작했는지 테스트 한다.', function() {
            expect(today2.year).toBe(1984);
            expect(today2.month).toBe(4);
            expect(today2.date).toBe(15);
        });
    });

    describe('')
});