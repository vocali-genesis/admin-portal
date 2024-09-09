import { GenesisUser, SubscriptionResponse } from '@/core/module/core.types';

const SET_USER = "SET_USER";
const SET_SUBSCRIPTION = 'SET_SUBSCRIPTION';
const CLEAR_USER = 'CLEAR_USER';

type UserActionTypes = {
  type: typeof SET_USER;
  payload: GenesisUser;
} | {
  type: typeof SET_SUBSCRIPTION;
  payload: SubscriptionResponse;
} | {
  type: typeof CLEAR_USER;
};

export interface UserState {
  user: GenesisUser | null;
  subscription: SubscriptionResponse | null;
}

const initialState: UserState = {
  user: null,
  subscription: null,
};

const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_SUBSCRIPTION:
      return { ...state, subscription: action.payload };
    case CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;