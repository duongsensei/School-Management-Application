using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolApp.Models.DataModels.StaticModel;




namespace SchoolApp.Models.DataModels
{
    [Table("Student")]
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StudentId { get; set; }

        //[Required(ErrorMessage = "Enrollment number is required")]
        public int? AdmissionNo { get; set; }

        //[Required(ErrorMessage = "Enrollment number is required")]
        public int? EnrollmentNo { get; set; }

        //[Required(ErrorMessage = "Unique Student Attendance Number is required")]
        //[Index(IsUnique = true)]
        [Required(ErrorMessage = "Mã điểm danh là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã điểm danh phải là số dương")]
        public int UniqueStudentAttendanceNumber { get; set; }

        [Required(ErrorMessage = "Tên học sinh là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên không được vượt quá 100 ký tự")]
        public string? StudentName { get; set; }

        public string? ImagePath { get; set; }

        [NotMapped]
        public ImageUpload? ImageUpload { get; set; }

        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        [DataType(DataType.Date)]
        public DateTime StudentDOB { get; set; }

        [Required(ErrorMessage = "Giới tính là bắt buộc")]
        public GenderList? StudentGender { get; set; }

        [StringLength(50)]
        public string? StudentReligion { get; set; }

        [StringLength(10)]
        public string? StudentBloodGroup { get; set; }

        [StringLength(50)]
        public string? StudentNationality { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "CMND chỉ được chứa chữ số")]
        [StringLength(17, MinimumLength = 17, ErrorMessage = "CMND phải đủ 17 chữ số")]
        public string? StudentNIDNumber { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? StudentContactNumber1 { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? StudentContactNumber2 { get; set; }

        [EmailAddress(ErrorMessage = "Địa chỉ email không hợp lệ")]
        public string? StudentEmail { get; set; }

        [StringLength(200)]
        public string? PermanentAddress { get; set; }

        [StringLength(200)]
        public string? TemporaryAddress { get; set; }

        [StringLength(100)]
        public string? FatherName { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "CMND của cha chỉ được chứa số")]
        [StringLength(17, MinimumLength = 17, ErrorMessage = "CMND của cha phải đủ 17 chữ số")]
        public string? FatherNID { get; set; }

        [Phone]
        public string? FatherContactNumber { get; set; }

        [StringLength(100)]
        public string? MotherName { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "CMND của mẹ chỉ được chứa số")]
        [StringLength(17, MinimumLength = 17, ErrorMessage = "CMND của mẹ phải đủ 17 chữ số")]
        public string? MotherNID { get; set; }

        [Phone]
        public string? MotherContactNumber { get; set; }

        [StringLength(100)]
        public string? LocalGuardianName { get; set; }

        [Phone]
        public string? LocalGuardianContactNumber { get; set; }

        //[Required(ErrorMessage = "Standard is required")]
        public int? StandardId { get; set; }

        [ForeignKey("StandardId")]
        public Standard? Standard { get; set; }

        //// Constructor to initialize UniqueAttendanceId
        //public Student()
        //{
        //    UniqueStudentAttendanceId = "STD-" + GenerateFixedNumbers(); // Generate fixed numbers
        //}

        //private string GenerateFixedNumbers()
        //{
        //    // You can generate a random or sequential number here
        //    // For simplicity, let's generate a sequential number for demonstration
        //    return "STD-" + (1000 + StudentId).ToString(); // Example: STD-1001, STD-1002, etc.
        //}
    }
    public enum GenderList
    {
        Male,
        Female,
        Other
    }
}
