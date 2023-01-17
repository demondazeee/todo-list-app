using Microsoft.EntityFrameworkCore;
using WebAPI.Entities;

namespace WebAPI.DBContext;

public class DB : DbContext
{
    public DbSet<Users> Users => Set<Users>();
    public DbSet<Tasks> Tasks => Set<Tasks>();
    
    public IConfiguration config { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(config["ConnectionStrings:DB"]);
        base.OnConfiguring(optionsBuilder);
    }

    public DB(
        IConfiguration config,
        DbContextOptions options
    ) : base(options)
    {
        this.config = config;
    }
}