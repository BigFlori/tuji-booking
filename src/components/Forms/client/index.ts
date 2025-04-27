import ClientFormApollo from "./ClientFormApollo";
import ClientFormLogic from "./ClientFormLogic";
import ClientFormView from "./ClientFormView";
import { 
  IClientFormApolloProps, 
  IClientFormLogicProps, 
  IClientFormModel, 
  IClientFormViewProps,
  ClientFormMode 
} from "./ClientFormTypes";

// Fő komponens exportálása
export default ClientFormApollo;

// Segédkomponensek exportálása
export { 
  ClientFormLogic,
  ClientFormView 
};

// Típusok exportálása
export type {
  IClientFormApolloProps,
  IClientFormLogicProps,
  IClientFormModel,
  IClientFormViewProps,
  ClientFormMode
};