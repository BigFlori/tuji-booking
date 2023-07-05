import { auth } from "@/firebase/firebase.config";
import { withPublic } from "@/hoc/route";
import { Box, Button } from "@mui/material";
import { NextPage } from "next";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const Login: NextPage = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <Box>
      <Button onClick={() => signInWithGoogle()}>Login with Google</Button>
    </Box>
  );
};

export default withPublic(Login);
