import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import RouteChangeHandler from "../components/RouteChangeHandler";

export default function Root() {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
      <RouteChangeHandler />
      <Header />
      <Outlet />
    </div>
  );
}
