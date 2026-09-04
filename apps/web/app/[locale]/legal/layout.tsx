import { Toolbar } from "@964reserve/cms/components/toolbar";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
}

const LegalLayout = ({ children }: LegalLayoutProps) => (
  <>
    {children}
    <Toolbar />
  </>
);

export default LegalLayout;
