import { atom } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    id: null as string | null,
    name: null as string | null,
  },
});

export default userState;
