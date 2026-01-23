export default {
  layout: {
    appName: 'Домашний портал',
    login: 'Войти',
    register: 'Регистрация',
    dashboard: 'Панель',
    footer: 'Домашний портал',
    languageLabel: 'Язык'
  },
  login: {
    eyebrow: 'С возвращением',
    heading: 'Войдите, чтобы продолжить',
    emailLabel: 'Эл. почта',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Пароль',
    passwordPlaceholder: '••••••••',
    button: 'Войти',
    buttonLoading: 'Входим…',
    helper: 'Вы здесь впервые?',
    helperLink: 'Создать аккаунт',
    errors: {
      required: 'Введите эл. почту и пароль, чтобы продолжить.',
      unexpected: 'Не удалось войти. Попробуйте ещё раз.'
    },
    success: 'Вход выполнен! Перенаправляем на панель...'
  },
  register: {
    eyebrow: 'Начните здесь',
    heading: 'Создайте аккаунт',
    fullNameLabel: 'Полное имя',
    fullNamePlaceholder: 'Ирина Иванова',
    emailLabel: 'Эл. почта',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Пароль',
    confirmPasswordLabel: 'Подтверждение пароля',
    passwordPlaceholder: '••••••••',
    button: 'Создать аккаунт',
    buttonLoading: 'Создаём аккаунт…',
    helper: 'Уже зарегистрированы?',
    helperLink: 'Войти',
    errors: {
      required: 'Заполните все обязательные поля.',
      mismatch: 'Пароли должны совпадать.',
      unexpected: 'Не удалось создать аккаунт. Попробуйте ещё раз.'
    },
    success: 'Аккаунт создан! Теперь можно войти.'
  },
  dashboard: {
    eyebrow: 'Обзор',
    heading: 'Ваша панель',
    signOut: 'Выйти',
    stats: {
      pendingTasks: 'Незавершённые задачи',
      upcomingMeetings: 'Предстоящие встречи',
      messages: 'Сообщения'
    },
    recentlyActive: 'Последняя активность',
    activity: {
      kickoff: {
        title: 'Запуск проекта',
        time: 'Сегодня · 14:00'
      },
      review: {
        title: 'Дизайн-ревью',
        time: 'Завтра · 11:00'
      },
      payroll: {
        title: 'Утверждение зарплаты',
        time: 'Пятница · 9:00'
      }
    },
    quickActions: 'Быстрые действия',
    actions: {
      profile: {
        label: 'Профиль',
        description: 'Обновите свои данные'
      },
      invite: {
        label: 'Пригласить коллегу',
        description: 'Поделитесь доступом'
      },
      signout: {
        label: 'Выйти',
        description: 'Вернуться к экрану входа'
      }
    },
    profile: {
      title: 'Вы вошли как',
      loading: 'Загружаем профиль…',
      empty: 'Вы ещё не вошли в систему.'
    }
  }
} as const;
