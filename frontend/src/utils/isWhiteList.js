import { getTgUserId } from "./verification";

export const isWhiteList = () => {
  let isWhiteList = false;
  const whiteList = [
    //TODO!
  ];

  const userId = Number(getTgUserId());

  whiteList.map((item) => {
    if (Number(item) === userId) {
      isWhiteList = true;
    }
  });

  return isWhiteList;
}