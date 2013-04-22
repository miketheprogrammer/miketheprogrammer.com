from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'login/?$', 'accounts.views.auth_login'),
    url(r'logout/?$', 'accounts.views.auth_logout'),
)
