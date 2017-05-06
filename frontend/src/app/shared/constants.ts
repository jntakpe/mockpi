export const appConst = {
  api: {
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
  lists: {
    mimeTypes: [
      'application/json', 'application/javascript', 'application/xhtml+xml', 'application/xml', 'application/octet-stream',
      'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml',
      'text/plain', 'text/css', 'text/csv', 'text/html', 'text/xml'
    ],
    status: [200, 201, 400, 401, 403, 404, 500]
  }
};
