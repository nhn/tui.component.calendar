'use strict';

var CONSTANTS = {
    relativeMonthValueKey: 'relativeMonthValue',
    prev: 'prev',
    prevYear: 'prev-year',
    prevMonth: 'prev-month',
    next: 'next',
    nextYear: 'next-year',
    nextMonth: 'next-month',
    selected: 'selected',
    today: 'today',
    clickable: 'clickable',
    calendarHeader: null,
    calendarBody: null,
    calendarFooter: null,
    defaultClassPrefixRegExp: /calendar-/g,
    titleRegExp: /yyyy|yy|mm|m|M/g,
    titleYearRegExp: /yyyy|yy/g,
    titleMonthRegExp: /mm|m|M/g,
    todayRegExp: /yyyy|yy|mm|m|M|dd|d|D/g,
    itemCountOfYear: 12,
    layerKeys: ['date', 'month', 'year']
};

/* eslint-disable */
CONSTANTS.calendarHeader = [
    '<div class="calendar-header">',
        '<a href="#" class="calendar-rollover calendar-btn-' + CONSTANTS.prev + '">Prev</a>',
        '<strong class="calendar-title"></strong>',
        '<a href="#" class="calendar-rollover calendar-btn-' + CONSTANTS.next + '">Next</a>',
    '</div>'].join('');

CONSTANTS.calendarBody = [
    '<div class="calendar-body">',
        '<table>',
            '<thead>',
                '<tr>',
                   '<th class="calendar-sun">Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fa</th><th class="calendar-sat">Sa</th>',
                '</tr>',
            '</thead>',
            '<tbody>',
                '<tr class="calendar-week">',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                    '<td class="calendar-date"></td>',
                '</tr>',
            '</tbody>',
        '</table>',
    '</div>',
    '<div class="calendar-body">',
        '<table>',
            '<tbody>',
                '<tr class="calendar-month-group">',
                    '<td class="calendar-month"></td>',
                    '<td class="calendar-month"></td>',
                    '<td class="calendar-month"></td>',
                '</tr>',
            '</tbody>',
        '</table>',
    '</div>',
    '<div class="calendar-body">',
        '<table>',
            '<tbody>',
                '<tr class="calendar-year-group">',
                    '<td class="calendar-year"></td>',
                    '<td class="calendar-year"></td>',
                    '<td class="calendar-year"></td>',
                '</tr>',
            '</tbody>',
        '</table>',
    '</div>'].join('');

CONSTANTS.calendarFooter = [
    '<div class="calendar-footer">',
        '<p>오늘 <em class="calendar-today"></em></p>',
    '</div>'].join('');
/* eslint-enable */

module.exports = CONSTANTS;
