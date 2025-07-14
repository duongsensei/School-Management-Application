using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("ExamScheduleStandard")]
    public class ExamScheduleStandard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ExamScheduleStandardId { get; set; }

        [Required(ErrorMessage = "ExamScheduleId không được để trống")]
        public int ExamScheduleId { get; set; }

        [Required(ErrorMessage = "StandardId không được để trống")]
        public int StandardId { get; set; }

        [ForeignKey("StandardId")]
        public virtual Standard? Standard { get; set; }

        [ForeignKey("ExamScheduleId")]
        public virtual ExamSchedule? ExamSchedule { get; set; }

        public virtual ICollection<ExamSubject> ExamSubjects { get; set; } = new List<ExamSubject>();
    }
}
