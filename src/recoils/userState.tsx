import { atom } from "recoil";

const userState = atom({
  key: "user",
  default: {
    ID: "",
    username: "",
  },
});

export default userState;
