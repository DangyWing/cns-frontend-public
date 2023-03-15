import { useEffect, useRef } from "react";

export function usePreviousPrice(value: string | undefined) {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
