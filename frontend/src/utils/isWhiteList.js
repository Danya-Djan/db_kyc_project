import { getTgUserId } from "./verification";

export const isWhiteList = () => {
  let isWhiteList = false;
  //123456,
  const whiteList = [
    342495217, 6374536117, 322861155, 5219438370, 193428034, 402449803,
    406350282, 1083462027,
  ];

  const userId = Number(getTgUserId());

  whiteList.map((item) => {
    if (Number(item) === userId) {
      isWhiteList = true;
    }
  });

  return isWhiteList;
}