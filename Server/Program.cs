using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;
using SE_II.Server.Repositories;
using SE_II.Server.Services;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

Log.Logger=new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/log.txt",rollingInterval: RollingInterval.Hour,restrictedToMinimumLevel: LogEventLevel.Warning)
    .CreateLogger();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")  // Vite's default dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
        );
});

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<ISessionService,SessionService>();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=Database/appdb.db"));

builder.Services.AddScoped<IAccountRepository,AccountRepository>();
builder.Services.AddScoped<IValidator<Account>,Validator<Account>>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowFrontend");  // Apply CORS before controllers
app.MapControllers();
app.Run();

public partial class Program{}