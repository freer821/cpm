import sys
import os
from openpyxl import load_workbook
import warnings
import json


warnings.filterwarnings("ignore")
# read contract json file
#json_file = '1.json'
for v in sys.argv[1:]:
    json_file = v

dir_path = os.path.dirname(os.path.realpath(__file__))
data = ''
json_file = dir_path + '\\' + json_file
with open(json_file, 'r') as f:
    data = f.read().replace('\n', '')
    data = json.loads(data)

    f.close()
    os.remove(json_file)

if data:
    contract = data['contract']
    project = data['project']

    #open xlsx template
    file_path = dir_path + '\contract.tmp.xlsx'
    wb = load_workbook(filename=file_path)

    #write data to sheet 0
    sheet = wb.worksheets[0]
    sheet['C5'] = contract['id']
    sheet['C6'] = contract['customer']
    sheet['B7'] = contract['work_content']
    sheet['E5'] = contract['contract_street']
    sheet['E6'] = project['community']

    temp_file = dir_path + '\..\download\\' + contract['id'] + '.temp.xlsx'
    wb.save(temp_file)
    print contract['id'] + '.temp.xlsx'
