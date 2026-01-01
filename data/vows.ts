export interface VowItem {
  id: number;
  textRu: string;
  textEn: string;
}

export interface VowCategory {
  key: string;
  vows: VowItem[];
}

export const vowsData: VowCategory[] = [
  {
    key: 'tenPrinciples',
    vows: [
      {
        id: 1,
        textRu: 'сохранение жизни (отказ от убийства)',
        textEn: 'preserving life (abstaining from killing)',
      },
      {
        id: 2,
        textRu: 'уважение чужой собственности (отказ от кражи)',
        textEn: 'respecting others\' property (abstaining from stealing)',
      },
      {
        id: 3,
        textRu: 'уважение отношений (отказ от неподобающего сексуального поведения)',
        textEn: 'respecting relationships (abstaining from sexual misconduct)',
      },
      {
        id: 4,
        textRu: 'говорить правду (отказ от лжи)',
        textEn: 'speaking truth (abstaining from lying)',
      },
      {
        id: 5,
        textRu: 'отказ от разделяющей речи',
        textEn: 'abstaining from divisive speech',
      },
      {
        id: 6,
        textRu: 'отказ от грубой речи',
        textEn: 'abstaining from harsh speech',
      },
      {
        id: 7,
        textRu: 'отказ от бесполезной речи',
        textEn: 'abstaining from idle chatter',
      },
      {
        id: 8,
        textRu: 'отказ от алчности и зависти',
        textEn: 'abstaining from greed and envy',
      },
      {
        id: 9,
        textRu: 'отказ от злорадства',
        textEn: 'abstaining from malice',
      },
      {
        id: 10,
        textRu: 'сохранение правильного мировоззрения',
        textEn: 'maintaining right view',
      },
    ],
  },
  {
    key: 'freedom',
    vows: [
      {
        id: 1,
        textRu: 'после принятия прибежища в Будде не искать прибежища в мирских объектах и божествах',
        textEn: 'after taking refuge in the Buddha, not seeking refuge in worldly objects and deities',
      },
      {
        id: 2,
        textRu: 'после принятия прибежища в Дхарме не наносить вреда никаким живым существам',
        textEn: 'after taking refuge in the Dharma, not harming any living beings',
      },
      {
        id: 3,
        textRu: 'после принятия прибежища в Сангхе избегать близкого общения с людьми, не разделяющими веру в Путь',
        textEn: 'after taking refuge in the Sangha, avoiding close association with people who do not share faith in the Path',
      },
      {
        id: 4,
        textRu: 'почитать любое изображение Будды как самого Будду',
        textEn: 'honoring any image of the Buddha as the Buddha himself',
      },
      {
        id: 5,
        textRu: 'почитать любой написанный текст или даже одну букву как саму Дхарму',
        textEn: 'honoring any written text or even a single letter as the Dharma itself',
      },
      {
        id: 6,
        textRu: 'почитать даже лоскут шафрановой накидки как саму Сангху',
        textEn: 'honoring even a patch of saffron robe as the Sangha itself',
      },
      {
        id: 7,
        textRu: 'принимать прибежище снова и снова, помня о благих качествах объектов прибежища',
        textEn: 'taking refuge again and again, remembering the good qualities of the objects of refuge',
      },
      {
        id: 8,
        textRu: 'предлагать первую часть любой еды и питья объектам прибежища',
        textEn: 'offering the first portion of any food and drink to the objects of refuge',
      },
      {
        id: 9,
        textRu: 'поощрять других принимать прибежище',
        textEn: 'encouraging others to take refuge',
      },
      {
        id: 10,
        textRu: 'принимать прибежище три раза утром и три раза вечером',
        textEn: 'taking refuge three times in the morning and three times in the evening',
      },
      {
        id: 11,
        textRu: 'полностью полагаться на объекты прибежища во время любых действий',
        textEn: 'completely relying on the objects of refuge during any actions',
      },
      {
        id: 12,
        textRu: 'не отрекаться от Трех Драгоценностей даже ценою жизни',
        textEn: 'not renouncing the Three Jewels even at the cost of one\'s life',
      },
      {
        id: 13,
        textRu: 'не употреблять алкоголь или наркотики и не предлагать их другим',
        textEn: 'not consuming alcohol or drugs and not offering them to others',
      },
    ],
  },
  {
    key: 'bodhisattva',
    vows: [
      {
        id: 1,
        textRu: 'не восхвалять себя в корыстных целях',
        textEn: 'not praising oneself for selfish purposes',
      },
      {
        id: 2,
        textRu: 'не порицать и не критиковать других в корыстных целях',
        textEn: 'not criticizing or blaming others for selfish purposes',
      },
      {
        id: 3,
        textRu: 'нежелание давать Дхарму из чувства собственности',
        textEn: 'unwillingness to give Dharma out of possessiveness',
      },
      {
        id: 4,
        textRu: 'нежелание оказать материальную помощь из чувства собственничества',
        textEn: 'unwillingness to provide material help out of possessiveness',
      },
      {
        id: 5,
        textRu: 'не принимать чьи-либо извинения',
        textEn: 'not accepting someone\'s apology',
      },
      {
        id: 6,
        textRu: 'не наносить удары другому человеку',
        textEn: 'not striking another person',
      },
      {
        id: 7,
        textRu: 'не отрицать учение махаяны и не увлекаться ложной дхармой',
        textEn: 'not denying Mahayana teachings and not being attracted to false dharma',
      },
      {
        id: 8,
        textRu: 'не обучать ложной Дхарме',
        textEn: 'not teaching false Dharma',
      },
      {
        id: 9,
        textRu: 'не совершать кражу того, что принадлежит Трем Драгоценностям',
        textEn: 'not stealing what belongs to the Three Jewels',
      },
      {
        id: 10,
        textRu: 'не отрекаться от Дхармы путем отрицания любого из путей (слушателей, самосозданных Будд или махаяны)',
        textEn: 'not abandoning the Dharma by denying any of the paths (hearers, solitary realizers, or Mahayana)',
      },
      {
        id: 11,
        textRu: 'не лишать монахов их одеяния, статуса и не причинять им вреда',
        textEn: 'not depriving monks of their robes, status, and not harming them',
      },
      {
        id: 12,
        textRu: 'не совершать тягчайших деяний (убийство родителей, архата, раскол сангхи, вред Будде)',
        textEn: 'not committing heinous acts (killing parents, arhats, splitting the sangha, harming the Buddha)',
      },
      {
        id: 13,
        textRu: 'не разрушать селения, города, области или страны',
        textEn: 'not destroying villages, towns, regions, or countries',
      },
      {
        id: 14,
        textRu: 'не давать учение о пустоте неподготовленному человеку',
        textEn: 'not teaching emptiness to an unprepared person',
      },
      {
        id: 15,
        textRu: 'не отворачивать человека от стремления к просветлению',
        textEn: 'not turning someone away from the aspiration for enlightenment',
      },
      {
        id: 16,
        textRu: 'никогда не отказываться от стремления к просветлению',
        textEn: 'never abandoning the aspiration for enlightenment',
      },
    ],
  },
  {
    key: 'tantric',
    vows: [],
  },
  {
    key: 'nuns',
    vows: [],
  },
  {
    key: 'monks',
    vows: [],
  },
];

export const getVowsByCategory = (categoryKey: string): VowItem[] => {
  const category = vowsData.find((cat) => cat.key === categoryKey);
  return category ? category.vows : [];
};

export const getVowText = (categoryKey: string, vowId: number, language: 'ru' | 'en'): string => {
  const vows = getVowsByCategory(categoryKey);
  const vow = vows.find((v) => v.id === vowId);
  if (!vow) return '';
  return language === 'ru' ? vow.textRu : vow.textEn;
};
