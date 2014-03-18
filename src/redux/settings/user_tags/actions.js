const userTagsActions = {

  USER_TAG_ADD: 'USER_TAG_ADD',
  USER_TAG_ADD_SUCCESS: 'USER_TAG_ADD_SUCCESS',
  USER_TAG_DELETE: 'USER_TAG_DELETE',
  USER_TAG_DELETE_SUCCESS: 'USER_TAG_DELETE_SUCCESS',
  USER_TAG_GET: 'USER_TAG_GET',
  USER_TAG_GET_SUCCESS: 'USER_TAG_GET_SUCCESS',


  addUserTag: (userTags) => ({
    type: userTagsActions.USER_TAG_ADD,
    userTags,
  }),
  addUserTagSuccess: (userTags) => ({
	  type: userTagsActions.USER_TAG_ADD_SUCCESS,
	  userTags,
  }),
  deleteUserTag: (userTags) => ({
    type: userTagsActions.USER_TAG_DELETE,
    userTags,
  }),
  deleteUserTagSuccess: (userTags) => ({
    type: userTagsActions.USER_TAG_DELETE_SUCCESS,
    userTags,
  }),
  getUserTag: () => ({
    type: userTagsActions.USER_TAG_GET,
  }),
  getUserTagSuccess: (tags) => ({
	  type: userTagsActions.USER_TAG_GET_SUCCESS,
	  tags
  }),
}

export default userTagsActions;
