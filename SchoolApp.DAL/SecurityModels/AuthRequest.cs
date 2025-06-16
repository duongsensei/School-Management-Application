using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels.SecurityModels
{
    public class AuthRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string? Email { get; set; }
        
        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(4, ErrorMessage = "Mật khẩu phải có ít nhất 4 ký tự")]
        public string? Password { get; set; }
    }
}
