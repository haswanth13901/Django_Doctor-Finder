import axios from 'axios';
import { FHIRPractitioner } from './types';

export const getDoctorData = async (practitionerId: string): Promise<FHIRPractitioner> => {
  if (!practitionerId) {
    throw new Error("No practitioner ID provided.");
  }

  console.log(`Fetching doctor from: http://localhost:8000/api/doctor/${practitionerId}/`);

  try {
    const response = await axios.get<FHIRPractitioner>(
      `http://localhost:8000/api/doctor/${practitionerId}/`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching doctor data:', error.message);
    throw error;
  }
};
