using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("Attendance")]
    public class Attendance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Loại điểm danh không được để trống")]
        [EnumDataType(typeof(AttendanceType))]
        public AttendanceType Type { get; set; } = AttendanceType.Student;

        [Required(ErrorMessage = "Mã định danh không được để trống")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã định danh phải lớn hơn 0")]
        public int AttendanceIdentificationNumber { get; set; }

        [MaxLength(300, ErrorMessage = "Ghi chú không được vượt quá 300 ký tự")]
        public string? Description { get; set; }

        public bool IsPresent { get; set; } = true;
    }

    public enum AttendanceType
    {
        Student,
        Staff
    }
}
