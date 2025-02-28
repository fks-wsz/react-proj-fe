import { useEffect } from "react";
import { useLatest } from "./useLatest";

export const useUnmount = (fn: () => void): void => {
  const fnRef = useLatest(fn);
  useEffect(
    () => () => {
      fnRef.current?.();
    },
    [fnRef],
  );
};
