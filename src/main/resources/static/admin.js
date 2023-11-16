let roleList = [
    {id: 1, role: "ADMIN"},
    {id: 2, role: "USER"}
]

$(async function () {
    await principalInfo()
    userList()
    userAdd()
    getDefaultModal()
    getNewUserForm()
})

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    principalInfo: async () => await fetch('api/users/current'),
    userList: async () => await fetch('api/users'),
    userGet: async (id) => await fetch(`api/users/${id}`),
    userAdd: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    userEdit: async (user) => await fetch('api/users/', {
        method: 'PUT',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    userDelete: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetch.head
    })
}

async function principalInfo() {
    let temp = ''
    const info = document.querySelector('#principalInfo')
    await userFetch.principalInfo()
        .then(res => res.json())
        .then(user => {
            temp += `
            <span style="color: white">
                <b>${user.email}</b> with roles: <span>${user.roles.map(r => ' ' + r.name)}</span>
            </span>
            `
        })
    info.innerHTML = temp
}

async function userList() {
    let temp = ''
    const table = document.querySelector('#userList tbody')
    await userFetch.userList()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                <tr class="border-top">
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(r => ' ' + r.name)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary"
                                data-userid="${user.id}"
                                data-action="edit"
                                data-toggle="modal"
                                data-target="#editModal">Edit
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger"
                                data-userid="${user.id}"
                                data-action="delete"
                                data-toggle="modal"
                                data-target="#deleteModal">Delete
                        </button>
                    </td>
                </tr>
                `
            })
            table.innerHTML = temp
        })

    $("#userList").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal')
        let targetButton = $(event.target)
        let buttonUserId = targetButton.attr('data-userid')
        let buttonAction = targetButton.attr('data-action')

        defaultModal.attr('data-userid', buttonUserId)
        defaultModal.attr('data-action', buttonAction)
        defaultModal.modal('show')
    })
}

async function getNewUserForm() {
    let button = $('#addUser')
    let form = $('#addForm')
    button.on('click', () => {
        form.show()
    })
}

async function userAdd() {
    $('#addUser').click(async () => {
        let addForm = $('#addForm')
        let firstName = addForm.find('#newFirstName').val().trim()
        let lastName = addForm.find('#newLastName').val().trim()
        let age = addForm.find('#newAge').val().trim()
        let email = addForm.find('#newEmail').val().trim()
        let password = addForm.find('#newPassword').val().trim()
        let roles = () => {
            let array = []
            let options = document.querySelector('#newRoles').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array
        }
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles()
        }

        const response = await userFetch.userAdd(data)
        if (response.ok) {
            userList()
            addForm.find('#newFirstName').val('')
            addForm.find('#newLastName').val('')
            addForm.find('#newAge').val('')
            addForm.find('#newEmail').val('')
            addForm.find('#newPassword').val('')
            addForm.find(roles()).val('')
        } else {
            let alert = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <a>Something went wrong</a>
                    <button class="btn-close btn-sm"
                            data-bs-dismiss="alert"
                            aria-label="Close">
                    </button>
                </div>
                `
            addForm.prepend(alert)
        }
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid')
        let action = thisModal.attr('data-action')
        switch (action) {
            case 'edit':
                userEdit(thisModal, userid)
                break;
            case 'delete':
                userDelete(thisModal, userid)
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target)
        thisModal.find('.modal-title').html('')
        thisModal.find('.modal-body').html('')
        thisModal.find('.modal-footer').html('')
    })
}

async function userEdit(modal, id) {
    let thisUser = await userFetch.userGet(id)
    let user = thisUser.json()
    modal.find('.modal-title').html('<h5 class="modal-title">Edit user</h5>')

    let closeButton = `<button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(editButton)

    user.then(user => {
        let bodyForm = `
            <form id="editUser">
               <div class="mx-auto text-center" style="width: 200px">
                    <label for="editId"><b>ID</b></label>
                    <input type="text" class="form-control mb-3" id="editId" value="${user.id}" disabled>
               
                    <label for="editFirstName"><b>First name</b></label>
                    <input type="text" class="form-control mb-3" id="editFirstName" value="${user.firstName}"required>
               
                    <label for="editLastName"><b>Last name</b></label>
                    <input type="text" class="form-control mb-3" id="editLastName" value="${user.lastName}" required>
               
                    <label for="editAge"><b>Age</b></label>
                    <input type="number" class="form-control mb-3" id="editAge" value="${user.age}" required>
               
                    <label for="editEmail"><b>Email</b></label>
                    <input type="email" class="form-control mb-3" id="editEmail" value="${user.email}" required>
                    
                    <label for="editPassword"><b>Password</b></label>
                    <input type="password" class="form-control mb-3" id="editPassword" required>
               
                    <label for="editRoles"><b>Role</b></label>
                    <select class="form-select" multiple size="2" id="editRoles">
                    <option value="ROLE_ADMIN">ADMIN</option>
                    <option value="ROLE_USER" selected>USER</option>
                    </select>
                </div>
            </form>
            `
        modal.find('.modal-body').append(bodyForm)
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#editId").val().trim()
        let firstName = modal.find('#editFirstName').val().trim()
        let lastName = modal.find('#editLastName').val().trim()
        let age = modal.find('#editAge').val().trim()
        let email = modal.find('#editEmail').val().trim()
        let password = modal.find('#editPassword').val().trim()
        let roles = () => {
            let array = []
            let options = document.querySelector('#editRoles').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array
        }
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles()
        }

        const response = await userFetch.userEdit(data, id);
        if (response.ok) {
            await userList()
            modal.modal('hide')
        } else {
            let alert = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <a>Something went wrong</a>
                    <button class="btn-close btn-sm"
                            data-bs-dismiss="alert"
                            aria-label="Close">
                    </button>
                </div>
                `
            modal.find('.modal-body').prepend(alert)
        }
    })
}

async function userDelete(modal, id) {
    let thisUser = await userFetch.userGet(id)
    let user = thisUser.json()

    modal.find('.modal-title').html('<h5 class="modal-title">Delete user</h5>')

    let closeButton = `<button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)

    user.then(user => {
        let bodyForm = `
            <form id="deleteUser">
                <div class="mx-auto text-center" style="width: 200px">
                    <label for="deleteId"><b>ID</b></label>
                    <input type="text" class="form-control mb-3" id="deleteId" value="${user.id}" disabled>

                    <label for="deleteFirstName"><b>First name</b></label>
                    <input type="text" class="form-control mb-3" id="deleteFirstName" value="${user.firstName}" disabled>

                    <label for="deleteLastName"><b>Last name</b></label>
                    <input type="text" class="form-control mb-3" id="deleteLastName" value="${user.lastName}" disabled>

                    <label for="deleteAge"><b>Age</b></label>
                    <input type="number" class="form-control mb-3" id="deleteAge" value="${user.age}" disabled>

                    <label for="deleteEmail"><b>Email</b></label>
                    <input type="email" class="form-control mb-3" id="deleteEmail" value="${user.email}" disabled>
                    
                    <label for="deleteRoles"><b>Role</b></label>
                    <select class="form-select" multiple size="2" id="deleteRoles" disabled>
                    <option>${user.roles.map(role => ' ' + role.name)}</option>
                    </select>
                </div>
            </form>
            `
        modal.find('.modal-body').append(bodyForm)
    })

    $("#deleteButton").on('click', async () => {
        const response = await userFetch.userDelete(id)

        if (response.ok) {
            await userList()
            modal.modal('hide')
        } else {
            let alert = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <a>Something went wrong</a>
                    <button class="btn-close btn-sm"
                            data-bs-dismiss="alert"
                            aria-label="Close">
                    </button>
                </div>
                `
            modal.find('.modal-body').prepend(alert)
        }
    })
}