using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=Database/appdb.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")  // Vite's default dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseCors("AllowFrontend");  // Apply CORS before controllers

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
