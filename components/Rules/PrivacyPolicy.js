import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../constants/CustomHeader";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Privacy Policy"
        onBackPress={handleGoBack}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>
            Chính Sách Bảo Mật Thông Tin Người Dùng cho Ứng Dụng OU Job
          </Text>

          <Section
            title="1. Giới thiệu"
            content="Chào mừng bạn đến với OU Job, ứng dụng xin việc dành cho sinh viên trường Đại học Mở. OU Job là sản phẩm đồ án năm 3 của sinh viên Trần Đặng Mỹ Tiên, được thực hiện trong nhiều ngày liền với ý tưởng tạo ra trang tìm việc làm cho sinh viên, mở ra nhiều cơ hội cho cả sinh viên và nhà tuyển dụng. Chúng tôi cam kết bảo mật thông tin cá nhân của bạn và tuân thủ các quy định về bảo mật dữ liệu."
          />

          <Section
            title="2. Thông tin thu thập"
            content={[
              "• Thông tin cá nhân: Họ tên, ngày sinh, email, số điện thoại, địa chỉ.",
              "• Thông tin học vấn: Trường học, chuyên ngành, năm học.",
              "• Thông tin việc làm: CV, kinh nghiệm làm việc, kỹ năng, nguyện vọng nghề nghiệp.",
              "• Thông tin kỹ thuật: Địa chỉ IP, loại thiết bị, trình duyệt, hệ điều hành, thời gian truy cập và hoạt động trên ứng dụng.",
            ]}
          />

          <Section
            title="3. Mục đích sử dụng thông tin"
            content={[
              "• Cung cấp dịch vụ: Tạo và quản lý tài khoản người dùng, kết nối sinh viên với nhà tuyển dụng.",
              "• Cải thiện trải nghiệm người dùng: Nâng cao chất lượng ứng dụng, phát triển các tính năng mới, phân tích và nghiên cứu dữ liệu.",
              "• Liên lạc và hỗ trợ: Gửi thông báo, trả lời các câu hỏi và hỗ trợ kỹ thuật.",
              "• Bảo mật và tuân thủ pháp luật: Bảo vệ người dùng khỏi các hoạt động gian lận và đảm bảo tuân thủ các quy định pháp luật hiện hành.",
            ]}
          />

          <Section
            title="4. Chia sẻ thông tin"
            content={[
              "• Với sự đồng ý của bạn: Chúng tôi chỉ chia sẻ thông tin khi có sự đồng ý rõ ràng từ bạn.",
              "• Với nhà tuyển dụng: Chúng tôi chia sẻ thông tin liên quan đến hồ sơ xin việc của bạn với nhà tuyển dụng khi bạn nộp đơn ứng tuyển.",
              "• Theo yêu cầu pháp lý: Chúng tôi có thể chia sẻ thông tin của bạn nếu bắt buộc bởi luật pháp hoặc theo yêu cầu của cơ quan chức năng.",
            ]}
          />

          <Section
            title="5. Bảo mật thông tin"
            content="Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép, mất mát, tiêu hủy hoặc tiết lộ không mong muốn. Tuy nhiên, không có phương thức truyền tải dữ liệu qua Internet hay lưu trữ điện tử nào an toàn tuyệt đối, vì vậy chúng tôi không thể đảm bảo an toàn tuyệt đối cho thông tin của bạn."
          />

          <Section
            title="6. Quyền của bạn"
            content="Bạn có quyền truy cập, chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân của mình bất cứ lúc nào. Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến quyền của mình, vui lòng liên hệ với chúng tôi qua thông tin liên hệ dưới đây."
          />

          <Section
            title="7. Liên hệ"
            content="Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: [địa chỉ email hỗ trợ]."
          />

          <Section
            title="8. Thay đổi chính sách bảo mật"
            content="Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh các thay đổi về thực tiễn bảo mật thông tin của chúng tôi. Bất kỳ thay đổi nào sẽ được thông báo trên trang web và ứng dụng của chúng tôi, và chính sách bảo mật mới sẽ có hiệu lực ngay khi được đăng tải."
          />

          <Text style={styles.sectionFooter}>
            Chính sách bảo mật này có hiệu lực kể từ ngày [ngày tháng năm].
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, content }) => (
  <Card style={styles.card}>
    <Card.Title
      title={title}
      titleStyle={styles.cardTitle}
      left={() => (
        <Icon name="shield-checkmark-outline" size={20} color="#00b14f" />
      )}
    />
    <Card.Content>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>
            {item}
          </Text>
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
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#ffffff",
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
    color: "#777",
    fontStyle: "italic",
  },
});

export default PrivacyPolicy;
