import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function useInternet() {
  const [netStatus, setNetStatus] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        return setNetStatus(true);
      }
      setNetStatus(false);
    });
  }, [netStatus]);
  return netStatus;
}
