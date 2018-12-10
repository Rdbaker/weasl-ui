import { API_URL } from 'constants/resources';
import { getToken } from 'utils/auth';


export const OrgsAPI = {
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