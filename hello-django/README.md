# Hello Django (uv)

Django starter project managed with `uv`.

## Prerequisites

- macOS/Linux (or WSL)
- Python 3.12+
- `uv` installed

Quick install:

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Initialize with uv

If you are creating this project from scratch, start with:

```sh
uv init
```

## Setup

Create and sync the environment:

```sh
uv sync
```

## Create the Django project

```sh
uv run django-admin startproject config .
```

## Run the dev server

```sh
uv run manage.py runserver
```

## Create a new app

```sh
uv run manage.py startapp users
```

## Django shell

```sh
uv run manage.py shell
```

## SQLite shell (play with the DB)

Using Django's dbshell:

```sh
uv run manage.py dbshell
```

Or open the SQLite file directly:

```sh
sqlite3 db.sqlite3
```

Common SQLite commands:

```sql
.tables
.schema users_user
SELECT * FROM users_user LIMIT 5;
```

Exit with:

```sql
.quit
```

## Migrations (generate and apply)

```sh
uv run manage.py makemigrations
uv run manage.py migrate
```

## Further sections

- Add database configuration details
- Document environment variables
- Add deployment notes
