using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class RegisterDto
{
    [Required]
    [MinLength(4)]
    [MaxLength(12)]
    public String Username { get; set; } = string.Empty;

    [Required]
    public String Password { get; set; } = string.Empty;
}