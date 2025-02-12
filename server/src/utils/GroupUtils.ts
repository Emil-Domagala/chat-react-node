import User from '../models/UserModel.ts';

export const validateGroupCreation = async (userId: string, selectedMembersIds: string[], name: string) => {
  let error: null | string = null;
  if (!Array.isArray(selectedMembersIds) || selectedMembersIds.length < 2) {
    return { error: 'Group has to have at least 2 members' };
  }

  if (!name.trim() || name.trim().length > 30) {
    return { error: 'Group name is required and cannot be longer than 30 characters' };
  }

  const existingUsers = await User.find({ _id: { $in: selectedMembersIds } }).select('_id groups');
  if (existingUsers.length !== selectedMembersIds.length) {
    return { error: 'Some users do not exist' };
  }

  const currentUser = await User.findById(userId).select('contacts groups');
  if (!currentUser) {
    return { error: 'User not found' };
  }

  const userContactIds = currentUser.contacts.map((contact) =>
    typeof contact.contactId === 'string' ? contact.contactId : contact.contactId.toString(),
  );

  const allAreContacts = selectedMembersIds.every((id) => userContactIds.includes(id));
  if (!allAreContacts) {
    return { error: 'Some selected members are not in your contacts' };
  }

  return { error, existingUsers, currentUser };
};
