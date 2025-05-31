# School Management System

Hệ thống quản lý trường học được xây dựng với ASP.NET Core 8.0 Web API và Angular 17.

## 📋 Mô tả dự án

Đây là một hệ thống quản lý trường học toàn diện bao gồm:
- Quản lý học sinh, giáo viên và nhân viên
- Quản lý lớp học và khóa học
- Hệ thống điểm danh
- Quản lý điểm số và báo cáo
- Hệ thống xác thực và phân quyền với JWT
- Giao diện người dùng hiện đại với Angular Material và Syncfusion

## 🏗️ Kiến trúc hệ thống

### Backend (.NET 8.0)
- **SchoolApiService**: ASP.NET Core Web API
- **SchoolApp.DAL**: Data Access Layer với Entity Framework Core
- **SchoolApp.Models**: Domain Models và Entity classes

### Frontend (Angular 17)
- **SchoolAppClient.NG**: Angular application với Material Design

### Database
- SQL Server LocalDB
- Entity Framework Core với Code First approach

## 🛠️ Yêu cầu hệ thống

### Phần mềm cần thiết:
1. **Visual Studio 2022** (Community Edition trở lên) hoặc **Visual Studio Code**
2. **.NET 8.0 SDK** - [Tải về](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **Node.js** (phiên bản 18.x trở lên) - [Tải về](https://nodejs.org/)
4. **Angular CLI** phiên bản 17
5. **SQL Server LocalDB** (thường đi kèm với Visual Studio)
6. **Git** - [Tải về](https://git-scm.com/)

### Kiểm tra phiên bản:
```bash
# Kiểm tra .NET SDK
dotnet --version

# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Angular CLI
ng version
```

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone dự án
```bash
git clone https://github.com/blanatole/School-Management-Application.git
cd SchoolManagementSystem
```

### Bước 2: Cài đặt Backend

#### 2.1. Restore các package NuGet
```bash
# Tại thư mục gốc của solution
dotnet restore
```

#### 2.2. Cài đặt Entity Framework CLI (nếu chưa có)
```bash
dotnet tool install --global dotnet-ef
```

#### 2.3. Cập nhật database
```bash
# Di chuyển đến thư mục SchoolApiService
cd SchoolApiService

# Tạo/cập nhật database
dotnet ef database update --project ../SchoolApp.DAL
```

### Bước 3: Cài đặt Frontend

#### 3.1. Di chuyển đến thư mục Angular
```bash
cd SchoolAppClient.NG
```

#### 3.2. Cài đặt Angular CLI (nếu chưa có)
```bash
npm install -g @angular/cli@17
```

#### 3.3. Cài đặt các dependencies
```bash
npm install
```

## 🏃‍♂️ Cách chạy ứng dụng

### Phương pháp 1: Chạy từ Visual Studio

#### Backend:
1. Mở file `SchoolManagementSystem.sln` trong Visual Studio
2. Set `SchoolApiService` làm startup project
3. Nhấn `F5` hoặc click `Start Debugging`
4. API sẽ chạy tại: `https://localhost:7125` hoặc `http://localhost:5125`

#### Frontend:
1. Mở Terminal trong Visual Studio hoặc Command Prompt
2. Di chuyển đến thư mục `SchoolAppClient.NG`
3. Chạy lệnh:
```bash
npm start
```
4. Angular app sẽ chạy tại: `http://127.0.0.1:4200`

### Phương pháp 2: Chạy từ Command Line

#### Backend:
```bash
# Tại thư mục SchoolApiService
cd SchoolApiService
dotnet run
```

#### Frontend:
```bash
# Tại thư mục SchoolAppClient.NG
cd SchoolAppClient.NG
npm start
```

### Phương pháp 3: Chạy toàn bộ solution

#### Với Visual Studio:
1. Right-click vào Solution trong Solution Explorer
2. Chọn "Properties"
3. Chọn "Multiple startup projects"
4. Set cả `SchoolApiService` và `SchoolAppClient.NG` thành "Start"
5. Nhấn `F5`

## 🗄️ Cấu hình Database

### Connection Strings có sẵn trong appsettings.json:

1. **LocalDbConnection**: Sử dụng SQL Server LocalDB (mặc định)
2. **SqlServerConnection**: Sử dụng SQL Server Express
3. **PortableLocalDb**: Sử dụng file database di động

### Thay đổi connection string:
1. Mở file `SchoolApiService/appsettings.json`
2. Sửa đổi connection string phù hợp với môi trường của bạn
3. Cập nhật lại database:
```bash
dotnet ef database update --project ../SchoolApp.DAL
```

## 🔐 Xác thực và phân quyền

Hệ thống sử dụng JWT Token cho authentication:
- **JWT Issuer**: IDB
- **JWT Audience**: DITC
- Token có thời hạn và cần refresh khi hết hạn

## 📝 API Documentation

Khi chạy backend, bạn có thể truy cập Swagger UI tại:
- `https://localhost:7125/swagger` (HTTPS)
- `http://localhost:5125/swagger` (HTTP)

## 🎨 Frontend Features

- **Angular Material Design**: Giao diện hiện đại và responsive
- **Syncfusion Components**: Datagrid, charts, và các component nâng cao
- **FontAwesome Icons**: Bộ icon phong phú
- **Bootstrap 5**: Framework CSS responsive

## 📁 Cấu trúc thư mục

```
SchoolManagementSystem/
├── SchoolApiService/              # ASP.NET Core Web API
│   ├── Controllers/               # API Controllers
│   ├── Services/                  # Business Logic Services
│   ├── ViewModels/               # DTOs và ViewModels
│   ├── Reports/                  # Report templates
│   └── wwwroot/                  # Static files
├── SchoolApp.DAL/                # Data Access Layer
│   ├── SchoolContext/            # DbContext và configurations
│   ├── Migrations/               # EF Core migrations
│   └── SecurityModels/           # Identity models
├── SchoolApp.Models/             # Domain Models
├── SchoolAppClient.NG/           # Angular Frontend
│   ├── src/
│   │   ├── app/                  # Angular components
│   │   ├── assets/               # Static assets
│   │   └── environments/         # Environment configs
│   └── package.json              # Node.js dependencies
└── README.md                     # File hướng dẫn này
```

## 🐛 Xử lý sự cố thường gặp

### 1. Lỗi Database Connection
```bash
# Kiểm tra SQL Server LocalDB service
sqllocaldb info

# Start LocalDB nếu cần
sqllocaldb start MSSQLLocalDB
```

### 2. Lỗi khi restore NuGet packages
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore lại
dotnet restore
```

### 3. Lỗi Angular dependencies
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install
```

### 4. Lỗi CORS khi gọi API từ Frontend
- Kiểm tra cấu hình CORS trong `Program.cs`
- Đảm bảo frontend chạy đúng port được cấu hình

### 5. Lỗi SSL Certificate
```bash
# Trust HTTPS development certificate
dotnet dev-certs https --trust
```

## 📊 Các tính năng chính

### Quản lý học sinh:
- Thêm, sửa, xóa thông tin học sinh
- Tìm kiếm và lọc học sinh
- Quản lý ảnh đại diện
- Báo cáo học sinh

### Quản lý giáo viên:
- Quản lý thông tin cá nhân giáo viên
- Phân công giảng dạy
- Lịch làm việc

### Quản lý lớp học:
- Tạo và quản lý lớp học
- Phân bổ học sinh vào lớp
- Thời khóa biểu

### Hệ thống báo cáo:
- Báo cáo điểm số
- Báo cáo điểm danh
- Export PDF với FastReport

## ⚠️ **Lưu ý về Syncfusion License**

Project này sử dụng **Syncfusion Essential Studio** cho các UI components nâng cao. Khi chạy ứng dụng, bạn có thể thấy thông báo:

> "This application was built using a trial version of Syncfusion Essential Studio..."

### **Cách xử lý:**

1. **Community License (Miễn phí):**
   - Đăng ký tại: https://www.syncfusion.com/products/communitylicense
   - Điều kiện: Doanh thu < $1M USD/năm, tối đa 5 developers
   - Sau khi có license key, thêm vào `src/main.ts`:
   ```typescript
   import { registerLicense } from '@syncfusion/ej2-base';
   registerLicense('YOUR-LICENSE-KEY-HERE');
   ```

2. **Thay thế bằng thư viện miễn phí:**
   - **AG Grid** thay cho Syncfusion Grid
   - **Chart.js** thay cho Syncfusion Charts  
   - **Angular Material** thay cho các UI components

3. **Mua license thương mại:**
   - Truy cập: https://www.syncfusion.com/sales/products

### **Components Syncfusion đang sử dụng:**
- DataGrid (Bảng dữ liệu)
- Charts (Biểu đồ) 
- PDF Viewer (Xem PDF)
- Input Components (Thành phần nhập liệu)
- Notifications (Thông báo)

## 🧹 Dọn dẹp project cho Production

Trước khi deploy hoặc push lên GitHub, hãy chạy script dọn dẹp để loại bỏ các file không cần thiết:

### Tự động (Khuyến nghị):
```powershell
# Đóng Visual Studio trước khi chạy
.\cleanup-before-push.ps1
```

### Thủ công:
```bash
# 1. Xóa thư mục build và cache
rm -rf SchoolAppClient.NG/node_modules
rm -rf SchoolAppClient.NG/dist
rm -rf bin
rm -rf obj

# 2. Xóa file database local (sẽ được ignore bởi .gitignore)
rm SchoolApp.DAL/Database/SchoolSystemDb.mdf
rm SchoolApp.DAL/Database/SchoolSystemDb_log.ldf

# 3. Xóa Visual Studio cache
rm -rf .vs
```

### Các file đã được ignore trong .gitignore:
- `*.mdf`, `*.ldf` (Database files)
- `bin/`, `obj/` (Build outputs)
- `node_modules/` (NPM packages)
- `.vs/` (Visual Studio cache)
- `*.log` (Log files)
- Environment-specific config files

## 🚀 Chuẩn bị cho Deployment

### Build Production:

#### Backend:
```bash
dotnet publish SchoolApiService -c Release -o ./publish
```

#### Frontend:
```bash
cd SchoolAppClient.NG
npm run build --prod
```

### Kích thước project tối ưu:
- Source code: ~50MB (sau khi dọn dẹp)
- Không bao gồm: `node_modules` (~400MB), `bin/obj` (~200MB), database files (~16MB)

## 🧪 Testing

### Backend Testing:
```bash
# Chạy unit tests
dotnet test

# Chạy với coverage report
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Testing:
```bash
cd SchoolAppClient.NG

# Unit tests
npm run test

# E2E tests  
npm run e2e

# Test coverage
npm run test:coverage
```

### Testing Database:
- Sử dụng In-Memory Database cho unit tests
- Separate test database cho integration tests
- Mock data được cung cấp trong `SchoolApp.Models/TestData/`

## 🔒 Security & Performance

### Security Features:
- **JWT Authentication** với refresh tokens
- **Role-based Authorization** (Admin, Teacher, Student)
- **Input Validation** với Data Annotations
- **SQL Injection Protection** thông qua Entity Framework
- **CORS Configuration** được cấu hình an toàn
- **HTTPS Enforcement** trong production

### Performance Optimizations:
- **Lazy Loading** cho Entity Framework relationships  
- **Pagination** cho tất cả danh sách dữ liệu
- **Caching** với Memory Cache cho frequent queries
- **Image Optimization** với WebP format
- **Bundle Optimization** cho Angular production builds
- **Database Indexing** trên các trường thường truy vấn

### Security Best Practices:
```bash
# Update dependencies thường xuyên
npm audit fix
dotnet list package --outdated

# Kiểm tra vulnerabilities
npm audit
dotnet list package --vulnerable
```

## 📈 Recent Updates & Changelog

### Version 2.0.0 (Latest)
#### ✨ New Features:
- **Modern UI Design** với Angular Material 17
- **Sticky Headers** cho tất cả data tables
- **Advanced Filtering** và search functionality
- **Responsive Design** optimization
- **Dark Mode Support** (experimental)

#### 🐛 Bug Fixes:
- Fixed button synchronization issues trong staff list
- Resolved TypeScript compilation errors
- Fixed API URL configuration problems
- Improved exam schedule UI consistency
- Enhanced fee management workflow

#### 🔧 Technical Improvements:
- Migrated to Angular 17 với standalone components
- Upgraded to .NET 8.0
- Removed Syncfusion dependencies where possible
- Improved error handling và user feedback
- Enhanced performance với lazy loading

### Previous Versions:
- **v1.5.0**: Added exam management system
- **v1.4.0**: Implemented fee management
- **v1.3.0**: Added staff salary management
- **v1.2.0**: Enhanced user management
- **v1.1.0**: Added department management
- **v1.0.0**: Initial release với basic CRUD operations

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp cho dự án! 

### Quy trình đóng góp:

1. **Fork** repository này
2. **Create** một feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** những thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Open** một Pull Request

### Coding Standards:

#### Backend (.NET):
- Sử dụng **PascalCase** cho public members
- Sử dụng **camelCase** cho private members
- Thêm **XML Documentation** cho public APIs
- Follow **SOLID principles**
- Sử dụng **async/await** cho I/O operations

#### Frontend (Angular):
- Sử dụng **Angular Style Guide**
- **Components**: PascalCase filenames, kebab-case selectors
- **Services**: PascalCase với suffix 'Service'
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Commit Message Convention:
```
type(scope): description

feat(auth): add JWT refresh token functionality
fix(ui): resolve button alignment in staff list
docs(readme): update installation instructions
style(css): improve responsive design for mobile
refactor(api): optimize database queries
test(unit): add tests for user service
```

### Issues & Bug Reports:
Khi báo cáo bugs, vui lòng bao gồm:
- **Mô tả** chi tiết về vấn đề
- **Steps to reproduce** 
- **Expected behavior**
- **Actual behavior**
- **Environment** info (OS, browser, .NET version)
- **Screenshots** nếu có

## ⚠️ Known Issues

### Current Limitations:
1. **Syncfusion License**: Cần license cho production deployment
2. **Mobile Responsiveness**: Một số trang chưa tối ưu hoàn toàn cho mobile
3. **Real-time Updates**: Chưa implement SignalR cho real-time notifications
4. **File Upload**: Size limit 5MB cho image uploads
5. **Report Generation**: PDF reports có thể chậm với dữ liệu lớn

### Workarounds:
- **Syncfusion**: Sử dụng community license hoặc thay thế bằng AG Grid
- **Mobile**: Sử dụng landscape mode cho tablets
- **Large Reports**: Filter data trước khi generate reports

## 🌍 Deployment

### Development Environment:
```bash
# Local development
dotnet run --project SchoolApiService --environment Development
cd SchoolAppClient.NG && npm start
```

### Production Deployment:

#### Docker (Recommended):
```dockerfile
# Dockerfile example cho backend
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SchoolApiService.dll"]
```

#### IIS Deployment:
1. Publish backend: `dotnet publish -c Release`
2. Build frontend: `npm run build --prod`
3. Copy files to IIS directory
4. Configure IIS với ASP.NET Core Hosting Bundle

#### Azure App Service:
1. Create App Service với .NET 8.0 stack
2. Configure connection strings trong Application Settings
3. Deploy using Visual Studio hoặc Azure DevOps

#### Database Migration trên Production:
```bash
# Update database schema
dotnet ef database update --project SchoolApp.DAL --configuration Production

# Seed initial data (nếu cần)
dotnet run --project SchoolApiService --environment Production -- --seed-data
```

## 📋 Environment Variables

### Development (.env):
```bash
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection="Server=(localdb)\\mssqllocaldb;Database=SchoolSystemDb;Trusted_Connection=true"
JWT__SecretKey="your-secret-key-here"
JWT__Issuer="IDB"
JWT__Audience="DITC"
```

### Production:
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="your-production-connection-string"
JWT__SecretKey="your-strong-production-secret"
CORS__AllowedOrigins="https://yourfrontend.domain.com"
```

## 📞 Support & Contact

### Documentation:
- **API Documentation**: Available tại `/swagger` khi chạy backend
- **Architecture Decision Records**: Trong `docs/adr/` folder
- **Database Schema**: Trong `docs/database/` folder

### Support Channels:
- **GitHub Issues**: Cho bug reports và feature requests
- **Discussions**: Cho questions và general discussions
- **Wiki**: Cho detailed documentation và tutorials

### Contributors:
- **Lead Developer**: [Your Name] - Backend Architecture & API Development
- **Frontend Developer**: [Your Name] - Angular UI/UX Implementation  
- **Database Designer**: [Your Name] - Database Schema & Optimization

## 📄 License

Dự án này được phân phối dưới **MIT License**. Xem file `LICENSE` để biết thêm chi tiết.

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


