using NoteFlow.API.Services;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "NoteFlowClient";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins("http://localhost:4200", "https://noteflow-nine-mu.vercel.app", "https://noteflow-4xt7hri92-sahil-khanvilkars-project.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddSingleton<NoteStore>();

var app = builder.Build();

app.UseCors(CorsPolicy);
app.MapControllers();

app.Run();
