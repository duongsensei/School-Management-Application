using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolApiService.Services;
using SchoolApp.DAL.SchoolContext;
using SchoolApp.Models.DataModels.SecurityModels;
using System.Text.RegularExpressions;

namespace SchoolApiService.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SchoolDbContext _context;
        private readonly ITokenService _tokenService;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SchoolDbContext context,
            ITokenService tokenService, ILogger<UsersController> logger
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegistrationRequest request)
        {
            try
            {
                // Basic model validation
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { 
                        Success = false, 
                        Message = "Dữ liệu không hợp lệ", 
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });
                }

                // Additional business logic validation
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { Success = false, Message = "Email không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    return BadRequest(new { Success = false, Message = "Tên người dùng không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { Success = false, Message = "Mật khẩu không được để trống" });
                }

                // Check if email already exists
                var existingUserByEmail = await _userManager.FindByEmailAsync(request.Email);
                if (existingUserByEmail != null)
                {
                    return BadRequest(new { Success = false, Message = "Email đã được sử dụng" });
                }

                // Check if username already exists
                var existingUserByUsername = await _userManager.FindByNameAsync(request.Username);
                if (existingUserByUsername != null)
                {
                    return BadRequest(new { Success = false, Message = "Tên người dùng đã được sử dụng" });
                }

                // Validate password strength
                if (!IsPasswordStrong(request.Password))
                {
                    return BadRequest(new { 
                        Success = false, 
                        Message = "Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt, tối thiểu 8 ký tự" 
                    });
                }

                // Validate password confirmation
                if (request.Password != request.ConfirmPassword)
                {
                    return BadRequest(new { Success = false, Message = "Mật khẩu xác nhận không khớp" });
                }

                // Ensure default roles exist
                var defaultRoles = new[] { "Student", "Teacher", "Admin", "Manager", "Operator" };
                foreach (var role in defaultRoles)
                {
                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(role));
                    }
                }

                // Validate roles
                if (request.Role == null || !request.Role.Any())
                {
                    request.Role = new List<string> { "Student" }; // Default role
                }

                foreach (var role in request.Role)
                {
                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        return BadRequest(new { Success = false, Message = $"Vai trò '{role}' không hợp lệ" });
                    }
                }

                // Create user
                var user = new ApplicationUser 
                { 
                    UserName = request.Username, 
                    Email = request.Email, 
                    Role = request.Role,
                    EmailConfirmed = true // For demo purposes
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(user, request.Role);
                    
                    return Ok(new { 
                        Success = true, 
                        Message = "Đăng ký thành công",
                        Data = new { 
                            Email = request.Email, 
                            Username = request.Username, 
                            Roles = request.Role 
                        }
                    });
                }

                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { 
                    Success = false, 
                    Message = "Đăng ký thất bại", 
                    Errors = errors 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    Success = false, 
                    Message = "Có lỗi xảy ra trong quá trình đăng ký",
                    Error = ex.Message 
                });
            }
        }

        [HttpPost()]
        [Route("login")]
        public async Task<ActionResult<AuthResponse>> Authenticate([FromBody] AuthRequest request)
        {
            try
            {
                // Basic model validation
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { 
                        Success = false, 
                        Message = "Dữ liệu không hợp lệ", 
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });
                }

                // Additional validation
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { Success = false, Message = "Email không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { Success = false, Message = "Mật khẩu không được để trống" });
                }

                // Find user by email
                var managedUser = await _userManager.FindByEmailAsync(request.Email);
                if (managedUser == null)
                {
                    return BadRequest(new { Success = false, Message = "Email hoặc mật khẩu không đúng" });
                }

                // Check if user is locked out
                if (await _userManager.IsLockedOutAsync(managedUser))
                {
                    return BadRequest(new { Success = false, Message = "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
                }

                // Validate password
                var isPasswordValid = await _userManager.CheckPasswordAsync(managedUser, request.Password);
                if (!isPasswordValid)
                {
                    // Increment failed login attempts
                    await _userManager.AccessFailedAsync(managedUser);
                    return BadRequest(new { Success = false, Message = "Email hoặc mật khẩu không đúng" });
                }

                // Reset failed login attempts on successful login
                await _userManager.ResetAccessFailedCountAsync(managedUser);

                // Find user in database
                var userInDb = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (userInDb == null)
                {
                    return BadRequest(new { Success = false, Message = "Người dùng không tồn tại" });
                }

                // Generate token
                var accessToken = _tokenService.CreateToken(userInDb);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Success = true,
                    Message = "Đăng nhập thành công",
                    Data = new AuthResponse
                    {
                        Username = userInDb.UserName,
                        Email = userInDb.Email,
                        Token = accessToken,
                        Roles = userInDb.Role.ToArray()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    Success = false, 
                    Message = "Có lỗi xảy ra trong quá trình đăng nhập",
                    Error = ex.Message 
                });
            }
        }

        // Private helper method for password strength validation
        private bool IsPasswordStrong(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return false;

            // At least one uppercase letter
            if (!Regex.IsMatch(password, @"[A-Z]"))
                return false;

            // At least one lowercase letter
            if (!Regex.IsMatch(password, @"[a-z]"))
                return false;

            // At least one digit
            if (!Regex.IsMatch(password, @"\d"))
                return false;

            // At least one special character
            if (!Regex.IsMatch(password, @"[@$!%*?&]"))
                return false;

            return true;
        }

        [HttpGet]
        [Route("/GetUsers")]
        public async Task<IActionResult> UserIndex()
        {
            return Ok(await _userManager.Users.ToListAsync());
        }

        [HttpGet("GetUser/{id}")]
        public async Task<IActionResult> UserIndex(string id)
        {
            return Ok(await _userManager.FindByIdAsync(id));
        }

        [HttpGet]
        [Route("/GetRoles")]
        //[Authorize(Roles = "Admin, ")]
        [Authorize()]
        public async Task<IActionResult> RoleIndex()
        {
            return Ok(await _roleManager.Roles.ToListAsync());
        }

        [HttpPost("create-role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateRole([FromBody] UserRoleDto request)
        {
            IdentityRole role = new IdentityRole()
            {
                Name = request.Name,
            };

            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return Ok(request);
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return BadRequest(ModelState);
        }
        [HttpPut("edit-role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> EditRole([FromBody] UserRoleDto request)//1234 Admin
        {


            var role = await _roleManager.FindByIdAsync(request.Id);//1234 ADMINS

            if (role == null) return BadRequest();

            role.Name = request.Name;

            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {
                return Ok(request);
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return BadRequest(ModelState);
        }
        [HttpDelete("delete-role/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteRole(string id)//1234 Admin
        {


            IdentityRole? role = await _roleManager.FindByIdAsync(id);//1234 ADMIN

            if (role == null) return BadRequest();


            var users = await _userManager.GetUsersInRoleAsync(role.Name);


            if (users.Count > 0)
            {
                return BadRequest("User exists in this role");
            }


            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                return Ok();
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("AssignRole")]
        [Authorize(Roles = "Admin, Operator")]
        //[Route("AssignRole")]
        public async Task<IActionResult> AssignRole(AssignRoleDto model)//manager, admin
        {
            try
            {

                var user = await _userManager.FindByIdAsync(model.Id);
                if (user is null) return BadRequest($"User not found by id: {model.Id}");

                var userRoles = await _userManager.GetRolesAsync(user);//existing user roles=> user, manager

                List<string?> dbRoles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();


                foreach (var role in dbRoles)//admin, user, manager, guest, public  => all roles in db
                {

                    if (model.Role.Contains(role))
                    {
                        if (!userRoles.Contains(role))
                        {
                            await _userManager.AddToRoleAsync(user, role);//
                        }
                        else
                        {
                            //roles already in user
                        }
                    }
                    else
                    {
                        if (userRoles.Contains(role))
                        {
                            await _userManager.RemoveFromRoleAsync(user, role);
                        }
                    }

                }

                user.Role = model.Role;
                await _userManager.UpdateAsync(user);

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("logout")]
        public async Task<ActionResult> Logout()
        {
            return Ok();
        }
    }
}