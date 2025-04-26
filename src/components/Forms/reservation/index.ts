import ReservationFormApollo from "./ReservationFormApollo";
import ReservationFormLogic from "./ReservationFormLogic";
import ReservationFormView from "./ReservationFormView";
import { 
  IReservationFormApolloProps, 
  IReservationFormLogicProps, 
  IReservationFormModel, 
  IReservationFormModelWithEmptyDate, 
  IReservationFormViewProps,
  ReservationFormMode 
} from "./ReservationFormTypes";

// Fő komponens exportálása
export default ReservationFormApollo;

// Segédkomponensek exportálása
export { 
  ReservationFormLogic,
  ReservationFormView 
};

// Típusok exportálása
export type {
  IReservationFormApolloProps,
  IReservationFormLogicProps,
  IReservationFormModel,
  IReservationFormModelWithEmptyDate,
  IReservationFormViewProps,
  ReservationFormMode
};