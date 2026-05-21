from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from django.http import JsonResponse
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Doctor
from .serializers import DoctorSerializer

def api_root(request):
    return JsonResponse({
        "create": "/api/create/",
        "filter": "/api/doctors/filter/"
    })

class DoctorCreateView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

class DoctorPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class DoctorFilterView(APIView):
    def get(self, request):
        filters = {}
        doctor_id = request.query_params.get("id")
        first_name = request.query_params.get('first_name')
        last_name = request.query_params.get('last_name')
        specialization = request.query_params.get('specialization')
        city = request.query_params.get('city')
        state = request.query_params.get('state')
        zip_code = request.query_params.get('zip_code')
        sort_order = request.query_params.get('sort', 'asc') 

        if doctor_id:
            filters["practitioner_id__iexact"] = doctor_id
        if specialization:
            filters['specialization__icontains'] = specialization
        if city:
            filters['city__icontains'] = city
        if state:
            filters['state__icontains'] = state
        if zip_code:
            filters['zip_code__icontains'] = zip_code

        queryset = Doctor.objects.filter(**filters)

        if first_name or last_name:
            name_filter = Q()
            if first_name:
                name_filter |= Q(first_name__icontains=first_name)
            if last_name:
                name_filter |= Q(last_name__icontains=last_name)
            queryset = queryset.filter(name_filter)

        if sort_order == 'desc':
            queryset = queryset.order_by('-first_name', '-last_name')
        else:
            queryset = queryset.order_by('first_name', 'last_name')

        paginator = DoctorPagination()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = DoctorSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class DoctorDetailView(APIView):
    def get(self, request, practitioner_id):
        try:
            doctor = Doctor.objects.get(practitioner_id=practitioner_id)

            fhir_data = {
                "resourceType": "Practitioner",
                "id": str(doctor.practitioner_id),
                "name": [{
                    "use": "official",
                    "family": doctor.last_name,
                    "given": [doctor.first_name]
                }],
                "telecom": [
                    {"system": "phone", "value": doctor.phone, "use": "work"},
                    {"system": "email", "value": doctor.email, "use": "work"}
                ],
                "specialty": [{
                    "coding": [{
                        "code": "unspecified",
                        "display": doctor.specialization
                    }]
                }]
            }

            return Response(fhir_data)

        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
