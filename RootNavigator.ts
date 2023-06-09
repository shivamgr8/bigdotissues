import * as React from "react";

export const navigationRef: any = React.createRef();

export function navigate(
  group: any,
  screen: any,
  ufname?: string | any,
  ulname?: string | any,
  uid?: string | any
) {
  navigationRef.current?.navigate(group, {
    screen: screen,
    params: {
      propsFirstName: ufname,
      propsLastName: ulname,
      uid: uid,
    },
  });
}
