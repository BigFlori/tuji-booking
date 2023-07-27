import Calendar from "@/components/Calendar/Calendar";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";
import PageHead from "@/components/UI/PageHead";
import NavBar from "@/components/UI/NavBar";

const Home: NextPage = () => {
  return (
    <>
      <PageHead />
      <NavBar />
      <Calendar />
    </>
  );
};

export default withProtected(Home);
