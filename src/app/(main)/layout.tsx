import { Footer } from "@/components/layout/Footer";

function FooterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

export default FooterLayout;
