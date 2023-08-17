import ImportData from "@/components/ImportData";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";

const ImportPage: NextPage = () => {
  return <ImportData />;
};

export default withProtected(ImportPage);
