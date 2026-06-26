import { useLocation, cookies, redirect } from "vanilla-bean";

export default function middleware() {
  const { path } = useLocation();
  if (path.startsWith("/demo/dashboard") && !cookies().get("session")) redirect("/demo/auth");
}
