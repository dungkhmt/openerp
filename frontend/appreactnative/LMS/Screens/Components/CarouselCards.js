import React from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';

const CarouselModel = [
  {
    title: 'Computer Science',
    body: '',
    imgUrl: '',
  },
  {
    title: 'Network & Communication',
    body: '',
    imgUrl: '',
  },
  {
    title: 'Systems of Information',
    body: '',
    imgUrl: '',
  },
  {
    title: 'Software Engineering',
    body: '',
    imgUrl: '',
  },
];

const CarouselCards = () => {
  const isCarousel = React.useRef(null);

  return (
    <View>
      <Carousel
        layoutCardOffset={8}
        ref={isCarousel}
        data={CarouselModel}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        useScrollView={true}
      />
    </View>
  );
};

export default CarouselCards;
