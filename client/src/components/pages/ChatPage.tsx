import { useUser } from '../../store/userContext';


const ChatPage = () => {
const {user} = useUser()
if(!user?.profileSetup){
    //display div please set up profile
}

  return (
   <h1>chat</h1>
  );
};
export default ChatPage;
