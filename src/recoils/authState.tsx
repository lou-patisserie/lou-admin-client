import { atom } from "recoil";

const authState = atom({
  key: "isAuthenticated",
  default: false,
});

export default authState;
