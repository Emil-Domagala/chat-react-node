import classes from './EditGroupModal.module.css';
import Modal from '../../../../UI/Modal/Modal';
import Input from '../../../../UI/Form/Input';
import { ContactDetail, useUser } from '../../../../../store/userContext';
import { useEffect, useState } from 'react';
import Lottie from '../../../../UI/Lottie/Lottie';
import UserItem from '../../../../UI/Chat/UserItem';
import ErrorText from '../../../../UI/Form/ErrorText';
import AddedUser from './AddedUser';
import {
  createGroupHTTP,
  getGroupDataHTTP,
  searchContactToGroupHTTP,
  editGroupHTTP,
} from '../../../../../utils/httpGroup';
import Loading from '../../../../UI/Loading/Loading';

const EditGroupModal = ({ turnOff, groupId }: { turnOff: React.MouseEventHandler<HTMLElement>; groupId?: string }) => {
  const { user, saveUserOnGroupAdd, saveUserOnGroupNameChange } = useUser();
  const [foundContact, setFoundContact] = useState<ContactDetail[] | []>([]);
  const [selectedMembers, setSelectedMembers] = useState<ContactDetail[] | []>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [groupNameWasTouched, setGroupNameWasTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupAdminId, setGroupAdminId] = useState<string | null>(null);

  let formIsValid = false;
  const selectedMembersAreValid = selectedMembers.length >= 2;
  const groupNameIsValid = groupName.trim() !== '' && groupName.trim().length < 30;
  const groupNameHasError = !groupNameIsValid && groupNameWasTouched;
  if (groupNameIsValid && selectedMembersAreValid) formIsValid = true;

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        const groupData = await getGroupDataHTTP(groupId!);
        setSelectedMembers([...groupData.members]);
        setGroupName(groupData.name);
        setGroupAdminId(groupData.admin);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
    setIsLoading(false);
  }, [groupId]);

  const searchContact = async (searchTerm: string) => {
    if (searchTerm.trim().length < 1) return setFoundContact([]);
    let foundContactIDs: string[] = [];
    if (selectedMembers.length > 0) {
      foundContactIDs = selectedMembers.map((contact) => {
        return contact._id;
      });
    }
    try {
      const resData = await searchContactToGroupHTTP(searchTerm.trim(), foundContactIDs);
      if (resData.possibleContacts.length < 1) return setFoundContact([]);
      setFoundContact(resData.possibleContacts);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnselectContact = (unselectedContact: ContactDetail) => {
    setSelectedMembers((prev) => prev.filter((contact) => contact._id !== unselectedContact._id));
    setFoundContact((prev) => [...prev, unselectedContact]);
  };

  const appendNewContact = async (item: ContactDetail) => {
    setSelectedMembers((prev) => [...prev, item]);
    setFoundContact((prev) => prev.filter((contact) => contact._id !== item._id));
  };

  const handleSubmitForm = async () => {
    if (!formIsValid) return;
    try {
      setIsLoading(true);
      const selectedMembersIds = selectedMembers.map((member) => member._id);
      if (groupId && groupAdminId == user?.id) {
        const resData = await editGroupHTTP(groupName, selectedMembersIds, groupId);
        saveUserOnGroupNameChange(resData._id, resData.name);
      } else if (!groupId) {
        const resData = await createGroupHTTP(groupName, selectedMembersIds);
        saveUserOnGroupAdd(resData.newGroup);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      // @ts-expect-error it just works
      turnOff();
    }
  };

  if (isLoading) {
    return (
      <Modal onClick={turnOff}>
        <Loading />
      </Modal>
    );
  }

  return (
    <Modal onClick={turnOff}>
      <>
        <h2 className={classes.header}>{groupId ? 'Edit Group' : 'Create Group'}</h2>
        <div className={classes['input-wrapper']}>
          <Input
            placeholder="Group Name"
            square
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={() => setGroupNameWasTouched(true)}
            value={groupName}
          />
          <ErrorText
            position
            hasErrors={groupNameHasError}
            errorMessage="Input cannot be empty and must be below 30 characters"
          />
        </div>
        <ul className={classes['users-in-group']}>
          {selectedMembers.map((contact) => {
            return <AddedUser contact={contact} key={contact._id} onClick={handleUnselectContact} />;
          })}
        </ul>
        <Input placeholder="Search contacts" square onChange={(e) => searchContact(e.target.value)} />
        <div className={classes['founded-contacts--wrapper']}>
          {foundContact.length > 0 ? (
            foundContact.map((item) => (
              <div onClick={() => appendNewContact(item)} key={item._id} className={classes['chat-link']}>
                <UserItem
                  userColor={item.color}
                  imageURL={item.image}
                  firstName={item.firstName}
                  lastName={item.lastName}
                />
              </div>
            ))
          ) : (
            <div className={classes['empty']}>
              <Lottie size={100} />
            </div>
          )}
        </div>
        <button disabled={!formIsValid} onClick={handleSubmitForm} type="button" className={classes['submit-button']}>
          {groupId ? 'Edit Group' : 'Create Group'}
        </button>
      </>
    </Modal>
  );
};

export default EditGroupModal;
