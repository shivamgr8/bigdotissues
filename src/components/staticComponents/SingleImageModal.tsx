import React, { useEffect } from "react";
import { Modal, StyleSheet, BackHandler } from "react-native";
import { HeadingText, Text } from "../../components/Themed";
import ImageViewer from "react-native-image-zoom-viewer";
import { AppConsolelog } from "../../utils/commonFunctions";
import { isJsonString } from "../../utils/utilityFunctions";
import useColorScheme from "../../hooks/useColorScheme";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";
import Colors from "../../constants/Colors";
interface props {
  imageUrl: [] | any;
  closeHandler: () => void;
}

export default function SingleImageModal(props: props) {
  const colorScheme = useColorScheme();

  let theme = usePrefetchTheme();
  if (theme !== "light" && theme !== "dark") {
    theme = colorScheme;
  }

  // const images = [
  //   {
  //     url: "https://d65zu7a5alzko.cloudfront.net/media/details/Illegal-timber_may22.jpg",
  //   },
  // ];

  const closeModal = () => {
    props.closeHandler();
  };

  useEffect(() => {
    const backAction = () => {
      console.info("hardwareback");
      closeModal();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const url = isJsonString(props.imageUrl)
    ? JSON.parse(props.imageUrl)
    : props?.imageUrl?.length
    ? props?.imageUrl
    : [];

  const images = url.map((imageUrl: { url: string }) => ({
    url: imageUrl.url,
  }));

  console.log("--images--", images);

  return (
    <>
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ImageViewer
          imageUrls={images}
          enableSwipeDown
          onSwipeDown={closeModal}
          backgroundColor={Colors[theme].background}
          enableImageZoom={true}
          renderHeader={(currentIndex: any) => {
            return (
              <HeadingText style={styles.imageCount}>{`${currentIndex + 1}/${
                url?.length
              }`}</HeadingText>
            );
          }}
          renderFooter={(currentIndex) => {
            return (
              <HeadingText style={styles.footerTxt}>
                {url[currentIndex]?.title}
              </HeadingText>
            );
          }}
          footerContainerStyle={styles.bottomCom}
          renderIndicator={(currentIndex?: number, alSize?) => {
            console.log(alSize, "--item--", currentIndex);
            return <></>;
          }}
          useNativeDriver={true}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  footerTxt: {
    fontSize: 12,
    marginHorizontal: 5,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  imageCount: {
    fontSize: 14,
    alignSelf: "center",
    top: 10,
    fontFamily: "Poppins-Regular",
    width: 30,
    textAlign: "center",
    position: "absolute",
  },
  bottomCom: {
    bottom: 10,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    zIndex: 9999,
  },
});
