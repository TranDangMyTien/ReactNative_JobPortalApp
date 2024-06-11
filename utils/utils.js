//Kiểm tra nó kéo tới phần chân điện thoại chưa 
  //Hàm đo màn hình => Hỗ trợ phần lazy, trượt tới đâu thấy sản phẩm tới đó 
  export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };