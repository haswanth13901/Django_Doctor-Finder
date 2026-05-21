from rest_framework import serializers
from .models import Doctor
from fhir.resources.practitioner import Practitioner
from fhir.resources.humanname import HumanName
from fhir.resources.contactpoint import ContactPoint
from fhir.resources.address import Address

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

    def to_fhir(self):
        doctor = self.instance
        practitioner = Practitioner.construct()

        practitioner.name = [HumanName(use="official", family=doctor.last_name, given=[doctor.first_name])]
        practitioner.telecom = [ContactPoint(system="phone", value=doctor.phone)]
        practitioner.address = [Address(line=[doctor.address])]
        practitioner.specialty = [{"coding": [{"system": "http://hl7.org/fhir/specialty", "code": doctor.specialization}]}]

        return practitioner
