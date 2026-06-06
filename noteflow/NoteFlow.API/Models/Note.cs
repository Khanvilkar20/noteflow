namespace NoteFlow.API.Models;

public class Note
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class NoteInput
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}
