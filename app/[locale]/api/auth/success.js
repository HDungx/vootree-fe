// pages/auth/success.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Gọi API để lấy token
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/success', {
          method: 'GET',
          credentials: 'include', // Thêm nếu cần gửi cookie hoặc thông tin xác thực
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        // Kiểm tra xem dữ liệu trả về có chứa token không
        if (data.token) {
          // Lưu token vào localStorage
          localStorage.setItem('token', data.token);

          // Chuyển hướng đến trang chính
          router.push('/home');
        } else {
          // Xử lý nếu không có token
          router.push('/error');
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
        router.push('/error');
      }
    };

    fetchToken();
  }, [router]);

  return (
    <div>
      {/* Có thể hiện thông báo hoặc trạng thái tại đây */}
      Đang xử lý đăng nhập...
    </div>
  );
};

export default AuthSuccess;
