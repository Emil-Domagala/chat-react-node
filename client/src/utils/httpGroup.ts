import { ContactDetail } from '../store/userContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const groupPath = import.meta.env.VITE_GROUP_BASE_PATH;
const SEARCH_CONTACTS_ROUTE = serverUrl + groupPath + '/search-contacts';
const CREATE_GROUP_ROUTE = serverUrl + groupPath + '/create-group';
const DELETE_GROUP_ROUTE = serverUrl + groupPath + '/delete-group';
const EDIT_GROUP_ROUTE = serverUrl + groupPath + '/edit-group';
const LEAVE_GROUP_ROUTE = serverUrl + groupPath + '/leave-group';

export const searchContactToGroupHTTP = async (searchTerm: string, alredySelectedIds: string[]) => {
  const response = await fetch(SEARCH_CONTACTS_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchTerm, alredySelectedIds }),
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
export const getGroupDataHTTP = async (groupId: string) => {
  const response = await fetch(`${serverUrl}${groupPath}/${groupId}`, {
    method: 'GET',
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Getting group data failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const createGroupHTTP = async (name: string, selectedMembersIds: string[]) => {
  const response = await fetch(CREATE_GROUP_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, selectedMembersIds }),
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Creating group failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
export const editGroupHTTP = async (name: string, selectedMembersIds: string[], groupId: string) => {
  const response = await fetch(EDIT_GROUP_ROUTE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, selectedMembersIds, groupId }),
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Creating group failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};

export const deleteGroupHTTP = async (groupId: string, chatId: string) => {
  const response = await fetch(DELETE_GROUP_ROUTE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupId, chatId }),
    credentials: 'include',
  });
  const resData = await response.json();
  if (!response.ok) {
    const error = new Error(resData.message || 'Creating group failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
export const leaveGroupHTTP = async (groupId: string) => {
  const response = await fetch(LEAVE_GROUP_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupId }),
    credentials: 'include',
  });
  const resData = await response.json();
  if (!response.ok) {
    const error = new Error(resData.message || 'Creating group failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
