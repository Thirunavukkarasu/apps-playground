import json

from django.http import JsonResponse
from django.http import QueryDict


def parse_json(request):
    try:
        raw_body = request.body.decode("utf-8") if request.body else "{}"
        return json.loads(raw_body), None
    except json.JSONDecodeError:
        return None, JsonResponse({"error": "Invalid JSON body."}, status=400)


def dt(dt_value):
    return dt_value.isoformat() if dt_value else None


def role_to_dict(role):
    return {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "created_at": dt(role.created_at),
        "updated_at": dt(role.updated_at),
    }


def permission_to_dict(permission):
    return {
        "id": permission.id,
        "name": permission.name,
        "description": permission.description,
        "created_at": dt(permission.created_at),
        "updated_at": dt(permission.updated_at),
    }


def user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_active": user.is_active,
        "roles": list(user.roles.values_list("id", flat=True)),
        "permissions": list(user.permissions.values_list("id", flat=True)),
        "created_at": dt(user.created_at),
        "updated_at": dt(user.updated_at),
    }


def get_related_ids(model, ids, label):
    if ids is None:
        return None, None
    if not isinstance(ids, list) or not all(isinstance(item, int) for item in ids):
        return None, JsonResponse(
            {"error": f"{label} must be a list of integer IDs."}, status=400
        )
    items = list(model.objects.filter(id__in=ids))
    if len(items) != len(set(ids)):
        return None, JsonResponse({"error": f"Invalid {label} IDs."}, status=400)
    return items, None


def parse_pagination(query_params: QueryDict, *, default_limit=20, max_limit=100):
    limit_raw = query_params.get("limit")
    offset_raw = query_params.get("offset")

    try:
        limit = int(limit_raw) if limit_raw is not None else default_limit
    except ValueError:
        return None, JsonResponse({"error": "limit must be an integer."}, status=400)

    try:
        offset = int(offset_raw) if offset_raw is not None else 0
    except ValueError:
        return None, JsonResponse({"error": "offset must be an integer."}, status=400)

    if limit <= 0:
        return None, JsonResponse({"error": "limit must be positive."}, status=400)
    if offset < 0:
        return None, JsonResponse({"error": "offset must be >= 0."}, status=400)

    if limit > max_limit:
        limit = max_limit

    return {"limit": limit, "offset": offset}, None


def paginated_response(queryset, serializer, *, limit, offset):
    total = queryset.count()
    results = [serializer(item) for item in queryset[offset : offset + limit]]
    return JsonResponse(
        {
            "count": total,
            "limit": limit,
            "offset": offset,
            "results": results,
        }
    )
