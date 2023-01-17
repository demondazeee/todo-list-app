using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.Services;

[ApiController]
[Route("/auth")]
public class AuthController : ControllerBase
{
    private IConfiguration config { get; set; }
    private IMapper mapper { get; set; }

    public IUsersRepository userRepo { get; set; }
    public AuthController(
        IMapper mapper,
        IConfiguration config,
        IUsersRepository userRepo
    )
    {
        this.mapper = mapper;
        this.config = config;
        this.userRepo = userRepo;
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginUser(
        LoginDto loginDto
    ) {
        var user = await userRepo.GetValueByExpression(u => u.Username == loginDto.Username);

        if(user == null) {
            return Unauthorized(new {
                message = "Username not found"
            });
        }
        
        if (!Argon2.Verify(user.Password, loginDto.Password)) {
            return Unauthorized(new {
                message = "Password not matched"
            });
        }

        var mappedUser = mapper.Map<UserDto>(user);

        var accessToken = userRepo.GenerateToken(user.Id, false);
        var refreshToken = userRepo.GenerateToken(user.Id, true);
        
        Response.Cookies.Append("rt", refreshToken, new CookieOptions() {
            HttpOnly = true,
            MaxAge = TimeSpan.FromDays(7)
        });
        mappedUser.AccessToken = accessToken;
        return Ok(mappedUser);
    }
    
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(
        RegisterDto authDto
    ){
        var mappedUser = mapper.Map<Users>(authDto);

        var buffer = RandomNumberGenerator.GetBytes(128);
        var config = new Argon2Config() {
            Salt = buffer,
            Password = Encoding.ASCII.GetBytes(mappedUser.Password) 
        };
        mappedUser.Password = Argon2.Hash(config);

        await userRepo.Create(mappedUser);

        var result = mapper.Map<UserDto>(mappedUser);

        var accessToken = userRepo.GenerateToken(mappedUser.Id, false);
        var refreshToken = userRepo.GenerateToken(mappedUser.Id, true);
        
        Response.Cookies.Append("rt", refreshToken, new CookieOptions() {
            HttpOnly = true,
            MaxAge = TimeSpan.FromDays(7)
        });
        result.AccessToken = accessToken;
        return Ok(result);
    }

    [HttpGet("refresh")]
    public async Task<ActionResult> RefreshToken(){
        try {
            var oldToken = Request.Cookies["rt"];

            if(oldToken == null){
                    return Unauthorized(new {
                    Message = "No token found"
                });
            }

            var decoded = new JwtSecurityTokenHandler().ValidateToken(
                oldToken,
                new TokenValidationParameters(){
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Authentication:Issuer"],
                    ValidAudience = config["Authentication:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.ASCII.GetBytes(config["Authentication:SecretForKey"]!)
                )
                },
                out SecurityToken validatedToken
            );

            if (validatedToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return Unauthorized(new {
                Message = "Invalid Token"
            });
            }

            if(decoded.Identity == null ){
                return Unauthorized();
            }

            var userId = decoded.Identity.Name;

            if(userId == null){
                return Unauthorized();
            }
            var user = await userRepo.GetValueByExpression(u => u.Id == new Guid(userId));

            if(user == null) {
                return NotFound(new {
                Message = "User not found"
            });
            }
            
             var mappedUser = mapper.Map<UserDto>(user);

            var accessToken = userRepo.GenerateToken(user.Id, false);
            var refreshToken = userRepo.GenerateToken(user.Id, true);
            Response.Cookies.Append("rt", refreshToken, new () {
                MaxAge = TimeSpan.FromDays(7),
                HttpOnly = true
            });

            mappedUser.AccessToken = accessToken;

            return Ok(mappedUser);
        } catch(Exception e) {
            return Unauthorized(e.Message);
        }
    }

    [HttpPost("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Append("rt", "", new () {
            MaxAge = TimeSpan.Zero,
        });

        return Ok(new {
            message = "User Logged out"
        });
    }

}