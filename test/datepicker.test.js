describe('데이터 피커를 테스트한다.', function() {

    jasmine.getStyleFixtures().fixturesPath = 'base';
    jasmine.getFixtures().fixturesPath = 'base';

    beforeEach(function() {
        loadStyleFixtures('test/css/common.css');
        loadFixtures('test/fixture/picker.html');
    });

    describe('picker를 생성하고 picker 기능을 테스트 한다.', function() {
        var picker,
            calendar;
        beforeEach(function() {
            calendar = new ne.component.Calendar({
                    year: 1983,
                    month: 5,
                    date: 12,
                    todayFormat: 'yyyy\/ mm\/ dd (D)',
                    titleFormat: 'yyyy\/mm',
                    yearTitleFormat: 'yyyy',
                    monthTitleFormat: 'mm',
                    monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    isDrawOnload: true
                }, $('#layer3'));
            picker = new ne.component.DatePicker({
                dateForm: 'yyyy-mm-dd',
                date: {
                    year: 1984,
                    month: 4,
                    date: 15
                },
                element: document.getElementById('datePick')
            }, calendar);
        });

        it('picker and calendar are defined?', function() {
            expect(picker).toBeDefined();
            expect(picker._calendar).toBeDefined();
        });

        it('setDate, set "2014-11-28', function() {
            picker.setDate(2014, 11, 28);
            var luckyday = picker.getDate();
            expect(luckyday.year).toBe(2014);
            expect(luckyday.month).toBe(11);
            expect(luckyday.date).toBe(28);
        });

        it('setDate _not valid date, set run with nothing', function() {
            var beforeYear = picker.getDate().year,
            beforeMonth = picker.getDate().month,
            beforeDate = picker.getDate().date;
            picker.setDate();
            var notday = picker.getDate();
            expect(notday.year).toBe(beforeYear);
            expect(notday.month).toBe(beforeMonth);
            expect(notday.date).toBe(beforeDate);
        });

        it('setDate _not valid date, set run with year and month', function() {
            var beforeYear = picker.getDate().year,
                beforeMonth = picker.getDate().month,
                beforeDate = picker.getDate().date;
            picker.setDate(1919, 7);
            var notday = picker.getDate();
            expect(notday.year).not.toBe(beforeYear);
            expect(notday.month).not.toBe(beforeMonth);
            expect(notday.date).toBe(beforeDate);
        });

        it('setDate _not valid date, set run with year', function() {
            var beforeYear = picker.getDate().year,
                beforeMonth = picker.getDate().month,
                beforeDate = picker.getDate().date;
            picker.setDate(1920);
            var notday = picker.getDate();
            expect(notday.year).not.toBe(beforeYear);
            expect(notday.month).toBe(beforeMonth);
            expect(notday.date).toBe(beforeDate);
        });

        it('_formed "yy-mm-dd" get 2014/11/28', function() {
            picker.setDate(2014, 11, 28);
            picker.setForm('yy/mm/dd');
            var str = picker._formed();
            expect(str).toBe('14/11/28');
        });

        it('_formed "yyyy-mm-dd" get 1984-04-15', function() {
            picker.setDate(1984, 4, 15);
            picker.setForm('yyyy-mm-dd');
            var str = picker._formed();
            expect(str).toBe('1984-04-15');
        });

        it('_formed "yy-m-d" get 84-4-2', function() {
            picker.setForm('yy-m-dd');
            var date = { year: 1984, month: 4, date: 2},
                str = picker._formed(date);
            expect(str).toBe('84-4-02');
        });

        it('"insertDate" insert datehash to change and push input element', function() {
            picker._dateForm = 'yyyy-mm-dd';
            var date = { year: 1982, month: 6, date: 12},
                str = picker._formed(date),
                element = picker._element;
            picker.insertDate(date);
            expect(str).toBe('1982-06-12');
            expect(element.value).toBe(str);
        });

        it('_arrangeLayer use _getBoundingClientRect', function() {
            var bound, calbound;

            bound = picker._getBoundingClientRect();
            picker._$calendarElement.show();
            picker._arrangeLayer();
            calbound = picker._getBoundingClientRect(picker._$calendarElement[0]);

            var isIE7 = navigator.userAgent.indexOf('MSIE') !== -1 && navigator.userAgent.indexOf('7.0') !== -1;

            expect(bound.left).toBe(isIE7 ? calbound.left - 2 : calbound.left);
            expect(bound.bottom).toBe(isIE7 ? calbound.top - 2 : calbound.top);

        });
        it('_extractDate', function() {
            var txt1 = '840415',
                txt2 = '19820612',
                txt3 = '20131231',
                txt4 = '14-04-22',
                txt5 = '1972/01/33';
            var res1 = picker._extractDate(txt1),
                res2 = picker._extractDate(txt2),
                res3 = picker._extractDate(txt3),
                res4 = picker._extractDate(txt4),
                res5 = picker._extractDate(txt5);
            expect(res1.year).toBe('2084');
            expect(res1.month).toBe('04');
            expect(res1.date).toBe('15');
            expect(res2.year).toBe('1982');
            expect(res2.month).toBe('06');
            expect(res2.date).toBe('12');
            expect(res3.year).toBe('2013');
            expect(res3.month).toBe('12');
            expect(res3.date).toBe('31');
            expect(res4.year).toBe('2014');
            expect(res4.month).toBe('04');
            expect(res4.date).toBe('22');
            expect(res5.year).toBe('1972');
            expect(res5.month).toBe('01');
            expect(res5.date).toBe('33');
        });
    });
    describe('picker의 동작을 테스트 한다', function() {
        var picker,
            calendar,
            picker2;
        beforeEach(function() {
            calendar = new ne.component.Calendar({
                year: 1983,
                month: 5,
                date: 12,
                todayFormat: 'yyyy\/ mm\/ dd (D)',
                titleFormat: 'yyyy\/mm',
                yearTitleFormat: 'yyyy',
                monthTitleFormat: 'mm',
                monthTitle: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                dayTitles: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                isDrawOnload: true
            }, $('#layer3'));
            picker = new ne.component.DatePicker({
                dateForm: 'yyyy-mm-dd',
                date: {
                    year: 2014,
                    month: 11,
                    date: 27
                },
                element: document.getElementById('datePick')
            }, calendar);
            picker2 = new ne.component.DatePicker({
                dateForm: 'yyyy-mm-dd',
                date: {
                    year: 2014,
                    month: 11,
                    date: 27
                },
                element: document.getElementById('datePick'),
                isRestrict: true,
                startDate: {
                    year: 2014,
                    month: 10,
                    date: 30
                },
                endDate: {
                    year: 2014,
                    month: 11,
                    date: 10
                }
            }, calendar);
        });
        it('open 캘린더를 열고, draw를 통해 다른연/월로 이동 -> picker의 date가 갱신되었는지 확인한다.', function() {
            var beforeDate,
                afterDate;

            calendar.draw();
            beforeDate = picker.getDate();

            beforeDate = {
                year: beforeDate.year,
                month: beforeDate.month
            };
            picker.open();
            calendar.draw('2014', '11');
            afterDate = picker.getDate();
            afterDate = {
                year: afterDate.year,
                month: afterDate.month
            };

            expect(beforeDate.year).not.toBe(afterDate.year);
            expect(beforeDate.month).not.toBe(afterDate.month);
            expect(afterDate.year).not.toBe(2014);
            expect(afterDate.month).not.toBe(11);
        });
        it('_getDateobject create New Date object', function() {
            var date = {
                    year: 2014,
                    month: 9,
                    date: 10
                },
                date2;
            date2 = picker._getDateObject(date);
            expect(date2.getFullYear()).toBe(2014);
            expect(date2.getMonth()).toBe(8);
            expect(date2.getDate()).toBe(10);
        });
        it('_checkRestrict, check date is available to select', function() {
            var date1 = {
                    year: 2014,
                    month: 11,
                    date: 1
                },
                date2 = {
                    year: 2014,
                    month: 7,
                    date: 30
                },
                restric, availd;
            availd = picker2._checkRestrict(date1);
            restric = picker2._checkRestrict(date2);
            expect(restric).toBeTruthy();
            expect(availd).toBeFalsy();
        });
        it('_bindDrawEventForSelectableRange 선택 불가능한 영역을 입힌다.', function() {
            var unselectableClass = 'unselectableClass';
            picker2._bindDrawEventForSelectableRange();
            calendar.draw(2014, 11);
            var unselectableList = picker2._$calendarElement.find('.selectableClass');
            // 10/30~11/10(12)
            expect(unselectableList.length).toBe(12);
        });
        it('_onClickCalendar 달력의 날짜를 눌렀을때를 테스트한다.', function() {
            var td = document.createElement('td');
            td.innerHTML = '<a>15</a>';
            var e = {
                target: td,
                stopPropagation: function() {}
            };
            picker2.open();
            picker2.setForm('dd-mm-yyyy');
            picker2._onClickCalendar(e);
            expect(picker2._element.value).toBe('15-11-2014');
        });
        it('_onKeydownPicker 엔터를 쳤을때와 아닐때, 동작테스트', function() {
            picker2.setDate('1984', '10', '11');
            picker2._element.value = '19840415';
            var e1 = {
                keyCode: 10
            };
            var e2 = {
                keyCode: 13
            };
            var res1,
                res2,
                res3;
            picker2._element.value = '17-04-11';
            picker2._onKeydownPicker(e1);
            res1 = picker2.getDate();

            expect(res1.year).toBe('1984');
            expect(res1.month).toBe('10');
            expect(res1.date).toBe('11');

            picker2._element.value = '17-04-11';
            picker2._onKeydownPicker(e2);
            res2 = picker2.getDate();

            // restric데이터라 갱신되지 않는다.
            expect(res2.year).toBe('1984');
            expect(res2.month).toBe('10');
            expect(res2.date).toBe('11');

            picker2._element.value = '14-11-09';
            picker2._onKeydownPicker(e2);
            res3 = picker2.getDate();

            expect(res3.year).toBe('2014');
            expect(res3.month).toBe('11');
            expect(res3.date).toBe('09');
        });
        it('_onKeydownPicker isReadOnly시 동작테스트', function() {
            var date = picker2.getDate();
            picker2._isReadOnly = true;
            picker2._element.value = '19840415';
            var e1 = {
                keyCode: 13
            };

            picker2._element.value = '14-11-09';
            picker2._onKeydownPicker(e1);

            expect(date.year).not.toBe('2014');
            expect(date.month).not.toBe('11');
            expect(date.date).not.toBe('09');
            picker2._isReadOnly = false;
        });
    });
});