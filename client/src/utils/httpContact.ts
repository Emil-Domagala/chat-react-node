const serverUrl = import.meta.env.VITE_SERVER_URL;
const contactPath = import.meta.env.VITE_CONTACT_BASE_PATH;
const ADD_CONTACT_ROUTE = serverUrl + contactPath + '/add-contact';
const SEARCH_CONTACTS_ROUTE = serverUrl + contactPath + '/search-contacts';
const DELETE_CONTACT_ROUTE = serverUrl + contactPath + '/delete-contact';

export const searchContactHandler = async (searchTerm: string) => {
  const response = await fetch(SEARCH_CONTACTS_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchTerm }),
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Getting contacts failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const addContactHandler = async (contactId: string) => {
  const response = await fetch(ADD_CONTACT_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId }),
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Getting contacts failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const deleteContactHandler = async (deleteContactId: string) => {
  const response = await fetch(DELETE_CONTACT_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deleteContactId }),
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Getting contacts failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
