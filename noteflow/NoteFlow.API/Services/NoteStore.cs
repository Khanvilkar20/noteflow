using NoteFlow.API.Models;

namespace NoteFlow.API.Services;

public class NoteStore
{
    private readonly List<Note> _notes = new();
    private readonly object _lock = new();

    public IEnumerable<Note> GetAll(string? query)
    {
        lock (_lock)
        {
            var notes = _notes.AsEnumerable();
            if (!string.IsNullOrWhiteSpace(query))
            {
                var q = query.Trim();
                notes = notes.Where(n =>
                    n.Title.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                    n.Body.Contains(q, StringComparison.OrdinalIgnoreCase));
            }
            return notes.OrderByDescending(n => n.UpdatedAt).ToList();
        }
    }

    public Note Create(NoteInput input)
    {
        lock (_lock)
        {
            var now = DateTime.UtcNow;
            var note = new Note
            {
                Id = Guid.NewGuid(),
                Title = input.Title ?? string.Empty,
                Body = input.Body ?? string.Empty,
                CreatedAt = now,
                UpdatedAt = now,
            };
            _notes.Add(note);
            return note;
        }
    }

    public Note? Update(Guid id, NoteInput input)
    {
        lock (_lock)
        {
            var note = _notes.FirstOrDefault(n => n.Id == id);
            if (note is null) return null;
            note.Title = input.Title ?? string.Empty;
            note.Body = input.Body ?? string.Empty;
            note.UpdatedAt = DateTime.UtcNow;
            return note;
        }
    }

    public bool Delete(Guid id)
    {
        lock (_lock)
        {
            var note = _notes.FirstOrDefault(n => n.Id == id);
            if (note is null) return false;
            _notes.Remove(note);
            return true;
        }
    }
}
