import { useInfiniteQuery } from '@tanstack/react-query';
import { IMessage } from '../store/socketContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const messagePath = import.meta.env.VITE_MESSAGE_BASE_PATH;
const FETCH_MESSAGE_ROUTE = `${serverUrl}${messagePath}/fetch-messages`;

const fetchMessages = async ({ pageParam = 1, chatId }: { pageParam: number; chatId: string }) => {
  const response = await fetch(`${FETCH_MESSAGE_ROUTE}?chatId=${chatId}&page=${pageParam}&limit=50`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Fetching messages failed');

  const resData = await response.json();

  return {
    messages: resData.messages || [], 
    nextPage: resData.nextPage ?? null,
  };
};

export const useChatMessages = (currentChatId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', currentChatId],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, chatId: currentChatId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,

    select: (data) => {
      const seen = new Set();
      return {
        pages: data.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((msg: IMessage) => {
            if (seen.has(msg._id)) return false;
            seen.add(msg._id);
            return true;
          }),
        })),
        pageParams: data.pageParams,
      };
    },
  });
};
