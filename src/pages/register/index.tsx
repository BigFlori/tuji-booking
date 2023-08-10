import RegisterApollo from "@/components/Forms/register/RegisterApollo";
import PageHead from "@/components/Page/PageHead";
import { withPublic } from "@/hoc/route";
import { NextPage } from "next";

const Register: NextPage = () => {
  return (
    <>
      <PageHead page="Regisztráció" metaDescription="Tuji-booking foglalási rendszeréhez regisztrációs felület" />
      <RegisterApollo />
    </>
  );
};

export default withPublic(Register);
