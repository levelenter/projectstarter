import dayjsOrg, { Dayjs } from 'dayjs';
import { range } from './utils';
import 'dayjs/locale/ja';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjsOrg.extend(utc);
dayjsOrg.extend(timezone);

import relativeTime from 'dayjs/plugin/relativeTime';
dayjsOrg.extend(relativeTime);

dayjsOrg.locale('ja');

export const moment = dayjsOrg;
export const dayjs = dayjsOrg;

export const DT_FORMAT = 'YYYY-MM-DD HH:mm';
export const MONTH_FORMAT = 'YYYY-MM';
export const MONTH_FORMAT_JA = 'YYYY年MM月';
export const DT_FORMAT_INPUT = 'YYYY-MM-DDTHH:mm';
export const D_FORMAT_INPUT = 'YYYY-MM-DD';
export const DT_FORMAT_JA = 'YYYY年MM月DD日 HH時mm分';
export const DT_FORMAT_JA_WO_Y = 'MM月DD日 HH時mm分';
export const D_FORMAT_JA = 'YYYY年MM月DD日';
export const DW_FORMAT_JA = 'YYYY年MM月DD日(dddd)';
export const DTW_FORMAT_JA_SHORT = 'YYYY年MM月DD日(ddd) HH時mm分';
export const DW_FORMAT_JA_SHORT_WITHOUT_Y = 'MM月DD日(ddd) HH時mm分';
export const DW_FORMAT_JA_SHORT = 'YYYY年MM月DD日(ddd)';
export const DTW_FORMAT_JA = 'YYYY年MM月DD日(dddd) HH時mm分';
export const T_FORMAT = 'HH:mm';
export const T_FORMAT_JA = 'HH時mm分';
export const DTW_FORMAT_JA_WO_YM = `DD日(dd) HH時mm分`;

export type DayOfWeek = '月' | '火' | '水' | '木' | '金' | '土' | '日';
export const DayOfWeekMap = {
  日: 0,
  月: 1,
  火: 2,
  水: 3,
  木: 4,
  金: 5,
  土: 6,
};

export function getDayOfWeek(str: string): DayOfWeek {
  return str as DayOfWeek;
}

export const weekDayList: { value: string; title: string }[] = [
  { value: '月', title: '毎週月曜' },
  { value: '火', title: '毎週火曜' },
  { value: '水', title: '毎週水曜' },
  { value: '木', title: '毎週木曜' },
  { value: '金', title: '毎週金曜' },
  { value: '土', title: '毎週土曜' },
  { value: '日', title: '毎週日曜' },
];

export function getDayInMonth(year: number, month: number): Dayjs[] {
  const originDate = dayjs().set('year', year).set('month', month).set('date', 1);
  const dateList:dayjsOrg.Dayjs[] = [];
  for (const index of range(1, 31)) {
    // let date = originDate.clone();
    const date = originDate.set('date', index);
    if (date.get('month') > originDate.get('month')) {
      break;
    }
    dateList.push(date.clone());
  }
  return dateList;
}
export function getMonthAllDayWeek(year: number, month: number, dayOfWeek: DayOfWeek): Dayjs[] {
  console.log(dayOfWeek, dayOfWeek === '月');
  const dayOfWeekNumber = DayOfWeekMap[dayOfWeek];
  const days = getDayInMonth(year, month - 1);
  return days.filter((d) => d.day() === dayOfWeekNumber);
}

export function getSameDayOfWeek(firstDate: Dayjs, count: number) {
  const result:dayjsOrg.Dayjs[] = [];
  for (const i of range(0, count)) {
    result.push(firstDate.add(i * 7, 'day'));
  }
  return result;
}

export function getSameTermOfWeek(
  firstDate: { start: Dayjs; end: Dayjs },
  count: number
): { start: Dayjs; end: Dayjs }[] {
  const result: { start: Dayjs; end: Dayjs }[] = [];
  for (const i of range(0, count)) {
    result.push({
      start: firstDate.start.add(i * 7, 'day'),
      end: firstDate.end.add(i * 7, 'day'),
    });
  }
  return result;
}

export function getSameDayOfWeekToDate(firstDate: Dayjs, limitDate: Dayjs) {
  const result:dayjsOrg.Dayjs[] = [];
  let date = firstDate;
  while (date.diff(limitDate, 'd') <= 0) {
    result.push(date);
    date = date.add(7, 'day');
    console.log('date ', date.diff(limitDate, 'day'));
  }
  return result;
}

export function getSameTermOfWeekToDate(
  firstDate: { start: Dayjs; end: Dayjs },
  limitDate: Dayjs
): { start: Dayjs; end: Dayjs }[] {
  const result: { start: Dayjs; end: Dayjs }[] = [];
  let date: { start: Dayjs; end: Dayjs } = firstDate;
  while (date.start.diff(limitDate, 'd') <= 0) {
    result.push(date);
    date = { start: date.start.add(7, 'day'), end: date.end.add(7, 'day') };
  }
  return result;
}

export function isDayOfWeek(str: string): boolean {
  return Object.keys(DayOfWeekMap).includes(str);
}

/**
 * ハイフン区切りのYYYY-MMフォーマットからDayjs型をとる
 * @param yearMonth
 */
export function toObjFromYearMonthString(yearMonth: string): { year: number; month: number } {
  const year = yearMonth.split('-')[0];
  const month = parseInt(yearMonth.split('-')[1]);
  const day = dayjsOrg(`${year}-${month}-01`);
  return { year: day.year(), month: day.month() + 1 }; // 月の０始まりを補正
}

export function toDayjsFromYearMonth(year: number, month: number) {
  return dayjsOrg().startOf('month').set('year', year).set('month', month).add(1, 'month'); // 月の０始まりを補正
}

// dayjs.locale('ja', {
//   weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
//   weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
// });
