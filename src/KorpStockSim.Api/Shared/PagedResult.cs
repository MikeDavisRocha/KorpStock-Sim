namespace KorpStockSim.Api.Shared;

// Uma classe genérica para encapsular uma resposta paginada.
public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
}