using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebAPI.DBContext;
using WebAPI.Entities;

namespace WebAPI.Services;

public class UsersRepository : RepositoryBase<Users>, IUsersRepository
{
    private IConfiguration config;
    private IHttpContextAccessor httpContext;
    public UsersRepository(
        DB context,
        IConfiguration config,
        IHttpContextAccessor httpContext
    ) : base(context)
    {
        this.config = config;
        this.httpContext = httpContext;
    }

    public string GenerateToken(Guid userId, bool isRefreshToken)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(config["Authentication:SecretForKey"]!)
        );

        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.Name, userId.ToString()));

        var tokenToWrite = new JwtSecurityToken(
            config["Authentication:Issuer"],
            config["Authentication:Audience"],
            claims,
            DateTime.UtcNow,
            isRefreshToken ?  DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddMinutes(15),
            signingCredentials
        );

        var jwtToken = new JwtSecurityTokenHandler().WriteToken(tokenToWrite);
        
        return jwtToken;
    }

    public string? GetAuthUser()
    {
        var userId = string.Empty;
        if(this.httpContext.HttpContext != null){
            userId = this.httpContext.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }

        return userId;
    }
}