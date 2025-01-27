from g4f.client import Client
import glob
import re

client = Client()

def get_response(message):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": message}],
        web_search = False
    )
    return response.choices[0].message.content

# get all files of C:\AM\Github\digitalMenu\src\app\api
files = glob.glob('C:/AM/Github/digitalMenu/src/app/api/**/*.ts', recursive=True)

for file in files:
    with open(file) as f:
        content = f.read()

        content = "please generate documentation for this file in markdown format\n for " + content
        response = get_response(content)
        with open('documentation/' + file + '.md', 'w') as f:
            f.write(response)