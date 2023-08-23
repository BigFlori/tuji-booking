import { useTheme } from "@mui/material";
import Head from "next/head";

interface IPageHeadProps {
  page?: string;
  metaDescription?: string;
  iconHref?: string;
}

const PageHead: React.FC<IPageHeadProps> = ({ page, metaDescription, iconHref }) => {
  const theme = useTheme();
  return (
    <Head>
      <title>Tuji-Booking{page && ` • ${page}`}</title>
      <meta name="description" content={metaDescription ? metaDescription : "Tuji-booking foglalási felülete"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content={`${theme.palette.brandColor.main}`} />
      <link rel="icon" href={iconHref ? iconHref : "/favicon.ico"} />
    </Head>
  );
};

export default PageHead;
