import ForgetPasswordApollo from "@/components/Forms/forget-password/ForgetPasswordApollo";
import PageHead from "@/components/Page/PageHead";
import { withPublic } from "@/hoc/route";
import { NextPage } from "next";

const ForgotPassword: NextPage = () => {
  return (
    <>
      <PageHead 
        page="Elfelejtett jelszó" 
        metaDescription="Tuji-booking elfelejtett jelszó visszaállítása" 
      />
      <ForgetPasswordApollo />
    </>
  );
};

export default withPublic(ForgotPassword);