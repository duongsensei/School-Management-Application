using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{

    [Table("Mark")]
    public class Mark
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MarkId { get; set; }

        [Required(ErrorMessage = "Tổng điểm không được để trống")]
        [Range(0, int.MaxValue, ErrorMessage = "Tổng điểm phải >= 0")]
        public int TotalMarks { get; set; }

        [Required(ErrorMessage = "Điểm đạt không được để trống")]
        [Range(0, int.MaxValue, ErrorMessage = "Điểm đạt phải >= 0")]
        public int PassMarks { get; set; }

        [Required(ErrorMessage = "Điểm số học sinh không được để trống")]
        [Range(0, int.MaxValue, ErrorMessage = "Điểm số phải >= 0")]
        public int ObtainedScore { get; set; }

        [Required]
        [EnumDataType(typeof(Grade))]
        public Grade Grade { get; set; }

        [Required]
        [EnumDataType(typeof(Pass))]
        public Pass PassStatus { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MarkEntryDate { get; set; } = DateTime.Now;

        [MaxLength(500)]
        public string? Feedback { get; set; }

        [Required]
        public int StaffId { get; set; }

        [ForeignKey("StaffId")]
        public Staff? Staff { get; set; }

        [Required]
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }

    public enum Grade
    {
        A,
        B,
        C,
        D,
        E,
        F
    }

    public enum Pass
    {
        Passed, Failed, UnderConsideration, SpecialConsideration, Withdrawn,
        UnderJurisdiction
    }
}
