using Microsoft.AspNetCore.Mvc;
using NoteFlow.API.Models;
using NoteFlow.API.Services;

namespace NoteFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly NoteStore _store;

    public NotesController(NoteStore store)
    {
        _store = store;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Note>> GetAll([FromQuery] string? q)
        => Ok(_store.GetAll(q));

    [HttpPost]
    public ActionResult<Note> Create([FromBody] NoteInput input)
    {
        if (input is null) return BadRequest();
        var note = _store.Create(input);
        return CreatedAtAction(nameof(GetAll), new { id = note.Id }, note);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<Note> Update(Guid id, [FromBody] NoteInput input)
    {
        if (input is null) return BadRequest();
        var note = _store.Update(id, input);
        return note is null ? NotFound() : Ok(note);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
        => _store.Delete(id) ? NoContent() : NotFound();
}
