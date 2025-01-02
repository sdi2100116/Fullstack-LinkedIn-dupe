import numpy as np
from blogs.models import Interest, Post,Comment,View
from api.models import User,Connection
import os

def load_matrix(file_name='predicted_matrix.npy'):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    

    file_path = os.path.join(current_dir, file_name)
    

    if os.path.exists(file_path):
        matrix = np.load(file_path)
        print(f"Matrix loaded from {file_path}")
        return matrix
    else:
        print(f"No file found at {file_path}")
        return None

def save_matrix_to_file(matrix, file_name='predicted_matrix.npy'):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, file_name)
    np.save(file_path, matrix)

def perform_matrix_factorization(matrix, k=50, steps=15000, alpha=0.001, beta=0.001):
    
    num_users, num_posts = matrix.shape
    
    
    U = np.random.rand(num_users, k)
    V = np.random.rand(num_posts, k)
    
    
    for step in range(steps):
        for i in range(num_users):
            for j in range(num_posts):
                if matrix[i][j] > 0:  
                    error_ij = matrix[i][j] - np.dot(U[i, :], V[j, :].T)
                    
                    
                    for f in range(k):
                        U[i][f] += alpha * (2 * error_ij * V[j][f] - beta * U[i][f])
                        V[j][f] += alpha * (2 * error_ij * U[i][f] - beta * V[j][f])
        
        
        total_loss = 0
        for i in range(num_users):
            for j in range(num_posts):
                if matrix[i][j] > 0:
                    total_loss += (matrix[i][j] - np.dot(U[i, :], V[j, :].T)) ** 2
                    total_loss += beta * (np.sum(U[i, :] ** 2) + np.sum(V[j, :] ** 2))
        
        if step % 100 == 0:
            print(f"Step {step}/{steps} - Loss: {total_loss}")
    
    
    predicted_matrix = np.dot(U, V.T)
    
    return predicted_matrix

def create_int_matrix():
    users = User.objects.all()
    posts = Post.objects.all()
    user_count = users.count()
    post_count = posts.count()

    interest_matrix = np.zeros((user_count, post_count))

    for i, user in enumerate(users):
        for j, post in enumerate(posts):
            try:
                interest = Interest.objects.get(user=user, post=post)
                interest_matrix[i, j] = 1
            except Interest.DoesNotExist:
                interest_matrix[i, j] = 0  

            comments = Comment.objects.filter(comment_author=user, post=post)
            if comments.exists():
                interest_matrix[i, j] += 0.5 * comments.count()
            
            connection =Connection.objects.filter(from_user=user, to_user=post.author)
            if connection.exists():
                interest_matrix[i, j] += 5
            else:
                connection =Connection.objects.filter(to_user=user, from_user=post.author)
                if connection.exists():
                    interest_matrix[i, j] += 5

            views = View.objects.filter(user=user, post=post)
            if views.exists():
                interest_matrix[i, j] += 0.1 * views.count()  
    return interest_matrix
