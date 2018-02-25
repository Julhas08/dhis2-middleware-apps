$(document).ready( function() {
// Data table property load
 $('#dataTable,.tableresponsive').DataTable( {
        dom: 'Bfrtip',

        buttons: [
            {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [ 0, ':visible' ]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [ 0, 1, 2, 5 ]
                }
            },

            'colvis',
            'print'
        ],
        retrieve: true,
        language: {
          "emptyTable": "No result found"
        },
        pageLength: 100,
        paging: true,
    } );

});				
    			
