const serverUrl = import.meta.env.VITE_SERVER_URL;
const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
const SIGNUP_ROUTE = serverUrl + authPath + '/signup';
const LOGIN_ROUTE = serverUrl + authPath + '/login';
const LOGOUT_ROUTE = serverUrl + authPath + '/logout';
const PUT_PROFILE_URL = serverUrl + authPath + '/update-profile';

export const logoutHandler = async () => {
  const response = await fetch(LOGOUT_ROUTE, {
    method: 'POST',
    credentials: 'include',

  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Signup failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const loginHandler = async (email: string, password: string) => {
  const response = await fetch(LOGIN_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Signup failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const signupHandler = async (email: string, password: string, confirmPassword: string) => {
  const response = await fetch(SIGNUP_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Signup failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

// export const fetchUserInfo = async () => {
//   try {
//     const response = await fetch(FETCH_USER_URL, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     });
//     const user = await response.json();
//     return user;
//   } catch (err) {
//     return false;
//   }
// };

export const updateProfileHandler = async (formData: FormData) => {
  console.log(PUT_PROFILE_URL);

  console.log(formData);

  const response = await fetch(PUT_PROFILE_URL, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Failed to update profile') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
