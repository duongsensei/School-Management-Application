# 🏫 School Management Application

Hệ thống quản lý trường học hiện đại với giao diện chuyên nghiệp và tính năng đầy đủ.

## ✨ Tính năng mới nhất (Updated 2024)

### 🔐 Authentication & Authorization
- **Đăng ký người dùng nâng cao** với validation mạnh mẽ
- **Đăng nhập bảo mật** với remember me và error handling
- **Xác thực JWT** với refresh token
- **Phân quyền theo vai trò**: Admin, Manager, Teacher, Student, Operator
- **Profile người dùng** với quản lý thông tin cá nhân

### 🎨 Modern UI/UX Design
- **Gradient backgrounds** và animations mượt mà
- **Responsive design** tối ưu cho mọi thiết bị
- **Dark mode support** (planning)
- **Real-time validation** với visual feedback
- **Password strength indicator** với color coding
- **Professional card layouts** và hover effects

### 📊 Professional Dashboard
- **Real-time statistics** hiển thị số liệu quan trọng
- **Quick actions** cho các tác vụ thường dùng
- **Recent activities** và notifications
- **Charts và graphs** (planning)
- **User profile integration**

### 🔧 Technical Improvements
- **Enhanced form validation** với regex patterns
- **Improved error handling** với Vietnamese messages
- **Better routing** với guards và redirects
- **Optimized bundle size** với lazy loading
- **FontAwesome icons** và Google Fonts
- **TypeScript improvements** với interfaces

## 🛠️ Công nghệ sử dụng

### Backend
- **ASP.NET Core 8.0** - Web API Framework
- **Entity Framework Core** - ORM
- **SQL Server LocalDB** - Database
- **JWT Authentication** - Security
- **AutoMapper** - Object mapping
- **Swagger/OpenAPI** - API Documentation

### Frontend
- **Angular 17** - Frontend Framework
- **TypeScript** - Programming Language
- **Bootstrap 5** - CSS Framework
- **FontAwesome 6** - Icons
- **Angular Material** - UI Components
- **RxJS** - Reactive Programming

### Development Tools
- **Visual Studio 2022** - IDE
- **VS Code** - Code Editor
- **Git** - Version Control
- **npm** - Package Manager
- **Angular CLI** - Development Tools

## 🚀 Hướng dẫn cài đặt

### Prerequisites
- **.NET 8.0 SDK**
- **Node.js 18+**
- **SQL Server LocalDB**
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/School-Management-Application.git
cd School-Management-Application
```

### 2. Setup Backend
```bash
# Restore NuGet packages
dotnet restore

# Update database
dotnet ef database update --project SchoolApiService

# Run backend server
dotnet run --project SchoolApiService
```
Backend sẽ chạy tại: `http://localhost:5257`

### 3. Setup Frontend
```bash
# Navigate to Angular project
cd SchoolAppClient.NG

# Install npm packages
npm install

# Run development server
ng serve
```
Frontend sẽ chạy tại: `http://localhost:4200`

## 📱 Screenshots

### Login Page
![Login](./docs/images/login.png)
*Modern login form với gradient background và validation*

### Registration Page
![Registration](./docs/images/register.png)
*Registration form với password strength indicator*

### Dashboard
![Dashboard](./docs/images/dashboard.png)
*Professional dashboard với real-time stats*

### Profile Page
![Profile](./docs/images/profile.png)
*User profile với security settings*

## 🎯 Tính năng chính

### Quản lý học sinh
- Đăng ký học sinh mới
- Cập nhật thông tin học sinh
- Theo dõi tiến độ học tập
- Quản lý điểm số

### Quản lý giáo viên
- Thêm giáo viên mới
- Phân công môn học
- Quản lý lương
- Đánh giá hiệu suất

### Quản lý điểm số
- Nhập điểm theo môn học
- Báo cáo thành tích
- Thống kê điểm trung bình
- Export kết quả

### Quản lý học phí
- Thu học phí hàng tháng
- Quản lý các khoản phí khác
- Báo cáo tài chính
- In hóa đơn

### Quản lý chuyên cần
- Điểm danh hàng ngày
- Theo dõi tỷ lệ vắng mặt
- Báo cáo chuyên cần
- Thông báo phụ huynh

## 🔐 Phân quyền người dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Admin** | Quản lý toàn bộ hệ thống, tạo tài khoản, phân quyền |
| **Manager** | Quản lý giáo viên, học sinh, báo cáo tổng hợp |
| **Teacher** | Quản lý lớp học, nhập điểm, điểm danh |
| **Student** | Xem điểm số, lịch học, thông báo |
| **Operator** | Hỗ trợ kỹ thuật, backup dữ liệu |

## 🧪 Testing

### Backend Testing
```bash
dotnet test
```

### Frontend Testing
```bash
cd SchoolAppClient.NG
ng test
ng e2e
```

## 📝 API Documentation

API documentation có sẵn tại: `http://localhost:5257/swagger`

### Main Endpoints
- `POST /api/users/register` - Đăng ký người dùng
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/profile` - Lấy thông tin profile
- `GET /api/dashboard/stats` - Thống kê dashboard

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]
- **Project Manager**: [Your Name]

## 📞 Liên hệ

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🎉 Changelog

### Version 2.0.0 (Current)
- ✅ Enhanced authentication system
- ✅ Modern UI redesign
- ✅ Professional dashboard
- ✅ User profile management
- ✅ Improved security
- ✅ Better validation
- ✅ Responsive design

### Version 1.0.0
- ✅ Basic CRUD operations
- ✅ Student management
- ✅ Teacher management
- ✅ Grade management
- ✅ Fee management
- ✅ Attendance tracking

## 🔮 Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Mobile app (Flutter)
- [ ] Advanced reporting
- [ ] AI-powered analytics
- [ ] Multi-language support
- [ ] Parent portal
- [ ] Online learning integration

---

⭐ **Don't forget to star this repository if you found it helpful!**

```
MIT License

Copyright (c) 2024 School Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🎯 Roadmap

### Upcoming Features:
- [ ] **Real-time notifications** với SignalR
- [ ] **Mobile app** với .NET MAUI
- [ ] **Advanced reporting** với Power BI integration
- [ ] **Multi-tenant support** cho nhiều trường học
- [ ] **Offline mode** cho mobile app
- [ ] **AI-powered analytics** cho student performance
- [ ] **Integration APIs** với third-party systems

### Technical Debt:
- [ ] **Complete Syncfusion removal** và migration to open-source alternatives
- [ ] **Microservices architecture** refactoring
- [ ] **GraphQL API** implementation
- [ ] **Redis caching** implementation
- [ ] **Event sourcing** cho audit trails

---

## 🙏 Acknowledgments

- **Microsoft**: Cho .NET 8.0 và Entity Framework Core
- **Angular Team**: Cho Angular 17 framework
- **Syncfusion**: Cho UI components (trial version)
- **Material Design**: Cho design system
- **Community**: Cho feedback và contributions

---

<div align="center">
  <p><strong>⭐ Nếu project này hữu ích, hãy cho chúng tôi một star! ⭐</strong></p>
  <p>Built with ❤️ by School Management System Team</p>
</div>


