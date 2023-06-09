export const ValidateEmail = (temail: string) => {
  //const mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
  //const mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  const mailformat =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return temail.match(mailformat) ? true : false;
};

export const apiAuthFieldValue = (
  userId: string,
  value: string,
  field: string,
  countryCode: string,
  twSecret: string
) => {
  if (field === "password" && userId.includes("@")) {
    return {
      email: userId,
      password: value,
    };
  } else if (field === "password" && !userId.includes("@")) {
    return {
      mobile: userId,
      password: value,
      countryCode,
    };
  } else if (field === "otp" && userId.includes("@")) {
    return {
      email: userId,
      otpcode: value,
    };
  } else if (field === "otp" && !userId.includes("@")) {
    return {
      mobile: userId,
      otpcode: value,
      countryCode,
    };
  } else if (field === "google") {
    return {
      login_type: "google",
      google_token: userId,
    };
  } else if (field === "facebook") {
    return {
      login_type: "facebook",
      facebook_token: userId,
    };
  } else if (field === "twitter") {
    return {
      login_type: "twitter",
      tw_access_token: userId,
      tw_token_secret: twSecret,
    };
  }
};

export const AppConsolelog = (string: string, text?: any) => {
  console.log(string, text);
};
export const AppConsoleinfo = (text: any) => {
  console.info(text);
};
