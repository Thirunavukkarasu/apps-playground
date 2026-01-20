from django.urls import include, path

from users import views

urlpatterns = [
    path("", views.home, name="home"),
    path("api/", include("users.api.urls")),
]
