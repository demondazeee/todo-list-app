using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class LoginDto
{
    [Required]
    [MinLength(4)]
    [MaxLength(12)]
    public String Username { get; set; } = string.Empty;

    [Required]
    [MinLength(4)]
    [MaxLength(12)]
    public String Password { get; set; } = string.Empty;
}