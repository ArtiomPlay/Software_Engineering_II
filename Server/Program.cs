var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")  // Vite's default dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend");  // Apply CORS before controllers

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
