export default {
  layout: {
    appName: 'Домашний портал',
    login: 'Войти',
    register: 'Регистрация',
    dashboard: 'Панель',
    tasks: 'Задачи',
    footer: 'Домашний портал',
    languageLabel: 'Язык'
  },
  login: {
    eyebrow: 'С возвращением',
    heading: 'Войдите, чтобы продолжить',
    emailLabel: 'Эл. почта',
    emailPlaceholder: 'name at example.com',
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
    emailPlaceholder: 'name at example.com',
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
      pendingTasks: 'Задачи в ожидании',
      inProgressTasks: 'В работе',
      completedTasks: 'Завершённые задачи'
    },
    recentTasks: 'Последние задачи',
    openTasks: 'Открыть доску задач',
    quickActions: 'Быстрые действия',
    actions: {
      tasks: {
        label: 'Управление задачами',
        description: 'Создавайте, обновляйте и просматривайте задачи'
      },
      register: {
        label: 'Создать ещё аккаунт',
        description: 'Открыть форму регистрации'
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
    },
    tasks: {
      loading: 'Загружаем задачи…',
      empty: 'Задач пока нет. Создайте первую на странице задач.',
      noDescription: 'Описание не указано.',
      status: {
        pending: 'Ожидает',
        in_progress: 'В работе',
        completed: 'Завершена'
      }
    }
  },
  tasks: {
    eyebrow: 'Рабочая зона',
    heading: 'Пространство задач',
    description: 'Здесь собран полный цикл работы с задачами: создание, просмотр, обновление и завершение.',
    backToDashboard: 'Назад в панель',
    filters: {
      all: 'Все',
      pending: 'Ожидают',
      inProgress: 'В работе',
      completed: 'Завершены'
    },
    status: {
      pending: 'Ожидает',
      in_progress: 'В работе',
      completed: 'Завершена'
    },
    create: {
      heading: 'Создать задачу',
      subheading: 'Новая задача сразу отправляется в backend.',
      submit: 'Создать задачу',
      submitting: 'Создаём…'
    },
    list: {
      heading: 'Список задач',
      subheading: 'Эти элементы загружаются из защищённых backend-роутов.',
      loading: 'Загружаем задачи…',
      empty: 'Для этого фильтра задач пока нет.'
    },
    form: {
      title: 'Название',
      titlePlaceholder: 'Подготовить заметки к kickoff',
      description: 'Описание',
      descriptionPlaceholder: 'Добавьте контекст, сроки и зависимости.',
      status: 'Статус',
      dueDate: 'Срок'
    },
    actions: {
      markPending: 'Вернуть в ожидание',
      markInProgress: 'Начать работу',
      markCompleted: 'Завершить',
      open: 'Открыть',
      delete: 'Удалить'
    },
    confirmDelete: {
      title: 'Удалить эту задачу?',
      message: 'Задача будет удалена без возможности восстановления.',
      confirm: 'Удалить задачу',
      cancel: 'Оставить задачу'
    },
    card: {
      noDescription: 'Описание не указано.',
      noDueDate: 'Срок не задан'
    },
    detail: {
      eyebrow: 'Детали задачи',
      heading: 'Просмотр и изменение задачи',
      back: 'Назад к задачам',
      loading: 'Загружаем задачу…',
      save: 'Сохранить изменения',
      saving: 'Сохраняем…',
      delete: 'Удалить задачу',
      deleting: 'Удаляем…',
      taskId: 'ID задачи',
      createdAt: 'Создана',
      updatedAt: 'Обновлена'
    },
    feedback: {
      created: 'Задача успешно создана.',
      updated: 'Задача успешно обновлена.',
      deleted: 'Задача успешно удалена.',
      titleRequired: 'Нужно указать название задачи.',
      unexpected: 'Не удалось выполнить запрос по задаче.'
    }
  }
} as const;
