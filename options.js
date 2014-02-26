/**
 * Created with JetBrains PhpStorm.
 * User: Sam0delkin
 * Date: 15.08.13
 * Time: 18:01
 * To change this template use File | Settings | File Templates.
 */
(function($){
    $(document).ready(function(){

        if(localStorage['user'])
            $('#user').val(localStorage['user']);

        if(localStorage['bill'])
        	$('#bill').val(localStorage['bill']);


        $.ajax({
            url: 'https://www.odesk.com/api/team/v2/teamrooms.json',
            data: {},
            success: function(data){


                for(var i in data.teamrooms.teamroom){
                    team = data.teamrooms.teamroom[i];
                    var t = $('<option value="' + team.id + '">' + team.name + '</option>');
                    $('#team').append(t);
                }
                if(localStorage['id'])
                    $('#team').val(localStorage['id']);
            },
            error: function(){

                    $('.row').before('<div class="alert alert-error"><h4>Error!</h4>You are not logged in on oDesk! <a href="https://www.odesk.com/login">Please, login</a> and reload this page</div>');
            },
            dataType: 'json'
        });
        $('#settings-form').submit(function(){return false;});
        $('#save').click(function(){
            localStorage['user'] = $('#user').val();
            localStorage['id'] = $('#team').val();
            localStorage['bill'] = $('#bill').val();
            update();
            return false;
        });


    });
})(jQuery);