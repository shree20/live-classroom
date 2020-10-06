const socket1 = io()


//templates
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { roomID, role, username } = Qs.parse(location.search, { ignoreQueryPrefix: true })


$("#startClass").on('click', function (e) {
    e.preventDefault();
    if ($("#classname").val() === '')
        return alert("Please enter class name!")

    const classDetails = {
        roomID,
        classname: $("#classname").val(),
        startTime: moment(new Date($.now())).format('h:mm a')
    }

    $.post('/addClass', classDetails)
        .done(function (res) {
            alert('Class has Started')
            $("#startClass").prop('disabled', true);

        })
        .fail(function (xhr, status, error) {
            alert(xhr.responseText)
        });

})

async function endClass(classDetails) {
    const p = await $.post('/endClass', classDetails)
        .done(function (res) {
            alert('Class has Ended')
            $("#startClass").prop('disabled', false);

        })
        .fail(function (xhr, status, error) {
            alert(xhr.responseText)
        });

    // socket1.emit('classEnd',roomID)

    // socket1.on('roomEnd', () => {

    //    alert("Class has Ended!")

    //   })


}

$("#endClass").on('click', async function (e) {
    e.preventDefault();

    const classDetails = {
        roomID,
        classname: $("#classname").val(),
        endTime: moment(new Date($.now())).format('h:mm a')
    }
    await endClass(classDetails)
})


$(document).ready(function () {

    if (role.toLowerCase() === "student") {
        $('#maindiv').hide();
    }
    else {
        $('#maindiv').show();
    }



    socket1.emit('classconnect', roomID)


    socket1.on('roomData', ({ roomID, students, teachers }) => {

        const html = Mustache.render(sidebarTemplate, {
            roomID,
            students,
            teachers
        })
        document.querySelector('#sidebar').innerHTML = html

    })


});


$(window).unload(async function () {

    let endTime = moment(new Date($.now())).format('h:mm a')
    if (role.toLowerCase() === "teacher") {
        const classDetails = {
            roomID,
            classname: $("#classname").val(),
            endTime,
            username,
            role
        }

        const p = await $.post('/removeUser', classDetails)
            .done(function (res) {

            })
            .fail(function (xhr, status, error) {
            });


        socket1.emit('classconnect', roomID)


    } else {
        const p = await $.post('/removeUser', { roomID, username, role, endTime })
            .done(function (res) {


            })
            .fail(function (xhr, status, error) {
            });

        socket1.emit('classconnect', roomID)
    }

});



