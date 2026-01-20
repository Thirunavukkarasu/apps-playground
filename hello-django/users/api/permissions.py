from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from users.api.utils import (
    paginated_response,
    parse_json,
    parse_pagination,
    permission_to_dict,
)
from users.models import AppPermission


@csrf_exempt
@require_http_methods(["GET", "POST"])
def permissions_list(request):
    if request.method == "GET":
        pagination, error = parse_pagination(request.GET)
        if error:
            return error
        return paginated_response(
            AppPermission.objects.all().order_by("id"),
            permission_to_dict,
            **pagination,
        )

    payload, error = parse_json(request)
    if error:
        return error

    name = payload.get("name")
    if not name:
        return JsonResponse({"error": "name is required."}, status=400)

    permission = AppPermission.objects.create(
        name=name, description=payload.get("description", "")
    )
    return JsonResponse(permission_to_dict(permission), status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def permissions_detail(request, permission_id):
    try:
        permission = AppPermission.objects.get(id=permission_id)
    except AppPermission.DoesNotExist:
        return JsonResponse({"error": "Permission not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(permission_to_dict(permission))

    if request.method == "DELETE":
        permission.delete()
        return JsonResponse({"status": "deleted"})

    payload, error = parse_json(request)
    if error:
        return error

    if "name" in payload:
        permission.name = payload["name"]
    if "description" in payload:
        permission.description = payload["description"]
    permission.save()
    return JsonResponse(permission_to_dict(permission))
