export default {
  layout: {
    appName: 'Portal Hogar',
    login: 'Iniciar sesión',
    register: 'Registrar',
    dashboard: 'Panel',
    tasks: 'Tareas',
    footer: 'Portal Hogar',
    languageLabel: 'Idioma'
  },
  login: {
    eyebrow: 'Bienvenido de nuevo',
    heading: 'Inicia sesión para continuar',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre arroba ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    button: 'Iniciar sesión',
    buttonLoading: 'Ingresando…',
    helper: '¿Nuevo aquí?',
    helperLink: 'Crea una cuenta',
    errors: {
      required: 'Ingresa tu correo y contraseña para continuar.',
      unexpected: 'No pudimos iniciar sesión. Inténtalo de nuevo.'
    },
    success: '¡Inicio de sesión correcto! Redirigiendo al panel...'
  },
  register: {
    eyebrow: 'Comienza aquí',
    heading: 'Crea tu cuenta',
    fullNameLabel: 'Nombre completo',
    fullNamePlaceholder: 'Juana Pérez',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre arroba ejemplo.com',
    passwordLabel: 'Contraseña',
    confirmPasswordLabel: 'Confirmar contraseña',
    passwordPlaceholder: '••••••••',
    button: 'Crear cuenta',
    buttonLoading: 'Creando cuenta…',
    helper: '¿Ya estás registrado?',
    helperLink: 'Inicia sesión',
    errors: {
      required: 'Completa todos los campos obligatorios.',
      mismatch: 'Las contraseñas deben coincidir.',
      unexpected: 'No pudimos crear la cuenta. Inténtalo de nuevo.'
    },
    success: '¡Cuenta creada! Ahora puedes iniciar sesión.'
  },
  dashboard: {
    eyebrow: 'Resumen',
    heading: 'Tu panel',
    signOut: 'Cerrar sesión',
    stats: {
      pendingTasks: 'Tareas pendientes',
      inProgressTasks: 'En progreso',
      completedTasks: 'Tareas completadas'
    },
    recentTasks: 'Tareas recientes',
    openTasks: 'Abrir tablero de tareas',
    quickActions: 'Acciones rápidas',
    actions: {
      tasks: {
        label: 'Gestionar tareas',
        description: 'Crea, actualiza y revisa tus tareas'
      },
      register: {
        label: 'Crear otra cuenta',
        description: 'Abrir el flujo de registro'
      },
      signout: {
        label: 'Cerrar sesión',
        description: 'Regresar a la pantalla de inicio'
      }
    },
    profile: {
      title: 'Sesión iniciada como',
      loading: 'Cargando tu perfil…',
      empty: 'Aún no has iniciado sesión.'
    },
    tasks: {
      loading: 'Cargando tareas…',
      empty: 'Aún no hay tareas. Crea la primera desde el tablero.',
      noDescription: 'Sin descripción.',
      status: {
        pending: 'Pendiente',
        in_progress: 'En progreso',
        completed: 'Completada'
      }
    }
  },
  tasks: {
    eyebrow: 'Tablero de ejecución',
    heading: 'Espacio de tareas',
    description: 'Controla todo el ciclo de vida de tus tareas: crearlas, revisarlas, actualizarlas y completarlas.',
    backToDashboard: 'Volver al panel',
    filters: {
      all: 'Todas',
      pending: 'Pendientes',
      inProgress: 'En progreso',
      completed: 'Completadas'
    },
    status: {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      completed: 'Completada'
    },
    create: {
      heading: 'Crear tarea',
      subheading: 'Envía una nueva tarea directamente al backend.',
      submit: 'Crear tarea',
      submitting: 'Creando…'
    },
    list: {
      heading: 'Lista de tareas',
      subheading: 'Estos elementos vienen de los endpoints protegidos del backend.',
      loading: 'Cargando tareas…',
      empty: 'Aún no hay tareas para este filtro.'
    },
    form: {
      title: 'Título',
      titlePlaceholder: 'Preparar notas para el kickoff del proyecto',
      description: 'Descripción',
      descriptionPlaceholder: 'Agrega contexto, plazos y dependencias.',
      status: 'Estado',
      dueDate: 'Fecha límite'
    },
    actions: {
      markPending: 'Marcar pendiente',
      markInProgress: 'Iniciar trabajo',
      markCompleted: 'Completar',
      assignToList: 'Agregar a {list}',
      assigning: 'Agregando...',
      removeFromList: 'Quitar de la lista',
      open: 'Abrir',
      delete: 'Eliminar'
    },
    confirmDelete: {
      title: '¿Eliminar esta tarea?',
      message: 'Esta acción elimina la tarea de forma permanente y no se puede deshacer.',
      confirm: 'Eliminar tarea',
      cancel: 'Conservar tarea'
    },
    card: {
      noDescription: 'Sin descripción.',
      noDueDate: 'Sin fecha límite'
    },
    taskLists: {
      heading: 'Listas de tareas',
      subheading: 'Agrupa tareas sin duplicarlas.',
      title: 'Título de lista',
      titlePlaceholder: 'Renovación del hogar',
      description: 'Descripción de lista',
      descriptionPlaceholder: 'Contexto opcional para este grupo.',
      create: 'Crear lista',
      creating: 'Creando...',
      allTasks: 'Todas las tareas',
      addNewTo: 'Agregar nueva tarea a lista',
      withoutList: 'Sin lista',
      delete: 'Eliminar lista',
      confirmDelete: {
        title: '¿Eliminar esta lista?',
        message: 'Las tareas permanecen en el sistema; solo se eliminan la lista y sus enlaces.',
        confirm: 'Eliminar lista',
        cancel: 'Conservar lista'
      }
    },
    events: {
      heading: 'Historial de estado',
      subheading: 'Cada cambio de estado o fecha se guarda como evento de tarea.',
      create: 'Agregar evento',
      creating: 'Agregando...',
      delete: 'Eliminar',
      empty: 'Aún no hay eventos.'
    },
    subtasks: {
      heading: 'Subtareas',
      subheading: 'Vincula tareas existentes como hijas de esta tarea.',
      selectTask: 'Tarea',
      selectPlaceholder: 'Selecciona una tarea',
      add: 'Agregar subtarea',
      adding: 'Agregando...',
      delete: 'Quitar',
      empty: 'Aún no hay subtareas.'
    },
    detail: {
      eyebrow: 'Detalle de tarea',
      heading: 'Revisar y actualizar tarea',
      back: 'Volver a tareas',
      loading: 'Cargando tarea…',
      save: 'Guardar cambios',
      saving: 'Guardando…',
      delete: 'Eliminar tarea',
      deleting: 'Eliminando…',
      taskId: 'ID de tarea',
      createdAt: 'Creada el',
      updatedAt: 'Actualizada el'
    },
    feedback: {
      created: 'Tarea creada correctamente.',
      updated: 'Tarea actualizada correctamente.',
      deleted: 'Tarea eliminada correctamente.',
      eventCreated: 'Evento de tarea agregado.',
      eventDeleted: 'Evento de tarea eliminado.',
      subtaskCreated: 'Subtarea agregada.',
      subtaskDeleted: 'Subtarea quitada.',
      taskAssigned: 'Tarea agregada a la lista.',
      taskRemovedFromList: 'Tarea quitada de la lista.',
      taskListCreated: 'Lista de tareas creada.',
      taskListDeleted: 'Lista de tareas eliminada.',
      titleRequired: 'El título de la tarea es obligatorio.',
      taskListTitleRequired: 'El título de la lista es obligatorio.',
      unexpected: 'No fue posible completar la solicitud de tareas.'
    }
  }
} as const;
