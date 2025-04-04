import { IRegisterFormModel } from "@/components/Forms/register/RegisterLogic";
import { auth } from "@/firebase/firebase.config";
import { createInitialUser, isUserdataExist } from "@/firebase/firestore-helpers/utils";
import {
  AuthError,
  User,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
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
  resetPasswordState: {
    resetPassword: (email: string) => Promise<void>;
    resetState: () => void;
    loading: boolean;
    error: AuthError | undefined;
    success: boolean;
  };
}

export const UserContext = React.createContext<IUserContextObject>({
  userState: {
    user: null,
    loading: false,
    error: undefined,
  },
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
  resetPasswordState: {
    resetPassword: async () => {},
    resetState: () => {},
    loading: false,
    error: undefined,
    success: false,
  },
});

export const useAuthContext = () => React.useContext(UserContext);

export const useUser = () => {
  const { userState } = useAuthContext();
  return userState.user;
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const onAuthStateChangeEvent = async (user: User | null) => {
    if (!user) return;
    
    // Check if user data exists
    await isUserdataExist(user);
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

  // States for password reset
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<AuthError | undefined>(undefined);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const createUserWithEmailAndPassword = async (data: IRegisterFormModel) => {
    const userCredential = await _createUserWithEmailAndPassword(data.email, data.password);
    
    const user = userCredential?.user;
    if (!user) return;
    
    const displayName = `${data.firstName} ${data.lastName}`;

    await updateProfile(user, { displayName: displayName });
    await createInitialUser(user, displayName);
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    const userCredential = await _signInWithEmailAndPassword(email, password);
    
    const user = userCredential?.user;
    if (!user) return;
    
    await isUserdataExist(user);
  };

  const signInWithGoogle = async () => {
    await _signInWithGoogle().then(async (userCredential) => {
      const user = userCredential?.user;
      if (!user) return;
      await createInitialUser(user, user.displayName);
    });
  };

  // Password reset function
  const resetPassword = async (email: string) => {
    setResetPasswordLoading(true);
    setResetPasswordError(undefined);
    setResetPasswordSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetPasswordSuccess(true);
    } catch (err) {
      setResetPasswordError(err as AuthError);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const resetPasswordState = () => {
    setResetPasswordLoading(false);
    setResetPasswordError(undefined);
    setResetPasswordSuccess(false);
  };

  return (
    <UserContext.Provider
      value={{
        userState: { user, loading, error },
        createUserState: { createUserWithEmailAndPassword, loading: createUserloading, error: createUserError },
        signInWithEmailAndPasswordState: {
          signInWithEmailAndPassword,
          loading: signInWithEmailAndPasswordLoading,
          error: signInWithEmailAndPasswordError,
        },
        signInWithGoogleState: { signInWithGoogle, loading: signInWithGoogleLoading, error: signInWithGoogleError },
        resetPasswordState: {
          resetPassword,
          resetState: resetPasswordState,
          loading: resetPasswordLoading,
          error: resetPasswordError,
          success: resetPasswordSuccess,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};