import React from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';

const CarouselModel = [
  {
    imgUrl: 'https://cafedev.vn/wp-content/uploads/2020/07/cafedev_datastruct_alg.jpeg',
  },
  {
    imgUrl: 'https://www.techfry.com/images/articles/php/object-oriented-programming.jpg',
  },
  {
    imgUrl: 'https://hninternationaledu.com/wp-content/uploads/2021/01/system-analysis-and-design.jpg',
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
