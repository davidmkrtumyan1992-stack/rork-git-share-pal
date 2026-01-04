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
    key: 'freedom',
    vows: [
      {
        id: 1,
        textRu: 'После принятия прибежища в Будде не искать прибежища в мирских объектах и божествах.',
        textEn: 'After taking refuge in the Buddha, do not seek refuge in worldly objects or deities.',
      },
      {
        id: 2,
        textRu: 'После принятия прибежища в Дхарме не наносить вреда никаким живым существам.',
        textEn: 'After taking refuge in the Dharma, do not cause harm to any living being.',
      },
      {
        id: 3,
        textRu: 'После принятия прибежища в Сангхе избегать близкого общения с людьми, не разделяющими веру в Путь.',
        textEn: 'After taking refuge in the Sangha, avoid close association with those who do not share faith in the Path.',
      },
      {
        id: 4,
        textRu: 'После принятия прибежища в Будде почитать любое изображение Будды как самого Будду, независимо от материала или художественного качества.',
        textEn: 'After taking refuge in the Buddha, venerate any image of Him as the Buddha Himself, regardless of the material it is made of or its artistic quality.',
      },
      {
        id: 5,
        textRu: 'После принятия прибежища в Дхарме почитать любой написанный текст или даже одну букву как саму Дхарму.',
        textEn: 'After taking refuge in the Dharma, venerate any written text or even a single letter as the Dharma itself.',
      },
      {
        id: 6,
        textRu: 'После принятия прибежища в Сангхе почитать даже лоскут шафрановой накидки как саму Сангху.',
        textEn: 'After taking refuge in the Sangha, venerate even a fragment of a saffron robe as the Sangha itself.',
      },
      {
        id: 7,
        textRu: 'Принимать прибежище снова и снова, помня о возвышенных качествах объектов прибежища.',
        textEn: 'Take refuge again and again, remembering the sublime qualities of the objects of refuge.',
      },
      {
        id: 8,
        textRu: 'Предлагать первую часть любой еды и питья объектам прибежища, помня об их доброте.',
        textEn: 'Offer the first portion of any food or drink to the objects of refuge, remembering their kindness.',
      },
      {
        id: 9,
        textRu: 'Поощрять других принимать прибежище.',
        textEn: 'Encourage others to take refuge.',
      },
      {
        id: 10,
        textRu: 'Принимать прибежище три раза утром и три раза вечером, размышляя о его благотворном влиянии.',
        textEn: 'Take refuge three times in the morning and three times in the evening, contemplating its beneficial influence.',
      },
      {
        id: 11,
        textRu: 'Полностью полагаться на объекты прибежища во время любых предпринимаемых действий.',
        textEn: 'Rely completely on the objects of refuge in every action undertaken.',
      },
      {
        id: 12,
        textRu: 'С момента принятия прибежища не отрекаться от Трёх Драгоценностей даже ценою жизни или даже в мыслях.',
        textEn: 'From the moment of taking refuge, do not renounce the Three Jewels, even at the cost of your life or even in your thoughts.',
      },
    ],
  },
  {
    key: 'tenPrinciples',
    vows: [
      {
        id: 13,
        textRu: 'Убийство.',
        textEn: 'Killing.',
      },
      {
        id: 14,
        textRu: 'Воровство.',
        textEn: 'Stealing.',
      },
      {
        id: 15,
        textRu: 'Сексуальные проступки.',
        textEn: 'Sexual misconduct.',
      },
      {
        id: 16,
        textRu: 'Ложь.',
        textEn: 'Lying.',
      },
      {
        id: 17,
        textRu: 'Разделяющая речь.',
        textEn: 'Divisive speech.',
      },
      {
        id: 18,
        textRu: 'Грубая речь.',
        textEn: 'Harsh speech.',
      },
      {
        id: 19,
        textRu: 'Пустая болтовня (Бесполезная речь).',
        textEn: 'Idle gossip (Useless speech).',
      },
      {
        id: 20,
        textRu: 'Алчность и зависть.',
        textEn: 'Covetousness and envy.',
      },
      {
        id: 21,
        textRu: 'Недоброжелательность (Злонамеренность).',
        textEn: 'Ill will (Malice).',
      },
      {
        id: 22,
        textRu: 'Ложные воззрения.',
        textEn: 'Wrong view.',
      },
    ],
  },
  {
    key: 'pratimoksha',
    vows: [
      {
        id: 23,
        textRu: 'Не убивать человека или человеческий плод.',
        textEn: 'Not killing a human being or a human fetus.',
      },
      {
        id: 24,
        textRu: 'Не воровать ничего ценного.',
        textEn: 'Not stealing anything of value.',
      },
      {
        id: 25,
        textRu: 'Не лгать о своих духовных достижениях.',
        textEn: 'Not lying about one\'s spiritual attainments.',
      },
      {
        id: 26,
        textRu: 'Не совершать супружескую измену и избегать сексуальных проступков.',
        textEn: 'Not committing adultery and avoiding sexual misconduct.',
      },
      {
        id: 27,
        textRu: 'Не употреблять алкоголь или наркотики и не предлагать их другим.',
        textEn: 'Not consuming alcohol or drugs, and not offering them to others.',
      },
    ],
  },
  {
    key: 'bodhisattva',
    vows: [
      {
        id: 28,
        textRu: 'Восхвалять себя в корыстных целях.',
        textEn: 'Praising oneself for selfish gain.',
      },
      {
        id: 29,
        textRu: 'Порицать или критиковать других в корыстных целях.',
        textEn: 'Belittling or criticizing others for selfish gain.',
      },
      {
        id: 30,
        textRu: 'Не давать Дхарму из чувства собственничества.',
        textEn: 'Withholding the Dharma out of a sense of possessiveness.',
      },
      {
        id: 31,
        textRu: 'Не оказывать материальную помощь из чувства собственничества.',
        textEn: 'Withholding material aid out of a sense of possessiveness.',
      },
      {
        id: 32,
        textRu: 'Не принимать чьи-либо извинения.',
        textEn: 'Refusing to accept someone\'s apologies.',
      },
      {
        id: 33,
        textRu: 'Наносить удары другому человеку.',
        textEn: 'Striking another person.',
      },
      {
        id: 34,
        textRu: 'Отрицать учение Махаяны как не являющееся словом Будды и увлекаться ложной дхармой.',
        textEn: 'Denying the Mahayana teachings as not being the Buddha\'s word and becoming involved in false dharma.',
      },
      {
        id: 35,
        textRu: 'Обучать ложной Дхарме.',
        textEn: 'Teaching false Dharma.',
      },
      {
        id: 36,
        textRu: 'Красть то, что принадлежит Драгоценности Будды.',
        textEn: 'Stealing what belongs to the Jewel of the Buddha.',
      },
      {
        id: 37,
        textRu: 'Красть то, что принадлежит Драгоценности Дхармы.',
        textEn: 'Stealing what belongs to the Jewel of the Dharma.',
      },
      {
        id: 38,
        textRu: 'Красть то, что принадлежит Драгоценности Сангхи.',
        textEn: 'Stealing what belongs to the Jewel of the Sangha.',
      },
      {
        id: 39,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Слушателей (Шраваков).',
        textEn: 'Renouncing the Dharma by denying the Path of Listeners (Shravakas).',
      },
      {
        id: 40,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Самосозданных Будд (Пратьекабудд).',
        textEn: 'Renouncing the Dharma by denying the Path of Solitary Realizers (Pratyekabuddhas).',
      },
      {
        id: 41,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Махаяны.',
        textEn: 'Renouncing the Dharma by denying the Mahayana Path.',
      },
      {
        id: 42,
        textRu: 'Лишать монахов их монашеского одеяния, избивать или заключать их в тюрьму.',
        textEn: 'Depriving monks of their monastic robes, beating them, or imprisoning them.',
      },
      {
        id: 43,
        textRu: 'Лишать монахов их монашеского статуса.',
        textEn: 'Depriving monks of their monastic status.',
      },
      {
        id: 44,
        textRu: 'Совершать тягчайшее деяние — убийство отца.',
        textEn: 'Committing the heinous act of killing one\'s father.',
      },
      {
        id: 45,
        textRu: 'Совершать тягчайшее деяние — убийство матери.',
        textEn: 'Committing the heinous act of killing one\'s mother.',
      },
      {
        id: 46,
        textRu: 'Совершать тягчайшее деяние — убийство Архата.',
        textEn: 'Committing the heinous act of killing an Arhat.',
      },
      {
        id: 47,
        textRu: 'Совершать тягчайшее деяние — раскол в Сангхе.',
        textEn: 'Committing the heinous act of creating a schism in the Sangha.',
      },
      {
        id: 48,
        textRu: 'Совершать тягчайшее деяние — попытка навредить Будде со злым умыслом.',
        textEn: 'Committing the heinous act of attempting to harm the Buddha with malicious intent.',
      },
      {
        id: 49,
        textRu: 'Придерживаться ложных воззрений: отрицать законы кармы и существование прошлых и будущих жизней.',
        textEn: 'Holding wrong views: denying the laws of karma and the existence of past and future lives.',
      },
      {
        id: 50,
        textRu: 'Разрушать деревни.',
        textEn: 'Destroying villages.',
      },
      {
        id: 51,
        textRu: 'Разрушать города.',
        textEn: 'Destroying towns.',
      },
      {
        id: 52,
        textRu: 'Разрушать целые области.',
        textEn: 'Destroying entire provinces.',
      },
      {
        id: 53,
        textRu: 'Разрушать целые страны.',
        textEn: 'Destroying entire countries.',
      },
      {
        id: 54,
        textRu: 'Давать учение о пустоте неподготовленному человеку.',
        textEn: 'Giving teachings on emptiness to an unprepared person.',
      },
      {
        id: 55,
        textRu: 'Отворачивать человека от стремления к просветлению.',
        textEn: 'Turning a person away from the aspiration for enlightenment.',
      },
      {
        id: 56,
        textRu: 'Принуждать человека отказаться от обетов Индивидуального Освобождения (Пратимокши).',
        textEn: 'Compelling a person to renounce their vows of Individual Liberation (Pratimoksha).',
      },
      {
        id: 57,
        textRu: 'Критиковать Путь Слушателей и утверждать, что этот путь не может победить желания и т.д.',
        textEn: 'Criticizing the Path of Listeners and claiming that this path cannot conquer desires, etc.',
      },
      {
        id: 58,
        textRu: 'Осуждать и критиковать других из желания похвалы.',
        textEn: 'Condemning and criticizing others out of a desire for praise.',
      },
      {
        id: 59,
        textRu: 'Ложно утверждать, что вы постигли пустоту.',
        textEn: 'Making a false claim that you have realized emptiness.',
      },
      {
        id: 60,
        textRu: 'Принимать дары, принадлежащие Драгоценности Сангхи или монахам.',
        textEn: 'Accepting gifts that belong to the Jewel of the Sangha or to monks.',
      },
      {
        id: 61,
        textRu: 'Принижать медитативную практику и отдавать имущество медитаторов тем, кто практикует начитывание.',
        textEn: 'Belittling meditative practice and giving the property of meditators to those who practice recitation.',
      },
      {
        id: 62,
        textRu: 'Отказываться от стремления к просветлению (Бодхичитты).',
        textEn: 'Abandoning the aspiration for enlightenment (Bodhicitta).',
      },
      {
        id: 63,
        textRu: 'Не делать ежедневных подношений Трём Драгоценностям телом, речью и умом.',
        textEn: 'Failing to make daily offerings to the Three Jewels with body, speech, and mind.',
      },
      {
        id: 64,
        textRu: 'Не сдерживать мысли похоти, привязанности и неудовлетворённости тем, что имеешь.',
        textEn: 'Failing to restrain thoughts of lust, attachment, and dissatisfaction with what one has.',
      },
      {
        id: 65,
        textRu: 'Не проявлять уважение к тем, кто принял обеты Бодхисаттвы раньше вас.',
        textEn: 'Failing to show respect to those who took Bodhisattva vows before you.',
      },
      {
        id: 66,
        textRu: 'Не отвечать на вопросы из-за гнева или лени.',
        textEn: 'Failing to answer questions out of anger or laziness.',
      },
      {
        id: 67,
        textRu: 'Не принимать приглашение из-за гордыни, злобы, гнева или лени.',
        textEn: 'Failing to accept an invitation out of pride, malice, anger, or laziness.',
      },
      {
        id: 68,
        textRu: 'Не принимать денежные или другие подношения из желания навредить дарителю, или из гнева, или лени.',
        textEn: 'Failing to accept monetary or other offerings out of a desire to harm the giver, or out of anger or laziness.',
      },
      {
        id: 69,
        textRu: 'Отказывать в учении Дхарме искренне заинтересованному человеку из желания навредить ему, или из лени, гнева или зависти.',
        textEn: 'Refusing to give Dharma teachings to a sincerely interested person out of a desire to harm them, or out of laziness, anger, or envy.',
      },
      {
        id: 70,
        textRu: 'Пренебрегать человеком, чьё поведение кажется неэтичным, из желания навредить ему, или из гнева, или лени.',
        textEn: 'Disregarding a person whose behavior seems unethical out of a desire to harm them, or out of anger or laziness.',
      },
      {
        id: 71,
        textRu: 'Не следовать обетам Индивидуального Освобождения, когда это помогает другим развить веру.',
        textEn: 'Failing to follow vows of Individual Liberation when doing so helps others develop faith.',
      },
      {
        id: 72,
        textRu: 'Совершать действие, приносящее меньше пользы другим.',
        textEn: 'Performing an action of lesser benefit for others.',
      },
      {
        id: 73,
        textRu: 'Отказываться нарушить один из первых семи этических принципов из сострадания (если вы соответствуете особым требованиям, изученным с Ламой).',
        textEn: 'Refusing to violate one of the first seven ethical principles out of compassion (if you meet the extraordinary requirements studied with a Lama).',
      },
      {
        id: 74,
        textRu: 'Нечестный заработок через притворство.',
        textEn: 'Dishonest livelihood through pretension.',
      },
      {
        id: 75,
        textRu: 'Нечестный заработок через лесть.',
        textEn: 'Dishonest livelihood through flattery.',
      },
      {
        id: 76,
        textRu: 'Нечестный заработок через намёки.',
        textEn: 'Dishonest livelihood through hinting.',
      },
      {
        id: 77,
        textRu: 'Нечестный заработок через принуждение.',
        textEn: 'Dishonest livelihood through coercion.',
      },
      {
        id: 78,
        textRu: 'Нечестный заработок через ловушки.',
        textEn: 'Dishonest livelihood through entrapment.',
      },
      {
        id: 79,
        textRu: 'Терять самоконтроль, совершать несдержанные или глупые поступки, или провоцировать других на такие поступки.',
        textEn: 'Losing self-control, committing unrestrained or foolish acts, or provoking others to do so.',
      },
      {
        id: 80,
        textRu: 'Думать, что для помощи другим нужно оставаться в цикле Сансары.',
        textEn: 'Thinking that to help others, one must remain in the cycle of Samsara.',
      },
      {
        id: 81,
        textRu: 'Не предпринимать действий, чтобы остановить плохие слухи о себе.',
        textEn: 'Failing to take action to stop bad rumors about oneself.',
      },
      {
        id: 82,
        textRu: 'Не исправлять кого-либо негативным способом, когда это необходимо.',
        textEn: 'Failing to correct someone in a negative way when it ought to be done.',
      },
      {
        id: 83,
        textRu: 'Отвечать на словесные оскорбления словесными оскорблениями.',
        textEn: 'Repaying verbal abuse with verbal abuse.',
      },
      {
        id: 84,
        textRu: 'Отвечать на гнев гневом.',
        textEn: 'Repaying anger with anger.',
      },
      {
        id: 85,
        textRu: 'Отвечать на удар ударом.',
        textEn: 'Repaying a blow with a blow.',
      },
      {
        id: 86,
        textRu: 'Отвечать на критику критикой.',
        textEn: 'Repaying criticism with criticism.',
      },
      {
        id: 87,
        textRu: 'Игнорировать тех, кто злится на вас, и не объяснять своё поведение из злобы, гордыни или лени.',
        textEn: 'Ignoring those who are angry with you and failing to explain your behavior out of malice, pride, or laziness.',
      },
      {
        id: 88,
        textRu: 'Не принимать извинения другого человека из желания навредить ему, злых мыслей или просто потому, что не хотите.',
        textEn: 'Refusing to accept another person\'s apology out of a desire to harm them, malicious thoughts, or simply because you do not want to.',
      },
      {
        id: 89,
        textRu: 'Не предпринимать действий для прекращения гневных мыслей.',
        textEn: 'Failing to take action to stop angry thoughts.',
      },
      {
        id: 90,
        textRu: 'Собирать учеников по эгоистичным причинам, таким как получение признания, услуг или подношений.',
        textEn: 'Gathering disciples for selfish reasons, such as obtaining recognition, services, or offerings.',
      },
      {
        id: 91,
        textRu: 'Не бороться с ленью.',
        textEn: 'Failing to combat laziness.',
      },
      {
        id: 92,
        textRu: 'Проводить время в пустой болтовне исключительно ради удовольствия.',
        textEn: 'Spending time in idle talk solely for pleasure.',
      },
      {
        id: 93,
        textRu: 'Не прилагать усилий для улучшения медитации из желания навредить кому-то или из лени.',
        textEn: 'Failing to exert effort to improve meditation out of a desire to harm someone or out of laziness.',
      },
      {
        id: 94,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как умственное возбуждение и тоска по кому-то или чему-то.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as mental agitation and longing for someone or something.',
      },
      {
        id: 95,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как недобрые мысли.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as unkind thoughts.',
      },
      {
        id: 96,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как сонливость и тупость ума.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as sleepiness and dullness of mind.',
      },
      {
        id: 97,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как жажда чувственных объектов.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as craving for sensory objects.',
      },
      {
        id: 98,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как неразрешённые сомнения.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as unresolved doubts.',
      },
      {
        id: 99,
        textRu: 'Считать, что удовольствие, достигнутое через медитативную практику, является главным духовным достижением.',
        textEn: 'Believing that the pleasure achieved through meditative practice is a major spiritual attainment.',
      },
      {
        id: 100,
        textRu: 'Отвергать Путь Слушателей, утверждая, что Бодхисаттвы не должны его изучать и, в частности, не должны соблюдать обеты Индивидуального Освобождения.',
        textEn: 'Rejecting the Path of Listeners, claiming that Bodhisattvas should not study it and, in particular, should not observe vows of Individual Liberation.',
      },
      {
        id: 101,
        textRu: 'Посвящать усилия изучению писаний Слушателей, когда нам доступны писания Махаяны.',
        textEn: 'Devoting effort to studying the scriptures of Listeners while Mahayana scriptures are available to us.',
      },
      {
        id: 102,
        textRu: 'Изучать небуддийские тексты, когда в этом нет необходимости и вы могли бы изучать учения Будд.',
        textEn: 'Studying non-Buddhist texts when there is no need for it and you could be studying the teachings of the Buddhas.',
      },
      {
        id: 103,
        textRu: 'Увлекаться небуддийскими текстами, даже когда есть необходимость их изучать.',
        textEn: 'Becoming engrossed in non-Buddhist texts even when there is a necessity to study them.',
      },
      {
        id: 104,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Эта часть не так уж важна».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This part is not all that important".',
      },
      {
        id: 105,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Этот текст хуже других».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This text is inferior to others".',
      },
      {
        id: 106,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Автор этой части не очень хорош».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "The author of this part is not very good".',
      },
      {
        id: 107,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Эта часть не увеличит благополучие живых существ».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This part will not increase the well-being of living beings".',
      },
      {
        id: 108,
        textRu: 'Восхвалять себя из гордыни или гнева.',
        textEn: 'Praising oneself out of pride or anger.',
      },
      {
        id: 109,
        textRu: 'Принижать и критиковать других из гордыни или гнева.',
        textEn: 'Belittling and criticizing others out of pride or anger.',
      },
      {
        id: 110,
        textRu: 'Отказываться идти слушать Дхарму из гордыни или гнева.',
        textEn: 'Refusing to go and listen to the Dharma out of pride or anger.',
      },
      {
        id: 111,
        textRu: 'Сосредотачиваться на сосуде, а не на его содержимом: на учителе и его недостатках, а не на учении.',
        textEn: 'Focusing on the vessel rather than its contents: on the teacher and their faults rather than the teaching.',
      },
      {
        id: 112,
        textRu: 'Не оказывать помощь из гнева или лени в совершении полезного дела.',
        textEn: 'Failing to provide help, out of anger or laziness, in performing a useful deed.',
      },
      {
        id: 113,
        textRu: 'Не оказывать помощь из гнева или лени тому, кто хочет добраться до определённого места.',
        textEn: 'Failing to provide help, out of anger or laziness, to someone who wishes to reach a certain place.',
      },
      {
        id: 114,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в изучении языка.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in language learning.',
      },
      {
        id: 115,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в освоении нового дела (не приносящего вреда никому).',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in mastering a new task (that brings no harm to anyone).',
      },
      {
        id: 116,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в защите своего имущества.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in protecting their property.',
      },
      {
        id: 117,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в примирении людей.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in reconciling people.',
      },
      {
        id: 118,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, планирующему добродетельное дело.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person planning a virtuous deed.',
      },
      {
        id: 119,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в совершении добродетельного дела общего характера.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in performing a virtuous deed of a general nature.',
      },
      {
        id: 120,
        textRu: 'Не оказывать помощь больным из гнева или лени.',
        textEn: 'Failing to provide help to the sick out of anger or laziness.',
      },
      {
        id: 121,
        textRu: 'Не пытаться облегчить страдания слепых из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the blind.',
      },
      {
        id: 122,
        textRu: 'Не пытаться облегчить страдания глухих из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the deaf.',
      },
      {
        id: 123,
        textRu: 'Не пытаться облегчить страдания людей с инвалидностью из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the disabled.',
      },
      {
        id: 124,
        textRu: 'Не пытаться облегчить страдания людей, измученных путешествием, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people exhausted by travel.',
      },
      {
        id: 125,
        textRu: 'Не пытаться облегчить страдания людей под влиянием одной из пяти духовных помех из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people under the influence of one of the five spiritual hindrances.',
      },
      {
        id: 126,
        textRu: 'Не пытаться облегчить страдания людей, охваченных враждебными мыслями, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people overcome by hostile thoughts.',
      },
      {
        id: 127,
        textRu: 'Не пытаться облегчить страдания людей, потерпевших поражение, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people who have suffered defeat.',
      },
      {
        id: 128,
        textRu: 'Не пытаться урезонить из гнева или лени человека, предпринимающего опасные действия.',
        textEn: 'Failing to attempt to reason with, out of anger or laziness, a person undertaking dangerous actions.',
      },
      {
        id: 129,
        textRu: 'Не отплатить кому-либо за оказанную помощь из желания навредить или лени.',
        textEn: 'Failing to repay someone for help provided, out of a desire to harm or laziness.',
      },
      {
        id: 130,
        textRu: 'Не прилагать усилий для облегчения страданий скорбящего человека из желания навредить или лени.',
        textEn: 'Failing to exert effort to alleviate the suffering of a grieving person out of a desire to harm or laziness.',
      },
      {
        id: 131,
        textRu: 'Не давать деньги или другие материальные ценности из желания навредить или лени тому, кто хочет их получить.',
        textEn: 'Failing to give money or other material values, out of a desire to harm or laziness, to one who wishes to receive them.',
      },
      {
        id: 132,
        textRu: 'Не заботиться о нуждах своих учеников из желания навредить или лени.',
        textEn: 'Failing to care for the needs of your disciples out of a desire to harm or laziness.',
      },
      {
        id: 133,
        textRu: 'Не искать способа наладить отношения с кем-либо из желания навредить или лени.',
        textEn: 'Failing to seek a way to build a relationship with someone out of a desire to harm or laziness.',
      },
      {
        id: 134,
        textRu: 'Не хвалить чьи-либо хорошие качества из желания навредить или лени.',
        textEn: 'Failing to praise someone\'s good qualities out of a desire to harm or laziness.',
      },
      {
        id: 135,
        textRu: 'Не применять суровые меры для дисциплинирования других, когда ситуация этого требует, из лени или другого духовного недуга.',
        textEn: 'Failing to apply harsh measures to discipline others when the situation requires it, out of laziness or another spiritual ailment.',
      },
      {
        id: 136,
        textRu: 'Не использовать сверхъестественные силы, когда ситуация этого требует.',
        textEn: 'Failing to use supernatural powers when the situation requires it.',
      },
      {
        id: 137,
        textRu: 'Не поддерживать Дхармой тех, кого следует поддержать.',
        textEn: 'Failing to support with the Dharma those who should be supported.',
      },
      {
        id: 138,
        textRu: 'Не поддерживать материально тех, кого следует поддержать.',
        textEn: 'Failing to support materially those who should be supported.',
      },
      {
        id: 139,
        textRu: 'Затаивать обиду на кого-либо за причину оскорбления.',
        textEn: 'Harboring a grudge against someone for a cause of offense.',
      },
      {
        id: 140,
        textRu: 'Проявлять различие к людям по принципу: этих я люблю, а тех нет.',
        textEn: 'Discriminating against people on the principle: I like these, but not those.',
      },
      {
        id: 141,
        textRu: 'Не стремиться получить аудиенцию у святого Ламы.',
        textEn: 'Failing to seek an audience with a holy Lama.',
      },
      {
        id: 142,
        textRu: 'Пренебрегать постоянством в духовном изучении.',
        textEn: 'Neglecting constancy in spiritual study.',
      },
      {
        id: 143,
        textRu: 'Пренебрегать размышлением и анализом изученного материала.',
        textEn: 'Neglecting reflection on and analysis of the material studied.',
      },
      {
        id: 144,
        textRu: 'Не хранить в сердце стремление помогать всем живым существам, используя пищу, одежду и т.д.',
        textEn: 'Failing to keep in one\'s heart the aspiration to help all living beings while using food, clothing, etc.',
      },
      {
        id: 145,
        textRu: 'Совершать добродетельные дела, не храня в сердце стремление к просветлению ради всех живых существ.',
        textEn: 'Performing virtuous deeds without keeping in one\'s heart the aspiration for enlightenment for the sake of all living beings.',
      },
      {
        id: 146,
        textRu: 'Чёрное деяние: Сознательно вводить Ламу в заблуждение, лгать Ламе или тем, кому мы делаем подношения, и тому подобное.',
        textEn: 'Black Deed: Deliberately misleading a Lama, lying to a Lama or to those to whom we make offerings, and the like.',
      },
      {
        id: 147,
        textRu: 'Белое деяние: Никогда не лгать преднамеренно, даже в шутку, ни одному живому существу.',
        textEn: 'White Deed: Never deliberately lying, even in jest, to any living being.',
      },
      {
        id: 148,
        textRu: 'Чёрное деяние: Заставлять человека сожалеть о своём добродетельном поступке.',
        textEn: 'Black Deed: Making a person regret their virtuous act.',
      },
      {
        id: 149,
        textRu: 'Белое деяние: Внушать человеку, о котором вы заботитесь, стремление к полному просветлению вместо практики с более низкой целью.',
        textEn: 'White Deed: Instilling in a person you care for the aspiration for complete enlightenment instead of practice with a lower goal.',
      },
      {
        id: 150,
        textRu: 'Чёрное деяние: Говорить что-то неприятное в гневе Бодхисаттве.',
        textEn: 'Black Deed: Saying something unpleasant in anger to a Bodhisattva.',
      },
      {
        id: 151,
        textRu: 'Белое деяние: Стремиться видеть во всех живых существах самого Учителя, видеть их и все вещи абсолютно чистыми.',
        textEn: 'White Deed: Striving to see in all living beings the Teacher Himself, seeing them and all things as absolutely pure.',
      },
      {
        id: 152,
        textRu: 'Чёрное деяние: Быть неискренним и хитрым с кем-либо, не брать на себя личную ответственность за их просветление.',
        textEn: 'Black Deed: Being disingenuous and cunning with anyone, failing to take personal responsibility for their enlightenment.',
      },
      {
        id: 153,
        textRu: 'Белое деяние: Соблюдать абсолютную честность по отношению к любому живому существу.',
        textEn: 'White Deed: Observing absolute honesty toward any living being.',
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

export const getVowById = (vowId: number): VowItem | undefined => {
  for (const category of vowsData) {
    const vow = category.vows.find((v) => v.id === vowId);
    if (vow) return vow;
  }
  return undefined;
};

export const getVowText = (categoryKey: string, vowId: number, language: 'ru' | 'en'): string => {
  const vows = getVowsByCategory(categoryKey);
  const vow = vows.find((v) => v.id === vowId);
  if (!vow) return '';
  return language === 'ru' ? vow.textRu : vow.textEn;
};

export const getAllVows = (): VowItem[] => {
  return vowsData.flatMap((category) => category.vows);
};
