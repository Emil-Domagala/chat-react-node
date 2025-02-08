import { useInfiniteQuery } from '@tanstack/react-query';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const messagePath = import.meta.env.VITE_MESSAGE_BASE_PATH;
const FETCH_MESSAGE_ROUTE = serverUrl + messagePath + '/fetch-messages';

const fetchMessages = async ({ pageParam = 1, chatId }: { pageParam: number; chatId: string }) => {
  const response = await fetch(`${FETCH_MESSAGE_ROUTE}?chatId=${chatId}&page=${pageParam}&limit=50`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Fetching messages failed');

  console.log('works in react query');
  const resData = await response.json();
  console.log(resData);
  return {
    messages: resData.messages,
    nextPage: resData.nextPage ?? null, // `null` means no more pages
  };
};

export const useChatMessages = (currentChatId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', currentChatId],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, chatId: currentChatId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage, // Automatically handles pagination
  });
};
