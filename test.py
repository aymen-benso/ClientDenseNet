
import requests

url = 'http://localhost:8000/predict/'
files = {'file': open('/workspaces/ClientDenseNet/Manar/Normal-1.png', 'rb')}
response = requests.post(url, files=files)

print(response.json())