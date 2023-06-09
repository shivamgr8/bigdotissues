import React from 'react'
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { Text, View, } from '../../components/Themed';

export default function ListingLoader() {
  return (
    <>
        <ContentLoader 
          speed={2}
          width={600}
          height={600}
          viewBox="0 0 600 600"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
      </ContentLoader>
    </>
  )
}
