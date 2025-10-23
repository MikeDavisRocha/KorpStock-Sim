using KorpStockSim.Api.Data;
using KorpStockSim.Api.Shared; // Importe a PagedResult
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static KorpStockSim.Api.Features.Products.GetProductById;

namespace KorpStockSim.Api.Features.Products;

public static class ListAllProductsEndpoint
{
    public static IEndpointRouteBuilder MapListAllProductsEndpoint(this IEndpointRouteBuilder builder)
    {
        // O endpoint agora aceita parâmetros de query: filter, page, pageSize
        builder.MapGet("/api/products", async (
            [FromQuery] string? filter,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromServices] ISender sender) =>
        {
            var query = new ListAllProducts.Query(filter, page, pageSize);
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("ListAllProducts")
        .WithTags("Products");

        return builder;
    }
}

public static class ListAllProducts
{
    // A Query agora recebe os parâmetros para filtro e paginação.
    public record Query(string? Filter, int Page, int PageSize) : IRequest<PagedResult<ProductResponse>>;

    internal sealed class Handler : IRequestHandler<Query, PagedResult<ProductResponse>>
    {
        private readonly AppDbContext _dbContext;

        public Handler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<ProductResponse>> Handle(Query request, CancellationToken cancellationToken)
        {
            var queryable = _dbContext.Products.AsNoTracking();

            // 1. APLICA O FILTRO (SE EXISTIR)
            if (!string.IsNullOrWhiteSpace(request.Filter))
            {
                var filterLower = request.Filter.ToLower();
                queryable = queryable.Where(p =>
                    p.Name.ToLower().Contains(filterLower) ||
                    p.Sku.ToLower().Contains(filterLower));
            }

            // 2. OBTÉM A CONTAGEM TOTAL (APÓS O FILTRO) PARA O PAGINADOR
            var totalCount = await queryable.CountAsync(cancellationToken);

            // 3. APLICA A PAGINAÇÃO
            var items = await queryable
                .OrderBy(p => p.Name)
                .Skip((request.Page - 1) * request.PageSize) // Pula os itens das páginas anteriores
                .Take(request.PageSize) // Pega apenas a quantidade de itens da página
                .Select(p => new ProductResponse(
                    p.Id,
                    p.Sku,
                    p.Name,
                    p.Description,
                    p.QuantityInStock,
                    p.LastUpdated))
                .ToListAsync(cancellationToken);

            // 4. RETORNA O OBJETO PAGINADO
            return new PagedResult<ProductResponse>
            {
                Items = items,
                TotalCount = totalCount
            };
        }
    }
}