export default {
  layout: {
    appName: 'Home Portal',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    footer: 'Home Portal',
    languageLabel: 'Language'
  },
  login: {
    eyebrow: 'Welcome back',
    heading: 'Sign in to continue',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
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
    emailPlaceholder: 'you@example.com',
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
      pendingTasks: 'Pending Tasks',
      upcomingMeetings: 'Upcoming Meetings',
      messages: 'Messages'
    },
    recentlyActive: 'Recently active',
    activity: {
      kickoff: {
        title: 'Project kickoff',
        time: 'Today · 2:00 PM'
      },
      review: {
        title: 'Design review',
        time: 'Tomorrow · 11:00 AM'
      },
      payroll: {
        title: 'Payroll approval',
        time: 'Friday · 9:00 AM'
      }
    },
    quickActions: 'Quick actions',
    actions: {
      profile: {
        label: 'View profile',
        description: 'Update your information'
      },
      invite: {
        label: 'Invite teammate',
        description: 'Share access with a colleague'
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
    }
  }
} as const;
