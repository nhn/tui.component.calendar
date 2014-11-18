describe('정적 함수들 테스트  ne.component.Calendar.CalendarUtil.', function() {

    it('날짜해시가 제대로 생성되었는지 확인', function() {
        var date = new Date(),
            date19840415 = new Date(1984, 3, 15, 00, 00);
        // 현재시간(로컬)
        hashDate = ne.component.Calendar.CalendarUtil.getDateHashTable(date);
        expect(hashDate.year).toBe(date.getFullYear());
        expect(hashDate.month).toBe(date.getMonth() + 1);
        expect(hashDate.date).toBe(date.getDate());
        // 특정 날짜(1984-04-15)
        hashDate = ne.component.Calendar.CalendarUtil.getDateHashTable(date19840415);
        expect(hashDate.year).toBe(1984);
        expect(hashDate.month).toBe(4);
        expect(hashDate.date).toBe(15);

        hashDate = ne.component.Calendar.CalendarUtil.getDateHashTable(1984, 4, 15);
        expect(hashDate.year).toBe(1984);
        expect(hashDate.month).toBe(4);
        expect(hashDate.date).toBe(15);
    });

    it('getToday, 설정된 today값이 없으면 오늘날짜 리턴한다, ', function() {
        var today = ne.component.Calendar.CalendarUtil.getToday();
        var newDate = new Date();
        expect(today.year).toBe(newDate.getFullYear());
        expect(today.month).toBe(newDate.getMonth() + 1);
        expect(today.date).toBe(newDate.getDate());
    });

    it('setToday로 날짜 설정 후, 제대로 동작했는지 테스트 한다.', function() {
        ne.component.Calendar.CalendarUtil.setToday(1984, 4, 15);
        var today2 = ne.component.Calendar.CalendarUtil.getToday();
        expect(today2.year).toBe(1984);
        expect(today2.month).toBe(4);
        expect(today2.date).toBe(15);
    });

    it('getTime, getDataObject', function() {
        var date = ne.component.Calendar.CalendarUtil.getDateObject(1984, 4, 15),
            date2 = ne.component.Calendar.CalendarUtil.getDateObject({
                year: 1984,
                month: 4,
                date: 15
            }),
            time1 = ne.component.Calendar.CalendarUtil.getTime({
                year: 1984,
                month: 4,
                date: 15
            }),
            time2 = date2.getTime();
        expect(date).toEqual(date2);
        expect(time1).toBe(time2);
    });

    it('getRelativeDate', function() {
        var pos = [0, 0, 1, {
                year: 1984,
                month: 7,
                date: 31
            }],
            date = ne.component.Calendar.CalendarUtil.getRelativeDate.apply(ne.component.Calendar.CalendarUtil, pos);
        expect(date.year).toBe(1984);
        expect(date.month).toBe(8);
        expect(date.date).toBe(1);
    });

});
