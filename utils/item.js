import { Image } from "react-native";
import { List } from "react-native-paper";
import moment from "moment";
import "moment/locale/vi";

//Phần dùng chung của Course và Lesson - cách thức hiện ra Item 
const Item = ({instance}) => {  //Truyền vào thuộc tính 
    return (
        <List.Item  title={instance.title} description={instance.created_date?moment(instance.created_date).fromNow():""}  //Nếu có created_date thì dùng, không thì cho null 
            left={() => <Image style={styles.avatar} source={{uri: instance.image}} />} /> 
    );


}

const styles = StyleSheet.create({
    avatar:{
        width: 80,
        height: 80,
        borderRadius: 20,
    },
     
  });

export default Item; 