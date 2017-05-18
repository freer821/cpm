import sys
import os
from openpyxl import load_workbook
import warnings


warnings.filterwarnings("ignore")
# simple argument echo script
for v in sys.argv[1:]:
    contract_id = v
dir_path = os.path.dirname(os.path.realpath(__file__))
file_path = dir_path + '\contract.tmp.xlsx'
wb = load_workbook(filename=file_path)
sheet = wb.active
sheet['C1'] = contract_id
temp_file = dir_path + '\..\download\\' + contract_id + '.temp.xlsx'
wb.save(temp_file)
print contract_id + '.temp.xlsx'
