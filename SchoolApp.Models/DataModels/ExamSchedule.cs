using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("ExamSchedule")]
    public class ExamSchedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ExamScheduleId { get; set; }

        [Required(ErrorMessage = "Tên lịch thi không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên lịch thi không được vượt quá 100 ký tự")]
        public string ExamScheduleName { get; set; } = string.Empty;

        public virtual ICollection<ExamScheduleStandard> ExamScheduleStandards { get; set; } = new List<ExamScheduleStandard>();
    }
}
