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
json_file = dir_path + '/' + json_file
with open(os.path.abspath(json_file), 'r') as f:
    data = f.read().replace('\n', '')
    data = json.loads(data)

    f.close()
    #os.remove(json_file)

if data:
    contract = data['contract']
    project = data['project']

    #open xlsx template
    file_path = dir_path + '/contract.tmp.xlsx'
    wb = load_workbook(filename=os.path.abspath(file_path))

    #write contract data to sheet 0
    sheet = wb.worksheets[0]
    #project id
    sheet['B4'] = contract.get('project_id', '')
    #contract id
    sheet['G4'] = contract.get('id', '')
    #customer
    sheet['H4'] = contract.get('customer', '')
    #project community, street housenr
    sheet['I4'] = project.get('community', '') + ', ' + contract.get('contract_street', '')
    #contract street housenr
    sheet['J4'] = contract.get('contract_street', '')
    #project community
    sheet['K4'] = project.get('community', '')
    #project city
    sheet['M4'] = project.get('city', '')
    #contract costcode
    sheet['N4'] = contract.get('cost_code', '')
    #project id
    sheet['O4'] = contract.get('project_id', '')
    #contract sap_nr
    sheet['P4'] = contract.get('sap_nr', '')
    #contract electric_nr
    sheet['Q4'] = contract.get('electric_nr', '')
    #contract gas_nr
    sheet['R4'] = contract.get('gas_nr', '')
    #contract water_nr
    sheet['S4'] = contract.get('water_nr', '')
    #contract partner_name
    sheet['S4'] = contract.get('partner_name', '')
    #contract work_content
    sheet['W4'] = contract.get('work_content', '')

    #contract building_work
    building_work = contract.get('building_work', '')
    if building_work:
        #plan_begin
        sheet['AF4'] = building_work.get('plan_begin', '')
        #plan_end
        sheet['AG4'] = building_work.get('plan_end', '')
        #worker_name
        sheet['AH4'] = building_work.get('worker_name', '')

    #contract building_permission
    building_permission = contract.get('building_permission', '')
    if building_permission and len(building_permission) > 0:
        if building_permission[0].get('type', '') == 'VAZ':
            sheet['AI4'] = building_permission[0].get('begin', '')
        elif building_permission[0].get('type', '') == 'BAZ':
            sheet['AJ4'] = building_permission[0].get('begin', '')

    #contract ofw
    ofw = contract.get('ofw', '')
    if ofw:
        sheet['AP4'] = ofw.get('permission_nr', '')

    #contract manager_name
    sheet['BY4'] = contract.get('manager_name', '')

    temp_file = dir_path + '/../download/' + contract['id'] + '.temp.xlsx'
    wb.save(os.path.abspath(temp_file))
    print contract['id'] + '.temp.xlsx'
