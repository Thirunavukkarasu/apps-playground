from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from users.api.utils import (
    get_related_ids,
    paginated_response,
    parse_json,
    parse_pagination,
    user_to_dict,
)
from users.models import AppPermission, AppRole, AppUser


@csrf_exempt
@require_http_methods(["GET", "POST"])
def users_list(request):
    if request.method == "GET":
        pagination, error = parse_pagination(request.GET)
        if error:
            return error
        return paginated_response(
            AppUser.objects.all().order_by("id"),
            user_to_dict,
            **pagination,
        )

    payload, error = parse_json(request)
    if error:
        return error

    username = payload.get("username")
    email = payload.get("email")
    if not username or not email:
        return JsonResponse({"error": "username and email are required."}, status=400)

    roles, error = get_related_ids(AppRole, payload.get("roles"), "roles")
    if error:
        return error

    permissions, error = get_related_ids(
        AppPermission, payload.get("permissions"), "permissions"
    )
    if error:
        return error

    user = AppUser.objects.create(
        username=username,
        email=email,
        is_active=payload.get("is_active", True),
    )
    if roles is not None:
        user.roles.set(roles)
    if permissions is not None:
        user.permissions.set(permissions)
    return JsonResponse(user_to_dict(user), status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def users_detail(request, user_id):
    try:
        user = AppUser.objects.get(id=user_id)
    except AppUser.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(user_to_dict(user))

    if request.method == "DELETE":
        user.delete()
        return JsonResponse({"status": "deleted"})

    payload, error = parse_json(request)
    if error:
        return error

    if "username" in payload:
        user.username = payload["username"]
    if "email" in payload:
        user.email = payload["email"]
    if "is_active" in payload:
        user.is_active = payload["is_active"]

    roles, error = get_related_ids(AppRole, payload.get("roles"), "roles")
    if error:
        return error

    permissions, error = get_related_ids(
        AppPermission, payload.get("permissions"), "permissions"
    )
    if error:
        return error

    user.save()
    if roles is not None:
        user.roles.set(roles)
    if permissions is not None:
        user.permissions.set(permissions)
    return JsonResponse(user_to_dict(user))
