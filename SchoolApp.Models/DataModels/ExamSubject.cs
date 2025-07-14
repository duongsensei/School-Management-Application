using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("ExamSubject")]
    public class ExamSubject
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ExamSubjectId { get; set; }

        [Required(ErrorMessage = "ExamScheduleStandardId không được để trống")]
        public int ExamScheduleStandardId { get; set; }

        [Required(ErrorMessage = "SubjectId không được để trống")]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "ExamTypeId không được để trống")]
        public int ExamTypeId { get; set; }

        [Required(ErrorMessage = "Ngày thi không được để trống")]
        [DataType(DataType.Date)]
        public DateTime ExamDate { get; set; }

        [Required(ErrorMessage = "Giờ bắt đầu không được để trống")]
        [DataType(DataType.Time)]
        public DateTime ExamStartTime { get; set; }

        [Required(ErrorMessage = "Giờ kết thúc không được để trống")]
        [DataType(DataType.Time)]
        public DateTime ExamEndTime { get; set; }

        [ForeignKey("SubjectId")]
        public virtual Subject? Subject { get; set; }

        [ForeignKey("ExamTypeId")]
        public virtual ExamType? ExamType { get; set; }

        [ForeignKey("ExamScheduleStandardId")]
        public virtual ExamScheduleStandard? ExamScheduleStandard { get; set; }
    }
}
