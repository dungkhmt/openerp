import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Navigation from '../navigation/Navigation.js';

class AxiosService {
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://openerp.dailyopt.ai/api',
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(this.handlerRequest);
    this.instance.interceptors.response.use(
      this.handleSuccess,
      this.handleError,
    );
  }

  handlerRequest = request => {
    // console.log(request);
    return request;
  };

  handleSuccess = response => {
    // console.log(response);
    return response;
  };

  handleError = error => {
    if (
      error.response !== undefined &&
      error.response !== null &&
      error.response.status === 401 &&
      Navigation.navigationRef.current.getCurrentRoute().name !== 'Auth'
    ) {
      AsyncStorage.removeItem('user_id');
      AsyncStorage.removeItem('user_token');
      Navigation.replace('Auth');
    }
    return Promise.reject(error);
  };

  get(url, config = null) {
    return this.instance.get(url, config);
  }

  post(url, data, config = null) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config = null) {
    return this.instance.put(url, data, config);
  }

  delete(url, param) {
    return this.instance.delete(url, param);
  }

  setToken = token => {
    var headers = this.instance.defaults.headers;
    const authenticationToken = {'x-auth-token': token};
    headers = {...headers, ...authenticationToken};
    this.instance.defaults.headers = headers;
  };
}

const axiosService = new AxiosService();

export default axiosService;
