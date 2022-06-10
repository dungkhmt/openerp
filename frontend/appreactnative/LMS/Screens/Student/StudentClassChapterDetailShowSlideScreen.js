import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Dimensions, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import PhotoZoom from 'react-native-photo-zoom';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentPostClassChapterDetailSlidesAction} from '../../redux-saga/actions/StudentPostClassChapterDetailSlidesAction';

const CarouselSlideItem = ({item, index}) => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={styles.header}>{item.title}</Text>
      <PhotoZoom
        source={{uri: 'data:image/png;base64,' + item.data}}
        minimumZoomScale={0.75}
        maximumZoomScale={2.5}
        androidScaleType="center"
        onLoad={() => console.log('Image loaded!')}
        style={{width: width, height: height}}
      />
    </View>
  );
};

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const CarouselSlides = ({data}) => {
  const isCarousel = React.useRef(null);
  const width = Dimensions.get('screen').width;
  const [orientation, setOrientation] = useState(
    isPortrait() ? 'PORTRAIT' : 'LANDSCAPE',
  );

  useEffect(() => {
    const callback = () =>
      setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');
    Dimensions.addEventListener('change', callback);
    return () => {
      Dimensions.remove('change', callback);
    };
  }, []);

  return (
    <Carousel
      ref={isCarousel}
      data={data}
      renderItem={CarouselSlideItem}
      sliderWidth={width}
      itemWidth={width}
      useScrollView={true}
    />
  );
};

const StudentClassChapterDetailShowSlideScreen = ({route}) => {
  console.log('StudentClassChapterDetailShowSlideScreen: enter');

  const {slideId} = route.params;

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.studentPostClassChapterDetailSlidesReducer.isFetching,
  );
  const chapterDetailSlides = useSelector(
    state =>
      state.studentPostClassChapterDetailSlidesReducer.chapterDetailSlides,
  );

  useEffect(() => {
    console.log('StudentClassChapterDetailScreen.useEffect: enter');
    dispatch(studentPostClassChapterDetailSlidesAction({fileId: slideId}));
  }, []);

  if (
    chapterDetailSlides !== undefined &&
    chapterDetailSlides !== null &&
    chapterDetailSlides.length > 0
  ) {
    const data = chapterDetailSlides.map((e, i) => {
      return {title: 'Slide ' + (i + 1), data: e};
    });

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
          <CarouselSlides data={data} />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
        </View>
      </SafeAreaView>
    );
  }
};

export default StudentClassChapterDetailShowSlideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  header: {
    color: Colors.controlBackground,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingTop: 16,
    textAlign: 'center',
  },
});
