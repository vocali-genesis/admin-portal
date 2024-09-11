import { createStore, combineReducers } from "redux";
import templatesReducer, {
  TemplatesState,
} from "@/resources/redux/templates/reducer";
import userReducer, { UserState } from "@/resources/redux/users/reducer";

export interface RootState {
  templates: TemplatesState;
  user: UserState
}

const rootReducer = combineReducers({
  templates: templatesReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;
