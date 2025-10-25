import { Dimensions } from 'react-native';

export const getScreenDimension = () => {
  // Retrieve screen height and width
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  return { screenHeight, screenWidth };
};