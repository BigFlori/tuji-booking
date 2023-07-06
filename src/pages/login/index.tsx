import LoginApollo from "@/components/Forms/login/LoginApollo";
import PageHead from "@/components/UI/PageHead";
import { withPublic } from "@/hoc/route";
import { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <>
      <PageHead page="Bejelentkezés" metaDescription="Tuji-booking foglalási felületére bejelentkezés" />
      <LoginApollo />
    </>
  );
};

export default withPublic(Login);
