// ⚙️ Cấu hình — chỉnh sửa file này theo ý bạn
const CONFIG = {
  // Mã bảo mật 8 số (đổi thành mã riêng của bạn)
  securityCode: '10030307',

  // Video chúc mừng — đặt file MP4 trong assets/video/
  // Hoặc dùng YouTube: type: 'youtube', youtubeId: 'MÃ_VIDEO_YOUTUBE'
  video: {
    type: 'local',
    localSrc: 'assets/video/video.mp4',
    youtubeId: '',
  },

  // Danh sách lời chúc hiện sau khi video kết thúc
  wishes: [
    'Chúc mừng Giang Thối đã tốt nghiệp Bằng Giỏi! 🎓',
    'Nhớ Giang quá đi à ~~ ✨',
    'Anh yêu Giangggggg',
    'Tự hào về những gì Giang đã đạt được! 💪',
    'Tương lai về nhà anh! 🌈',
    'Anh tặng anh cho Giang thối há há 🎉',
  ],
};
