from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from users.api.utils import (
    paginated_response,
    parse_json,
    parse_pagination,
    role_to_dict,
)
from users.models import AppRole


@csrf_exempt
@require_http_methods(["GET", "POST"])
def roles_list(request):
    if request.method == "GET":
        pagination, error = parse_pagination(request.GET)
        if error:
            return error
        return paginated_response(
            AppRole.objects.all().order_by("id"),
            role_to_dict,
            **pagination,
        )

    payload, error = parse_json(request)
    if error:
        return error

    name = payload.get("name")
    if not name:
        return JsonResponse({"error": "name is required."}, status=400)

    role = AppRole.objects.create(name=name, description=payload.get("description", ""))
    return JsonResponse(role_to_dict(role), status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def roles_detail(request, role_id):
    try:
        role = AppRole.objects.get(id=role_id)
    except AppRole.DoesNotExist:
        return JsonResponse({"error": "Role not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(role_to_dict(role))

    if request.method == "DELETE":
        role.delete()
        return JsonResponse({"status": "deleted"})

    payload, error = parse_json(request)
    if error:
        return error

    if "name" in payload:
        role.name = payload["name"]
    if "description" in payload:
        role.description = payload["description"]
    role.save()
    return JsonResponse(role_to_dict(role))
