import { Language } from './translations';

export interface Timezone {
  value: string;
  labelRu: string;
  labelEn: string;
  offset: string;
}

export const timezones: Timezone[] = [
  { value: 'Pacific/Midway', labelRu: '(UTC-11:00) Остров Мидуэй', labelEn: '(UTC-11:00) Midway Island', offset: '-11:00' },
  { value: 'Pacific/Honolulu', labelRu: '(UTC-10:00) Гавайи', labelEn: '(UTC-10:00) Hawaii', offset: '-10:00' },
  { value: 'America/Anchorage', labelRu: '(UTC-09:00) Аляска', labelEn: '(UTC-09:00) Alaska', offset: '-09:00' },
  { value: 'America/Los_Angeles', labelRu: '(UTC-08:00) Тихоокеанское время (США и Канада)', labelEn: '(UTC-08:00) Pacific Time (US & Canada)', offset: '-08:00' },
  { value: 'America/Denver', labelRu: '(UTC-07:00) Горное время (США и Канада)', labelEn: '(UTC-07:00) Mountain Time (US & Canada)', offset: '-07:00' },
  { value: 'America/Chicago', labelRu: '(UTC-06:00) Центральное время (США и Канада)', labelEn: '(UTC-06:00) Central Time (US & Canada)', offset: '-06:00' },
  { value: 'America/New_York', labelRu: '(UTC-05:00) Восточное время (США и Канада)', labelEn: '(UTC-05:00) Eastern Time (US & Canada)', offset: '-05:00' },
  { value: 'America/Caracas', labelRu: '(UTC-04:00) Каракас', labelEn: '(UTC-04:00) Caracas', offset: '-04:00' },
  { value: 'America/Argentina/Buenos_Aires', labelRu: '(UTC-03:00) Буэнос-Айрес', labelEn: '(UTC-03:00) Buenos Aires', offset: '-03:00' },
  { value: 'Atlantic/South_Georgia', labelRu: '(UTC-02:00) Средняя Атлантика', labelEn: '(UTC-02:00) Mid-Atlantic', offset: '-02:00' },
  { value: 'Atlantic/Azores', labelRu: '(UTC-01:00) Азорские острова', labelEn: '(UTC-01:00) Azores', offset: '-01:00' },
  { value: 'Europe/London', labelRu: '(UTC+00:00) Лондон, Дублин', labelEn: '(UTC+00:00) London, Dublin', offset: '+00:00' },
  { value: 'Europe/Paris', labelRu: '(UTC+01:00) Париж, Берлин, Рим', labelEn: '(UTC+01:00) Paris, Berlin, Rome', offset: '+01:00' },
  { value: 'Europe/Athens', labelRu: '(UTC+02:00) Афины, Каир', labelEn: '(UTC+02:00) Athens, Cairo', offset: '+02:00' },
  { value: 'Europe/Moscow', labelRu: '(UTC+03:00) Москва, Санкт-Петербург', labelEn: '(UTC+03:00) Moscow, St. Petersburg', offset: '+03:00' },
  { value: 'Asia/Dubai', labelRu: '(UTC+04:00) Дубай, Абу-Даби', labelEn: '(UTC+04:00) Dubai, Abu Dhabi', offset: '+04:00' },
  { value: 'Asia/Yekaterinburg', labelRu: '(UTC+05:00) Екатеринбург', labelEn: '(UTC+05:00) Yekaterinburg', offset: '+05:00' },
  { value: 'Asia/Almaty', labelRu: '(UTC+06:00) Алматы, Новосибирск', labelEn: '(UTC+06:00) Almaty, Novosibirsk', offset: '+06:00' },
  { value: 'Asia/Bangkok', labelRu: '(UTC+07:00) Бангкок, Джакарта', labelEn: '(UTC+07:00) Bangkok, Jakarta', offset: '+07:00' },
  { value: 'Asia/Singapore', labelRu: '(UTC+08:00) Сингапур, Пекин, Гонконг', labelEn: '(UTC+08:00) Singapore, Beijing, Hong Kong', offset: '+08:00' },
  { value: 'Asia/Tokyo', labelRu: '(UTC+09:00) Токио, Сеул', labelEn: '(UTC+09:00) Tokyo, Seoul', offset: '+09:00' },
  { value: 'Australia/Sydney', labelRu: '(UTC+10:00) Сидней, Мельбурн', labelEn: '(UTC+10:00) Sydney, Melbourne', offset: '+10:00' },
  { value: 'Pacific/Noumea', labelRu: '(UTC+11:00) Нумеа', labelEn: '(UTC+11:00) Noumea', offset: '+11:00' },
  { value: 'Pacific/Auckland', labelRu: '(UTC+12:00) Окленд, Веллингтон', labelEn: '(UTC+12:00) Auckland, Wellington', offset: '+12:00' },
];

export const getTimezoneLabel = (tz: Timezone, language: Language): string => {
  return language === 'ru' ? tz.labelRu : tz.labelEn;
};
