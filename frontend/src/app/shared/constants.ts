export const appConst = {
  api: {
    baseUrl: '/api',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  snackBar: {
    closeBtnLabel: 'Close',
    defaultConfig: {
      duration: 4000
    }
  },
  assets: {
    icons: 'assets/images/icons/'
  },
  localstorage: {
    token: {
      store: 'mpi_token',
      key: 'oauth2_response'
    }
  },
  oauth2: {
    clientId: 'mpifrontend',
    secret: 'mpiunsecuresecret',
    scope: 'read write',
  },
};
