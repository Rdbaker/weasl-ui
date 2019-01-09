import { API_URL } from 'constants/resources';
import { getToken } from 'utils/auth';


export const OrgsAPI = {
  updateThemeProperty(name, value, type='STRING') {
    return fetch(`${API_URL}/orgs/theme/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${getToken()}`,
      },
      body: JSON.stringify({ value, type }),
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