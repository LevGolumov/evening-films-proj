import { Fragment } from "react";
import Footer from "./Footer";
import Header from "./Header";

function Layout({children}: {children: React.ReactNode}) {
    return <Fragment>
        <Header />
        <main className="flex-grow bg-sky-800 text-white">{children}</main>
        <Footer />
    </Fragment>;
}

export default Layout;