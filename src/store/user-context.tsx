import { IRegisterFormModel } from "@/components/Forms/register/RegisterLogic";
import { auth } from "@/firebase/firebase.config";
import { createInitialUser, isUserdataExist } from "@/firebase/firestore-helpers/utils";
import { AuthError, User, updateProfile } from "firebase/auth";
import React from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

interface IUserContextObject {
  userState: {
    user?: User | null;
    loading: boolean;
    error: Error | undefined;
  };
  initialUserDataChecked: boolean;
  createUserState: {
    createUserWithEmailAndPassword: (data: IRegisterFormModel) => Promise<void>;
    loading: boolean;
    error: AuthError | undefined;
  };
  signInWithEmailAndPasswordState: {
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error: AuthError | undefined;
  };
  signInWithGoogleState: {
    signInWithGoogle: () => Promise<void>;
    loading: boolean;
    error: AuthError | undefined;
  };
}

export const UserContext = React.createContext<IUserContextObject>({
  userState: {
    user: null,
    loading: false,
    error: undefined,
  },
  initialUserDataChecked: false,
  createUserState: {
    createUserWithEmailAndPassword: async () => {},
    loading: false,
    error: undefined,
  },
  signInWithEmailAndPasswordState: {
    signInWithEmailAndPassword: async () => {},
    loading: false,
    error: undefined,
  },
  signInWithGoogleState: {
    signInWithGoogle: async () => {},
    loading: false,
    error: undefined,
  },
});

export const useAuthContext = () => React.useContext(UserContext);

export const useUser = () => {
  const { userState } = useAuthContext();
  return userState.user;
};

//Duplán ellenőrizni a felhasználói adatok meglétét, ezt érdemes lenne javítani majd
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const onAuthStateChangeEvent = async (user: User | null) => {
    if (!user) return;
    setInitialUserDataChecked(false);
    await isUserdataExist(user).then(() => {
      setInitialUserDataChecked(true);
    });
  };

  const [user, loading, error] = useAuthState(auth, { onUserChanged: onAuthStateChangeEvent });

  const [_createUserWithEmailAndPassword, createUser, createUserloading, createUserError] =
    useCreateUserWithEmailAndPassword(auth);
  const [
    _signInWithEmailAndPassword,
    emailPasswordUser,
    signInWithEmailAndPasswordLoading,
    signInWithEmailAndPasswordError,
  ] = useSignInWithEmailAndPassword(auth);
  const [_signInWithGoogle, googleUser, signInWithGoogleLoading, signInWithGoogleError] = useSignInWithGoogle(auth);

  //Amikor ez a state megváltozik akkor lekéri az adatbázisból a foglalásokat, csoportokat és ügyfeleket
  const [initialUserDataChecked, setInitialUserDataChecked] = React.useState(false);

  const createUserWithEmailAndPassword = async (data: IRegisterFormModel) => {
    setInitialUserDataChecked(false);
    await _createUserWithEmailAndPassword(data.email, data.password).then(async (userCredential) => {
      const user = userCredential?.user;
      if (!user) return;
      const displayName = `${data.firstName} ${data.lastName}`;

      await updateProfile(user, { displayName: displayName });
      await createInitialUser(user, displayName).then(() => {
        setInitialUserDataChecked(true);
      });
    });
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    setInitialUserDataChecked(false);
    await _signInWithEmailAndPassword(email, password).then(async (userCredential) => {
      const user = userCredential?.user;
      if (!user) return;
      await isUserdataExist(user).then(() => {
        setInitialUserDataChecked(true);
      });
    });
  };

  const signInWithGoogle = async () => {
    setInitialUserDataChecked(false);
    await _signInWithGoogle().then(async (userCredential) => {
      const user = userCredential?.user;
      if (!user) return;
      await createInitialUser(user, user.displayName).then(() => {
        setInitialUserDataChecked(true);
      });
    });
  };

  return (
    <UserContext.Provider
      value={{
        userState: { user, loading, error },
        initialUserDataChecked,
        createUserState: { createUserWithEmailAndPassword, loading: createUserloading, error: createUserError },
        signInWithEmailAndPasswordState: {
          signInWithEmailAndPassword,
          loading: signInWithEmailAndPasswordLoading,
          error: signInWithEmailAndPasswordError,
        },
        signInWithGoogleState: { signInWithGoogle, loading: signInWithGoogleLoading, error: signInWithGoogleError },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
