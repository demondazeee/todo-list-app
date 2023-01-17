using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Entities;

public class Users
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    [MinLength(4)]
    [MaxLength(12)]
    public String Username { get; set; }

    [Required]
    public String Password { get; set; }

    public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();

    public Users(
        string username,
        string password
    )
    {
        Username = username;
        Password = password;
    }
}