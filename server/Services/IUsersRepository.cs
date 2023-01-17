using WebAPI.Entities;

namespace WebAPI.Services;

public interface IUsersRepository: IRepositoryBase<Users>
{
    string? GetAuthUser();
    string GenerateToken(Guid userId, bool isRefreshToken);
}