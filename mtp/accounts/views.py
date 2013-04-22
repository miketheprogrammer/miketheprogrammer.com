from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login, logout
from django.core.urlresolvers import reverse
from django.template import RequestContext

def auth_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        print username
        print password
        user = authenticate(username=username,password=password)

        if user is not None:
            if not request.POST.get('remember_me', None):
                request.session.set_expiry(0)
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse('base.views.index'))
            else:
                return HttpResponse('Failed to loging')
        else:
            return HttpResponse("Failed to Authenticate")

    return render_to_response("login.html", RequestContext(request, {}))

            
def auth_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('accounts.views.auth_login'))


