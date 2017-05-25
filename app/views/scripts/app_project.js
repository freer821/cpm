/**
 * Created by Zhenyu on 25.05.2017.
 */
(function ($) {
    'use strict';
    $('#project-modal').on('show.bs.modal', function(e) {
        $(this).find('form')[0].reset();
        var project = $(e.relatedTarget).data('project');
        if(project){
            //set title
            $('#project-modal-title').text('Update Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/update/'+project.id);

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

})(jQuery);