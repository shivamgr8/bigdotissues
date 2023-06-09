import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { Dimensions } from "react-native";
import { View } from "../Themed";

// const originalWidth = 500;
// const originalHeight = 2000;
// const aspectRatio = originalWidth / originalHeight;
// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Math.ceil(windowWidth / aspectRatio);
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;

const MyLoader = () => (
  <ContentLoader
    style={{ position: "absolute" }}
    viewBox={`0 0 ${windowWidth} ${windowHeight}`}
    width={windowWidth - 17}
    height={windowHeight}
    speed={1}
    backgroundColor={"#f3f3f3"}
    foregroundColor={"#ecebeb"}
    preserveAspectRatio="xMinYMin slice"
  >
    <Rect x="16" y="17" rx="0" ry="0" width={windowWidth} height="200" />
    <Rect x="15" y="229" rx="2" ry="2" width="360" height="15" />
    <Rect x="15" y="255" rx="2" ry="2" width="20" height="20" />
    <Circle cx="48" cy="265" r="3" />
    <Rect x="60" y="255" rx="0" ry="0" width="180" height="20" />
    <Rect x="320" y="255" rx="0" ry="0" width="20" height="20" />
    <Rect x="355" y="255" rx="0" ry="0" width="20" height="20" />

    <Rect x="225" y="300" rx="2" ry="2" width="150" height="100" />
    <Rect x="15" y="300" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="340" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="410" rx="2" ry="2" width="360" height="20" />
    <Rect x="15" y="440" rx="2" ry="2" width="20" height="20" />
    <Circle cx="48" cy="450" r="3" />
    <Rect x="60" y="440" rx="0" ry="0" width="180" height="20" />
    <Rect x="320" y="440" rx="0" ry="0" width="20" height="20" />
    <Rect x="355" y="440" rx="0" ry="0" width="20" height="20" />

    <Rect x="225" y="485" rx="2" ry="2" width="150" height="100" />
    <Rect x="15" y="485" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="525" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="595" rx="2" ry="2" width="360" height="20" />
    <Rect x="15" y="625" rx="2" ry="2" width="20" height="20" />
    <Circle cx="48" cy="635" r="3" />
    <Rect x="60" y="625" rx="0" ry="0" width="180" height="20" />
    <Rect x="320" y="625" rx="0" ry="0" width="20" height="20" />
    <Rect x="355" y="625" rx="0" ry="0" width="20" height="20" />

    <Rect x="225" y="670" rx="2" ry="2" width="150" height="100" />
    <Rect x="15" y="670" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="715" rx="2" ry="2" width="190" height="30" />
    <Rect x="15" y="780" rx="2" ry="2" width="360" height="20" />
    <Rect x="15" y="810" rx="2" ry="2" width="20" height="20" />
    <Circle cx="48" cy="820" r="3" />
    <Rect x="60" y="810" rx="0" ry="0" width="180" height="20" />
    <Rect x="320" y="810" rx="0" ry="0" width="20" height="20" />
    <Rect x="355" y="810" rx="0" ry="0" width="20" height="20" />
  </ContentLoader>
);

export default MyLoader;
