const serverUrl = import.meta.env.VITE_SERVER_URL;
const messagePath = import.meta.env.VITE_MESSAGE_BASE_PATH;
const FETCH_MESSAGE_ROUTE = serverUrl + messagePath + '/fetch-messages';

export const fetchMessagestHTTP = async (currentChatId: string, page: number) => {
  const response = await fetch(`${FETCH_MESSAGE_ROUTE}?chatId=${currentChatId}&page=${page}&limit=50`, {
    method: 'GET',
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Getting messages failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
