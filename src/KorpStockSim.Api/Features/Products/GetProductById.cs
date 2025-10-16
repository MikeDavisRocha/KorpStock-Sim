using KorpStockSim.Api.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KorpStockSim.Api.Features.Products;

public static class GetProductByIdEndpoint
{
    public static IEndpointRouteBuilder MapGetProductByIdEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/products/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] ISender sender) =>
        {
            var query = new GetProductById.Query(id);
            var result = await sender.Send(query);

            return result is not null ? Results.Ok(result) : Results.NotFound();
        })
        // ESSENCIAL: Nomeamos a rota para que o CreateAtRoute possa encontrá-la.
        .WithName("GetProductById")
        .WithTags("Products");

        return builder;
    }
}

public static class GetProductById
{
    // Query: Representa a intenção de buscar um produto.
    // Contém apenas o identificador necessário para a busca.
    public record Query(Guid Id) : IRequest<ProductResponse?>;

    // Response DTO: Um objeto de transferência de dados que representa
    // a "visão pública" de um produto. Evita expor nossa entidade de domínio diretamente.
    public record ProductResponse(
        Guid Id,
        string Sku,
        string Name,
        string Description,
        int QuantityInStock,
        DateTime LastUpdated);

    // Handler: Contém a lógica de busca.
    internal sealed class Handler : IRequestHandler<Query, ProductResponse?>
    {
        private readonly AppDbContext _dbContext;

        public Handler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ProductResponse?> Handle(Query request, CancellationToken cancellationToken)
        {
            // 1. Busca o produto no banco de dados pela chave primária.
            var product = await _dbContext.Products
                .AsNoTracking() // Usamos AsNoTracking para consultas, pois não vamos alterar a entidade. Melhora a performance.
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            // 2. Se o produto não for encontrado, retorna nulo.
            if (product is null)
            {
                return null;
            }

            // 3. Se encontrado, mapeia a entidade de domínio para o DTO de resposta.
            var response = new ProductResponse(
                product.Id,
                product.Sku,
                product.Name,
                product.Description,
                product.QuantityInStock,
                product.LastUpdated);

            return response;
        }
    }
}