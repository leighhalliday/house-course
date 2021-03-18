import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";

interface IProps {
  main: ReactNode;
}

const Layout: FunctionComponent<IProps> = ({ main }) => {
  const { logout, authenticated } = useAuth();

  return (
    <div className="max-w-screen-3xl mx-auto text-white">
      <nav className="bg-black-900 " style={{ height: "64px" }}>
        <div className="px-8 flex items-center justify-between h-16">
          <div className="flex items-center ">
            <Link href="/">
              <a>
                <img
                  src="/ss-logo.svg"
                  alt="Sportyspots logo"
                  className="inline w-40"
                />
              </a>
            </Link>
            <div className="text-lg px-8">
              <p className="font-sans font-medium">
                Find public spaces to play sports in Amsterdam
              </p>
            </div>
          </div>

          <div>
            {/* {authenticated ? (
              <>
                <Link href="/spots/add">
                  <a>add a spot</a>
                </Link>
                <button style={{ marginLeft: "16px" }} onClick={logout}>
                  Logout
                </button>{" "}
              </>
            ) : (
              <Link href="/auth">
                <a>Login / Signup</a>
              </Link>
            )} */}
          </div>
        </div>
      </nav>

      <main style={{ minHeight: "calc(100vh - 80px)" }}>{main}</main>
    </div>
  );
};

export default Layout;
