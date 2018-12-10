let ResourcesConstants;

if (ENVIRONMENT === 'production') {
  ResourcesConstants = {
    API_URL: 'https://api.weasl.in',
  }
} else {
  ResourcesConstants = {
    API_URL: 'http://localhost:5000',
  }
}

export const DEBUG = ENVIRONMENT !== 'production'
export const API_URL = ResourcesConstants.API_URL