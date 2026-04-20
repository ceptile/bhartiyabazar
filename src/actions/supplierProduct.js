import axios from 'axios';
import {
  SUPPLIER_CREATE_REQUEST, SUPPLIER_CREATE_SUCCESS, SUPPLIER_CREATE_FAIL,
  SUPPLIER_DETAILS_REQUEST, SUPPLIER_DETAILS_SUCCESS, SUPPLIER_DETAILS_FAIL,
  SUPPLIER_LIST_REQUEST, SUPPLIER_LIST_SUCCESS, SUPPLIER_LIST_FAIL,
  SUPPLIER_MY_REQUEST, SUPPLIER_MY_SUCCESS, SUPPLIER_MY_FAIL,
  SUPPLIER_COMPARE_REQUEST, SUPPLIER_COMPARE_SUCCESS, SUPPLIER_COMPARE_FAIL,
  SUPPLIER_ANALYTICS_REQUEST, SUPPLIER_ANALYTICS_SUCCESS, SUPPLIER_ANALYTICS_FAIL,
  SUPPLIER_CONTACT_REQUEST, SUPPLIER_CONTACT_SUCCESS, SUPPLIER_CONTACT_FAIL,
} from '../constants/supplierConstants.js';

// KEY FIX: reads token from Redux state — no re-login needed
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState();
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

export const createOrUpdateSupplier = (supplierData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUPPLIER_CREATE_REQUEST });
    const config = getAuthConfig(getState);
    const { data } = await axios.post('/api/supplier', supplierData, config);
    dispatch({ type: SUPPLIER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_CREATE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const getMySupplier = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUPPLIER_MY_REQUEST });
    const config = getAuthConfig(getState);
    const { data } = await axios.get('/api/supplier/my', config);
    dispatch({ type: SUPPLIER_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_MY_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const listAllSuppliers = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_LIST_REQUEST });
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/supplier?${query}`);
    dispatch({ type: SUPPLIER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const getSupplierById = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/supplier/${id}`);
    dispatch({ type: SUPPLIER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_DETAILS_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const compareSuppliers = (ids) => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_COMPARE_REQUEST });
    const { data } = await axios.post('/api/supplier/compare', { ids });
    dispatch({ type: SUPPLIER_COMPARE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_COMPARE_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const getSellerAnalytics = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUPPLIER_ANALYTICS_REQUEST });
    const config = getAuthConfig(getState);
    const { data } = await axios.get(`/api/supplier/${id}/analytics`, config);
    dispatch({ type: SUPPLIER_ANALYTICS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_ANALYTICS_FAIL, payload: error.response?.data?.message || error.message });
  }
};

export const sendContactMessage = (id, messageData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUPPLIER_CONTACT_REQUEST });
    const config = getAuthConfig(getState);
    const { data } = await axios.post(`/api/supplier/${id}/contact`, messageData, config);
    dispatch({ type: SUPPLIER_CONTACT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPPLIER_CONTACT_FAIL, payload: error.response?.data?.message || error.message });
  }
};