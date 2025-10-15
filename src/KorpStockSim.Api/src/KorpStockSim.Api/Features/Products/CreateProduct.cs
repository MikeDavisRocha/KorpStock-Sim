using KorpStockSim.Api.Data;
using KorpStockSim.Api.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KorpStockSim.Api.Features.Products;

// Esta classe estática servirá como um "agrupador" para o nosso endpoint.
public static class CreateProductEndpoint
{
    public static IEndpointRouteBuilder MapCreateProductEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPost("/api/products", async (
            [FromBody] CreateProduct.Command command,
            [FromServices] ISender sender) =>
        {
            var result = await sender.Send(command);
            // Retorna a URL para o novo recurso criado, uma boa prática de APIs REST.
            return Results.Created($"/api/products/{result}", new { id = result });
        })
        .WithName("CreateProduct")
        .WithTags("Products");

        return builder;
    }
}


public static class CreateProduct
{
    // Command: Representa os dados necessários para criar um produto.
    // É um DTO (Data Transfer Object) que vem do corpo da requisição.
    public record Command(string Sku, string Name, string Description, int InitialStock) : IRequest<Guid>;

    // Handler: Contém a lógica de negócio real.
    // Ele recebe o Command, interage com o banco de dados e retorna o resultado.
    internal sealed class Handler : IRequestHandler<Command, Guid>
    {
        private readonly AppDbContext _dbContext;

        public Handler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> Handle(Command request, CancellationToken cancellationToken)
        {
            // 1. Usamos o método de fábrica na nossa entidade para criar um produto válido.
            var product = Product.Create(
                request.Sku,
                request.Name,
                request.Description,
                request.InitialStock);

            // 2. Adicionamos o novo produto ao DbContext.
            await _dbContext.Products.AddAsync(product, cancellationToken);

            // 3. Salvamos as mudanças no banco de dados.
            await _dbContext.SaveChangesAsync(cancellationToken);

            // 4. Retornamos o ID do produto recém-criado.
            return product.Id;
        }
    }
}