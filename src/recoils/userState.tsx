import { atom } from "recoil";

const userState = atom({
  key: "user",
  default: {
    ID: "",
    role_id: 0,
    username: "",
    email: "",
    avatar: "",
  },
});

export default userState;
