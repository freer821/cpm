/**
 * Created by Zhenyu on 25.05.2017.
 */
$(document).ready(function(){

    $('#contract-basic-modal').on('show.bs.modal', function(e) {
        $(this).find('form')[0].reset();
        var contract = $(e.relatedTarget).data('contract-baisc');
        if(contract){
            console.log(JSON.stringify(contract));
            //set title
            $('#contract-modal-title').text('Update Contract');

            //set content
            $("#customer").val(contract.customer);
            $("#partner_name").val(contract.partner_name);
            $("#sap_nr").val(contract.sap_nr);
            $("#cost_code").val(contract.cost_code);
            $("#manager_name").val(contract.manager_name);
            $("#estimated_value").val(contract.estimated_value);
            $("#work_content").val(contract.work_content);
            $("#contract_delivery").val(contract.contract_delivery);
            $("#doc_delivery").val(contract.doc_delivery);
            $("#is_electric").val(contract.is_electric);
            $("#is_water").val(contract.is_water);
            $("#is_gas").val(contract.is_gas);
            $("#is_telecom").val(contract.is_telecom);
            $("#is_light").val(contract.is_light);
            $("#is_others").val(contract.is_others);
            $("#electric_nr").val(contract.electric_nr);
            $("#water_nr").val(contract.water_nr);
            $("#gas_nr").val(contract.gas_nr);
            $("#rot_b").val(contract.rot_b);
            $("#isBombExisted").val(contract.isBombExisted);
            $("#is_building_permission_activ").val(contract.is_building_permission_activ);
            $("#is_ofw_activ").val(contract.is_ofw_activ);
            $("#person").val(contract.person);
            $("#reason").val(contract.reason);
            $("#comment").val(contract.comment);
            $("#contract_id").val(contract.id);
            $("#project_id").val(contract.project_id);
            $("#contract_street").val(contract.contract_street);

        } else {
            var project = $(e.relatedTarget).data('project');

            if (project) {
                $("#project_id").val(project.id);
                $("#contract_street").val(project.street+' '+project.housenr);

            }

        }


    });

});
