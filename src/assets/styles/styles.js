import { StyleSheet, Dimensions } from 'react-native';

const gstyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',      
      margin:0,                   
    },
    title: {
      fontSize: 28,                
      alignSelf:"stretch",
    },
    separator: {
      marginVertical: 5,
      height: 1,
      backgroundColor:'#cccccc',
      opacity:0.8,
      width: '100%',
    },
  });

  export default gstyles