from Jobs.models import Job, Application
from api.models import Profile
from django.contrib.auth import get_user_model
import numpy as np
import os

User = get_user_model()


def get_matching_skills(user_skills, job_skills_string):
    """
    Returns the count of matching skills between a user and a job.
    The job skills are provided as a comma-separated string.
    """
    # Convert job skills string into a set of skills
    job_skill_set = set(job_skills_string.split(','))
    
    # Find the intersection of user skills and job skills
    matching_skills = [skill for skill in user_skills if skill in job_skill_set]

    return len(matching_skills)


def create_job_int_matrix():
    """
    Creates a job interest matrix with users as rows and jobs as columns.
    Populates the matrix with interactions between users and jobs.
    """
    users = User.objects.all()
    jobs = Job.objects.all()
    user_count = users.count()
    job_count = jobs.count()

    # Initialize a zero matrix with users as rows and jobs as columns
    job_interest_matrix = np.zeros((user_count, job_count))

    # Populate the matrix with user-job interactions
    for i, user in enumerate(users):
        user_profile = user.profile  # Assuming profile exists and is correctly set up
        
        # Convert user skills queryset into a list of skill names
        user_skills = [skill.name for skill in user_profile.skills.all()]
        
        for j, job in enumerate(jobs):
            # Bonus for jobs created by the user
            if user == job.creator:
                job_interest_matrix[i, j] += 2
            
            # Applications count as interactions
            if Application.objects.filter(user=user, job=job).exists():
                job_interest_matrix[i, j] += 5

            # Matching based on skills (job.skills is a comma-separated string)
            job_skills_string = job.skills  # Assuming job.skills is a string
            
            matching_skills_count = get_matching_skills(user_skills, job_skills_string)
            if matching_skills_count > 0:
                job_interest_matrix[i, j] += 0.5 * matching_skills_count

    return job_interest_matrix


def perform_matrix_factorization(matrix, k=50, steps=15000, alpha=0.001, beta=0.001):
    """
    Performs matrix factorization using stochastic gradient descent.
    """
    num_users, num_jobs = matrix.shape

    # Initialize user and job feature matrices with random values
    U = np.random.rand(num_users, k)
    V = np.random.rand(num_jobs, k)

    # Perform matrix factorization
    for step in range(steps):
        for i in range(num_users):
            for j in range(num_jobs):
                if matrix[i][j] > 0:  # Only consider existing interactions
                    error_ij = matrix[i][j] - np.dot(U[i, :], V[j, :].T)
                    
                    # Update user and job feature matrices
                    for f in range(k):
                        U[i][f] += alpha * (2 * error_ij * V[j][f] - beta * U[i][f])
                        V[j][f] += alpha * (2 * error_ij * U[i][f] - beta * V[j][f])
        
        # Calculate total loss for monitoring
        total_loss = 0
        for i in range(num_users):
            for j in range(num_jobs):
                if matrix[i][j] > 0:
                    total_loss += (matrix[i][j] - np.dot(U[i, :], V[j, :].T)) ** 2
                    total_loss += beta * (np.sum(U[i, :] ** 2) + np.sum(V[j, :] ** 2))
        
        # Print loss every 100 steps
        if step % 100 == 0:
            print(f"Step {step}/{steps} - Loss: {total_loss}")
    
    # Compute the predicted interaction matrix
    predicted_matrix = np.dot(U, V.T)
    return predicted_matrix


def save_matrix_to_file(matrix, file_name='predicted_job_matrix.npy'):
    """
    Saves the matrix to a .npy file for future use.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, file_name)
    np.save(file_path, matrix)
    print(f"Matrix saved to {file_path}")

def load_matrix(file_name='predicted_job_matrix.npy'):
    """
    Loads the matrix from a .npy file if it exists.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, file_name)

    if os.path.exists(file_path):
        matrix = np.load(file_path)
        print(f"Matrix loaded from {file_path}")
        return matrix
    else:
        print(f"No file found at {file_path}")
        return None