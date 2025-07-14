using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    // Class table, renamed for avoiding built-in keyword clash
    [Table("Standard")]
    public class Standard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StandardId { get; set; }

        [Required(ErrorMessage = "Tên lớp là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên lớp không được vượt quá 100 ký tự")]
        public string StandardName { get; set; } = string.Empty;

        [StringLength(10, ErrorMessage = "Sức chứa tối đa 10 ký tự")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Sức chứa chỉ được chứa chữ số")]
        public string? StandardCapacity { get; set; }

        // Quan hệ với các bảng khác
        public virtual ICollection<Subject>? Subjects { get; set; }
        public virtual ICollection<ExamScheduleStandard>? ExamScheduleStandards { get; set; }
        public virtual ICollection<Student>? Students { get; set; } = [];

        //[NotMapped]
        //public int? StudentCount { get; set; } //=> this.Students?.Count;
        //[NotMapped]
        //public int? SubjectCount { get; set; }

    }
}
