using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SchoolApp.Models.DataModels
{
    [Table("MarkEntry")]
    public class MarkEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MarkEntryId { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MarkEntryDate { get; set; } = DateTime.Now;

        [Required]
        public int StaffId { get; set; }

        [ForeignKey("StaffId")]
        public Staff? Staff { get; set; }

        [Required]
        public int ExamScheduleId { get; set; }

        [ForeignKey("ExamScheduleId")]
        public ExamSchedule? ExamSchedule { get; set; }

        [Required]
        public int ExamTypeId { get; set; }

        [ForeignKey("ExamTypeId")]
        public ExamType? ExamType { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }

        [Required]
        public int StandardId { get; set; }

        [ForeignKey("StandardId")]
        public Standard? Standard { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Tổng điểm phải >= 0")]
        public int? TotalMarks { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Điểm qua phải >= 0")]
        public int? PassMarks { get; set; }

        public virtual ICollection<StudentMarksDetails> StudentMarksDetails { get; set; } = new List<StudentMarksDetails>();
    }



}
