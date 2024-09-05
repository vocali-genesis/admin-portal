import { createStore, combineReducers } from "redux";
import templatesReducer, {
  TemplatesState,
} from "@/resources/utils/templates-store/reducer";

export interface RootState {
  templates: TemplatesState;
}

const rootReducer = combineReducers({
  templates: templatesReducer,
});

const store = createStore(rootReducer);

export default store;
