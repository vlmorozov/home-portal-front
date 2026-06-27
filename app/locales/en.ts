export default {
  layout: {
    appName: 'Home Portal',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    footer: 'Home Portal',
    languageLabel: 'Language'
  },
  login: {
    eyebrow: 'Welcome back',
    heading: 'Sign in to continue',
    emailLabel: 'Email address',
    emailPlaceholder: 'name at example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    button: 'Sign in',
    buttonLoading: 'Signing in…',
    helper: 'New here?',
    helperLink: 'Create an account',
    errors: {
      required: 'Enter your email and password to continue.',
      unexpected: 'Unable to sign in. Please try again.'
    },
    success: 'Login successful! Redirecting to your dashboard...'
  },
  register: {
    eyebrow: 'Start here',
    heading: 'Create your account',
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'Jane Doe',
    emailLabel: 'Email address',
    emailPlaceholder: 'name at example.com',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm password',
    passwordPlaceholder: '••••••••',
    button: 'Create account',
    buttonLoading: 'Creating account…',
    helper: 'Already registered?',
    helperLink: 'Sign in',
    errors: {
      required: 'Please complete all required fields.',
      mismatch: 'Passwords must match.',
      unexpected: 'Unable to create the account. Please try again.'
    },
    success: 'Account created! You can sign in now.'
  },
  dashboard: {
    eyebrow: 'Overview',
    heading: 'Your dashboard',
    signOut: 'Sign out',
    stats: {
      pendingTasks: 'Pending tasks',
      inProgressTasks: 'In progress',
      completedTasks: 'Completed tasks'
    },
    recentTasks: 'Recent tasks',
    openTasks: 'Open tasks board',
    quickActions: 'Quick actions',
    actions: {
      tasks: {
        label: 'Manage tasks',
        description: 'Create, update and review your tasks'
      },
      register: {
        label: 'Create another account',
        description: 'Open the registration flow'
      },
      signout: {
        label: 'Sign out',
        description: 'Return to the login screen'
      }
    },
    profile: {
      title: 'Signed in as',
      loading: 'Loading your profile…',
      empty: 'You are not signed in.'
    },
    tasks: {
      loading: 'Loading your tasks…',
      empty: 'No tasks yet. Create your first one from the tasks board.',
      noDescription: 'No description provided.',
      status: {
        pending: 'Pending',
        in_progress: 'In progress',
        completed: 'Completed'
      }
    }
  },
  tasks: {
    eyebrow: 'Execution board',
    heading: 'Tasks workspace',
    description: 'Track the full lifecycle of your tasks: create, review, update and complete them from one place.',
    backToDashboard: 'Back to dashboard',
    filters: {
      all: 'All',
      pending: 'Pending',
      inProgress: 'In progress',
      completed: 'Completed'
    },
    status: {
      pending: 'Pending',
      in_progress: 'In progress',
      completed: 'Completed'
    },
    create: {
      heading: 'Create a task',
      subheading: 'Send a new task directly to the backend.',
      submit: 'Create task',
      submitting: 'Creating…'
    },
    list: {
      heading: 'Task list',
      subheading: 'These items come from the protected backend endpoints.',
      loading: 'Loading tasks…',
      empty: 'No tasks match this filter yet.'
    },
    form: {
      title: 'Title',
      titlePlaceholder: 'Prepare project kickoff notes',
      description: 'Description',
      descriptionPlaceholder: 'Add context, deadlines and dependencies.',
      status: 'Status',
      dueDate: 'Due date'
    },
    actions: {
      markPending: 'Set pending',
      markInProgress: 'Start work',
      markCompleted: 'Complete',
      assignToList: 'Add to {list}',
      assigning: 'Adding...',
      removeFromList: 'Remove from list',
      open: 'Open',
      delete: 'Delete'
    },
    confirmDelete: {
      title: 'Delete this task?',
      message: 'This action removes the task permanently. You cannot undo it later.',
      confirm: 'Delete task',
      cancel: 'Keep task'
    },
    card: {
      noDescription: 'No description provided.',
      noDueDate: 'No due date'
    },
    taskLists: {
      heading: 'Task lists',
      subheading: 'Group tasks into working sets without duplicating the task itself.',
      title: 'List title',
      titlePlaceholder: 'Home renovation',
      description: 'List description',
      descriptionPlaceholder: 'Optional context for this group.',
      create: 'Create list',
      creating: 'Creating...',
      allTasks: 'All tasks',
      addNewTo: 'Add new task to list',
      withoutList: 'Without list',
      delete: 'Delete list',
      confirmDelete: {
        title: 'Delete this list?',
        message: 'Tasks stay in the system, only the list and its links are removed.',
        confirm: 'Delete list',
        cancel: 'Keep list'
      }
    },
    events: {
      heading: 'Status history',
      subheading: 'Each status or due date change is stored as a task event.',
      create: 'Add event',
      creating: 'Adding...',
      delete: 'Delete',
      empty: 'No events yet.'
    },
    subtasks: {
      heading: 'Subtasks',
      subheading: 'Link existing tasks as children of this task.',
      selectTask: 'Task',
      selectPlaceholder: 'Select a task',
      add: 'Add subtask',
      adding: 'Adding...',
      delete: 'Remove',
      empty: 'No subtasks yet.'
    },
    detail: {
      eyebrow: 'Task details',
      heading: 'Review and update task',
      back: 'Back to tasks',
      loading: 'Loading task…',
      save: 'Save changes',
      saving: 'Saving…',
      delete: 'Delete task',
      deleting: 'Deleting…',
      taskId: 'Task ID',
      createdAt: 'Created at',
      updatedAt: 'Updated at'
    },
    feedback: {
      created: 'Task created successfully.',
      updated: 'Task updated successfully.',
      deleted: 'Task deleted successfully.',
      eventCreated: 'Task event added.',
      eventDeleted: 'Task event deleted.',
      subtaskCreated: 'Subtask added.',
      subtaskDeleted: 'Subtask removed.',
      taskAssigned: 'Task added to list.',
      taskRemovedFromList: 'Task removed from list.',
      taskListCreated: 'Task list created.',
      taskListDeleted: 'Task list deleted.',
      titleRequired: 'Task title is required.',
      taskListTitleRequired: 'Task list title is required.',
      unexpected: 'Unable to complete the task request.'
    }
  }
} as const;
