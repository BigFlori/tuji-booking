import Calendar from "@/components/Calendar/Calendar";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";
import PageHead from "@/components/UI/PageHead";

const BookingApp: NextPage = () => {
  return (
    <>
      <PageHead />
      <Calendar />
    </>
  );
};

export default withProtected(BookingApp);
