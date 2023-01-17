using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebAPI.DBContext;
using WebAPI.Services;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(
    opt => {
        opt.ReturnHttpNotAcceptable = true;
    }
)
.AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DB>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ITaskRepository, TasksRepository>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddCors(opt => {
    opt.AddPolicy("SomePolicy", policy=> {
        policy.WithOrigins(builder.Configuration["ClientURL"]!)
        .AllowAnyHeader()
        .AllowCredentials()
        .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication().AddJwtBearer(
    opt => {
        opt.TokenValidationParameters = new () {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Authentication:Issuer"],
            ValidAudience = builder.Configuration["Authentication:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(builder.Configuration["Authentication:SecretForKey"]!)
            )
        };
    }
);

builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SomePolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
