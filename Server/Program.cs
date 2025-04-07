using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;
using SE_II.Server.Repositories;
using SE_II.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")  // Vite's default dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=Database/appdb.db"));

builder.Services.AddScoped<IAccountRepository,AccountRepository>();
builder.Services.AddScoped<IValidator<Account>,Validator<Account>>();

var app = builder.Build();

app.UseCors("AllowFrontend");  // Apply CORS before controllers

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
