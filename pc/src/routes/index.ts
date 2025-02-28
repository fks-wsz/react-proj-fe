import Home from "@/containers/Home";
import Login from "@/containers/Login";

export const ROUTES_CONFIG = [
  {
    key: "home",
    path: "/",
    element: Home,
    title: "首页",
  },
  {
    key: "login",
    path: "/login",
    element: Login,
    title: "登录",
  },
];
