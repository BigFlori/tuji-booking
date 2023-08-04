import PageHead from "@/components/UI/PageHead";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";

const Settings: NextPage = () => {
  return (
    <>
      <PageHead page="Beállítások" metaDescription="Tuji-booking foglalási felületének beállításai" />
      <div>Beállítások</div>
    </>
  );
};

export default withProtected(Settings);
