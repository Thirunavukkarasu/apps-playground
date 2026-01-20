from django.contrib import admin

from .models import AppPermission, AppRole, AppUser

admin.site.register(AppRole)
admin.site.register(AppPermission)
admin.site.register(AppUser)
