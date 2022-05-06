import React from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';

const CarouselModel = [
  {
    title: 'Chương trình Khoa học Máy tính',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-khoa-hoc-may-tinh-ma-tuyen-sinh-it1.html',
  },
  {
    title: 'Chương trình Kỹ thuật Máy tính',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-dao-tao-cong-nghe-thong-tin-ky-thuat-may-tinh-it2.html',
  },
  {
    title: 'Chương trình Elitech Công nghệ thông tin Việt Nam - Nhật Bản',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-ky-su-cong-nghe-thong-tin-viet-nam-nhat-ban-hedspi.html',
  },
  {
    title: 'Chương trình Elitech Công nghệ thông tin toàn cầu',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-ky-su-cong-nghe-thong-tin-toan-cau-global-ict.html',
  },
  {
    title: 'Chương trình Elitech Khoa học dữ liệu và Trí tuệ nhân tạo',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-cu-nhan-khoa-hoc-du-lieu-va-tri-tue-nhan-tao-dsai-it-e10.html',
  },
  {
    title: 'Chương trình Elitech Công nghệ thông tin Việt Pháp',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-elitech-cong-nghe-thong-tin-viet-phap.html',
  },
  {
    title: 'Chương trình Elitech An toàn không gian số',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-elitech-an-toan-khong-gian-so-cyber-security-it-e15.html',
  },
  {
    title: 'Chương trình Cử nhân Tài năng Công nghệ thông tin và Truyền thông',
    body: '',
    imgUrl: '',
    link: 'https://soict.hust.edu.vn/chuong-trinh-dao-tao-elitech-tai-nang-khoa-hoc-may-tinh.html',
  },
  {
    title: 'Chương trình Kỹ sư Chất lượng cao',
    body: '',
    imgUrl: '',
    link: '',
  },
  {
    title: 'Chương trình TROY-IT',
    body: '',
    imgUrl: '',
    link: 'https://sie.hust.edu.vn/chuong-trinh-troy-my/',
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
