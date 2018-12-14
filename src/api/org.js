import { API_URL } from 'constants/resources';
import { getToken } from 'utils/auth';


export const OrgsAPI = {
  updateThemeProperty(name, value) {
    return fetch(`${API_URL}/orgs/theme/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${getToken()}`,
      },
      body: JSON.stringify({ value }),
    })
  },

  getMyOrg() {
    return fetch(`${API_URL}/orgs/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${getToken()}`,
      },
    })
  },
}