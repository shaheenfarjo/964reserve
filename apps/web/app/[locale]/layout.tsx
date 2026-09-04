import "./styles.css";
import { AnalyticsProvider } from "@964reserve/analytics/provider";
import { Toolbar as CMSToolbar } from "@964reserve/cms/components/toolbar";
import { DesignSystemProvider } from "@964reserve/design-system";
import { fonts } from "@964reserve/design-system/lib/fonts";
import { cn } from "@964reserve/design-system/lib/utils";
import { Toolbar } from "@964reserve/feature-flags/components/toolbar";
import { getDictionary } from "@964reserve/internationalization";
import type { ReactNode } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <Header dictionary={dictionary} />
            {children}
            <Footer />
          </DesignSystemProvider>
          <Toolbar />
          <CMSToolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
