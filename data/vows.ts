export interface VowItem {
  id: number;
  textRu: string;
  textEn: string;
  textIt?: string;
  textFr?: string;
  textDe?: string;
  textEs?: string;
  textZh?: string;
  textHy?: string;
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
        textIt: 'Dopo aver preso rifugio nel Buddha, non cercare rifugio in oggetti o divinità mondane.',
      },
      {
        id: 2,
        textRu: 'После принятия прибежища в Дхарме не наносить вреда никаким живым существам.',
        textEn: 'After taking refuge in the Dharma, do not cause harm to any living being.',
        textIt: 'Dopo aver preso rifugio nel Dharma, non recare danno ad alcun essere vivente.',
      },
      {
        id: 3,
        textRu: 'После принятия прибежища в Сангхе избегать близкого общения с людьми, не разделяющими веру в Путь.',
        textEn: 'After taking refuge in the Sangha, avoid close association with those who do not share faith in the Path.',
        textIt: 'Dopo aver preso rifugio nel Sangha, evitare la stretta associazione con persone che non condividono la fede nel Cammino.',
      },
      {
        id: 4,
        textRu: 'После принятия прибежища в Будде почитать любое изображение Будды как самого Будду, независимо от материала или художественного качества.',
        textEn: 'After taking refuge in the Buddha, venerate any image of Him as the Buddha Himself, regardless of the material it is made of or its artistic quality.',
        textIt: 'Dopo aver preso rifugio nel Buddha, venerare ogni sua immagine come il Buddha stesso, indipendentemente dal materiale o dalla qualità artistica.',
      },
      {
        id: 5,
        textRu: 'После принятия прибежища в Дхарме почитать любой написанный текст или даже одну букву как саму Дхарму.',
        textEn: 'After taking refuge in the Dharma, venerate any written text or even a single letter as the Dharma itself.',
        textIt: 'Dopo aver preso rifugio nel Dharma, venerare ogni testo scritto o anche una singola lettera come il Dharma stesso.',
      },
      {
        id: 6,
        textRu: 'После принятия прибежища в Сангхе почитать даже лоскут шафрановой накидки как саму Сангху.',
        textEn: 'After taking refuge in the Sangha, venerate even a fragment of a saffron robe as the Sangha itself.',
        textIt: 'Dopo aver preso rifugio nel Sangha, venerare anche un frammento di veste zafferano come il Sangha stesso.',
      },
      {
        id: 7,
        textRu: 'Принимать прибежище снова и снова, помня о возвышенных качествах объектов прибежища.',
        textEn: 'Take refuge again and again, remembering the sublime qualities of the objects of refuge.',
        textIt: 'Prendere rifugio ancora e ancora, ricordando le sublimi qualità degli Oggetti del Rifugio.',
      },
      {
        id: 8,
        textRu: 'Предлагать первую часть любой еды и питья объектам прибежища, помня об их доброте.',
        textEn: 'Offer the first portion of any food or drink to the objects of refuge, remembering their kindness.',
        textIt: 'Offrire la prima parte di ogni cibo o bevanda agli Oggetti del Rifugio, ricordando la loro gentilezza.',
      },
      {
        id: 9,
        textRu: 'Поощрять других принимать прибежище.',
        textEn: 'Encourage others to take refuge.',
        textIt: 'Incoraggiare gli altri a prendere rifugio.',
      },
      {
        id: 10,
        textRu: 'Принимать прибежище три раза утром и три раза вечером, размышляя о его благотворном влиянии.',
        textEn: 'Take refuge three times in the morning and three times in the evening, contemplating its beneficial influence.',
        textIt: 'Prendere rifugio tre volte al mattino e tre volte alla sera, meditando sul suo benefico influsso.',
      },
      {
        id: 11,
        textRu: 'Полностью полагаться на объекты прибежища во время любых предпринимаемых действий.',
        textEn: 'Rely completely on the objects of refuge in every action undertaken.',
        textIt: 'Affidarsi completamente agli Oggetti del Rifugio in ogni azione intrapresa.',
      },
      {
        id: 12,
        textRu: 'С момента принятия прибежища не отрекаться от Трёх Драгоценностей даже ценою жизни или даже в мыслях.',
        textEn: 'From the moment of taking refuge, do not renounce the Three Jewels, even at the cost of your life or even in your thoughts.',
        textIt: 'Dal momento della presa del rifugio, non rinunciare ai Tre Gioielli, neanche a costo della vita o nei propri pensieri.',
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
        textIt: 'Uccidere.',
      },
      {
        id: 14,
        textRu: 'Воровство.',
        textEn: 'Stealing.',
        textIt: 'Rubare.',
      },
      {
        id: 15,
        textRu: 'Сексуальные проступки.',
        textEn: 'Sexual misconduct.',
        textIt: 'Condotta sessuale scorretta.',
      },
      {
        id: 16,
        textRu: 'Ложь.',
        textEn: 'Lying.',
        textIt: 'Mentire.',
      },
      {
        id: 17,
        textRu: 'Разделяющая речь.',
        textEn: 'Divisive speech.',
        textIt: 'Parola che divide (calunnia).',
      },
      {
        id: 18,
        textRu: 'Грубая речь.',
        textEn: 'Harsh speech.',
        textIt: 'Parola aspra (insulto).',
      },
      {
        id: 19,
        textRu: 'Пустая болтовня (Бесполезная речь).',
        textEn: 'Idle gossip (Useless speech).',
        textIt: 'Chiacchiere oziose (parole inutili).',
      },
      {
        id: 20,
        textRu: 'Алчность и зависть.',
        textEn: 'Covetousness and envy.',
        textIt: 'Avidità e invidia.',
      },
      {
        id: 21,
        textRu: 'Недоброжелательность (Злонамеренность).',
        textEn: 'Ill will (Malice).',
        textIt: 'Malevolenza (cattiveria).',
      },
      {
        id: 22,
        textRu: 'Ложные воззрения.',
        textEn: 'Wrong view.',
        textIt: 'Visioni errate.',
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
        textIt: 'Non uccidere un essere umano o un feto umano.',
      },
      {
        id: 24,
        textRu: 'Не воровать ничего ценного.',
        textEn: 'Not stealing anything of value.',
        textIt: 'Non rubare nulla di valore.',
      },
      {
        id: 25,
        textRu: 'Не лгать о своих духовных достижениях.',
        textEn: 'Not lying about one\'s spiritual attainments.',
        textIt: 'Non mentire sulle proprie realizzazioni spirituali.',
      },
      {
        id: 26,
        textRu: 'Не совершать супружескую измену и избегать сексуальных проступков.',
        textEn: 'Not committing adultery and avoiding sexual misconduct.',
        textIt: 'Non commettere adulterio ed evitare condotte sessuali scorrette.',
      },
      {
        id: 27,
        textRu: 'Не употреблять алкоголь или наркотики и не предлагать их другим.',
        textEn: 'Not consuming alcohol or drugs, and not offering them to others.',
        textIt: 'Non consumare alcol o droghe, e non offrirli ad altri.',
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
        textIt: 'Lodare se stessi per guadagno personale.',
      },
      {
        id: 29,
        textRu: 'Порицать или критиковать других в корыстных целях.',
        textEn: 'Belittling or criticizing others for selfish gain.',
        textIt: 'Denigrare o criticare gli altri per guadagno personale.',
      },
      {
        id: 30,
        textRu: 'Не давать Дхарму из чувства собственничества.',
        textEn: 'Withholding the Dharma out of a sense of possessiveness.',
        textIt: 'Non condividere il Dharma per attaccamento e possesso.',
      },
      {
        id: 31,
        textRu: 'Не оказывать материальную помощь из чувства собственничества.',
        textEn: 'Withholding material aid out of a sense of possessiveness.',
        textIt: 'Non condividere aiuto materiale per attaccamento e possesso.',
      },
      {
        id: 32,
        textRu: 'Не принимать чьи-либо извинения.',
        textEn: 'Refusing to accept someone\'s apologies.',
        textIt: 'Rifiutare di accettare le scuse di qualcuno.',
      },
      {
        id: 33,
        textRu: 'Наносить удары другому человеку.',
        textEn: 'Striking another person.',
        textIt: 'Percuotere un\'altra persona.',
      },
      {
        id: 34,
        textRu: 'Отрицать учение Махаяны как не являющееся словом Будды и увлекаться ложной дхармой.',
        textEn: 'Denying the Mahayana teachings as not being the Buddha\'s word and becoming involved in false dharma.',
        textIt: 'Negare che gli insegnamenti Mahayana siano la parola del Buddha e farsi coinvolgere in un falso dharma.',
      },
      {
        id: 35,
        textRu: 'Обучать ложной Дхарме.',
        textEn: 'Teaching false Dharma.',
        textIt: 'Insegnare un falso Dharma.',
      },
      {
        id: 36,
        textRu: 'Красть то, что принадлежит Драгоценности Будды.',
        textEn: 'Stealing what belongs to the Jewel of the Buddha.',
        textIt: 'Rubare ciò che appartiene al Gioiello del Buddha.',
      },
      {
        id: 37,
        textRu: 'Красть то, что принадлежит Драгоценности Дхармы.',
        textEn: 'Stealing what belongs to the Jewel of the Dharma.',
        textIt: 'Rubare ciò che appartiene al Gioiello del Dharma.',
      },
      {
        id: 38,
        textRu: 'Красть то, что принадлежит Драгоценности Сангхи.',
        textEn: 'Stealing what belongs to the Jewel of the Sangha.',
        textIt: 'Rubare ciò che appartiene al Gioiello del Sangha.',
      },
      {
        id: 39,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Слушателей (Шраваков).',
        textEn: 'Renouncing the Dharma by denying the Path of Listeners (Shravakas).',
        textIt: 'Rinunciare al Dharma negando il Sentiero degli Uditori (Shravaka).',
      },
      {
        id: 40,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Самосозданных Будд (Пратьекабудд).',
        textEn: 'Renouncing the Dharma by denying the Path of Solitary Realizers (Pratyekabuddhas).',
        textIt: 'Rinunciare al Dharma negando il Sentiero dei Realizzatori Solitari (Pratyekabuddha).',
      },
      {
        id: 41,
        textRu: 'Отрекаться от Дхармы путём отрицания Пути Махаяны.',
        textEn: 'Renouncing the Dharma by denying the Mahayana Path.',
        textIt: 'Rinunciare al Dharma negando il Sentiero Mahayana.',
      },
      {
        id: 42,
        textRu: 'Лишать монахов их монашеского одеяния, избивать или заключать их в тюрьму.',
        textEn: 'Depriving monks of their monastic robes, beating them, or imprisoning them.',
        textIt: 'Privare i monaci delle loro vesti, picchiarli o imprigionarli.',
      },
      {
        id: 43,
        textRu: 'Лишать монахов их монашеского статуса.',
        textEn: 'Depriving monks of their monastic status.',
        textIt: 'Privare i monaci del loro status monastico.',
      },
      {
        id: 44,
        textRu: 'Совершать тягчайшее деяние — убийство отца.',
        textEn: 'Committing the heinous act of killing one\'s father.',
        textIt: 'Commettere l\'atto atroce di uccidere il proprio padre.',
      },
      {
        id: 45,
        textRu: 'Совершать тягчайшее деяние — убийство матери.',
        textEn: 'Committing the heinous act of killing one\'s mother.',
        textIt: 'Commettere l\'atto atroce di uccidere la propria madre.',
      },
      {
        id: 46,
        textRu: 'Совершать тягчайшее деяние — убийство Архата.',
        textEn: 'Committing the heinous act of killing an Arhat.',
        textIt: 'Commettere l\'atto atroce di uccidere un Arhat.',
      },
      {
        id: 47,
        textRu: 'Совершать тягчайшее деяние — раскол в Сангхе.',
        textEn: 'Committing the heinous act of creating a schism in the Sangha.',
        textIt: 'Commettere l\'atto atroce di creare uno scisma nel Sangha.',
      },
      {
        id: 48,
        textRu: 'Совершать тягчайшее деяние — попытка навредить Будде со злым умыслом.',
        textEn: 'Committing the heinous act of attempting to harm the Buddha with malicious intent.',
        textIt: 'Commettere l\'atto atroce di tentare di nuocere al Buddha con intento malevolo.',
      },
      {
        id: 49,
        textRu: 'Придерживаться ложных воззрений: отрицать законы кармы и существование прошлых и будущих жизней.',
        textEn: 'Holding wrong views: denying the laws of karma and the existence of past and future lives.',
        textIt: 'Avere visioni errate: negare le leggi del karma e l\'esistenza di vite passate e future.',
      },
      {
        id: 50,
        textRu: 'Разрушать деревни.',
        textEn: 'Destroying villages.',
        textIt: 'Distruggere villaggi.',
      },
      {
        id: 51,
        textRu: 'Разрушать города.',
        textEn: 'Destroying towns.',
        textIt: 'Distruggere città.',
      },
      {
        id: 52,
        textRu: 'Разрушать целые области.',
        textEn: 'Destroying entire provinces.',
        textIt: 'Distruggere intere province.',
      },
      {
        id: 53,
        textRu: 'Разрушать целые страны.',
        textEn: 'Destroying entire countries.',
        textIt: 'Distruggere interi paesi.',
      },
      {
        id: 54,
        textRu: 'Давать учение о пустоте неподготовленному человеку.',
        textEn: 'Giving teachings on emptiness to an unprepared person.',
        textIt: 'Insegnare la vacuità a chi non è pronto.',
      },
      {
        id: 55,
        textRu: 'Отворачивать человека от стремления к просветлению.',
        textEn: 'Turning a person away from the aspiration for enlightenment.',
        textIt: 'Allontanare una persona dall\'aspirazione all\'illuminazione.',
      },
      {
        id: 56,
        textRu: 'Принуждать человека отказаться от обетов Индивидуального Освобождения (Пратимокши).',
        textEn: 'Compelling a person to renounce their vows of Individual Liberation (Pratimoksha).',
        textIt: 'Costringere qualcuno a rinunciare ai voti di Liberazione Individuale (Pratimoksha).',
      },
      {
        id: 57,
        textRu: 'Критиковать Путь Слушателей и утверждать, что этот путь не может победить желания и т.д.',
        textEn: 'Criticizing the Path of Listeners and claiming that this path cannot conquer desires, etc.',
        textIt: 'Criticare il Sentiero degli Uditori affermando che non possa vincere i desideri, ecc.',
      },
      {
        id: 58,
        textRu: 'Осуждать и критиковать других из желания похвалы.',
        textEn: 'Condemning and criticizing others out of a desire for praise.',
        textIt: 'Condannare e criticare gli altri per desiderio di lode.',
      },
      {
        id: 59,
        textRu: 'Ложно утверждать, что вы постигли пустоту.',
        textEn: 'Making a false claim that you have realized emptiness.',
        textIt: 'Dichiarare falsamente di aver realizzato la vacuità.',
      },
      {
        id: 60,
        textRu: 'Принимать дары, принадлежащие Драгоценности Сангхи или монахам.',
        textEn: 'Accepting gifts that belong to the Jewel of the Sangha or to monks.',
        textIt: 'Accettare doni che appartengono al Gioiello del Sangha o ai monaci.',
      },
      {
        id: 61,
        textRu: 'Принижать медитативную практику и отдавать имущество медитаторов тем, кто практикует начитывание.',
        textEn: 'Belittling meditative practice and giving the property of meditators to those who practice recitation.',
        textIt: 'Denigrare la pratica meditativa e dare i beni dei meditatori a chi pratica la recitazione.',
      },
      {
        id: 62,
        textRu: 'Отказываться от стремления к просветлению (Бодхичитты).',
        textEn: 'Abandoning the aspiration for enlightenment (Bodhicitta).',
        textIt: 'Abbandonare l\'aspirazione all\'illuminazione (Bodhicitta).',
      },
      {
        id: 63,
        textRu: 'Не делать ежедневных подношений Трём Драгоценностям телом, речью и умом.',
        textEn: 'Failing to make daily offerings to the Three Jewels with body, speech, and mind.',
        textIt: 'Non fare offerte quotidiane ai Tre Gioielli con corpo, parola e mente.',
      },
      {
        id: 64,
        textRu: 'Не сдерживать мысли похоти, привязанности и неудовлетворённости тем, что имеешь.',
        textEn: 'Failing to restrain thoughts of lust, attachment, and dissatisfaction with what one has.',
        textIt: 'Non frenar i pensieri di lussuria, attaccamento e insoddisfazione per ciò che si ha.',
      },
      {
        id: 65,
        textRu: 'Не проявлять уважение к тем, кто принял обеты Бодхисаттвы раньше вас.',
        textEn: 'Failing to show respect to those who took Bodhisattva vows before you.',
        textIt: 'Non mostrare rispetto a coloro che hanno preso i voti del Bodhisattva prima di te.',
      },
      {
        id: 66,
        textRu: 'Не отвечать на вопросы из-за гнева или лени.',
        textEn: 'Failing to answer questions out of anger or laziness.',
        textIt: 'Non rispondere alle domande per rabbia o pigrizia.',
      },
      {
        id: 67,
        textRu: 'Не принимать приглашение из-за гордыни, злобы, гнева или лени.',
        textEn: 'Failing to accept an invitation out of pride, malice, anger, or laziness.',
        textIt: 'Non accettare un invito per orgoglio, malizia, rabbia o pigrizia.',
      },
      {
        id: 68,
        textRu: 'Не принимать денежные или другие подношения из желания навредить дарителю, или из гнева, или лени.',
        textEn: 'Failing to accept monetary or other offerings out of a desire to harm the giver, or out of anger or laziness.',
        textIt: 'Non accettare offerte di denaro o altro per il desiderio di nuocere al donatore, o per rabbia o pigrizia.',
      },
      {
        id: 69,
        textRu: 'Отказывать в учении Дхарме искренне заинтересованному человеку из желания навредить ему, или из лени, гнева или зависти.',
        textEn: 'Refusing to give Dharma teachings to a sincerely interested person out of a desire to harm them, or out of laziness, anger, or envy.',
        textIt: 'Rifiutare di dare insegnamenti di Dharma a chi è sinceramente interessato per desiderio di nuocere, pigrizia, rabbia o invidia.',
      },
      {
        id: 70,
        textRu: 'Пренебрегать человеком, чьё поведение кажется неэтичным, из желания навредить ему, или из гнева, или лени.',
        textEn: 'Disregarding a person whose behavior seems unethical out of a desire to harm them, or out of anger or laziness.',
        textIt: 'Trascurare una persona il cui comportamento sembra non etico per desiderio di nuocere, rabbia o pigrizia.',
      },
      {
        id: 71,
        textRu: 'Не следовать обетам Индивидуального Освобождения, когда это помогает другим развить веру.',
        textEn: 'Failing to follow vows of Individual Liberation when doing so helps others develop faith.',
        textIt: 'Non seguire i voti di Liberazione Individuale quando farlo aiuta gli altri a sviluppare fede.',
      },
      {
        id: 72,
        textRu: 'Совершать действие, приносящее меньше пользы другим.',
        textEn: 'Performing an action of lesser benefit for others.',
        textIt: 'Compiere un\'azione di minor beneficio per gli altri.',
      },
      {
        id: 73,
        textRu: 'Отказываться нарушить один из первых семи этических принципов из сострадания (если вы соответствуете особым требованиям, изученным с Ламой).',
        textEn: 'Refusing to violate one of the first seven ethical principles out of compassion (if you meet the extraordinary requirements studied with a Lama).',
        textIt: 'Rifiutare di violare uno dei primi sette principi etici per compassione (se si soddisfano i requisiti straordinari).',
      },
      {
        id: 74,
        textRu: 'Нечестный заработок через притворство.',
        textEn: 'Dishonest livelihood through pretension.',
        textIt: 'Mezzi di sussistenza disonesti attraverso la pretesa.',
      },
      {
        id: 75,
        textRu: 'Нечестный заработок через лесть.',
        textEn: 'Dishonest livelihood through flattery.',
        textIt: 'Mezzi di sussistenza disonesti attraverso l\'adulazione.',
      },
      {
        id: 76,
        textRu: 'Нечестный заработок через намёки.',
        textEn: 'Dishonest livelihood through hinting.',
        textIt: 'Mezzi di sussistenza disonesti attraverso allusioni.',
      },
      {
        id: 77,
        textRu: 'Нечестный заработок через принуждение.',
        textEn: 'Dishonest livelihood through coercion.',
        textIt: 'Mezzi di sussistenza disonesti attraverso la coercizione.',
      },
      {
        id: 78,
        textRu: 'Нечестный заработок через ловушки.',
        textEn: 'Dishonest livelihood through entrapment.',
        textIt: 'Mezzi di sussistenza disonesti attraverso l\'inganno.',
      },
      {
        id: 79,
        textRu: 'Терять самоконтроль, совершать несдержанные или глупые поступки, или провоцировать других на такие поступки.',
        textEn: 'Losing self-control, committing unrestrained or foolish acts, or provoking others to do so.',
        textIt: 'Perdere l\'autocontrollo, commettere atti sfrenati o sciocchi, o spingere altri a farlo.',
      },
      {
        id: 80,
        textRu: 'Думать, что для помощи другим нужно оставаться в цикле Сансары.',
        textEn: 'Thinking that to help others, one must remain in the cycle of Samsara.',
        textIt: 'Pensare che per aiutare gli altri si debba rimanere nel ciclo del Samsara.',
      },
      {
        id: 81,
        textRu: 'Не предпринимать действий, чтобы остановить плохие слухи о себе.',
        textEn: 'Failing to take action to stop bad rumors about oneself.',
        textIt: 'Non agire per fermare cattive voci su di sé.',
      },
      {
        id: 82,
        textRu: 'Не исправлять кого-либо негативным способом, когда это необходимо.',
        textEn: 'Failing to correct someone in a negative way when it ought to be done.',
        textIt: 'Non correggere qualcuno in modo negativo quando sarebbe necessario farlo.',
      },
      {
        id: 83,
        textRu: 'Отвечать на словесные оскорбления словесными оскорблениями.',
        textEn: 'Repaying verbal abuse with verbal abuse.',
        textIt: 'Ricambiare l\'abuso verbale con abuso verbale.',
      },
      {
        id: 84,
        textRu: 'Отвечать на гнев гневом.',
        textEn: 'Repaying anger with anger.',
        textIt: 'Ricambiare la rabbia con la rabbia.',
      },
      {
        id: 85,
        textRu: 'Отвечать на удар ударом.',
        textEn: 'Repaying a blow with a blow.',
        textIt: 'Ricambiare un colpo con un colpo.',
      },
      {
        id: 86,
        textRu: 'Отвечать на критику критикой.',
        textEn: 'Repaying criticism with criticism.',
        textIt: 'Ricambiare la critica con la critica.',
      },
      {
        id: 87,
        textRu: 'Игнорировать тех, кто злится на вас, и не объяснять своё поведение из злобы, гордыни или лени.',
        textEn: 'Ignoring those who are angry with you and failing to explain your behavior out of malice, pride, or laziness.',
        textIt: 'Ignorare chi è arrabbiato con te e non spiegare il proprio comportamento per malizia, orgoglio o pigrizia.',
      },
      {
        id: 88,
        textRu: 'Не принимать извинения другого человека из желания навредить ему, злых мыслей или просто потому, что не хотите.',
        textEn: 'Refusing to accept another person\'s apology out of a desire to harm them, malicious thoughts, or simply because you do not want to.',
        textIt: 'Rifiutare le scuse di un\'altra persona per desiderio di nuocere.',
      },
      {
        id: 89,
        textRu: 'Не предпринимать действий для прекращения гневных мыслей.',
        textEn: 'Failing to take action to stop angry thoughts.',
        textIt: 'Non agire per fermare i pensieri di rabbia.',
      },
      {
        id: 90,
        textRu: 'Собирать учеников по эгоистичным причинам, таким как получение признания, услуг или подношений.',
        textEn: 'Gathering disciples for selfish reasons, such as obtaining recognition, services, or offerings.',
        textIt: 'Radunare discepoli per ragioni egoistiche (riconoscimento, servizi, offerte).',
      },
      {
        id: 91,
        textRu: 'Не бороться с ленью.',
        textEn: 'Failing to combat laziness.',
        textIt: 'Non combattere la pigrizia.',
      },
      {
        id: 92,
        textRu: 'Проводить время в пустой болтовне исключительно ради удовольствия.',
        textEn: 'Spending time in idle talk solely for pleasure.',
        textIt: 'Passare il tempo in chiacchiere oziose solo per piacere.',
      },
      {
        id: 93,
        textRu: 'Не прилагать усилий для улучшения медитации из желания навредить кому-то или из лени.',
        textEn: 'Failing to exert effort to improve meditation out of a desire to harm someone or out of laziness.',
        textIt: 'Non sforzarsi di migliorare la meditazione per pigrizia.',
      },
      {
        id: 94,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как умственное возбуждение и тоска по кому-то или чему-то.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as mental agitation and longing for someone or something.',
        textIt: 'Non superare gli ostacoli alla concentrazione come l\'agitazione mentale e la brama.',
      },
      {
        id: 95,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как недобрые мысли.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as unkind thoughts.',
        textIt: 'Non superare gli ostacoli come i pensieri poco gentili.',
      },
      {
        id: 96,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как сонливость и тупость ума.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as sleepiness and dullness of mind.',
        textIt: 'Non superare gli ostacoli come la sonnolenza e l\'ottusità mentale.',
      },
      {
        id: 97,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как жажда чувственных объектов.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as craving for sensory objects.',
        textIt: 'Non superare gli ostacoli come il desiderio per gli oggetti sensoriali.',
      },
      {
        id: 98,
        textRu: 'Не преодолевать препятствия для медитативного сосредоточения, такие как неразрешённые сомнения.',
        textEn: 'Failing to overcome obstacles to meditative concentration such as unresolved doubts.',
        textIt: 'Non superare gli ostacoli come i dubbi irrisolti.',
      },
      {
        id: 99,
        textRu: 'Считать, что удовольствие, достигнутое через медитативную практику, является главным духовным достижением.',
        textEn: 'Believing that the pleasure achieved through meditative practice is a major spiritual attainment.',
        textIt: 'Credere che il piacere ottenuto con la meditazione sia una grande realizzazione spirituale.',
      },
      {
        id: 100,
        textRu: 'Отвергать Путь Слушателей, утверждая, что Бодхисаттвы не должны его изучать и, в частности, не должны соблюдать обеты Индивидуального Освобождения.',
        textEn: 'Rejecting the Path of Listeners, claiming that Bodhisattvas should not study it and, in particular, should not observe vows of Individual Liberation.',
        textIt: 'Rifiutare il Sentiero degli Uditori, sostenendo che i Bodhisattva non debbano studiarlo.',
      },
      {
        id: 101,
        textRu: 'Посвящать усилия изучению писаний Слушателей, когда нам доступны писания Махаяны.',
        textEn: 'Devoting effort to studying the scriptures of Listeners while Mahayana scriptures are available to us.',
        textIt: 'Sforzarsi nello studio delle scritture degli Uditori quando le scritture Mahayana sono disponibili.',
      },
      {
        id: 102,
        textRu: 'Изучать небуддийские тексты, когда в этом нет необходимости и вы могли бы изучать учения Будд.',
        textEn: 'Studying non-Buddhist texts when there is no need for it and you could be studying the teachings of the Buddhas.',
        textIt: 'Studiare testi non buddisti quando non ce n\'è bisogno.',
      },
      {
        id: 103,
        textRu: 'Увлекаться небуддийскими текстами, даже когда есть необходимость их изучать.',
        textEn: 'Becoming engrossed in non-Buddhist texts even when there is a necessity to study them.',
        textIt: 'Diventare assorbiti in testi non buddisti anche quando è necessario studiarli.',
      },
      {
        id: 104,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Эта часть не так уж важна».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This part is not all that important".',
        textIt: 'Rifiutare una parte del sentiero Mahayana dicendo: «Questa parte non è poi così importante».',
      },
      {
        id: 105,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Этот текст хуже других».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This text is inferior to others".',
        textIt: 'Rifiutare una parte dicendo: «Questo testo è inferiore agli altri».',
      },
      {
        id: 106,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Автор этой части не очень хорош».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "The author of this part is not very good".',
        textIt: 'Rifiutare una parte dicendo: «L\'autore di questa parte non è molto bravo».',
      },
      {
        id: 107,
        textRu: 'Отвергать часть пути Махаяны, говоря: «Эта часть не увеличит благополучие живых существ».',
        textEn: 'Rejecting a part of the Mahayana path by stating: "This part will not increase the well-being of living beings".',
        textIt: 'Rifiutare una parte dicendo: «Questo non aumenterà il benessere degli esseri».',
      },
      {
        id: 108,
        textRu: 'Восхвалять себя из гордыни или гнева.',
        textEn: 'Praising oneself out of pride or anger.',
        textIt: 'Lodare se stessi per orgoglio o rabbia.',
      },
      {
        id: 109,
        textRu: 'Принижать и критиковать других из гордыни или гнева.',
        textEn: 'Belittling and criticizing others out of pride or anger.',
        textIt: 'Denigrare e criticare gli altri per orgoglio o rabbia.',
      },
      {
        id: 110,
        textRu: 'Отказываться идти слушать Дхарму из гордыни или гнева.',
        textEn: 'Refusing to go and listen to the Dharma out of pride or anger.',
        textIt: 'Rifiutare di andare ad ascoltare il Dharma per orgoglio o rabbia.',
      },
      {
        id: 111,
        textRu: 'Сосредотачиваться на сосуде, а не на его содержимом: на учителе и его недостатках, а не на учении.',
        textEn: 'Focusing on the vessel rather than its contents: on the teacher and their faults rather than the teaching.',
        textIt: 'Concentrarsi sul vaso invece che sul contenuto: sull\'insegnante e i suoi difetti invece che sull\'insegnamento.',
      },
      {
        id: 112,
        textRu: 'Не оказывать помощь из гнева или лени в совершении полезного дела.',
        textEn: 'Failing to provide help, out of anger or laziness, in performing a useful deed.',
        textIt: 'Non aiutare, per rabbia o pigrizia, in un\'azione utile.',
      },
      {
        id: 113,
        textRu: 'Не оказывать помощь из гнева или лени тому, кто хочет добраться до определённого места.',
        textEn: 'Failing to provide help, out of anger or laziness, to someone who wishes to reach a certain place.',
        textIt: 'Non aiutare, per rabbia o pigrizia, chi desidera raggiungere un luogo.',
      },
      {
        id: 114,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в изучении языка.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in language learning.',
        textIt: 'Non supportare, per rabbia o pigrizia, chi ha bisogno di aiuto nell\'apprendimento delle lingue.',
      },
      {
        id: 115,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в освоении нового дела (не приносящего вреда никому).',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in mastering a new task (that brings no harm to anyone).',
        textIt: 'Non supportare chi ha bisogno di aiuto per padroneggiare un nuovo compito.',
      },
      {
        id: 116,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в защите своего имущества.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in protecting their property.',
        textIt: 'Non supportare chi ha bisogno di protezione per i propri beni.',
      },
      {
        id: 117,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в примирении людей.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in reconciling people.',
        textIt: 'Non supportare chi ha bisogno di riconciliarsi con altri.',
      },
      {
        id: 118,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, планирующему добродетельное дело.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person planning a virtuous deed.',
        textIt: 'Non supportare chi pianifica un\'azione virtuosa.',
      },
      {
        id: 119,
        textRu: 'Не оказывать поддержку из гнева или лени человеку, нуждающемуся в помощи в совершении добродетельного дела общего характера.',
        textEn: 'Failing to provide support, out of anger or laziness, to a person in need of help in performing a virtuous deed of a general nature.',
        textIt: 'Non supportare chi compie un\'azione virtuosa di natura generale.',
      },
      {
        id: 120,
        textRu: 'Не оказывать помощь больным из гнева или лени.',
        textEn: 'Failing to provide help to the sick out of anger or laziness.',
        textIt: 'Non aiutare i malati per rabbia o pigrizia.',
      },
      {
        id: 121,
        textRu: 'Не пытаться облегчить страдания слепых из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the blind.',
        textIt: 'Non tentare di alleviare la sofferenza dei ciechi.',
      },
      {
        id: 122,
        textRu: 'Не пытаться облегчить страдания глухих из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the deaf.',
        textIt: 'Non tentare di alleviare la sofferenza dei sordi.',
      },
      {
        id: 123,
        textRu: 'Не пытаться облегчить страдания людей с инвалидностью из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of the disabled.',
        textIt: 'Non tentare di alleviare la sofferenza dei disabili.',
      },
      {
        id: 124,
        textRu: 'Не пытаться облегчить страдания людей, измученных путешествием, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people exhausted by travel.',
        textIt: 'Non aiutare chi è esausto dal viaggio.',
      },
      {
        id: 125,
        textRu: 'Не пытаться облегчить страдания людей под влиянием одной из пяти духовных помех из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people under the influence of one of the five spiritual hindrances.',
        textIt: 'Non aiutare chi è sotto l\'influenza dei cinque ostacoli spirituali.',
      },
      {
        id: 126,
        textRu: 'Не пытаться облегчить страдания людей, охваченных враждебными мыслями, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people overcome by hostile thoughts.',
        textIt: 'Non aiutare chi è sopraffatto da pensieri ostili.',
      },
      {
        id: 127,
        textRu: 'Не пытаться облегчить страдания людей, потерпевших поражение, из гнева или лени.',
        textEn: 'Failing to attempt, out of anger or laziness, to alleviate the suffering of people who have suffered defeat.',
        textIt: 'Non aiutare chi ha subito una sconfitta.',
      },
      {
        id: 128,
        textRu: 'Не пытаться урезонить из гнева или лени человека, предпринимающего опасные действия.',
        textEn: 'Failing to attempt to reason with, out of anger or laziness, a person undertaking dangerous actions.',
        textIt: 'Non tentare di far ragionare chi intraprende azioni pericolose.',
      },
      {
        id: 129,
        textRu: 'Не отплатить кому-либо за оказанную помощь из желания навредить или лени.',
        textEn: 'Failing to repay someone for help provided, out of a desire to harm or laziness.',
        textIt: 'Non ricambiare l\'aiuto ricevuto per malizia o pigrizia.',
      },
      {
        id: 130,
        textRu: 'Не прилагать усилий для облегчения страданий скорбящего человека из желания навредить или лени.',
        textEn: 'Failing to exert effort to alleviate the suffering of a grieving person out of a desire to harm or laziness.',
        textIt: 'Non sforzarsi di alleviare la sofferenza di chi soffre per un lutto.',
      },
      {
        id: 131,
        textRu: 'Не давать деньги или другие материальные ценности из желания навредить или лени тому, кто хочет их получить.',
        textEn: 'Failing to give money or other material values, out of a desire to harm or laziness, to one who wishes to receive them.',
        textIt: 'Non dare denaro o beni materiali a chi desidera riceverli.',
      },
      {
        id: 132,
        textRu: 'Не заботиться о нуждах своих учеников из желания навредить или лени.',
        textEn: 'Failing to care for the needs of your disciples out of a desire to harm or laziness.',
        textIt: 'Non prendersi cura dei bisogni dei propri discepoli.',
      },
      {
        id: 133,
        textRu: 'Не искать способа наладить отношения с кем-либо из желания навредить или лени.',
        textEn: 'Failing to seek a way to build a relationship with someone out of a desire to harm or laziness.',
        textIt: 'Non cercare di costruire una relazione con qualcuno.',
      },
      {
        id: 134,
        textRu: 'Не хвалить чьи-либо хорошие качества из желания навредить или лени.',
        textEn: 'Failing to praise someone\'s good qualities out of a desire to harm or laziness.',
        textIt: 'Non lodare le buone qualità di qualcuno.',
      },
      {
        id: 135,
        textRu: 'Не применять суровые меры для дисциплинирования других, когда ситуация этого требует, из лени или другого духовного недуга.',
        textEn: 'Failing to apply harsh measures to discipline others when the situation requires it, out of laziness or another spiritual ailment.',
        textIt: 'Non applicare misure severe di disciplina quando necessario.',
      },
      {
        id: 136,
        textRu: 'Не использовать сверхъестественные силы, когда ситуация этого требует.',
        textEn: 'Failing to use supernatural powers when the situation requires it.',
        textIt: 'Non usare poteri soprannaturali quando la situazione lo richiede.',
      },
      {
        id: 137,
        textRu: 'Не поддерживать Дхармой тех, кого следует поддержать.',
        textEn: 'Failing to support with the Dharma those who should be supported.',
        textIt: 'Non supportare con il Dharma chi dovrebbe essere supportato.',
      },
      {
        id: 138,
        textRu: 'Не поддерживать материально тех, кого следует поддержать.',
        textEn: 'Failing to support materially those who should be supported.',
        textIt: 'Non supportare materialmente chi dovrebbe essere supportato.',
      },
      {
        id: 139,
        textRu: 'Затаивать обиду на кого-либо за причину оскорбления.',
        textEn: 'Harboring a grudge against someone for a cause of offense.',
        textIt: 'Portare rancore contro qualcuno per un\'offesa.',
      },
      {
        id: 140,
        textRu: 'Проявлять различие к людям по принципу: этих я люблю, а тех нет.',
        textEn: 'Discriminating against people on the principle: I like these, but not those.',
        textIt: 'Discriminare le persone secondo il principio: questi mi piacciono, quelli no.',
      },
      {
        id: 141,
        textRu: 'Не стремиться получить аудиенцию у святого Ламы.',
        textEn: 'Failing to seek an audience with a holy Lama.',
        textIt: 'Non cercare l\'udienza di un santo Lama.',
      },
      {
        id: 142,
        textRu: 'Пренебрегать постоянством в духовном изучении.',
        textEn: 'Neglecting constancy in spiritual study.',
        textIt: 'Trascurare la costanza nello studio spirituale.',
      },
      {
        id: 143,
        textRu: 'Пренебрегать размышлением и анализом изученного материала.',
        textEn: 'Neglecting reflection on and analysis of the material studied.',
        textIt: 'Trascurare la riflessione e l\'analisi del materiale studiato.',
      },
      {
        id: 144,
        textRu: 'Не хранить в сердце стремление помогать всем живым существам, используя пищу, одежду и т.д.',
        textEn: 'Failing to keep in one\'s heart the aspiration to help all living beings while using food, clothing, etc.',
        textIt: 'Non mantenere nel cuore l\'aspirazione ad aiutare tutti gli esseri mentre si usa cibo, vestiti, ecc.',
      },
      {
        id: 145,
        textRu: 'Совершать добродетельные дела, не храня в сердце стремление к просветлению ради всех живых существ.',
        textEn: 'Performing virtuous deeds without keeping in one\'s heart the aspiration for enlightenment for the sake of all living beings.',
        textIt: 'Compiere azioni virtuose senza l\'aspirazione all\'illuminazione per il bene di tutti gli esseri.',
      },
      {
        id: 146,
        textRu: 'Чёрное деяние: Сознательно вводить Ламу в заблуждение, лгать Ламе или тем, кому мы делаем подношения, и тому подобное.',
        textEn: 'Black Deed: Deliberately misleading a Lama, lying to a Lama or to those to whom we make offerings, and the like.',
        textIt: 'Ingannare deliberatamente un Lama, mentire a un Lama o a coloro a cui facciamo offerte.',
      },
      {
        id: 147,
        textRu: 'Белое деяние: Никогда не лгать преднамеренно, даже в шутку, ни одному живому существу.',
        textEn: 'White Deed: Never deliberately lying, even in jest, to any living being.',
        textIt: 'Non mentire mai deliberatamente, neanche per scherzo, ad alcun essere vivente.',
      },
      {
        id: 148,
        textRu: 'Чёрное деяние: Заставлять человека сожалеть о своём добродетельном поступке.',
        textEn: 'Black Deed: Making a person regret their virtuous act.',
        textIt: 'Far pentire una persona di un suo atto virtuoso.',
      },
      {
        id: 149,
        textRu: 'Белое деяние: Внушать человеку, о котором вы заботитесь, стремление к полному просветлению вместо практики с более низкой целью.',
        textEn: 'White Deed: Instilling in a person you care for the aspiration for complete enlightenment instead of practice with a lower goal.',
        textIt: 'Instillare in una persona l\'aspirazione alla completa illuminazione invece di una pratica con un obiettivo inferiore.',
      },
      {
        id: 150,
        textRu: 'Чёрное деяние: Говорить что-то неприятное в гневе Бодхисаттве.',
        textEn: 'Black Deed: Saying something unpleasant in anger to a Bodhisattva.',
        textIt: 'Dire qualcosa di spiacevole per rabbia a un Bodhisattva.',
      },
      {
        id: 151,
        textRu: 'Белое деяние: Стремиться видеть во всех живых существах самого Учителя, видеть их и все вещи абсолютно чистыми.',
        textEn: 'White Deed: Striving to see in all living beings the Teacher Himself, seeing them and all things as absolutely pure.',
        textIt: 'Sforzarsi di vedere in tutti gli esseri il Maestro stesso, vedendo tutto come assolutamente puro.',
      },
      {
        id: 152,
        textRu: 'Чёрное деяние: Быть неискренним и хитрым с кем-либо, не брать на себя личную ответственность за их просветление.',
        textEn: 'Black Deed: Being disingenuous and cunning with anyone, failing to take personal responsibility for their enlightenment.',
        textIt: 'Essere disonesti e scaltri con chiunque, non prendendosi la responsabilità personale per la loro illuminazione.',
      },
      {
        id: 153,
        textRu: 'Белое деяние: Соблюдать абсолютную честность по отношению к любому живому существу.',
        textEn: 'White Deed: Observing absolute honesty toward any living being.',
        textIt: 'Osservare l\'assoluta onestà verso ogni essere vivente.',
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

export const getVowText = (categoryKey: string, vowId: number, language: 'ru' | 'en' | 'it' | 'fr' | 'de' | 'es' | 'zh' | 'hy'): string => {
  const vows = getVowsByCategory(categoryKey);
  const vow = vows.find((v) => v.id === vowId);
  if (!vow) return '';
  
  switch (language) {
    case 'ru': return vow.textRu;
    case 'en': return vow.textEn;
    case 'it': return vow.textIt || vow.textEn;
    case 'fr': return vow.textFr || vow.textEn;
    case 'de': return vow.textDe || vow.textEn;
    case 'es': return vow.textEs || vow.textEn;
    case 'zh': return vow.textZh || vow.textEn;
    case 'hy': return vow.textHy || vow.textEn;
    default: return vow.textEn;
  }
};

export const getAllVows = (): VowItem[] => {
  return vowsData.flatMap((category) => category.vows);
};
