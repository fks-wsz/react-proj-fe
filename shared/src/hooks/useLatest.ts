import { useRef } from "react";

export const useLatest = <T>(value: T): React.RefObject<T> => {
  const valueRef = useRef(value);
  valueRef.current = value;

  return valueRef;
};
