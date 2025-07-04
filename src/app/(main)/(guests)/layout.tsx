import Navbar from "@/components/ui/Navbar";
import React from "react";


function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}

export default MainLayout;
