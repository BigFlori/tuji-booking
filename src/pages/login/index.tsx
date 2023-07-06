import LoginApollo from "@/components/Forms/login/LoginApollo";
import { withPublic } from "@/hoc/route";
import { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <LoginApollo />
  );
};

export default withPublic(Login);
