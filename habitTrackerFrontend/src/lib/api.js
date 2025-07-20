const BASE_URL = 'http://192.168.1.14:8000/api';

/**
 * Retrieves the token from localStorage.
 * @returns {string|null} The token or null if not found.
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Makes an API request.
 * @param {string} endpoint - The API endpoint.
 * @param {string} [method='GET'] - The HTTP method (GET, POST, PUT, DELETE).
 * @param {Object|null} [body=null] - The request body.
 * @param {boolean} [auth=false] - Whether to include authentication headers.
 * @returns {Promise<any>} The response data.
 * @throws {Error} If the response is not OK.
 */
async function apiRequest(endpoint, method = 'GET', body = null, auth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getToken();
    console.log('Token:', token); // Debugging line to check the token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization Header:', headers['Authorization']); // Debugging line to check the header
    }
  }
  const options = {
    method,
    headers,
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body); // Ensure the body is stringified
    console.log('Request Body:', options.body); // Debugging line to check the body
    
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const json = await res.json(); // Ensure the response is parsed
    if (!res.ok) {
      throw new Error(json.message || 'API request failed');
    };
    return json;
  } catch (error) {
    console.error('API request error:', error);
    return null;
}
}


/**
 * Registers a new user.
 * @param {Object} data - The user data to register.
 * @returns {Promise<any>} The response data.
 */
export async function registerUser(data) {
  return apiRequest('/auth/register', 'POST', data);
}

/**
 * Logs in a user.
 * @param {Object} data - The login credentials.
 * @returns {Promise<any>} The response data.
 * @throws {Error} If login fails.
 * */
export async function loginUser(data) {
  return apiRequest('/auth/login', 'POST', data)
}

/**
 * Verifies a logged in users token.
 * @param {Object} data - The verification data.
 * @returns {Promise<any>} The response data.
 * @throws {Error} If verification fails.
 */ 
export async function verifyUser(data) {
  return apiRequest('/auth/verify', 'GET', null, true);
}

/**
 * Fetches all habits for the authenticated user.
 * @returns {Promise<any>} The user's habits.
 */
export async function getHabits() {
  return apiRequest('/habit', 'GET', null, true);
}

/**
 * checks a habit for that day
 * @param {string} habitId - The ID of the habit to check.
 * @returns {Promise<any>} The response data.
 * @throws {Error} If the check fails.
 */
export async function checkHabit(habitId) {
  return apiRequest(`/habit/${habitId}/check`, 'PATCH', null, true);
}

/**
 * Adds a new habit.
 * @param {Object} data - The habit data to add.
 * @returns {Promise<any>} The response data.
 */
export async function addHabit(data) {
  return apiRequest('/habit', 'POST', data, true);
}