# NoteFlow

Full-stack notes app with ASP.NET Core Web API backend and Angular frontend.

## Structure

- `NoteFlow.API/` — ASP.NET Core 8 Web API (in-memory storage)
- `NoteFlow.Client/` — Angular 17 + Angular Material frontend

## Run the backend

```bash
cd NoteFlow.API
dotnet run
```

API runs at `http://localhost:5080`.

Endpoints:

- `POST   /api/notes`            — create note
- `GET    /api/notes?q=search`   — list notes (optional search)
- `PUT    /api/notes/{id}`       — update note
- `DELETE /api/notes/{id}`       — delete note

## Run the frontend

```bash
cd NoteFlow.Client
npm install
npm start
```

App runs at `http://localhost:4200` and talks to the API at `http://localhost:5080`.
