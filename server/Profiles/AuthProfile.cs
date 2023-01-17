using AutoMapper;
using WebAPI.Entities;
using WebAPI.Models;

public class AuthProfile : Profile
{
    public AuthProfile()
    {
        CreateMap<RegisterDto, Users>();
        CreateMap<Users, UserDto>();
    }
}