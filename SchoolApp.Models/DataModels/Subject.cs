using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SchoolApp.Models.DataModels
{
    [Table("Subject")]
    public class Subject
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Tên môn học là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên môn học không được dài quá 100 ký tự")]
        public string? SubjectName { get; set; }

        [Required(ErrorMessage = "Mã môn học là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã môn học phải là số dương")]
        public int? SubjectCode { get; set; }

        public int? StandardId { get; set; }

        [ForeignKey("StandardId")]
        public virtual Standard? Standard { get; set; }

        public virtual ICollection<ExamSubject>? ExamSubjects { get; set; }
    }
}
