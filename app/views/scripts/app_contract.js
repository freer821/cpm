/**
 * Created by Zhenyu on 25.05.2017.
 */
(function ($) {
    'use strict';
    $('#contract-basic-modal').on('show.bs.modal', function(e) {
        $(this).find('form')[0].reset();
        $("#project_id").val($(e.relatedTarget).data('project_id'));
        var contract = $(e.relatedTarget).data('project');
        if(contract){
            //set title
        } else {
            //set title

        }
    });

})(jQuery);