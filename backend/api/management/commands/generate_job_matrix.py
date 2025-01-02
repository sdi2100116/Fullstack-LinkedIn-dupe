from django.core.management.base import BaseCommand
from api.services.create_job_matrix import create_job_int_matrix, perform_matrix_factorization,save_matrix_to_file 
class Command(BaseCommand):
    help = 'Generate the interaction matrix of jobs'

    def handle(self, *args, **kwargs):
        matrix = create_job_int_matrix()
        predicted_matrix = perform_matrix_factorization(matrix)
        
        save_matrix_to_file(predicted_matrix)
        print("Interaction matrix predicted and saved successfully.")