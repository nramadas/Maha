import { LayoutAnimation } from 'react-native';

const quickTiming = LayoutAnimation.create(150, 'easeInEaseOut', 'opacity');
const mediumTiming = LayoutAnimation.create(300, 'easeInEaseOut', 'opacity');
const slowTiming = LayoutAnimation.create(1000, 'easeInEaseOut', 'opacity');

export const quick = LayoutAnimation.configureNext.bind(null, quickTiming);
export const medium = LayoutAnimation.configureNext.bind(null, mediumTiming);
export const slow = LayoutAnimation.configureNext.bind(null, slowTiming);
