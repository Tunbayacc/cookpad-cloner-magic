export type Recipe = {
  slug: string;
  title: string;
  author: string;
  authorBio: string;
  authorRecipes: number;
  time: string;
  servings: string;
  intro: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  tips?: string;
};

export const recipes: Recipe[] = [
  {
    slug: "thit-kho-trung-nuoc-dua",
    title: "Thịt kho trứng nước dừa",
    author: "Mẹ Lan",
    authorBio: "Nội trợ 30 năm ở Sài Gòn, chuyên các món kho truyền thống Nam Bộ.",
    authorRecipes: 24,
    time: "90 phút",
    servings: "4 người",
    intro:
      "Món kho quen thuộc của mâm cơm Nam Bộ, thịt ba chỉ mềm nhừ, trứng thấm màu nước dừa vàng óng.",
    ingredients: [
      { name: "Thịt ba chỉ", amount: "500 g" },
      { name: "Trứng vịt", amount: "6 quả" },
      { name: "Nước dừa tươi", amount: "500 ml" },
      { name: "Nước màu (dừa hoặc hàng)", amount: "2 muối canh" },
      { name: "Nước mắm ngon", amount: "2 muối canh" },
      { name: "Đường", amount: "1 muối canh" },
      { name: "Hành tím băm, tỏi băm", amount: "1 muối canh" },
      { name: "Ớt tươi", amount: "2 quả" },
    ],
    steps: [
      "Thịt ba chỉ rửa sạch với muối, cắt khúc vuông khoảng 4 cm.",
      "Ướp thịt với nước mắm, đường, hành tím, tỏi băm và nước màu trong 30 phút.",
      "Luộc trứng vịt chín tới, bóc vỏ, để ráo.",
      "Cho thịt vào nồi, đảo trên lửa vừa đến khi thịt săn lại và ngấm màu.",
      "Đổ nước dừa tươi vào, đun sôi rồi hạ nhỏ lửa, kho liu riu 45 phút.",
      "Cho trứng vào kho cùng 15 phút cuối, nêm lại cho vừa miệng.",
      "Cắt mở lửa, rắc ớt tươi và dùng nóng với cơm trắng.",
    ],
    tips: "Dùng nước dừa tươi thay nước lọc sẽ giúp thịt kho mềm và có màu cánh gián tự nhiên.",
  },
  {
    slug: "canh-chua-ca-loc",
    title: "Canh chua cá lóc",
    author: "Bếp của Hà",
    authorBio: "Người miền Tây yêu nước, chia sẻ công thức đồng bằng mỗi tuần.",
    authorRecipes: 18,
    time: "40 phút",
    servings: "4 người",
    intro:
      "Vị chua thanh của me, ngọt của cá lóc và hương ngò om làm nên linh hồn món canh miền Tây.",
    ingredients: [
      { name: "Cá lóc", amount: "600 g" },
      { name: "Me chua", amount: "100 g" },
      { name: "Cà chua", amount: "2 quả" },
      { name: "Rau cần nước, giá đỗ", amount: "200 g" },
      { name: "Bạc hà (dọc mùng)", amount: "2 cây" },
      { name: "Ngò om, hành lá", amount: "1 nắm" },
      { name: "Nước mắm, đường, muối", amount: "vừa ăn" },
    ],
    steps: [
      "Cá lóc làm sạch, cắt khúc, ướp với chút muối và nước mắm 15 phút.",
      "Dầm me với nước sôi, lọc lấy nước cốt chua.",
      "Phi thơm tỏi, cà chua bổ múi vào xào sơ.",
      "Đun sôi nước, cho cá và nước cốt me vào, nấu 10 phút và vớt bọt.",
      "Nêm nước mắm, đường, muối cho vừa miệng.",
      "Cho bạc hà, giá đỗ, rau cần vào, tắt bếp ngay khi canh sôi lại.",
      "Rắc ngò om, hành lá, dùng kèm nước mắm ớt.",
    ],
    tips: "Đừng nấu rau quá lâu — canh chua miền Tây ngon nhất khi rau còn giòn.",
  },
  {
    slug: "goi-cuon-tom-thit",
    title: "Gỏi cuốn tôm thịt",
    author: "Minh Anh",
    authorBio: "Yêu bếp từ thời sinh viên, thích các món ăn vặt lành mạnh.",
    authorRecipes: 12,
    time: "30 phút",
    servings: "4 người",
    intro:
      "Món ăn mát lành, cuốn tất cả vị ngon của tôm, thịt và rau sống trong lớp bánh tráng mềm dẻo.",
    ingredients: [
      { name: "Tôm tươi", amount: "300 g" },
      { name: "Thịt nạc luộc", amount: "200 g" },
      { name: "Bánh tráng", amount: "12 tấm" },
      { name: "Bún tươi", amount: "400 g" },
      { name: "Rau xà lách, rau thơm, dưa leo", amount: "đủ dùng" },
      { name: "Xốt tương đậu phộng", amount: "1 chén" },
    ],
    steps: [
      "Luộc tôm và thịt, để nguội rồi thái mỏng. Tôm bóc vỏ, cắt đôi.",
      "Chuẩn bị bún, rau rửa sạch để ráo, dưa leo thái lát dài.",
      "Tráng mềm bánh tráng qua nước ấm, trải lên mặt phẳng.",
      "Xếp lần lượt rau, bún, thịt, tôm và cuốn chặt tay.",
      "Pha xốt tương đậu phộng hoặc dùng nước chấm chua ngọt.",
    ],
    tips: "Tráng bánh tráng qua nước ấm là đủ, ngâm lâu sẽ làm bánh bị nhão khi cuốn.",
  },
  {
    slug: "banh-flan-caramel",
    title: "Bánh flan caramel",
    author: "Thu Trang",
    authorBio: "Công thức làm bánh gia đình được truyền lại ba thế hệ.",
    authorRecipes: 9,
    time: "60 phút",
    servings: "8 khu",
    intro:
      "Bánh flan mềm mịn, bốc mùi vanilla, phủ lớp caramel đắng ngọt hài hòa.",
    ingredients: [
      { name: "Trứng gà", amount: "5 quả" },
      { name: "Sữa tươi", amount: "400 ml" },
      { name: "Sữa đặc", amount: "200 g" },
      { name: "Đường trắng", amount: "100 g" },
      { name: "Nước sôi để nguội", amount: "50 ml" },
      { name: "Tinh chất vanilla", amount: "1 thìa cà phê" },
    ],
    steps: [
      "Pha 50 g đường với chút nước, đun lửa nhỏ thành caramel vàng, đổ vào đáy khuôn.",
      "Đánh tan trứng với sữa tươi, sữa đặc và vanilla, không đánh bong bóng.",
      "Lọc hỗn hợp qua rây để bánh mịn màng.",
      "Đổ hỗn hợp vào khuôn đã có caramel.",
      "Hấp cách thủy 30–35 phút ở lửa vừa, đ surface nắp khuôn bằng giấy nhôm.",
      "Kiểm tra bằng tăm: xiên vào bánh, tăm rút ra sạch là chín.",
      "Để nguội rồi cho vào tủ lạnh ít nhất 2 giờ trước khi ăn.",
    ],
    tips: "Hấp cách thủy với lửa vừa và yên tĩnh — lửa quá to sẽ làm bánh rỗ.",
  },
  {
    slug: "com-chien-duong-chau",
    title: "Cơm chiên dương châu",
    author: "Tuấn Nấu",
    authorBio: "Đầu bếp tại gia, ghi lại mọi món nấu nhanh cho bữa tối bận rộn.",
    authorRecipes: 15,
    time: "20 phút",
    servings: "2 người",
    intro:
      "Cơm chiên tách hạt với tôm, chả lụa và rau củ — bữa tối nhanh gọn vẫn đủ chất.",
    ingredients: [
      { name: "Cơm nguội", amount: "2 bát" },
      { name: "Tôm tươi bóc vỏ", amount: "150 g" },
      { name: "Chả lụa", amount: "100 g" },
      { name: "Trứng gà", amount: "2 quả" },
      { name: "Cà rốt, đậu hà lan", amount: "100 g" },
      { name: "Hành lá, hành tím băm", amount: "vừa đủ" },
      { name: "Nước mắm, tiêu, dầu hào", amount: "vừa ăn" },
    ],
    steps: [
      "Chuẩn bị cơm nguội tách hạt, ướp tôm với chút tiêu.",
      "Phi hành tím, xào tôm đến khi săn rồi múc ra.",
      "Đánh trứng, chiên trong chảo rồi cắt nhỏ.",
      "Xào cà rốt và đậu hà lan 2 phút, cho chả lụa vào.",
      "Cho cơm vào, đảo lửa lớn cho tách hạt.",
      "Trở lại tôm và trứng, nêm nước mắm, dầu hào, tiêu.",
      "Rắc hành lá, tắt bếp và múc ra dùng nóng.",
    ],
    tips: "Cơm nguội qua đêm chiên sẽ tách hạt đẹp hơn cơm mới nấu.",
  },
  {
    slug: "bun-bo-hue",
    title: "Bún bò Huế",
    author: "Cô Ba",
    authorBio: "Người Huế gốc, giữ gìn hương vị cố đô trong từng nồi bò.",
    authorRecipes: 21,
    time: "3 giờ",
    servings: "6 người",
    intro:
      "Nước lèo đậm đà từ xương và mắm ruốc, thơm sả ớt — chuẩn vị Huế từ bỏ me.",
    ingredients: [
      { name: "Xương bò", amount: "1,5 kg" },
      { name: "Bắp bò", amount: "500 g" },
      { name: "Chả Huế", amount: "300 g" },
      { name: "Sả băm", amount: "5 cây" },
      { name: "Mắm ruốc Huế", amount: "2 muối canh" },
      { name: "Ớt bột Huế", amount: "2 muối canh" },
      { name: "Bún Huế", amount: "2 kg" },
      { name: "Rau sống: rau muống, xà lách, ngò gai, tía tô", amount: "đĩa lớn" },
      { name: "Chanh, hành tím", amount: "vừa đủ" },
    ],
    steps: [
      "Chần xương bò qua nước sôi, rửa sạch rồi ninh 2 giờ với nước lọc.",
      "Bắp bò luộc trong nồi nước lèo đến khi mềm, thái lát mỏng.",
      "Phi sả băm với ớt bột Huế trong dầu nóng, cho vào nồi nước lèo.",
      "Hòa mắm ruốc với chút nước, lọc bỏ cặn rồi nêm vào nước lèo.",
      "Ninh thêm 30 phút, vớt bọt thường xuyên để nước trong.",
      "Trụng bún qua nước sôi, xếp vào tô.",
      "Chan nước lèo, xếp bắp bò, chả Huế, thêm hành tím phi thơm.",
      "Dùng kèm rau sống, chanh và tương ớt.",
    ],
    tips: "Mắm ruốc là linh hồn của bún bò Huế — đừng thay bằng mắm khác.",
  },
];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}
