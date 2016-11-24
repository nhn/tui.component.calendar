var utils = require('../src/utils');
describe('Canedlar calendarUtils test  calendarUtils.', function() {

    it('create date hash', function() {
        var date = new Date(),
            date19840415 = new Date(1984, 3, 15, 00, 00),
            hashDate;
        // now(local)
        hashDate = utils.getDateHash(date);
        expect(hashDate.year).toBe(date.getFullYear());
        expect(hashDate.month).toBe(date.getMonth() + 1);
        expect(hashDate.date).toBe(date.getDate());
        // some day (1984-04-15)
        hashDate = utils.getDateHash(date19840415);
        expect(hashDate.year).toBe(1984);
        expect(hashDate.month).toBe(4);
        expect(hashDate.date).toBe(15);

        hashDate = utils.getDateHash(1984, 4, 15);
        expect(hashDate.year).toBe(1984);
        expect(hashDate.month).toBe(4);
        expect(hashDate.date).toBe(15);
    });

    it('getToday', function() {
        var today = utils.getToday();
        var newDate = new Date();
        expect(today.year).toBe(newDate.getFullYear());
        expect(today.month).toBe(newDate.getMonth() + 1);
        expect(today.date).toBe(newDate.getDate());
    });

    it('getToday return date hash.', function() {
        var dateObj = new Date();
        var todayHash = utils.getToday();
        expect(todayHash.year).toBe(dateObj.getFullYear());
        expect(todayHash.month).toBe(dateObj.getMonth()+1);
        expect(todayHash.date).toBe(dateObj.getDate());
    });

    it('getTime, getDataObject', function() {
        var date = utils.getDateObject(1984, 4, 15),
            date2 = utils.getDateObject({
                year: 1984,
                month: 4,
                date: 15
            }),
            time1 = utils.getTime({
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
            date = utils.getRelativeDate.apply(utils, pos);
        expect(date.year).toBe(1984);
        expect(date.month).toBe(8);
        expect(date.date).toBe(1);
    });

});
