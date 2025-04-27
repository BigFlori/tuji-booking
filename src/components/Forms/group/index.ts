import GroupFormApollo from "./GroupFormApollo";
import GroupFormLogic from "./GroupFormLogic";
import GroupFormView from "./GroupFormView";
import { 
  IGroupFormApolloProps, 
  IGroupFormLogicProps, 
  IGroupFormModel, 
  IGroupFormViewProps,
  GroupFormMode 
} from "./GroupFormTypes";

// Fő komponens exportálása
export default GroupFormApollo;

// Segédkomponensek exportálása
export { 
  GroupFormLogic,
  GroupFormView 
};

// Típusok exportálása
export type {
  IGroupFormApolloProps,
  IGroupFormLogicProps,
  IGroupFormModel,
  IGroupFormViewProps,
  GroupFormMode
};