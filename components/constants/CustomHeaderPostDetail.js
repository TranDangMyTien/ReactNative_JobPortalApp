import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu } from 'react-native-paper';

const CustomHeaderPostDetail = ({ title, onBackPress, onReport, onHide }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Icon name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={() => { onReport(); setMenuVisible(false); }} title="Báo cáo" />
        <Menu.Item onPress={() => { onHide(); setMenuVisible(false); }} title="Ẩn" />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00b14f',
    height: 50,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuButton: {
    padding: 10,
  },
});

export default CustomHeaderPostDetail;