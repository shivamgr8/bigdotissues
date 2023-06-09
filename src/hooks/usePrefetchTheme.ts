import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { PrefetchContext } from "./PrefetchContext";
import useColorScheme from "../hooks/useColorScheme";

export default function usePrefetchTheme() {
  const context = useContext(PrefetchContext);
  let theme = context.theme;

  useEffect(() => {
    return () => {};
  }, [context.theme]);

  if (!theme) theme = "light";

  return theme;
}
