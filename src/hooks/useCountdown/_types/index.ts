export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Params {
  targetDate: Date | string;
}

export type CountdownTimeZone = 'local' | 'GMT' | 'KST';

export interface Options {
  timeZone?: CountdownTimeZone;
}
