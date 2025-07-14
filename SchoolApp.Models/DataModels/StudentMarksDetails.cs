using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("StudentMarksDetails")]
    public class StudentMarksDetails
    {
        [Required]
        [ForeignKey("MarkEntry")]
        public int MarkEntryId { get; set; }

        [Required]
        [ForeignKey("Student")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "Tên học sinh là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên học sinh không được vượt quá 100 ký tự")]
        public string? StudentName { get; set; }

        [Required(ErrorMessage = "Điểm số là bắt buộc")]
        [Range(0, 100, ErrorMessage = "Điểm phải nằm trong khoảng từ 0 đến 100")]
        public int? ObtainedScore { get; set; }

        [Required(ErrorMessage = "Xếp loại là bắt buộc")]
        public GradesSystem? Grade { get; set; } = GradesSystem.A;

        [Required(ErrorMessage = "Tình trạng đậu/rớt là bắt buộc")]
        public PassFailStatus? PassStatus { get; set; } = PassFailStatus.Passed;

        [StringLength(500, ErrorMessage = "Nhận xét không được dài quá 500 ký tự")]
        public string? Feedback { get; set; }

        public virtual Student? Student { get; set; }

        public virtual MarkEntry? MarkEntry { get; set; }
    }

    public enum GradesSystem
    {
        A, B, C, D, E, F, NotApplicable
    }

    public enum PassFailStatus
    {
        Passed, Failed, UnderConsideration, SpecialConsideration, Withdrawn, UnderJurisdiction
    }
}
