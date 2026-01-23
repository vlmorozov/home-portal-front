export default {
  layout: {
    appName: 'Portal Hogar',
    login: 'Iniciar sesión',
    register: 'Registrar',
    dashboard: 'Panel',
    footer: 'Portal Hogar',
    languageLabel: 'Idioma'
  },
  login: {
    eyebrow: 'Bienvenido de nuevo',
    heading: 'Inicia sesión para continuar',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
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
    emailPlaceholder: 'tu@ejemplo.com',
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
      upcomingMeetings: 'Próximas reuniones',
      messages: 'Mensajes'
    },
    recentlyActive: 'Actividad reciente',
    activity: {
      kickoff: {
        title: 'Inicio de proyecto',
        time: 'Hoy · 2:00 PM'
      },
      review: {
        title: 'Revisión de diseño',
        time: 'Mañana · 11:00 AM'
      },
      payroll: {
        title: 'Aprobación de nómina',
        time: 'Viernes · 9:00 AM'
      }
    },
    quickActions: 'Acciones rápidas',
    actions: {
      profile: {
        label: 'Ver perfil',
        description: 'Actualiza tu información'
      },
      invite: {
        label: 'Invitar compañero',
        description: 'Comparte acceso con un colega'
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
    }
  }
} as const;
