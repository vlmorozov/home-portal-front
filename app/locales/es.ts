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
      titleRequired: 'El título de la tarea es obligatorio.',
      unexpected: 'No fue posible completar la solicitud de tareas.'
    }
  }
} as const;
