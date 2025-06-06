import _dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

_dayjs.extend(advancedFormat);
_dayjs.extend(duration);
_dayjs.extend(isoWeek);
_dayjs.extend(localizedFormat);
_dayjs.extend(relativeTime);
_dayjs.extend(timezone);
_dayjs.extend(utc);

export const dayjs = _dayjs;
export type { Dayjs } from "dayjs";
