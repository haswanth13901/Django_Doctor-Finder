from django.db import models
from fhir.resources.practitioner import Practitioner
from fhir.resources.humanname import HumanName
from fhir.resources.address import Address
from fhir.resources.contactpoint import ContactPoint

class Doctor(models.Model):
    practitioner_id = models.CharField(max_length=50, primary_key=True)  
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    
    class Meta:
        db_table = "doctors"
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['state']),
            models.Index(fields=['zip_code']),
            models.Index(fields=['specialization']),
        ]

    def validate_fields(self):
        errors = []

        if not self.first_name or not self.last_name:
            errors.append("First name and last name are required.")
        if not self.phone:
            errors.append("Phone number is required.")
        if len(self.phone) < 10:
            errors.append("Phone number must be at least 10 digits.")
        if not self.specialization:
            errors.append("Specialization is required.")
        if not self.address:
            errors.append("Address is required.")

        return errors

    def to_fhir(self):
        validation_errors = self.validate_fields()
        if validation_errors:
            raise ValueError("Validation failed: " + ", ".join(validation_errors))

        practitioner = Practitioner.construct()
        practitioner.id = self.practitioner_id  
        practitioner.name = [HumanName(use="official", family=self.last_name, given=[self.first_name])]
        practitioner.telecom = [ContactPoint(system="phone", value=self.phone)]
        practitioner.address = [Address(line=[self.address], city=self.city, state=self.state, postalCode=self.zip_code)]
        practitioner.specialty = [{"coding": [{"system": "http://hl7.org/fhir/specialty", "code": self.specialization}]}]

        return practitioner

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.specialization})"
