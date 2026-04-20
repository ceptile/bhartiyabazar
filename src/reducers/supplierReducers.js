import {
  SUPPLIER_CREATE_REQUEST, SUPPLIER_CREATE_SUCCESS, SUPPLIER_CREATE_FAIL, SUPPLIER_CREATE_RESET,
  SUPPLIER_MY_REQUEST, SUPPLIER_MY_SUCCESS, SUPPLIER_MY_FAIL,
  SUPPLIER_DETAILS_REQUEST, SUPPLIER_DETAILS_SUCCESS, SUPPLIER_DETAILS_FAIL,
  SUPPLIER_LIST_REQUEST, SUPPLIER_LIST_SUCCESS, SUPPLIER_LIST_FAIL,
  SUPPLIER_COMPARE_REQUEST, SUPPLIER_COMPARE_SUCCESS, SUPPLIER_COMPARE_FAIL,
  SUPPLIER_ANALYTICS_REQUEST, SUPPLIER_ANALYTICS_SUCCESS, SUPPLIER_ANALYTICS_FAIL,
  SUPPLIER_CONTACT_REQUEST, SUPPLIER_CONTACT_SUCCESS, SUPPLIER_CONTACT_FAIL, SUPPLIER_CONTACT_RESET,
} from '../constants/supplierConstants.js';

export const supplierCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPPLIER_CREATE_REQUEST: return { loading: true };
    case SUPPLIER_CREATE_SUCCESS: return { loading: false, success: true, supplier: action.payload };
    case SUPPLIER_CREATE_FAIL: return { loading: false, error: action.payload };
    case SUPPLIER_CREATE_RESET: return {};
    default: return state;
  }
};

export const supplierMyReducer = (state = { supplier: null }, action) => {
  switch (action.type) {
    case SUPPLIER_MY_REQUEST: return { loading: true };
    case SUPPLIER_MY_SUCCESS: return { loading: false, supplier: action.payload };
    case SUPPLIER_MY_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const supplierDetailsReducer = (state = { supplier: {} }, action) => {
  switch (action.type) {
    case SUPPLIER_DETAILS_REQUEST: return { loading: true, supplier: {} };
    case SUPPLIER_DETAILS_SUCCESS: return { loading: false, supplier: action.payload };
    case SUPPLIER_DETAILS_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const supplierListReducer = (state = { suppliers: [] }, action) => {
  switch (action.type) {
    case SUPPLIER_LIST_REQUEST: return { loading: true, suppliers: [] };
    case SUPPLIER_LIST_SUCCESS: return { loading: false, ...action.payload };
    case SUPPLIER_LIST_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const supplierCompareReducer = (state = { suppliers: [] }, action) => {
  switch (action.type) {
    case SUPPLIER_COMPARE_REQUEST: return { loading: true, suppliers: [] };
    case SUPPLIER_COMPARE_SUCCESS: return { loading: false, suppliers: action.payload };
    case SUPPLIER_COMPARE_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const supplierAnalyticsReducer = (state = { analytics: null }, action) => {
  switch (action.type) {
    case SUPPLIER_ANALYTICS_REQUEST: return { loading: true };
    case SUPPLIER_ANALYTICS_SUCCESS: return { loading: false, analytics: action.payload };
    case SUPPLIER_ANALYTICS_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const supplierContactReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPPLIER_CONTACT_REQUEST: return { loading: true };
    case SUPPLIER_CONTACT_SUCCESS: return { loading: false, success: true, message: action.payload.message };
    case SUPPLIER_CONTACT_FAIL: return { loading: false, error: action.payload };
    case SUPPLIER_CONTACT_RESET: return {};
    default: return state;
  }
};