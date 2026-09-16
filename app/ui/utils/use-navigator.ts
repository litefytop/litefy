"use client";

import * as React from "react";

export type UseNavigatorOptions<T extends Record<string, unknown>> = {
  fields: T;
  onValuesChange?: (values: T) => void;
};

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  if (a === b) return true;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((key) => Object.is(a[key], b[key]));
}

export function useNavigator<T extends Record<string, unknown>>({
  fields,
  onValuesChange,
}: UseNavigatorOptions<T>) {
  const defaultsRef = React.useRef(fields);
  const [values, setValuesState] = React.useState<T>(fields);
  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const commit = React.useCallback(
    (next: T) => {
      if (shallowEqual(valuesRef.current, next)) return;
      valuesRef.current = next;
      setValuesState(next);
      onValuesChange?.(next);
    },
    [onValuesChange],
  );

  const setValue = React.useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      commit({ ...valuesRef.current, [key]: value });
    },
    [commit],
  );

  const setValues = React.useCallback(
    (patch: Partial<T>) => {
      commit({ ...valuesRef.current, ...patch });
    },
    [commit],
  );

  const reset = React.useCallback(() => {
    commit({ ...defaultsRef.current });
  }, [commit]);

  const activeKeys = Object.keys(defaultsRef.current).filter(
    (key) => !Object.is(values[key], defaultsRef.current[key]),
  );

  return {
    values,
    setValue,
    setValues,
    reset,
    activeKeys,
    activeCount: activeKeys.length,
  };
}
