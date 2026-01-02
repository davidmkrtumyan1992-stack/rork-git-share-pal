export type Language = 'en' | 'ru' | 'es' | 'zh' | 'de' | 'fr' | 'hy' | 'it';

export const translations = {
  en: {
    app: {
      title: 'KeepMyVow',
      subtitle: 'Commitment Management System',
    },
    auth: {
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Sign Out',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      fullName: 'Full Name',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      resetPasswordTitle: 'Reset Password',
      resetPasswordDesc: 'Enter your email to receive a reset link',
      sendResetLink: 'Send Reset Link',
      resetLinkSent: 'Reset link sent! Check your email.',
      backToLogin: 'Back to Sign In',
      startPractice: 'Start Practice',
      createAccount: 'Create Account',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      fillAllFields: 'Please fill in all fields',
      invalidEmail: 'Please enter a valid email address',
      loginSuccess: 'Successfully signed in',
      registerSuccess: 'Account created successfully',
      logoutSuccess: 'Successfully signed out',
      errorInvalidCredentials: 'Invalid email or password',
      errorEmailExists: 'Email already registered',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back',
      todayStatus: 'Today\'s Status',
      streak: 'Current Streak',
      totalKept: 'Total Kept',
      totalBroken: 'Total Broken',
      selectVow: 'Select a Vow',
      noVowSelected: 'No vow selected',
      markAsKept: 'Mark as Kept',
      markAsBroken: 'Mark as Broken',
      postpone: 'Postpone',
      addNote: 'Add Note',
      statistics: 'Statistics',
      history: 'History',
      days: 'days',
      participants: 'participants',
    },
    vows: {
      title: 'Select Your Vows',
      subtitle: 'Choose one or more vows to track',
      tenPrinciples: '10 Principles',
      tenPrinciplesDesc: 'Basic ethical guidelines for daily practice',
      freedom: 'Freedom Vows',
      freedomDesc: 'Vows of liberation and personal growth',
      bodhisattva: 'Bodhisattva Vows',
      bodhisattvaDesc: 'Commitment to help all sentient beings',
      tantric: 'Tantric Vows',
      tantricDesc: 'Advanced practices requiring initiation',
      nuns: 'Nun Vows',
      nunsDesc: 'Monastic vows for ordained women',
      monks: 'Monk Vows',
      monksDesc: 'Monastic vows for ordained men',
      selected: 'Selected',
      locked: 'Locked',
      lockedTitle: 'Vow Locked',
      lockedDesc: 'To access this vow type, please send a request to:',
      lockedRequirements: 'Requirements',
      lockedReq1: 'Full name',
      lockedReq2: 'Completed ACI courses',
      lockedReq3: 'Received initiation',
      continue: 'Continue',
      noFap: 'NoFap',
      noFapDesc: 'Abstinence from pornography and masturbation',
      noSmoke: 'No Smoking',
      noSmokeDesc: 'Quit smoking journey',
      noAlcohol: 'No Alcohol',
      noAlcoholDesc: 'Stay sober and clear-minded',
      noSugar: 'No Sugar',
      noSugarDesc: 'Cut out added sugars',
      noSocialMedia: 'No Social Media',
      noSocialMediaDesc: 'Digital detox from social platforms',
      exercise: 'Daily Exercise',
      exerciseDesc: 'Move your body every day',
      meditation: 'Daily Meditation',
      meditationDesc: 'Mindfulness practice',
      reading: 'Daily Reading',
      readingDesc: 'Read at least 30 minutes',
      custom: 'Custom Vow',
      customDesc: 'Create your own commitment',
    },
    admin: {
      title: 'Admin panel',
      users: 'Users',
      totalUsers: 'Total users',
      activeToday: 'Active today',
      completedAntidotes: 'Completed antidotes',
      manageRoles: 'Manage roles',
      statistics: 'Platform statistics',
      searchUsers: 'Search users...',
      role: 'Role',
      lastActive: 'Last active',
      actions: 'Actions',
      deleteUser: 'Delete user',
      confirmDelete: 'Are you sure you want to delete this user?',
      vowAccess: 'Vow access',
      grantAccess: 'Grant access',
      revokeAccess: 'Revoke access',
    },
    settings: {
      personalData: 'Personal data',
      changePassword: 'Change password',
      oldPassword: 'Old password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      updatePassword: 'Update password',
      localization: 'Localization and time',
      timezone: 'Timezone',
      vowManagement: 'Vow management',
      currentVow: 'Current vow',
      changeVows: 'Change vows',
      notificationSettings: 'Notification settings',
      notificationInterval: 'Notification interval',
      hours: 'hours',
      passwordUpdated: 'Password updated successfully',
      passwordMismatch: 'Passwords do not match',
      changePhoto: 'Change photo',
      selectVowTypes: 'Select vow types',
      vowTypesDesc: 'Choose the types of vows you want to track',
      photoUpdated: 'Photo updated successfully',
      vowTypesUpdated: 'Vow types updated',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      settings: 'Settings',
      profile: 'Profile',
      language: 'Language',
      notifications: 'Notifications',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
    },
    status: {
      kept: 'Kept',
      broken: 'Broken',
      postponed: 'Postponed',
      pending: 'Pending',
    },
  },
  ru: {
    app: {
      title: 'Дневник Обетов',
      subtitle: 'Система управления обязательствами',
    },
    auth: {
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      email: 'Email',
      password: 'Пароль',
      username: 'Имя пользователя',
      fullName: 'Полное имя',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      resetPasswordTitle: 'Сброс пароля',
      resetPasswordDesc: 'Введите email для получения ссылки сброса',
      sendResetLink: 'Отправить ссылку',
      resetLinkSent: 'Ссылка отправлена! Проверьте почту.',
      backToLogin: 'Вернуться ко входу',
      startPractice: 'Начать практику',
      createAccount: 'Создать аккаунт',
      enterEmail: 'Введите email',
      enterPassword: 'Введите пароль',
      fillAllFields: 'Пожалуйста, заполните все поля',
      invalidEmail: 'Пожалуйста, введите корректный email',
      loginSuccess: 'Вход выполнен успешно',
      registerSuccess: 'Аккаунт создан успешно',
      logoutSuccess: 'Выход выполнен успешно',
      errorInvalidCredentials: 'Неверный email или пароль',
      errorEmailExists: 'Email уже зарегистрирован',
    },
    dashboard: {
      title: 'Панель управления',
      welcome: 'С возвращением',
      todayStatus: 'Статус сегодня',
      streak: 'Текущая серия',
      totalKept: 'Всего сохранено',
      totalBroken: 'Всего нарушено',
      selectVow: 'Выберите обязательство',
      noVowSelected: 'Обязательство не выбрано',
      markAsKept: 'Отметить выполненным',
      markAsBroken: 'Отметить нарушенным',
      postpone: 'Отложить',
      addNote: 'Добавить заметку',
      statistics: 'Статистика',
      history: 'История',
      days: 'дней',
      participants: 'участников',
    },
    vows: {
      title: 'Выберите обеты',
      subtitle: 'Выберите один или несколько обетов для отслеживания',
      tenPrinciples: '10 принципов',
      tenPrinciplesDesc: 'Базовые этические принципы для ежедневной практики',
      freedom: 'Обеты свободы',
      freedomDesc: 'Обеты освобождения и личностного роста',
      bodhisattva: 'Обеты Бодхисаттвы',
      bodhisattvaDesc: 'Обязательство помогать всем живым существам',
      tantric: 'Тантрические обеты',
      tantricDesc: 'Продвинутые практики, требующие посвящения',
      nuns: 'Обеты монахинь',
      nunsDesc: 'Монашеские обеты для посвящённых женщин',
      monks: 'Обеты монахов',
      monksDesc: 'Монашеские обеты для посвящённых мужчин',
      selected: 'Выбран',
      locked: 'Заблокирован',
      lockedTitle: 'Обет заблокирован',
      lockedDesc: 'Для доступа к этому типу обетов отправьте запрос на:',
      lockedRequirements: 'Требования',
      lockedReq1: 'ФИО',
      lockedReq2: 'Пройденные курсы ACI',
      lockedReq3: 'Полученное посвящение',
      continue: 'Продолжить',
      noFap: 'NoFap',
      noFapDesc: 'Воздержание от порнографии и мастурбации',
      noSmoke: 'Без курения',
      noSmokeDesc: 'Путь к отказу от курения',
      noAlcohol: 'Без алкоголя',
      noAlcoholDesc: 'Оставайтесь трезвыми и ясными',
      noSugar: 'Без сахара',
      noSugarDesc: 'Откажитесь от добавленного сахара',
      noSocialMedia: 'Без соцсетей',
      noSocialMediaDesc: 'Цифровой детокс от социальных платформ',
      exercise: 'Ежедневные упражнения',
      exerciseDesc: 'Двигайтесь каждый день',
      meditation: 'Ежедневная медитация',
      meditationDesc: 'Практика осознанности',
      reading: 'Ежедневное чтение',
      readingDesc: 'Читайте минимум 30 минут',
      custom: 'Своё обязательство',
      customDesc: 'Создайте собственное обязательство',
    },
    admin: {
      title: 'Панель администратора',
      users: 'Пользователи',
      totalUsers: 'Всего пользователей',
      activeToday: 'Активны сегодня',
      completedAntidotes: 'Выполнено антидотов',
      manageRoles: 'Управление ролями',
      statistics: 'Статистика платформы',
      searchUsers: 'Поиск пользователей...',
      role: 'Роль',
      lastActive: 'Последняя активность',
      actions: 'Действия',
      deleteUser: 'Удалить пользователя',
      confirmDelete: 'Вы уверены, что хотите удалить этого пользователя?',
      vowAccess: 'Доступ к обетам',
      grantAccess: 'Открыть доступ',
      revokeAccess: 'Закрыть доступ',
    },
    settings: {
      personalData: 'Личные данные',
      changePassword: 'Изменить пароль',
      oldPassword: 'Старый пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Подтвердить пароль',
      updatePassword: 'Обновить пароль',
      localization: 'Локализация и время',
      timezone: 'Часовой пояс',
      vowManagement: 'Управление обетами',
      currentVow: 'Текущий обет',
      changeVows: 'Изменить обеты',
      notificationSettings: 'Уведомления',
      notificationInterval: 'Интервал уведомлений',
      hours: 'часа',
      passwordUpdated: 'Пароль обновлён успешно',
      passwordMismatch: 'Пароли не совпадают',
      changePhoto: 'Изменить фото',
      selectVowTypes: 'Выбор типов обетов',
      vowTypesDesc: 'Выберите типы обетов, которые хотите отслеживать',
      photoUpdated: 'Фото обновлено',
      vowTypesUpdated: 'Типы обетов обновлены',
    },
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      confirm: 'Подтвердить',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      settings: 'Настройки',
      profile: 'Профиль',
      language: 'Язык',
      notifications: 'Уведомления',
      theme: 'Тема',
      dark: 'Тёмная',
      light: 'Светлая',
    },
    status: {
      kept: 'Выполнено',
      broken: 'Нарушено',
      postponed: 'Отложено',
      pending: 'Ожидает',
    },
  },
};

export const getTranslation = (lang: Language) => {
  if (lang === 'en' || lang === 'ru') {
    return translations[lang];
  }
  return translations['en'];
};

export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatQuotes = (text: string): string => {
  return text.replace(/"/g, '«').replace(/"/g, '»');
};

export const onboardingContent = {
  ru: {
    slide1: { 
      title: '6 разовый дневник', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Начни свой путь', 
      text: '',
      hint: 'Добавить обет'
    },
    slide3: { 
      title: 'Путь к осознанности', 
      text: 'Если обет был нарушен — не страшно. Просто зафиксируйте это и выполните «антидот». Мы поможем вам не забыть об этом.',
      hint: ''
    },
    buttons: { next: 'Далее', skip: 'Пропустить', start: 'Начать' }
  },
  en: {
    slide1: { 
      title: '6 times a day diary', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Start your journey', 
      text: '',
      hint: 'Add a vow'
    },
    slide3: { 
      title: 'Path to mindfulness', 
      text: 'If a vow is broken, it\'s okay. Just record it and perform an "antidote". We\'ll help you remember to do it.',
      hint: ''
    },
    buttons: { next: 'Next', skip: 'Skip', start: 'Start' }
  },
  hy: {
    slide1: { 
      title: 'Օրական 6-անգամյա օրագիր', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Սկսեք ձեր ճանապարհը', 
      text: '',
      hint: 'Ավելացնել ուխտ'
    },
    slide3: { 
      title: 'Գիտակցության ուղին', 
      text: 'Եթե ուխտը դրժվել է, դա սարսափելի չէ: Պարզապես արձանագրեք դա և կատարեք «հակաթույնը»: Մենք կօգնենք ձեզ չմոռանալ դրա մասին:',
      hint: ''
    },
    buttons: { next: 'Հաջորդը', skip: 'Բաց թողնել', start: 'Սկսել' }
  },
  es: {
    slide1: { 
      title: 'Diario de 6 veces al día', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Comienza tu viaje', 
      text: '',
      hint: 'Añadir voto'
    },
    slide3: { 
      title: 'Camino a la conciencia', 
      text: 'Si se rompe un voto, no pasa nada. Simplemente regístralo y realiza un "antídoto". Te ayudaremos a recordar hacerlo.',
      hint: ''
    },
    buttons: { next: 'Siguiente', skip: 'Omitir', start: 'Comenzar' }
  },
  de: {
    slide1: { 
      title: '6-mal am Tag Tagebuch', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Beginnen Sie Ihre Reise', 
      text: '',
      hint: 'Gelübde hinzufügen'
    },
    slide3: { 
      title: 'Pfad zur Achtsamkeit', 
      text: 'Wenn ein Gelübde gebrochen wird, ist das nicht schlimm. Registrieren Sie es einfach und führen Sie ein „Gegenmittel" aus. Wir helfen Ihnen, daran zu denken.',
      hint: ''
    },
    buttons: { next: 'Weiter', skip: 'Überspringen', start: 'Starten' }
  },
  zh: {
    slide1: { 
      title: '每日 6 次日记', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: '开始你的旅程', 
      text: '',
      hint: '添加誓言'
    },
    slide3: { 
      title: '正念之路', 
      text: '如果违反了誓言，也没关系。只需记录下来并执行「解毒剂」。我们会帮您记住去执行。',
      hint: ''
    },
    buttons: { next: '下一步', skip: '跳过', start: '开始' }
  },
  fr: {
    slide1: { 
      title: 'Journal 6 fois par jour', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Commencez votre voyage', 
      text: '',
      hint: 'Ajouter un vœu'
    },
    slide3: { 
      title: 'Chemin vers la pleine conscience', 
      text: 'Si un vœu est rompu, ce n\'est pas grave. Enregistrez-le simplement et effectuez un « antidote ». Nous vous aiderons à ne pas oublier.',
      hint: ''
    },
    buttons: { next: 'Suivant', skip: 'Passer', start: 'Commencer' }
  },
  it: {
    slide1: { 
      title: 'Diario 6 volte al giorno', 
      text: '',
      hint: ''
    },
    slide2: { 
      title: 'Inizia il tuo viaggio', 
      text: '',
      hint: 'Aggiungi voto'
    },
    slide3: { 
      title: 'Sentiero verso la consapevolezza', 
      text: 'Se un voto viene infranto, non importa. Basta registrarlo ed eseguire un "antidoto". Ti aiuteremo a ricordare di farlo.',
      hint: ''
    },
    buttons: { next: 'Avanti', skip: 'Salta', start: 'Inizia' }
  },
};
