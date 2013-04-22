from django.conf.urls.defaults import patterns, url

urlpatterns = patterns(
    '',
    url(r'new/', 'base.views.index'),
                       
