from django.conf.urls import patterns, url


urlpatterns = patterns(
    '',
    (r'home/?$', 'newapp.views.index'),

)
