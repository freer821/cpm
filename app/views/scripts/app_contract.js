/**
 * Created by Zhenyu on 25.05.2017.
 */
$(document).ready(function(){

    $('#contract-basic-modal').on('show.bs.modal', function(e) {
        $(this).find('form')[0].reset();
        var contract = $(e.relatedTarget).data('contract-baisc');
        if(contract){
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
            $("#contract_delivery").val(formatDate(contract.contract_delivery));
            $("#doc_delivery").val(formatDate(contract.doc_delivery));
            if (contract.contract_typ.electric) {
                $("#is_electric").attr('checked','checked');
            }
            if (contract.contract_typ.water){
                $("#is_water").attr('checked','checked');
            }
            if (contract.contract_typ.gas){
                $("#is_gas").attr('checked','checked');
            }
            if (contract.contract_typ.telecom){
                $("#is_telecom").attr('checked','checked');
            }
            if (contract.contract_typ.light){
                $("#is_light").attr('checked','checked');
            }
            if (contract.contract_typ.others){
                $("#is_others").attr('checked','checked');
            }
            $("#electric_nr").val(contract.electric_nr);
            $("#water_nr").val(contract.water_nr);
            $("#gas_nr").val(contract.gas_nr);
            if (contract.rot_b){
                $("#rot_b").attr('checked','checked');
            }
            if (contract.isBombExisted){
                $("#isBombExisted").attr('checked','checked');
            }
            if (contract.is_building_permission_activ){
                $("#is_building_permission_activ").attr('checked','checked');
            }
            if (contract.is_ofw_activ){
                $("#is_ofw_activ").attr('checked','checked');
            }
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

    // Attach a submit handler to the form
    $("form").submit(function( event ) {
        // Get some values from elements on the page:
        url = $(this).attr( "action" );
        if (url != '/contracts/edit/permission' && url !='/contracts/edit/invocie'){
            // Stop form from submitting normally
            event.preventDefault();

            // Send the data using post
            var posting = $.post( url, $(this).serialize() );

            // Put the results in a div
            posting.done(function( data ) {
                bootbox.alert(data);
            });
        }
        $('.modal').modal('hide');
    });

});


function formatDate(time) {
    return moment(time).format("DD-MM-YYYY");
}