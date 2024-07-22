import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../constants/CustomHeader";
import { Card } from 'react-native-paper';

const TermsOfService = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title="Terms of Service" onBackPress={handleGoBack} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>
            Điều Khoản Dịch Vụ cho Ứng Viên của Ứng Dụng OU Job
          </Text>

          <Section
            title="1. Giới thiệu"
            content="Chào mừng bạn đến với OU Job, ứng dụng xin việc dành cho sinh viên trường Đại học Mở. OU Job là sản phẩm đồ án năm 3 của sinh viên Trần Đặng Mỹ Tiên, được thực hiện với ý tưởng tạo ra trang tìm việc làm cho sinh viên, mở ra nhiều cơ hội cho cả sinh viên và nhà tuyển dụng. Bằng việc sử dụng ứng dụng OU Job, bạn đồng ý tuân thủ các điều khoản dịch vụ dưới đây."
          />

          <Section
            title="2. Đăng Ký Tài Khoản"
            content={[
              "• Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản trên OU Job.",
              "• Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình, và thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hoạt động trái phép nào liên quan đến tài khoản của bạn.",
              "• Bạn phải đủ 18 tuổi hoặc có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp để sử dụng ứng dụng này."
            ]}
          />

          <Section
            title="3. Quyền và Trách Nhiệm của Ứng Viên"
            content={[
              "• Bạn có quyền tạo hồ sơ xin việc, cập nhật thông tin cá nhân, tìm kiếm và ứng tuyển vào các công việc trên OU Job.",
              "• Bạn cam kết rằng mọi thông tin cung cấp trên hồ sơ xin việc là chính xác, đầy đủ và không gây hiểu lầm.",
              "• Bạn chịu trách nhiệm về nội dung thông tin mà bạn chia sẻ và phải đảm bảo rằng không vi phạm pháp luật, quyền lợi của bên thứ ba hoặc các quy định của OU Job."
            ]}
          />

          <Section
            title="4. Sử Dụng Dịch Vụ"
            content={[
              "• Bạn chỉ được sử dụng OU Job cho mục đích cá nhân và không thương mại.",
              "• Bạn không được sử dụng OU Job để đăng tải, gửi hoặc chia sẻ nội dung không phù hợp, gây hại hoặc có tính chất xúc phạm.",
              "• Bạn không được sử dụng các phương thức tự động (như bot, script) để truy cập hoặc sử dụng dịch vụ của OU Job."
            ]}
          />

          <Section
            title="5. Quyền Sở Hữu Trí Tuệ"
            content={[
              "• OU Job sở hữu tất cả các quyền sở hữu trí tuệ liên quan đến ứng dụng, bao gồm nhưng không giới hạn ở mã nguồn, thiết kế, logo và nội dung.",
              "• Bạn không được sao chép, sửa đổi, phân phối hoặc tạo ra các sản phẩm phái sinh từ bất kỳ phần nào của OU Job mà không có sự cho phép bằng văn bản từ chúng tôi."
            ]}
          />

          <Section
            title="6. Chấm Dứt Dịch Vụ"
            content={[
              "• Chúng tôi có quyền chấm dứt hoặc tạm ngưng tài khoản của bạn mà không cần thông báo trước nếu bạn vi phạm các điều khoản dịch vụ này hoặc có hành vi gây hại đến ứng dụng.",
              "• Bạn có thể chấm dứt sử dụng dịch vụ của OU Job bất cứ lúc nào bằng cách xóa tài khoản của mình."
            ]}
          />

          <Section
            title="7. Giới Hạn Trách Nhiệm"
            content={[
              "• OU Job không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng dụng, bao gồm nhưng không giới hạn ở việc mất mát dữ liệu, thiệt hại tài sản hoặc tổn thất tài chính.",
              "• Chúng tôi không đảm bảo rằng dịch vụ của OU Job sẽ không bị gián đoạn, an toàn hoặc không có lỗi."
            ]}
          />

          <Section
            title="8. Thay Đổi Điều Khoản Dịch Vụ"
            content="Chúng tôi có thể thay đổi điều khoản dịch vụ này theo thời gian để phản ánh các thay đổi về chính sách và quy định pháp luật. Bất kỳ thay đổi nào sẽ được thông báo trên ứng dụng và trang web của chúng tôi, và điều khoản dịch vụ mới sẽ có hiệu lực ngay khi được đăng tải."
          />

          <Section
            title="9. Liên Hệ"
            content="Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi qua email: support@oujob.com"
          />

          <Text style={styles.sectionFooter}>
            Điều khoản dịch vụ này có hiệu lực kể từ ngày 26 tháng 8 năm 2024.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, content }) => (
  <Card style={styles.card}>
    <Card.Title title={title} titleStyle={styles.cardTitle} />
    <Card.Content>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>{item}</Text>
        ))
      ) : (
        <Text style={styles.sectionContent}>{content}</Text>
      )}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00b14f",
  },
  sectionContent: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 8,
  },
  sectionFooter: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
});

export default TermsOfService;