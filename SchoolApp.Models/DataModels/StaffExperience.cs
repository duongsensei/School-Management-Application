using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolApiService.Helpers;

namespace SchoolApp.Models.DataModels
{
    [Table("StaffExperience")]
    public class StaffExperience
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StaffExperienceId { get; set; }

        [Required]
        public int StaffId { get; set; }

        [ForeignKey("StaffId")]
        public Staff? Staff { get; set; }

        [Required]
        [MaxLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Designation { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime JoiningDate { get; set; } = DateTime.Now;

        [DataType(DataType.Date)]
        public DateTime? LeavingDate { get; set; }

        [MaxLength(500)]
        public string? Responsibilities { get; set; }

        [MaxLength(300)]
        public string? Achievements { get; set; }

        [NotMapped]
        public TimeSpan ServiceDuration => LeavingDate.HasValue
            ? LeavingDate.Value - JoiningDate
            : DateTime.Now - JoiningDate;

        [NotMapped]
        public string ServiceDurationText => ServiceDuration.ToReadableString(); // Custom extension method
    }
}
