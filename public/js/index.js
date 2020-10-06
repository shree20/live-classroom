
const socket = io()

$("#join").on('click', function (event) {
    event.preventDefault();
    const user = {
        username: $('#username').val(),
        password: $('#password').val(),
        roomID: $('#classroomId').val()

    }

    let roomID = null;
    let role = ''

    var p = $.post('/login', user)
        .done(function (res) {
            roomID = res.roomID
            role = res.role

        })
        .fail(function (xhr, status, error) {
            alert(xhr.responseText)
        });


    p.then(() => {
        const entryTime = moment(new Date($.now())).format('h:mm a')
        socket.emit('join', { username: user.username, room: roomID, role: role, entryTime }, (error) => {
            if (error) {
                alert(error)
                location.href = '/'
            }
            else
                location.href = `/classroom.html?roomID=${roomID}&username=${user.username}&role=${role}`
        })
    })



});








