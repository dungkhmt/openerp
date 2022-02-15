import React, {useEffect} from 'react';
import {View, SafeAreaView, SectionList, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getMenuAction} from '../../redux-saga/actions/GetMenuAction';
import {
  MenuEduLearningManagement,
  MenuEduTeachingManagement,
  MenuProgrammingContestTeacher,
  MenuProgrammingContestStudent,
} from '../../configurations/Menus';

const makeMenuModel = menuList => {
  const menuEduLearningManagement = MenuEduLearningManagement();
  const menuEduTeachingManagement = MenuEduTeachingManagement();
  const menuProgrammingContestTeacher = MenuProgrammingContestTeacher();
  const menuProgrammingContestStudent = MenuProgrammingContestStudent();

  menuEduLearningManagement.child = menuEduLearningManagement.child.filter(
    child => menuList.includes('' + child.id),
  );
  menuEduTeachingManagement.child = menuEduTeachingManagement.child.filter(
    child => menuList.includes('' + child.id),
  );
  menuProgrammingContestTeacher.child =
    menuProgrammingContestTeacher.child.filter(child =>
      menuList.includes('' + child.id),
    );
  menuProgrammingContestStudent.child =
    menuProgrammingContestStudent.child.filter(child =>
      menuList.includes('' + child.id),
    );

  const input = [
    menuEduLearningManagement,
    menuEduTeachingManagement,
    menuProgrammingContestTeacher,
    menuProgrammingContestStudent,
  ].filter(element => element.child.length > 0);
  var output = [];
  input.forEach(element => {
    var data = [];
    element.child.forEach(child => {
      data.push(child.text);
    });
    output.push({title: element.text, data: data});
  });

  return output;
};

const MenuItem = ({title}) => (
  <View style={styles.cardContent}>
    <Text style={styles.menuItem}>{title}</Text>
  </View>
);

const MenuSectionHeader = ({title}) => (
  <View style={{backgroundColor: Colors.controlBackground}}>
    <Text style={styles.sectionHeader}>{title}</Text>
  </View>
);

const HomeScreen = () => {
  console.log('HomeScreen: enter');

  const dispatch = useDispatch();
  const loading = useSelector(state => state.getMenuReducer.isFetching);
  const menuList = useSelector(state => state.getMenuReducer.menuItemList);

  const menuModel = makeMenuModel(menuList);
  // console.log(JSON.stringify(menuModel));

  useEffect(() => {
    console.log('HomeScreen.useEffect: enter');
    dispatch(getMenuAction());
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <View
          style={{height: 216, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 36, fontWeight: 'bold', color: Colors.text}}>
            Dashboard
          </Text>
        </View>
        <SectionList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          sections={menuModel}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <MenuItem title={item} />}
          renderSectionHeader={({section: {title}}) => (
            <MenuSectionHeader title={title} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    padding: 8,
    margin: 8,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    height: 96,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    margin: 8,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    margin: 8,
    padding: 8,
  },
});
