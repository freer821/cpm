/**
 * Created by Zhenyu on 25.05.2017.
 */
$(document).ready(function(){
    // add and edit project
    $('#project-modal').on('show.bs.modal', function (e) {
        $(this).find('form')[0].reset();
        var project = $(e.relatedTarget).data('project');
        if (project) {
            //set title
            $('#project-modal-title').text('Update Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/update/' + project.id);

            //set content
            $("#city").val(project.city);
            $("#community").val(project.community);
            $("#street").val(project.street);
            $("#housenr").val(project.housenr);
            $("#files_path").val(project.files_path);
            $("#linesplan_files_path").val(project.linesplan_files_path);
            $("#zipcode").val(project.zipcode);
            $("#comment").val(project.comment);
        } else {
            //set title
            $('#project-modal-title').text('Add Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/add');

        }
    });

    var projects_table = $('#projects-overview').DataTable();

    // loading the contracts of a project
    $('#projects-overview tbody').on('click', 'td.details-control', function (e) {
        // Stop form submitting normally
        e.preventDefault();

        var projects_tr = $(this).closest('tr');
        var projects_table_row = projects_table.row(projects_tr);
        var project_id = projects_table_row.data()[1];

        if (projects_table_row.child.isShown()) {
            // This row is already open - close it
            projects_table_row.child.hide();
            projects_tr.removeClass('shown');
        }
        else {
            // Open this row
            projects_table_row.child('<table id="' + project_id + '"class="table table-striped b-t b-b dataTable no-footer" cellpadding="5" ui-jp="dataTable" cellspacing="0" border="0" style="padding-left:50px;"></table>').show();
            // set subTableid,use project_id

            var subTable = loadContractsOfProject(project_id);

            $(subTable.table().header()).remove();
            projects_tr.addClass('shown');

            $('#' + project_id + ' tbody').on('click', 'td.details-control-sub', function () {
                var tr = $(this).closest('tr');
                var row = subTable.row(tr);
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(contractDetail(row.data())).show();
                    tr.addClass('shown');
                }
            });

        }
    });

});

function loadContractsOfProject(project_id) {
    return $('#' + project_id).DataTable({
        "info": false,
        "paging": false,
        "ordering": false,
        "searching": false,
        "ajax": '/projects/'+project_id+'/contracts',
        "columns": [
            {
                "className": 'details-control-sub',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {"data": "id"},
            {"data": "contract_street"},
            {"data": "work_content"},
            {"data": "cost_code"},
            {"data": "customer"},
            {"data": "status_finished"},
            {
                "data": function (row, type, full, meta) {
                    return '<a href="#" data-toggle="modal" data-target="#contract-basic-modal" data-contract=\''+JSON.stringify(row)+'\'><i class="material-icons md-24">&#xe3c9;</i></a>';
                }
            },
            {
                "data": function (row, type, full, meta) {
                    return '<a onclick="delContract(this)" data-contract=\''+JSON.stringify(row)+'\'><i class="material-icons md-24">&#xe872;</i></a>';
                }
            }            
        ]
    });
}

function contractDetail(d) {
    // `d` is the original data object for the row
    return '<div style="font-size:18px" class="box">' +
        '<ul class="list inset m-0">' +
        '<li class="list-item">' +
        '<a href="#" data-toggle="modal" data-target="#contract-permissions-modal" data-contract=\''+JSON.stringify(d)+'\' class="list-left">' +
        '<span class="w-40 circle accent">' +
        '<i class="fa fa-envelope"></i>' +
        '</span>' +
        '</a>' +
        '<div class="list-body">' +
        '<div class="form-group row">' +
        '<div class="col-md-4">' +
        '<div style="font-size:22px">' + d.permission_status + '</div>' +
        '</div>' +
        '<div class="form-group col-md-3">' +
        '<div id="manager_name_text">' + d.manager_name + '</div>' +
        '</div>' +
        '<div id="worker_name_d" class="form-group col-md-3" >' +
        '<div id="worker_name_text">' + formatData(d.building_work,"worker_name") + '</div>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<a href="#" data-toggle="modal" data-target="#contract-building-modal" data-contract=\''+JSON.stringify(d)+'\' class="list-left">' +
        '<span class="w-40 circle green">' +
        '<i class="fa fa-smile-o"></i>' +
        '</span>' +
        '</a>' +
        '<div class="list-body">' +
        '<div class="form-group row">' +
        '<div class="col-md-4">' +
        '<div style="font-size:22px">' + d.building_status + '</div>' +
        '</div>' +
        '<div class="form-group col-md-3">' +
        d.building_begin +
        '</div> ' +
        '<div class="form-group col-md-4">' +
        d.building_end +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<a href="#" data-toggle="modal" data-target="#contract-ofw-modal" data-contract=\''+JSON.stringify(d)+'\' class="list-left">' +
        '<span class="w-40 circle warn">' +
        '<i class="fa fa-flash"></i>' +
        '</span>' +
        '</a>' +
        '<div class="list-body">' +
        '<div class="form-group row">' +
        '<div class="col-md-4">' +
        '<div style="font-size:22px">' + d.ofw_status + '</div>' +
        '</div>' +
        '<div class="form-group col-md-3">' +
        d.sum_value +
        '</div> ' +
        '<div class="form-group col-md-4">' +
        d.current_value +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<a href="#" data-toggle="modal" data-target="#contract-invoices-modal" data-contract=\''+JSON.stringify(d)+'\' class="list-left">' +
        '<span class="w-40 circle danger">' +
        '<i class="fa fa-database"></i>' +
        '</span>' +
        '</a>' +
        '<div class="list-body">' +
        '<div class="form-group row">' +
        '<div class="col-md-4">' +
        '<div style="font-size:22px">' + d.invoice_status + '</div>' +
        '</div>' +
        '<div class="form-group col-md-3">' +
        d.doc_location.person +
        '</div> ' +
        '<div class="form-group col-md-4">' +
        d.doc_location.reason +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<div class="form-group">' +
        '<textarea style="width:100%" class="form-control" rows="4" data-minwords="6" ' +
        'required="" placeholder="Kommentar">' + d.comment + '</textarea>' +
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<div class="form-group row">' +
        '<div class="col-md-1">' +
        '<button type="submit" class="btn success">打开文件夹</button>' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button onclick="printTemplate(\'' + d.id + '\')" type="submit" class="btn success">打印模板</button>' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button type="submit" class="btn success">建立XXX</button>' +
        '</div>' +
        '<div class="col-md-2">' +
        '</div>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>';
}

function delContract(element){
    var contract = element.dataset.contract;
    contract = eval('(' + contract + ')');
    if(contract){
        bootbox.confirm("are you sure to delete contract: "+contract.id+"?", function(result){ 
            if(result){
                let url = "/contracts/"+contract._id+"/del/item";
                //let project_id = contract.project_id;
                ajaxPost(url,{'project_id':''});
            }
        });
    }
}

function formatData(obj, key){
    if(obj)
        return obj[key];
    else
        return 'undefined';
}