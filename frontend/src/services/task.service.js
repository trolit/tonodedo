import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/task/';

class TaskService {

  create(email, description) {
    return axios.post(API_URL,
      {
        email,
        description
      }, 
      { 
        headers: authHeader() 
      });
  }

  getAllByEmail(email) {
    return axios.get(API_URL + email, 
    { 
      headers: authHeader() 
    });
  }

  delete(email, id) {
    return axios.delete(`${API_URL}${email}/${id}`, { headers: authHeader() });
  }

  update(id, description, email) {
    return axios.put(API_URL + id, 
      { 
        description,
        email
      }, 
      { 
        headers: authHeader() 
      });
  }
}

export default new TaskService();
