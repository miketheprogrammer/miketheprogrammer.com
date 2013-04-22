# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.contrib.auth import logout

def index(request):
    c = {'user':request.user}

    if request.user.is_authenticated():
        return render_to_response('base2.html', RequestContext(request,c))
    else:
        return HttpResponseRedirect(reverse('accounts.views.auth_login'))
