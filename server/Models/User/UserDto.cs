namespace WebAPI.Models;

public class UserDto
{
    public Guid Id { get; set; }    

    public String Username { get; set; } = string.Empty;

    public String AccessToken { get; set; } = string.Empty;
}