from django.urls import include, path

from users.api.permissions import permissions_detail, permissions_list
from users.api.roles import roles_detail, roles_list
from users.api.users import users_detail, users_list

roles_api_urls = [
    path("", roles_list, name="roles_list"),
    path("<int:role_id>/", roles_detail, name="roles_detail"),
]

permissions_api_urls = [
    path("", permissions_list, name="permissions_list"),
    path("<int:permission_id>/", permissions_detail, name="permissions_detail"),
]

users_api_urls = [
    path("", users_list, name="users_list"),
    path("<int:user_id>/", users_detail, name="users_detail"),
]

urlpatterns = [
    path("roles/", include(roles_api_urls)),
    path("permissions/", include(permissions_api_urls)),
    path("users/", include(users_api_urls)),
]
