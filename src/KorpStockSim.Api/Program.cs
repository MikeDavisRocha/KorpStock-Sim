using KorpStockSim.Api.Data;
using Microsoft.EntityFrameworkCore;
using KorpStockSim.Api.Features.Products;

var builder = WebApplication.CreateBuilder(args);

// 1. Pega a string de conexão do appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Registra o AppDbContext no sistema de injeção de dependências
//    e configura para usar o SQLite.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// 3. Registra os serviços do MediatR
//    O AddMediatR vai escanear nosso projeto em busca de Commands, Queries e Handlers.
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapCreateProductEndpoint();
app.MapGetProductByIdEndpoint();
app.MapListAllProductsEndpoint();
app.MapUpdateProductEndpoint();
app.MapDeleteProductEndpoint();

app.UseAuthorization();
app.MapControllers();
app.Run();