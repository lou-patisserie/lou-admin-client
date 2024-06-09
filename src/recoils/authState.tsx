import { atom } from "recoil";

const authState = atom({
  key: "authenticated",
  default: false,
});

export default authState;
