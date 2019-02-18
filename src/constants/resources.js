let ResourcesConstants;

if (ENVIRONMENT === 'production') {
  ResourcesConstants = {
    API_URL: 'https://api.weasl.in',
    WEASL_ON_WEASL_CLIENT_ID: '9a63c7237a',
    WEASL_ON_WEASL_SHIM_URL: 'https://js.weasl.in/embed/shim.js',
  }
} else {
  ResourcesConstants = {
    API_URL: 'http://localhost:5000',
    WEASL_ON_WEASL_CLIENT_ID: 'cb4ebc07cd',
    WEASL_ON_WEASL_SHIM_URL: 'http://lcl.weasl.in:9000/shim.js',
  }
}

export const DEBUG = ENVIRONMENT !== 'production'
export const API_URL = ResourcesConstants.API_URL
export const WEASL_ON_WEASL_CLIENT_ID = ResourcesConstants.WEASL_ON_WEASL_CLIENT_ID
export const WEASL_ON_WEASL_SHIM_URL = ResourcesConstants.WEASL_ON_WEASL_SHIM_URL